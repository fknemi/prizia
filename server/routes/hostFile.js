import { Router } from "express";
import bodyParser from "body-parser";
import fs from "fs";
import busboy from "connect-busboy";
import es from "event-stream";

const router = Router();
router.use(busboy());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post("/upload/:id", (req, res) => {
  const id = req.params.id;
  const saveTo = `./${process.env.UPLOADS_FOLDER}/${id}`;
  const totalBytes = req.headers["content-length"];
  let uploadedBytes = 0;

  if (!fs.existsSync(saveTo)) {
    fs.mkdirSync(saveTo);
  }

  req.pipe(req.busboy);

  req.busboy.on("file", (_, file, info) => {
    const filePath = `./${process.env.UPLOADS_FOLDER}/${id}/${info.filename}`;
    file
      .pipe(
        es.mapSync((chunk) => {
          uploadedBytes += chunk.length;
          const progress = (uploadedBytes / totalBytes) * 100;
          console.log(`Upload progress: ${progress}%`);
        })
      )
      .pipe(fs.createWriteStream(filePath));
  });

  req.busboy.on("finish", () => {
    return res.status(200).send("File uploaded successfully.");
  });
});

export { router };
