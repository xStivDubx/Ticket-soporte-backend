-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "users" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"name" varchar(150) NOT NULL,
	"email" varchar(150) NOT NULL,
	"password" varchar(300) NOT NULL,
	"role" varchar(20) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_key" UNIQUE("email"),
	CONSTRAINT "chk_users_role" CHECK ((role)::text = ANY ((ARRAY['EMPLEADO'::character varying, 'AGENTE'::character varying])::text[]))
);
--> statement-breakpoint
CREATE TABLE "tickets" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "tickets_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"title" varchar(200) NOT NULL,
	"description" text NOT NULL,
	"category" varchar(30) NOT NULL,
	"priority" varchar(20) NOT NULL,
	"status" varchar(20) DEFAULT 'ABIERTO' NOT NULL,
	"created_by" bigint NOT NULL,
	"assigned_to" bigint,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"resolved_at" timestamp,
	CONSTRAINT "chk_tickets_category" CHECK ((category)::text = ANY ((ARRAY['HARDWARE'::character varying, 'SOFTWARE'::character varying, 'RED'::character varying, 'ACCESOS'::character varying, 'OTRO'::character varying])::text[])),
	CONSTRAINT "chk_tickets_priority" CHECK ((priority)::text = ANY ((ARRAY['CRITICA'::character varying, 'ALTA'::character varying, 'MEDIA'::character varying, 'BAJA'::character varying])::text[])),
	CONSTRAINT "chk_tickets_status" CHECK ((status)::text = ANY ((ARRAY['ABIERTO'::character varying, 'EN_PROGRESO'::character varying, 'RESUELTO'::character varying, 'CERRADO'::character varying])::text[]))
);
--> statement-breakpoint
CREATE TABLE "ticket_comments" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ticket_comments_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"ticket_id" bigint NOT NULL,
	"user_id" bigint NOT NULL,
	"comment" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ticket_status_history" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ticket_status_history_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"ticket_id" bigint NOT NULL,
	"old_status" varchar(20),
	"new_status" varchar(20) NOT NULL,
	"changed_by" bigint NOT NULL,
	"changed_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "chk_status_history_old" CHECK ((old_status IS NULL) OR ((old_status)::text = ANY ((ARRAY['ABIERTO'::character varying, 'EN_PROGRESO'::character varying, 'RESUELTO'::character varying, 'CERRADO'::character varying])::text[]))),
	CONSTRAINT "chk_status_history_new" CHECK ((new_status)::text = ANY ((ARRAY['ABIERTO'::character varying, 'EN_PROGRESO'::character varying, 'RESUELTO'::character varying, 'CERRADO'::character varying])::text[]))
);
--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "fk_tickets_created_by" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "fk_tickets_assigned_to" FOREIGN KEY ("assigned_to") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ticket_comments" ADD CONSTRAINT "fk_ticket_comments_ticket" FOREIGN KEY ("ticket_id") REFERENCES "public"."tickets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ticket_comments" ADD CONSTRAINT "fk_ticket_comments_user" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ticket_status_history" ADD CONSTRAINT "fk_status_history_ticket" FOREIGN KEY ("ticket_id") REFERENCES "public"."tickets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ticket_status_history" ADD CONSTRAINT "fk_status_history_user" FOREIGN KEY ("changed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_tickets_assigned_to" ON "tickets" USING btree ("assigned_to" int8_ops);--> statement-breakpoint
CREATE INDEX "idx_tickets_category" ON "tickets" USING btree ("category" text_ops);--> statement-breakpoint
CREATE INDEX "idx_tickets_created_at" ON "tickets" USING btree ("created_at" timestamp_ops);--> statement-breakpoint
CREATE INDEX "idx_tickets_created_by" ON "tickets" USING btree ("created_by" int8_ops);--> statement-breakpoint
CREATE INDEX "idx_tickets_priority" ON "tickets" USING btree ("priority" text_ops);--> statement-breakpoint
CREATE INDEX "idx_tickets_status" ON "tickets" USING btree ("status" text_ops);--> statement-breakpoint
CREATE INDEX "idx_ticket_comments_ticket" ON "ticket_comments" USING btree ("ticket_id" int8_ops);--> statement-breakpoint
CREATE INDEX "idx_ticket_status_history_date" ON "ticket_status_history" USING btree ("changed_at" timestamp_ops);--> statement-breakpoint
CREATE INDEX "idx_ticket_status_history_ticket" ON "ticket_status_history" USING btree ("ticket_id" int8_ops);
*/