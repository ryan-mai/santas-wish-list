import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core"

export const wishes = sqliteTable("wishes", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    item: text("item").notNull(),
    score: integer("score").notNull().default(50),
    notes: text("notes"),
    fulfilled: integer("fulfilled").notNull().default(0), // False boolean 0 = false, 1 = true
    createdAt: integer("created_at").notNull(),
})