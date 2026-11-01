import { readConfig } from "../config";
import { getUser } from "../lib/db/queries/users";
import { type User } from "../lib/db/schema";

export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;

export type UserCommandHandler = (cmdName: string, user: User, ...args: string[]) => Promise<void>;

export type CommandsRegistry = Record<string, CommandHandler>;

export function middlewareLoggedIn(handler: UserCommandHandler): CommandHandler {
    return async (cmdName: string, ...args: string[]) => {
        const userName = readConfig().currentUserName;
        const user = await getUser(userName);
        if (!user) {
            throw new Error(`User ${userName} not found`);
        }
        await handler(cmdName, user, ...args);
    };
}


export async function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler): Promise<void>{
    if (registry[cmdName]) {
        console.log("Command already exists.");
    } else {
        registry[cmdName] = handler;
    }
}

export async function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]): Promise<void>{
    const handler = registry[cmdName];
    if (handler) {
        await handler(cmdName, ...args);
    } else {
        console.log(`Unknown command: ${cmdName}`);
    }
    
}