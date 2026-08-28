import { XMLParser } from "fast-xml-parser";

export async function fetchFeed(feedURL: string): Promise<RSSFeed> {
    const res = await fetch(feedURL, {
        headers: {
            "User-Agent": "gator"
        }
    });
    const tex = await res.text();
    const parser = new XMLParser({processEntities: false});
    let jObj = parser.parse(tex);
    if (!jObj.rss.channel) {
        throw new Error("Channel is empty");
    }
    if (!jObj.rss.channel.title) {
        throw new Error("Title is empty");
    }
    if (!jObj.rss.channel.link) {
        throw new Error("Link is empty");
    }
    if (!jObj.rss.channel.description) {
        throw new Error("Description is empty");
    }
    let items = jObj.rss.channel.item;
    if (Array.isArray(items)) {
        //pass
    } else if (!items) {
        items = [];
    } else {
        items = [items];
    }
    let rssItems: RSSItem[] = []
    for (const item of items) {
            if (item.title && item.link && item.description && item.pubDate) {
                rssItems.push({
                    title: item.title,
                    link: item.link,
                    description: item.description,
                    pubDate: item.pubDate
                });
            }
        }
    return {
        channel: {
            title: jObj.rss.channel.title,
            link: jObj.rss.channel.link,
            description: jObj.rss.channel.description,
            item: rssItems
        }
    };
}

type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

