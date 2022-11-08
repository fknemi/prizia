import dotenv from "dotenv";
dotenv.config();
import http from "http";
import cors from "cors";
import express from "express"
import { handler as ssrHandler } from "../dist/server/entry.mjs";
import { router as getHostedData } from "./routes/getHostedData.js";
import { router as hostFile } from "./routes/hostFile.js";
import { router as getGeneratedId } from "./routes/getGeneratedID.js";
import { router as validatePassword } from "./routes/validatePassword.js";
import { router as tempDataSave } from "./routes/tempDataSave.js";
import { PrismaClient } from "@prisma/client";
// import * as bodyParser from ""
import bb from 'express-busboy';
import { saveFiles } from "./utils/utils.js";

const app = express()
const server = http.createServer(app);
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

   

app.use(express.static("../dist/client/"));
app.use(ssrHandler);
app.use(cors({ origin: "*" }));

bb.extend(app, {
  allowedPath: "/temp/upload",
});










app.use("/api/", getGeneratedId);
app.use("/api/", validatePassword);
app.use("/api/", getHostedData);
app.use("/api/", hostFile);
app.use("/api/", tempDataSave);

app.use("/api/temp/upload", saveFiles)


const startServer = async () => {
  app.listen(port, () => {
    console.log(`Server is Listening on http://localhost:${port}/`);
  });
};
startServer();
