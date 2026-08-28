export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;

export type CommandsRegistry = Record<string, CommandHandler>;


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