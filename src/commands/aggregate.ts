import { fetchFeed } from "../lib/rss";

export async function handlerAgg(cmdName: string, ...args: string[]) {
    const fetch = await fetchFeed("https://www.wagslane.dev/index.xml");
    console.log(JSON.stringify(fetch));
}