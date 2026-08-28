import { db } from "..";
import { users, feeds, type Feed } from "../schema";
import { eq } from "drizzle-orm";
import { readConfig, type Config } from "../config.ts";


export async function createFeeds(name: string, url: string, userId: string) {
    return await db.insert(feeds).values({ name: name, url: url, userId: userId  });
}

