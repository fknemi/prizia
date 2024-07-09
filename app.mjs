import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import { handler as ssrHandler } from "./dist/server/entry.mjs";
import { validateUser } from "./utils/validation.js";
import fs from "fs";
import cors from "cors";
import {
  corruptedFilesDeletionJob,
  expiredFilesDeletionJob,
} from "./cron-jobs/filesDeletion.mjs";

if (!fs.existsSync(`./${process.env.TEMP_FOLDER}`)) {
  fs.mkdirSync(`./${process.env.TEMP_FOLDER}`);
}
if (!fs.existsSync(`./${process.env.UPLOADS_FOLDER}`)) {
  fs.mkdirSync(`./${process.env.UPLOADS_FOLDER}`);
}

const allowedOrigins = [
  "https://prizia.vihaan.ind.in",
  process.env.ENVIRONMENT === "development" ? "*" : "",
];
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (!allowedOrigins.includes("*")) {
        if (allowedOrigins.indexOf(origin) === -1) {
          var msg =
            "The CORS policy for this site does not " +
            "allow access from the specified Origin.";
          return callback(new Error(msg), false);
        }
      }

      return callback(null, true);
    },
  })
);

// Add Astro SSR routes
app.use("/api/hosted/data/:id", validateUser);
app.use("/api/file/:id/:fileId", validateUser);
app.use(ssrHandler);

app.use(express.static("./dist/client"));
expiredFilesDeletionJob.start();
corruptedFilesDeletionJob.start();
app.listen(process.env.PORT || port, () => {
  console.log(
    `Node Express server listening on port ${process.env.PORT || port}`
  );
});
