const express = require("express");
const cors = require("cors");
const path = require("path");

const { PORT, CLIENT_APPLICATION, checkEnvVars } = require("./env_vars");
require("dotenv").config({ path: "./.env" });
checkEnvVars();

const api = require("./api");

const app = express();

app.use(cors());
// Serve static files from the React app
app.use(express.static(CLIENT_APPLICATION));
app.use(express.json());

// Put all API endpoints under '/api'
app.use("/api", api);

// Handle all requests that don't match the ones above, for example those created by a browser router
app.get("*", (_, res) => {
    res.sendFile(path.join(CLIENT_APPLICATION, "index.html"));
});

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});
