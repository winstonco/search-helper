import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const MONGO_URI = process.env.MONGO_URI ?? process.env.ATLAS_URI;
export const PORT = process.env.SERVER_PORT ?? 3001;
export const CLIENT_APPLICATION =
  process.env.CLIENT_APPLICATION ?? path.join(__dirname, '../client/build');

export const envVars = { MONGO_URI, PORT, CLIENT_APPLICATION };

export function checkEnvVars() {
  for (const [key, value] of Object.entries(envVars)) {
    if (value === undefined) {
      console.error(
        `Error: Environment variable ${key} is undefined. Please check your .env file or provide the corresponding environment variable.`
      );
      process.exit(1);
    }
  }
}
