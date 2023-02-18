import { Router } from "express";
import bodyParser from "body-parser";
import { deleteFolder, prisma, saveFile } from "../utils/utils.js";
import fs from "fs";
import { encryptAllFiles } from "../utils/encrypt.js";
const router = Router();

router.use(bodyParser.json());

router.post("/save/:id", async (req, res) => {
  const id = req.params.id;
  const password = req.body.password;
  if (!id || !password) {
    return res.status(400).json({ message: "Missing id or password" });
  }
  let didSave = await saveFile(id, password);
  if (!didSave) {
    const didDeleteFolder = await deleteFolder(id);
    if (didDeleteFolder) {
      console.log(`DELETED ${id}`);
    } else {
      console.log(`FAILED TO DELETE ${id}`);
    }
    return res.status(500).json({ message: "Failed to Save Files" });
  }
  try {
    const files = await prisma.files.findFirst({
      where: {
        uploadId: id,
      },
      include: {
        files: true,
      },
    });
    await encryptAllFiles(files.files, password, id);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to Save Files" });
  }

  return res.status(200).json({ message: "Saved Files" });
});

export { router };
