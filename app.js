const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config({ path: './.env' });
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
const { client, db, users } = require('./db/conn');
const { ObjectID } = require('bson');

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

// Register
app.post('/api/createUser', async (req, res) => {
  const { username, password } = req.body;
  const userpass = username + '_' + password;
  const saved = { google: [], se: [] };
  try {
    const newUser = await users.insertOne({
      username,
      password,
      userpass,
      saved,
    });
    console.log(newUser);
    res.json(newUser);
  } catch (err) {
    console.log(
      `Error when creating new user (username: ${username}, password: ${password}`
    );
    res
      .status(409)
      .send(
        `Error when creating new user (username: ${username}, password: ${password}`
      );
  }
});

app.get('/api/users', async (req, res) => {
  const cursor = users.find({});
  res.send(await cursor.toArray());
});

app.post('/api/getUser', async (req, res) => {
  const { username, password } = req.body;
  const userpass = username + '_' + password;
  const query = { userpass };
  const projection = { userpass: 1 };
  const result = await users.find(query).project(projection).next();
  res.json(result);
});

app.post('/api/read', async (req, res) => {
  const { _id } = req.body;
  const query = { _id: ObjectID(_id) };
  const options = { projection: { _id: 0, userpass: 0 } };
  const result = await users.findOne(query, options);
  res.json(result);
});

app.delete('/api/deleteUser', async (req, res) => {
  const { _id } = req.body;
  const result = await users.deleteOne({ _id: ObjectID(_id) });
  res.send(result);
});

app.put('/api/addLink', async (req, res) => {
  const { _id, site, link } = req.body;
  const query = { _id: ObjectID(_id) };
  const key = `saved.${site}`;
  const update = { $addToSet: { [key]: link } };
  const result = await users.updateOne(query, update);
  res.json(result);
});

app.put('/api/remLink', async (req, res) => {
  const { _id, site, link } = req.body;
  const query = { _id: ObjectID(_id) };
  const key = `saved.${site}`;
  const update = { $pull: { [key]: link } };
  const result = await users.updateOne(query, update);
  res.json(result);
});

app.post('/api/containsLink', async (req, res) => {
  const { _id, site, link } = req.body;
  const key = `saved.${site}`;
  console.log('test');
  const query = { _id: ObjectID(_id), [key]: link };
  const result = await users.find(query).next();
  result !== '' ? res.send('true') : res.send('false');
});

app.delete('/api/deleteAll', async (req, res) => {
  await users.deleteMany({});
  res.send('Deleted all.');
});
