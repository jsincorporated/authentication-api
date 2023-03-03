require('dotenv').config()
const http = require("http");
const app = require("./app");
// const server = http.createServer(app);

const API_PORT = process.env.API_PORT;
const port = process.env.PORT || API_PORT;

app.listen(port);