import { Router } from "express";
import bodyParser from "body-parser";
import fs from "fs";
import { prisma } from "../utils/utils.js";
import busboy from "busboy";

const router = Router();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post("/upload/:id", function (req, res) {
  let id = req.params.id;
  if (!id) return res.status(400).json({ message: "Missing id" });
  const bb = busboy({ headers: req.headers });
  const savePath = `./${process.env.UPLOADS_FOLDER}/${id}`;
  let totalBytesReceived = 0;
  let fileSize = 0;
  let buffers = [];
  if(!fs.existsSync(savePath)){
    fs.mkdirSync(savePath);
  }
  bb.on("file", function (_, file, info) {
    try {
      file.on("data", (chunk) => {
        buffers.push(chunk);
        totalBytesReceived += chunk.length;
        if (fileSize === 0) {
          fileSize = req.headers["content-length"];
        }
        const progress = Math.floor((totalBytesReceived / fileSize) * 100);
      });
      file.on("end", async () => {
        let buf = Buffer.concat(buffers);
        fs.writeFileSync(`${savePath}/${info.filename}`, buf);
        let fileData = {
          fileStoredPath: `${savePath}/${info.filename}`,
          fileName: info.filename,
          fileSize: buf.length,
          fileType: info.mimeType,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
        };
        await prisma.files.upsert({
          where: {
            uploadId: id,
          },
          update: {
            files: {
              create: {
                ...fileData,
              },
            },
          },
          create: {
            uploadId: id,
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
            password: "",
            files: {
              create: {
                ...fileData,
              },
            },
          },
        });
      });
    } catch (err) {
      console.log(err);
    }
  });

  req.pipe(bb);
  return res.status(200).send("hello");
});

export { router };
