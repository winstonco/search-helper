import express from 'express';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';

import {
  MONGO_URI,
  PORT,
  CLIENT_APPLICATION,
  checkEnvVars,
} from './env_vars.js';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
checkEnvVars();

import api from './api.js';

await mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

app.use(cors());
// Serve static files from the React app
app.use(express.static(CLIENT_APPLICATION));
app.use(express.json());

// Put all API endpoints under '/api'
app.use('/api', api);

// Handle all requests that don't match the ones above, for example those created by a browser router
app.get('*', (_, res) => {
  res.sendFile(path.join(CLIENT_APPLICATION, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
