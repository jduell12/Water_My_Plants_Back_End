const express = require("express");
const cors = require("cors");
const server = express();

//routers
const authRouter = require("../auth/authRouter");
const auth = require("../auth/authMiddleware");

server.use(express.json());
server.use(cors());

server.use("/auth", authRouter);

server.get("/", (req, res) => {
  res.status(200).json({ server: "working!" });
});

module.exports = server;
