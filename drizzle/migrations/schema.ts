import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const guestbook = pgTable("guestbook", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	message: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});
