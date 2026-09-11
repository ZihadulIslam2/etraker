import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { PGlite } from '@electric-sql/pglite';
import { createServer } from 'pglite-server';

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(__dirname, '../.pgdata');
const PORT = 5432;

function checkPort(port) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(1000);
    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.once('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.once('error', () => {
      resolve(false);
    });
    socket.connect(port, '127.0.0.1');
  });
}

async function main() {
  const isRunning = await checkPort(PORT);
  if (isRunning) {
    console.log(`[DB] PostgreSQL service is already active on port ${PORT}.`);
    setInterval(() => {}, 60000);
    return;
  }

  console.log(`[DB] Starting embedded PostgreSQL (PGlite) server on port ${PORT}...`);
  const db = new PGlite(dataDir);
  await db.waitReady;

  const server = createServer(db);
  server.listen(PORT, async () => {
    console.log(`[DB] Embedded PostgreSQL is listening on port ${PORT}`);
    
    // Automatically push prisma schema asynchronously
    try {
      console.log(`[DB] Syncing database schema with Prisma...`);
      const { stdout, stderr } = await execAsync('npx prisma db push --skip-generate', {
        cwd: path.resolve(__dirname, '..'),
        env: {
          ...process.env,
          DATABASE_URL: 'postgresql://etraker:etraker_dev@localhost:5432/etraker',
        },
      });
      if (stdout) console.log(stdout.trim());
      if (stderr) console.error(stderr.trim());
      console.log(`[DB] Database schema ready.`);
    } catch (err) {
      console.error(`[DB] Sync notice:`, err.message);
    }
  });

  const shutdown = () => {
    console.log(`[DB] Shutting down embedded database server...`);
    server.close(() => {
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((err) => {
  console.error('[DB] Fatal error:', err);
  process.exit(1);
});
