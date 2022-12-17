const express = require('express');
const cors = require('cors');

const { PORT, CLIENT_APPLICATION, checkEnvVars } = require('./env_vars');
require('dotenv').config({ path: './.env' });
checkEnvVars();

const api = require('./api');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/', express.static(CLIENT_APPLICATION));
app.use('/api', api);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
