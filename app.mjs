import express from 'express';
import { handler as ssrHandler } from './dist/server/entry.mjs';
import { validateUser } from './utils/validation.js';

const app = express();
const port = 3000;
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Add Astro SSR routes
app.use("/api/hosted/data/:id", validateUser);
app.use("/api/file/:id/:fileId", validateUser);
app.use(ssrHandler);

app.use(express.static('./dist/client'));


app.listen(process.env.PORT || port, () => {
  console.log(
    `Node Express server listening on port ${process.env.PORT || port}`
  );
});
