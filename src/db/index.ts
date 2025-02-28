import * as schema from "./models/index"
import { Database } from "bun:sqlite"
import { drizzle } from "drizzle-orm/bun-sqlite"

const sqlite = new Database("sqlite.db")
export const db = drizzle({ client: sqlite, schema })
