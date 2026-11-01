import { createFeeds, getFeeds, getFeedByURL, createFeedFollow, getFeedFollowsForUser, deleteFeedFollow } from "../lib/db/queries/feeds";
import { type User, type Feed } from "../lib//db/schema"

export async function handlerAddFeeds(cmdName: string, user: User, ...args: string[]) {
    if (!args[0] || !args[1]) {
        throw new Error("No url or name given");
    }
    const feed = await createFeeds(args[0], args[1], user.id);
    if (!feed) {
        throw new Error("no feed found");
    }
    await createFeedFollow(user.id, feed.id);
    printFeed(feed, user);
}

export async function printFeed(feed: Feed, user: User) {
    console.log(feed);
    console.log(user);
}

export async function handlerFeeds(cmdName: string, ...args: string[]) {
    const feeds = await getFeeds();
    if (feeds.length === 0) {
        console.log("No feeds found");
        return;
    }
    for (const feed of feeds) {
        console.log(`* ${feed.name}`);
        console.log(`  URL:  ${feed.url}`);
        console.log(`  User: ${feed.userName}`);
    }
}

export async function handlerFollow(cmdName: string, user: User, ...args: string[]) {
    if (!args[0]) {
        throw new Error("No url given");
    }
    const feed = await getFeedByURL(args[0]);
    if (!feed) {
        throw new Error("no feed found for that url");
    }
    const follow = await createFeedFollow(user.id, feed.id);
    console.log(`* ${follow.feedName}`);
    console.log(`  User: ${follow.userName}`);
}

export async function handlerFollowing(cmdName: string, user: User, ...args: string[]) {
    const follows = await getFeedFollowsForUser(user.id);
    if (follows.length === 0) {
        console.log("Not following any feeds");
        return;
    }
    for (const follow of follows) {
        console.log(`* ${follow.feedName}`);
    }
}

export async function handlerUnfollow(cmdName: string, user: User, ...args: string[]) {
    if (!args[0]) {
        throw new Error("No url given");
    }
    const feed = await getFeedByURL(args[0]);
    if (!feed) {
        throw new Error("no feed found for that url");
    }
    const removed = await deleteFeedFollow(user.id, feed.id);
    if (!removed) {
        throw new Error(`${user.name} is not following ${feed.name}`);
    }
    console.log(`${user.name} unfollowed ${feed.name}`);
}