import { t } from "elysia"

export const StatusUnion = t.Union([t.Literal("available"), t.Literal("unavailable"), t.Literal("away")])
