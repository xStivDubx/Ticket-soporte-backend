import { relations } from "drizzle-orm/relations";
import { tickets } from "../schema/tickets.schema";
import { users } from "../schema/users.schema";
import { ticketComments } from "../schema/ticket-comments.schema";
import { ticketStatusHistory } from "../schema/ticket-status.schema";

export const ticketsRelations = relations(tickets, ({one, many}) => ({
	user_createdBy: one(users, {
		fields: [tickets.createdBy],
		references: [users.id],
		relationName: "tickets_createdBy_users_id"
	}),
	user_assignedTo: one(users, {
		fields: [tickets.assignedTo],
		references: [users.id],
		relationName: "tickets_assignedTo_users_id"
	}),
	ticketComments: many(ticketComments),
	ticketStatusHistories: many(ticketStatusHistory),
}));

export const usersRelations = relations(users, ({many}) => ({
	tickets_createdBy: many(tickets, {
		relationName: "tickets_createdBy_users_id"
	}),
	tickets_assignedTo: many(tickets, {
		relationName: "tickets_assignedTo_users_id"
	}),
	ticketComments: many(ticketComments),
	ticketStatusHistories: many(ticketStatusHistory),
}));

export const ticketCommentsRelations = relations(ticketComments, ({one}) => ({
	ticket: one(tickets, {
		fields: [ticketComments.ticketId],
		references: [tickets.id]
	}),
	user: one(users, {
		fields: [ticketComments.userId],
		references: [users.id]
	}),
}));

export const ticketStatusHistoryRelations = relations(ticketStatusHistory, ({one}) => ({
	ticket: one(tickets, {
		fields: [ticketStatusHistory.ticketId],
		references: [tickets.id]
	}),
	user: one(users, {
		fields: [ticketStatusHistory.changedBy],
		references: [users.id]
	}),
}));