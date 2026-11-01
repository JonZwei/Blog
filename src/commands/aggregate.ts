import { fetchFeed } from "../lib/rss";
import { getNextFeedToFetch, markFeedFetched } from "../lib/db/queries/feeds";
import { parseDuration } from "../lib/time";
import { createPost } from "../lib/db/queries/posts";

export async function handlerAgg(cmdName: string, ...args: string[]) {
    if (!args[0]) {
        throw new Error("time_between_reqs not provided (e.g. 1s, 1m, 1h)");
    }
    const timeBetweenRequests = parseDuration(args[0]);
    console.log(`Collecting feeds every ${args[0]}`);

    const handleError = (err: unknown) => console.error("Error scraping feeds:", err);
    scrapeFeeds().catch(handleError);
    const interval = setInterval(() => {
        scrapeFeeds().catch(handleError);
    }, timeBetweenRequests);

    await new Promise<void>((resolve) => {
        process.on("SIGINT", () => {
            console.log("Shutting down feed aggregator...");
            clearInterval(interval);
            resolve();
        });
    });
}

export async function scrapeFeeds() {
    const feed = await getNextFeedToFetch();
    if (!feed) {
        console.log("No feeds to fetch");
        return;
    }
    await markFeedFetched(feed.id);
    const rss = await fetchFeed(feed.url);
    for (const item of rss.channel.item) {
        const published = new Date(item.pubDate);
        await createPost({
            title: item.title,
            url: item.link,
            description: item.description,
            publishedAt: isNaN(published.getTime()) ? null : published,
            feedId: feed.id,
        });
    }
    console.log(`Fetched ${feed.name}: ${rss.channel.item.length} posts`);
}
