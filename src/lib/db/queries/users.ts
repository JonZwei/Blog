import { db } from "..";
import { users } from "../schema";
import { eq } from "drizzle-orm";

export async function createUser(name: string) {
  const [result] = await db.insert(users).values({ name: name }).returning();
  return result;
}

export async function getUser(name: string) {
    try {
        const rows = await db.select().from(users).where(eq(users.name, name));
        return rows[0];
    } catch (e) {
        console.log("getUser ERROR:", e);
    }
}

export async function deleteUsers() {
    await db.delete(users);
    console.log("All users removed");
}

export async function getUsers() {
    const result = await db.select().from(users);
    return result;
}