// import dotenv from "dotenv";
// dotenv.config();
// import fs from "fs";
// import cors from "cors";
// import express from "express";
// import { handler as ssrHandler } from "../dist/server/entry.mjs";
// import bodyParser from "body-parser";
// import { validateUser, verifyToken } from "../utils/validation.js";

// if (!fs.existsSync(`./${process.env.TEMP_FOLDER}`)) {
//   fs.mkdirSync(`./${process.env.TEMP_FOLDER}`);
// }
// if (!fs.existsSync(`./${process.env.UPLOADS_FOLDER}`)) {
//   fs.mkdirSync(`./${process.env.UPLOADS_FOLDER}`);
// }

// const app = express();
// const port = process.env.PORT || 3000;

// // app.use(express.static("../client/assets"));



// app.use(ssrHandler);
// app.use(cors({ origin: "*" }));


// // app.use("/api/upload", bodyParser.urlencoded({ extended: false }));
// // app.use("/api/upload", bodyParser.json());
// // app.use("/api/file", validateUser);
// app.use("/api/hosted/data/*", async (req,res,next) => {
//   return res.status(200).send("DIE")
//   // return next()
// });

// const startServer = async () => {
//   app.listen(port, () => {});
// };
// startServer();














// Based on node_modules\@astrojs\node\dist\server.js
import { polyfill } from '@astrojs/webapi';
import { ExpressApp } from './app.mjs';
import middleware from './middleware.mjs';
polyfill(globalThis, {
  exclude: 'window document',
});
function createExports(manifest) {
  const app = new ExpressApp(manifest);
  return {
    handler: middleware(app),
  };
}
function start(manifest, options) {
  return;
  // if (options.mode !== "standalone" || process.env.ASTRO_NODE_AUTOSTART === "disabled") {
  //   return;
  // }
  // const app = new ExpressApp(manifest);
  // startServer(app, options);
}
export { createExports, start };
