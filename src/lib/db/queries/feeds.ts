import { db } from "..";
import { users, feeds, feedFollows, type Feed } from "../schema";
import { eq, and, sql } from "drizzle-orm";


export async function createFeeds(name: string, url: string, userId: string) {
    const [result] = await db.insert(feeds).values({ name: name, url: url, userId: userId  }).returning();
    return result;
}

export async function getFeeds() {
    return await db
        .select({ name: feeds.name, url: feeds.url, userName: users.name })
        .from(feeds)
        .innerJoin(users, eq(feeds.userId, users.id));
}

export async function getFeedByURL(url: string) {
    const rows = await db.select().from(feeds).where(eq(feeds.url, url));
    return rows[0];
}

export async function createFeedFollow(userId: string, feedId: string) {
    const [newFollow] = await db.insert(feedFollows).values({ userId: userId, feedId: feedId }).returning();
    const [result] = await db
        .select({
            id: feedFollows.id,
            createdAt: feedFollows.createdAt,
            updatedAt: feedFollows.updatedAt,
            userId: feedFollows.userId,
            feedId: feedFollows.feedId,
            feedName: feeds.name,
            userName: users.name,
        })
        .from(feedFollows)
        .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
        .innerJoin(users, eq(feedFollows.userId, users.id))
        .where(eq(feedFollows.id, newFollow.id));
    return result;
}

export async function getFeedFollowsForUser(userId: string) {
    return await db
        .select({ feedName: feeds.name, userName: users.name })
        .from(feedFollows)
        .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
        .innerJoin(users, eq(feedFollows.userId, users.id))
        .where(eq(feedFollows.userId, userId));
}

export async function deleteFeedFollow(userId: string, feedId: string) {
    const [result] = await db
        .delete(feedFollows)
        .where(and(eq(feedFollows.userId, userId), eq(feedFollows.feedId, feedId)))
        .returning();
    return result;
}

export async function markFeedFetched(feedId: string) {
    const [result] = await db
        .update(feeds)
        .set({ lastFetchedAt: new Date() })
        .where(eq(feeds.id, feedId))
        .returning();
    return result;
}

export async function getNextFeedToFetch() {
    const rows = await db
        .select()
        .from(feeds)
        .orderBy(sql`${feeds.lastFetchedAt} asc nulls first`)
        .limit(1);
    return rows[0];
}