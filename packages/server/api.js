const express = require("express");
const { ObjectID } = require("bson");

const { users } = require("./db/conn");

const router = express.Router();

app.post("/createUser", async (req, res) => {
    const { username, password } = req.body;
    const userpass = username + "_" + password;
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
        res.status(409).send(
            `Error when creating new user (username: ${username}, password: ${password}`
        );
    }
});

app.get("/users", async (req, res) => {
    const cursor = users.find({});
    res.send(await cursor.toArray());
});

app.post("/getUser", async (req, res) => {
    const { username, password } = req.body;
    const userpass = username + "_" + password;
    const query = { userpass };
    const projection = { userpass: 1 };
    const result = await users.find(query).project(projection).next();
    res.json(result);
});

app.post("/read", async (req, res) => {
    const { _id } = req.body;
    const query = { _id: ObjectID(_id) };
    const options = { projection: { _id: 0, userpass: 0 } };
    const result = await users.findOne(query, options);
    res.json(result);
});

app.delete("/deleteUser", async (req, res) => {
    const { _id } = req.body;
    const result = await users.deleteOne({ _id: ObjectID(_id) });
    res.send(result);
});

app.put("/addLink", async (req, res) => {
    const { _id, site, title, link } = req.body;
    const query = { _id: ObjectID(_id) };
    const key = `saved.${site}`;
    const update = { $addToSet: { [key]: { title: title, link: link } } };
    console.log(update);
    const result = await users.updateOne(query, update);
    res.json(result);
});

app.put("/remLink", async (req, res) => {
    const { _id, site, title, link } = req.body;
    const query = { _id: ObjectID(_id) };
    const key = `saved.${site}`;
    const update = { $pull: { [key]: { title: title, link: link } } };
    const result = await users.updateOne(query, update);
    res.json(result);
});

app.post("/containsLink", async (req, res) => {
    const { _id, site, title, link } = req.body;
    const key = `saved.${site}`;
    console.log("test");
    const query = { _id: ObjectID(_id), [key]: { title: title, link: link } };
    const result = await users.find(query).next();
    result !== "" ? res.send("true") : res.send("false");
});

app.delete("/deleteAll", async (req, res) => {
    await users.deleteMany({});
    res.send("Deleted all.");
});

module.exports = router;
