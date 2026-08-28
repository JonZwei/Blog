import { type CommandsRegistry, type CommandHandler, registerCommand, runCommand } from './commands/commands';
import { handlerLogin, handlerRegister, handlerReset, handlerGetUsers } from "./commands/users";
import { handlerAgg } from "./commands/aggregate"
import { handlerFeeds } from "./commands/feeds"

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
    await registerCommand(registry, "addfeed", handlerFeeds);
    try {
        await runCommand(registry, cmdName, ...cmdArgs);
    } catch (err) {
        console.log("CAUGHT:", err);
        process.exit(1);
    }
    process.exit(0);
}

main();
