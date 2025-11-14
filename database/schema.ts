import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    lastname: varchar("lastname", { length: 255 }).notNull(),
    mail: varchar("mail", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull().unique(),
});

export type NewUser = typeof users.$inferInsert;