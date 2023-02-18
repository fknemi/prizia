import { Router } from "express";
import { decrypt } from "../utils/decrypt.js";
import { prisma } from "../utils/utils.js";
import stream from "stream";
import fs from "fs";

const router = Router();

router.get("/file/:id/:fileId", async (req, res) => {
  let id = req.params.id;
  let fileId = req.params.fileId;
  let password = req.body.password;
  let file = null;
  try {
    file = await prisma.file.findFirst({
      where: {
        id: fileId,
        uploadId: id,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
  if (!file) {
    return res.status(400).json({ message: "File not found" });
  }
  let decryptedBuffer = null;
  try {
    decryptedBuffer = await decrypt(file.encryptedFileStoredPath, password);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
  if (!decryptedBuffer) {
    return res.status(500).json({ message: "Failed to Decrypt File" });
  }
  res.setHeader("Content-Type", file.fileType);
  res.setHeader("Content-Disposition", `attachment; filename=${file.fileName}`);
  res.setHeader("Content-Length", file.fileSize);
  //   let readStream = new stream.PassThrough();
  //   readStream.write(decryptedBuffer);
  //   readStream.pipe(res);
  return res.status(200).send({ message: "File Downloaded" });
});

export { router };
