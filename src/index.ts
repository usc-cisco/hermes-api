import { db } from "./db"
import { sql } from "drizzle-orm"
import { Elysia } from "elysia"

const query = sql`select "hello world" as text`
const result = db.get<{ text: string }>(query)
console.log(result)

const app = new Elysia().get("/", () => "Hello Elysia").listen(3000)

console.log(`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`)
