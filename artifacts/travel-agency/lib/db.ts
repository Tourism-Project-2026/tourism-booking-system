import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

function createDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Add it to your project Secrets to connect to PostgreSQL."
    );
  }
  const client = postgres(url, {
    ssl: "require",
    max: 10,
    idle_timeout: 30,
    connect_timeout: 10,
  });
  return drizzle(client);
}

let _db: ReturnType<typeof createDb> | null = null;

export function getDb() {
  if (!_db) {
    _db = createDb();
  }
  return _db;
}

export const db = {
  get select() { return getDb().select.bind(getDb()); },
  get insert() { return getDb().insert.bind(getDb()); },
  get update() { return getDb().update.bind(getDb()); },
  get delete() { return getDb().delete.bind(getDb()); },
  get query() { return getDb().query; },
};
