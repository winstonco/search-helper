const express = require('express');
const cors = require('cors');

const { PORT, CLIENT_APPLICATION, checkEnvVars } = require('./env_vars');
require('dotenv').config({ path: './.env' });
checkEnvVars();

const api = require('./api');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', api);
app.use('', express.static(CLIENT_APPLICATION));

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
