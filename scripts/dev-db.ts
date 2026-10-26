/*
 * A local Postgres for development, no Docker or system install needed:
 * `npm run db:dev` starts it (data in .data/postgres) until Ctrl+C.
 * Matches DATABASE_URL=postgres://kainos:kainos@localhost:5433/kainos.
 */
import { existsSync } from "node:fs";
import EmbeddedPostgres from "embedded-postgres";

const databaseDir = ".data/postgres";
const fresh = !existsSync(databaseDir);

const pg = new EmbeddedPostgres({
  databaseDir,
  user: "kainos",
  password: "kainos",
  port: 5433,
  persistent: true,
});

async function main() {
  if (fresh) await pg.initialise();
  await pg.start();
  if (fresh) await pg.createDatabase("kainos");

  console.log("Postgres is running at postgres://kainos:kainos@localhost:5433/kainos (Ctrl+C to stop)");

  const stop = async () => {
    await pg.stop();
    process.exit(0);
  };
  process.on("SIGINT", stop);
  process.on("SIGTERM", stop);
}

main();
