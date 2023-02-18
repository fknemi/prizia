import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";
import { handler as ssrHandler } from "../dist/server/entry.mjs";
import { router as getHostedData } from "./routes/getHostedData.js";
import { router as hostFile } from "./routes/hostFile.js";
import { router as getGeneratedId } from "./routes/getGeneratedID.js";
import { router as validatePassword } from "./routes/validatePassword.js";
import { router as saveFiles } from "./routes/saveFiles.js";
import { router as getFile } from "./routes/getFile.js";
import fs from "fs";

if (!fs.existsSync(`./${process.env.TEMP_FOLDER}`)) {
  fs.mkdirSync(`./${process.env.TEMP_FOLDER}`);
}
if (!fs.existsSync(`./${process.env.UPLOADS_FOLDER}`)) {
  fs.mkdirSync(`./${process.env.UPLOADS_FOLDER}`);
}

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("../dist/client/"));
app.use(ssrHandler);
app.use(cors({ origin: "*" }));
app.use("/api/url/generate", getGeneratedId);
app.use("/api/", hostFile);
app.use("/api/", validatePassword);
app.use("/api/", saveFiles);
app.use("/api/", getHostedData);
app.use("/api/", getFile);

const startServer = async () => {
  app.listen(port, () => {});
};
startServer();
