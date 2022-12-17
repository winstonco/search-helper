const { MONGO_URI } = require("../env_vars");

const { MongoClient } = require("mongodb");
const client = new MongoClient(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = client.db("searchHelper");
const users = db.collection("users");

module.exports = { client, db, users };
