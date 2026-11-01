import { db } from "..";
import { posts, feeds, feedFollows, type NewPost } from "../schema";
import { eq, sql } from "drizzle-orm";

export async function createPost(post: NewPost) {
    const [result] = await db.insert(posts).values(post).onConflictDoNothing({ target: posts.url }).returning();
    return result;
}

export async function getPostsForUser(userId: string, limit: number) {
    return await db
        .select({ title: posts.title, url: posts.url, publishedAt: posts.publishedAt, feedName: feeds.name })
        .from(posts)
        .innerJoin(feedFollows, eq(posts.feedId, feedFollows.feedId))
        .innerJoin(feeds, eq(posts.feedId, feeds.id))
        .where(eq(feedFollows.userId, userId))
        .orderBy(sql`${posts.publishedAt} desc nulls last`)
        .limit(limit);
}
