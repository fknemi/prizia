import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { handler as ssrHandler } from "../dist/server/entry.mjs";
import { router as getHostedData } from "./routes/getHostedData.js";
import { router as hostFile } from "./routes/hostFile.js";
import { router as getGeneratedId } from "./routes/getGeneratedID.js";
import { router as validatePassword } from "./routes/validatePassword.js";
import { PrismaClient } from "@prisma/client";
import { Server } from "socket.io";

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;
app.use(express.static("../dist/client/"));
app.use(ssrHandler);
app.use(cors({ origin: "*" }));
app.use("/api/", getGeneratedId);
app.use("/api/", validatePassword);
app.use("/api/", getHostedData);
app.use("/api/", hostFile);

const startServer = async () => {
  const server = app.listen(port, () => {
    console.log(`Server is Listening on http://localhost:${port}/`);
  });
  const io = new Server(server, { cors: { origin: "*" } });
  await prisma
    .$connect()
    .then(() => {
      console.log("Connected to database");
    })
    .catch((err) => {
      console.log(err);
    });

  io.on("connection", (socket) => {
    socket.on("receiveFile", (data) => {});
  });
};
startServer();
