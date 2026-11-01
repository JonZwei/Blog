import { type CommandsRegistry, type CommandHandler, registerCommand, runCommand, middlewareLoggedIn } from './commands/commands';
import { handlerLogin, handlerRegister, handlerReset, handlerGetUsers } from "./commands/users";
import { handlerAgg } from "./commands/aggregate"
import { handlerAddFeeds, handlerFeeds, handlerFollow, handlerFollowing, handlerUnfollow } from "./commands/feeds"
import { handlerBrowse } from "./commands/posts"

async function main() {
    const args = process.argv.slice(2);
    if (args.length < 1) {
        console.log("Command not found");
        process.exit(1);
    }
    const cmdName = args[0];
    const cmdArgs = args.slice(1);
    
    let registry: CommandsRegistry = {};
    await registerCommand(registry, "login", handlerLogin);
    await registerCommand(registry, "register", handlerRegister);
    await registerCommand(registry, "reset", handlerReset);
    await registerCommand(registry, "users", handlerGetUsers);
    await registerCommand(registry, "agg", handlerAgg);
    await registerCommand(registry, "addfeed", middlewareLoggedIn(handlerAddFeeds));
    await registerCommand(registry, "feeds", handlerFeeds);
    await registerCommand(registry, "follow", middlewareLoggedIn(handlerFollow));
    await registerCommand(registry, "following", middlewareLoggedIn(handlerFollowing));
    await registerCommand(registry, "unfollow", middlewareLoggedIn(handlerUnfollow));
    await registerCommand(registry, "browse", middlewareLoggedIn(handlerBrowse));
    try {
        await runCommand(registry, cmdName, ...cmdArgs);
    } catch (err) {
        console.log("CAUGHT:", err);
        process.exit(1);
    }
    process.exit(0);
}

main();
