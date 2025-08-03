import { migrate } from 'drizzle-orm/vercel-postgres/migrator';
import { db } from '.';
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Load environment variables manually
 */
function loadEnv() {
  try {
    // Try to load .env.local first, then .env
    const envFiles = ['.env.local', '.env'];

    for (const envFile of envFiles) {
      try {
        const envPath = join(process.cwd(), envFile);
        const envContent = readFileSync(envPath, 'utf8');

        // Parse and set environment variables
        envContent.split('\n').forEach((line) => {
          const trimmedLine = line.trim();
          if (trimmedLine && !trimmedLine.startsWith('#')) {
            const [key, ...valueParts] = trimmedLine.split('=');
            if (key && valueParts.length > 0) {
              const value = valueParts.join('=').trim();
              // Remove quotes if present
              const cleanValue = value.replace(/^["']|["']$/g, '');
              process.env[key.trim()] = cleanValue;
            }
          }
        });
      } catch (error) {
        // File doesn't exist, continue to next
        continue;
      }
    }
  } catch (error) {
    console.warn('Could not load environment files:', error);
  }
}

/**
 * Migration function
 *
 * Only runs when the NODE_ENV is NOT production
 */
async function main() {
  try {
    // Load environment variables
    loadEnv();

    await migrate(db, { migrationsFolder: 'lib/db/drizzle' });
    console.log('Migrations complete');
  } catch (error) {
    console.log('Migrations failed');
    console.error(error);
  }
}

main();
