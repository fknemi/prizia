import { Router } from "express";
import bodyParser from "body-parser";
import { deleteFolder, saveFile } from "../utils/utils.js";

const router = Router();

router.use(bodyParser.json());

router.post("/save/:id", async (req, res) => {
  const id = req.params.id;
  console.log(req.body.password)
  if (!id || !req.body.password) {
    return res.status(400).json({ message: "Missing id or password" });
  }
  let didSave = saveFile(id, req.body.password);
  if (!didSave) {
    const didDeleteFolder = await deleteFolder(id);
    if (didDeleteFolder) {
      console.log(`DELETED ${id}`);
    } else {
      console.log(`FAILED TO DELETE ${id}`);
    }
    return res.status(500).json({ message: "Failed to Save Files" });
  }
  return res.status(200).json({ message: "Saved Files" });
});

export { router };
