import { readConfig, writeConfig, type Config } from "../config";
import { createUser, getUser, deleteUsers, getUsers } from "../lib/db/queries/users";

export async function handlerLogin(cmdName: string, ...args: string[]) {
    if (args.length != 1) {
        throw new Error("Username not provided");
    }
    if (await getUser(args[0])) {
        await setUser(args[0]);
        console.log("User has been set");
    } else {
        throw new Error("Username does not exist");
    }
}

export async function setUser(name: string): Promise<Config> {
    console.log("setUser:", name);
    if (!(await getUser(name))) {
        throw new Error("Username does not exist");
    }
    const current: Config = readConfig();
    current.currentUserName = name;
    writeConfig(current);
    return current;
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
    if (args.length != 1) {
        throw new Error("Username not provided");
    }
    const handlerUser = await getUser(args[0]);
    if (handlerUser) {
        throw new Error("User already exists");
    }
    const user = await createUser(args[0]);0
    await setUser(args[0]);
    console.log("User was created", user);
}

export async function handlerReset(cmdName: string, ...args: string[]) {
    await deleteUsers();
}

export async function handlerGetUsers(cmdName: string, ...args: string[]) {
    const users = await getUsers();
    
    for (const user of users) {
        const current: Config = readConfig();
        if (current.currentUserName == user.name) {
            console.log("* " + user.name + " (current)");
        } else {
            console.log("* " + user.name);
        }
    }
}