import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  client_name: text("client_name").notNull(),
  phone: text("phone"),
  destination_description: text("destination_description"),
  trip_period: text("trip_period"),
  notes: text("notes"),
  status: text("status").default("New").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
