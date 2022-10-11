import { Router } from "express";
import readable from "readable-url-names";
import { createFolder, deleteFolder, validId } from "../utils/utils.js";

const router = Router();

router.get("/url", async (req, res) => {
  let generator = new readable();
  let id = generator.generate();
  let isValid = await validId(id);
  while (isValid !== null) {
    id = generator.generate();
    isValid = await validId(id);
  }

  return res.status(200).send(id);
});

export { router };
