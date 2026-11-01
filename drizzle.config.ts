import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: "src/lib/db/schema.ts",
    out: "src/lib/db",
    dialect: "postgresql",
    dbCredentials: {
        url: "postgres://bandhippie:codebox@codebox-db:5432/gator?sslmode=disable"
    },
});