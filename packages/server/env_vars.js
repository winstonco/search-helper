const path = require('path');

const envVars = {
  MONGO_URI: process.env.MONGO_URI ?? process.env.ATLAS_URI,
  PORT: process.env.SERVER_PORT ?? 3001,
  CLIENT_APPLICATION:
    process.env.CLIENT_APPLICATION ?? path.join(__dirname, '../client/build'),
};

function checkEnvVars() {
  for (const [key, value] of Object.entries(envVars)) {
    if (value === undefined) {
      console.error(
        `Error: Environment variable ${key} is undefined. Please check your .env file or provide the corresponding environment variable.`
      );
      process.exit(1);
    }
  }
}

module.exports = { ...envVars, checkEnvVars };
