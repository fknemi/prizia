import dotenv from "dotenv";
dotenv.config();
import http from "http";
import cors from "cors";
import express from "express";
import { handler as ssrHandler } from "../dist/server/entry.mjs";
import { router as getHostedData } from "./routes/getHostedData.js";
import { router as hostFile } from "./routes/hostFile.js";
import { router as getGeneratedId } from "./routes/getGeneratedID.js";
import { router as validatePassword } from "./routes/validatePassword.js";
import { router as saveFiles } from "./routes/saveFiles.js";
import { PrismaClient } from "@prisma/client";

const app = express();
const server = http.createServer(app);
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

app.use(express.static("../dist/client/"));
app.use(ssrHandler);
app.use(cors({ origin: "*" }));
app.use("/api/url/generate", getGeneratedId);
app.use("/api/", hostFile);
app.use("/api/", validatePassword);
app.use("/api/", saveFiles)


const startServer = async () => {
  app.listen(port, () => {
    console.log(`Server is Listening on http://localhost:${port}/`);
  });
};
startServer();
