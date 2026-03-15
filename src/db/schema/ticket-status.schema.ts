import { pgTable, unique, check, bigint, varchar, timestamp, index, foreignKey, text } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import { tickets } from "./tickets.schema";
import { users } from "./users.schema";


export const ticketStatusHistory = pgTable("ticket_status_history", {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity({ name: "ticket_status_history_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    ticketId: bigint("ticket_id", { mode: "number" }).notNull(),
    oldStatus: varchar("old_status", { length: 20 }),
    newStatus: varchar("new_status", { length: 20 }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    changedBy: bigint("changed_by", { mode: "number" }).notNull(),
    changedAt: timestamp("changed_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
    index("idx_ticket_status_history_date").using("btree", table.changedAt.asc().nullsLast().op("timestamp_ops")),
    index("idx_ticket_status_history_ticket").using("btree", table.ticketId.asc().nullsLast().op("int8_ops")),
    foreignKey({
            columns: [table.ticketId],
            foreignColumns: [tickets.id],
            name: "fk_status_history_ticket"
        }).onDelete("cascade"),
    foreignKey({
            columns: [table.changedBy],
            foreignColumns: [users.id],
            name: "fk_status_history_user"
        }),
    check("chk_status_history_old", sql`(old_status IS NULL) OR ((old_status)::text = ANY ((ARRAY['ABIERTO'::character varying, 'EN_PROGRESO'::character varying, 'RESUELTO'::character varying, 'CERRADO'::character varying])::text[]))`),
    check("chk_status_history_new", sql`(new_status)::text = ANY ((ARRAY['ABIERTO'::character varying, 'EN_PROGRESO'::character varying, 'RESUELTO'::character varying, 'CERRADO'::character varying])::text[])`),
]);
