import { pgTable, unique, check, bigint, varchar, timestamp, index, foreignKey, text } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import { tickets } from "./tickets.schema";
import { users } from "./users.schema";

export const ticketComments = pgTable("ticket_comments", {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity({ name: "ticket_comments_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    ticketId: bigint("ticket_id", { mode: "number" }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    userId: bigint("user_id", { mode: "number" }).notNull(),
    comment: text().notNull(),
    createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
    index("idx_ticket_comments_ticket").using("btree", table.ticketId.asc().nullsLast().op("int8_ops")),
    foreignKey({
            columns: [table.ticketId],
            foreignColumns: [tickets.id],
            name: "fk_ticket_comments_ticket"
        }).onDelete("cascade"),
    foreignKey({
            columns: [table.userId],
            foreignColumns: [users.id],
            name: "fk_ticket_comments_user"
        }),
]);