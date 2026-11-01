import { getPostsForUser } from "../lib/db/queries/posts";
import { type User } from "../lib/db/schema";

export async function handlerBrowse(cmdName: string, user: User, ...args: string[]) {
    const limit = args[0] ? parseInt(args[0]) : 2;
    if (isNaN(limit) || limit < 1) {
        throw new Error("limit must be a positive number");
    }
    const posts = await getPostsForUser(user.id, limit);
    if (posts.length === 0) {
        console.log("No posts found");
        return;
    }
    for (const post of posts) {
        console.log(`* ${post.title}`);
        console.log(`  Feed:      ${post.feedName}`);
        console.log(`  Published: ${post.publishedAt ? post.publishedAt.toLocaleString() : "unknown"}`);
        console.log(`  URL:       ${post.url}`);
    }
}
