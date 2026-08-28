import { createFeeds } from "../lib/db/queries/feeds";
import { readConfig, type Config } from "../config";
import { getUser } from "../lib/db/queries/users"
import { type User, type Feed } from "../lib//db/schema"

export async function handlerFeeds(cmdName: string, ...args: string[]) {
    if (!args[0] || !args[1]) {
        throw new Error("No url or name given");
    }
    const current: Config = readConfig();
    const name: string = current.currentUserName;
    const user  = await getUser(name);
    if (!user) {
        throw new Error("no user found");
    }
    const userId: string = user.id;
    const feed = await createFeeds(args[0], args[1], userId);
    if (!feed) {
        throw new Error("no feed found");
    }
    printFeed(feed, user);
}

export async function printFeed(feed: Feed, user: User) {

}