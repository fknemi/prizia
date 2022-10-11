import { Router } from "express";
import { getHostedFiles, validatePassword } from "../utils/utils.js";

const router = Router();

router.post("/url/:id", async (req, res) => {
  const { id } = req.params;

  const data = await getHostedFiles(id);
  const isValid = await validatePassword(password, data.password);
  if (!isValid) {
    res.status(403).send("Invalid Password");
  }

  return res.status(200).send({
    id: data.id,
    fileUrls: data.fileUrls,
  });
});

export { router };
