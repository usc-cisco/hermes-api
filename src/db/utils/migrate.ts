import { db } from ".."
import { migrate } from "drizzle-orm/bun-sqlite/migrator"

await migrate(db, { migrationsFolder: "./drizzle" })
