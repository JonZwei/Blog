export function parseDuration(durationStr: string): number {
    const match = durationStr.match(/^(\d+)(ms|s|m|h)$/);
    if (!match) {
        throw new Error("Invalid duration, use e.g. 1s, 30s, 1m, 1h");
    }
    const n = parseInt(match[1]);
    switch (match[2]) {
        case "ms":
            return n;
        case "s":
            return n * 1000;
        case "m":
            return n * 60 * 1000;
        case "h":
            return n * 60 * 60 * 1000;
        default:
            throw new Error(`Unknown unit: ${match[2]}`);
    }
}
