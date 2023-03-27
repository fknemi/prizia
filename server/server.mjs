import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";
import { handler as ssrHandler } from "../dist/server/entry.mjs";
import fs from "fs";
import { validatePassword } from "../utils/hash.js";
import { verifyToken } from "../utils/validation.js";

if (!fs.existsSync(`./${process.env.TEMP_FOLDER}`)) {
  fs.mkdirSync(`./${process.env.TEMP_FOLDER}`);
}
if (!fs.existsSync(`./${process.env.UPLOADS_FOLDER}`)) {
  fs.mkdirSync(`./${process.env.UPLOADS_FOLDER}`);
}

const app = express();
const port = process.env.PORT || 3000;
app.use(express.static("../client/assets"));
app.use("/api/*", async (req, res, next) => {
  if (req.originalUrl.slice(0, 10) === "/api/login") {
    return next();
  }
  let token = req.headers.authorization;
  if (!token) {
    return res.status(401).send("Unauthorized");
  }
  token = token.replace("Bearer ", "");
  let isValid = await verifyToken(token);
  if (!isValid) {
    return res.status(401).send("Unauthorized");
  }
  next();
});
app.use(ssrHandler);
app.use(cors({ origin: "*" }));

const startServer = async () => {
  app.listen(port, () => {});
};
startServer();
