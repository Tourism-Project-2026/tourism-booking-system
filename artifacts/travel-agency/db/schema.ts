import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";

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

export const trips = pgTable("trips", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  destination: text("destination").notNull(),
  description: text("description"),
  start_date: text("start_date"),
  end_date: text("end_date"),
  price_per_person: integer("price_per_person"),
  status: text("status").default("Upcoming").notNull(),
  capacity: integer("capacity"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export type Trip = typeof trips.$inferSelect;
export type NewTrip = typeof trips.$inferInsert;

export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  country: text("country"),
  notes: text("notes"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export type Client = typeof clients.$inferSelect;
export type NewClient = typeof clients.$inferInsert;
