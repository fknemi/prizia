import { Router } from "express";
import { getHostedFiles, validatePassword } from "../utils/utils.js";

const router = Router();

router.post("/url/:id", async (req, res) => {
  const id = req.params.id;
  const password = req.body.password;
  if (!id || !password)
    return res.status(400).json({ message: "Missing id or password" });

  const data = await getHostedFiles(id);
  const isValid = await validatePassword(password, data.password);
  if (!isValid) {
    return res.status(403).send("Invalid Password");
  }

  for (const file of data.files) {
    delete file.encryptedFileName;
    delete file.fileStoredPath;
    delete file.encryptedFileStoredPath;
  }

  return res.status(200).send({
    uploadId: data.uploadId,
    expiresAt: data.expiresAt,
    files: data.files,
  });
});

export { router };
