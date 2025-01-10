import { defineConfig } from "drizzle-kit"

export default defineConfig({
  dialect: "sqlite",
  schema: "./src/db/models",
  dbCredentials: {
    url: "file://sqlite.db",
  },
})
