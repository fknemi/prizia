// import { decrypt } from "../utils/decrypt.js";
// import { prisma } from "../utils/utils.js";



export async function get({params,req}){
  // let fileId = req.params.fileId;
  // let password = req.body.password;
  // let file = null;
  // try {
  //   file = await prisma.file.findFirst({
  //     where: {
  //       id: fileId,
  //     },
  //   });
  // } catch (err) {
  //   console.log(err);
  //   return res.status(500).json({ message: "Internal Server Error" });
  // }
  // if (!file) {
  //   return res.status(400).json({ message: "File not found" });
  // }
  // let decryptedBuffer = null;
  // try {
  //   decryptedBuffer = await decrypt(file.encryptedFileStoredPath, password);
  // } catch (err) {
  //   console.log(err);
  //   return res.status(500).json({ message: "Internal Server Error" });
  // }
  // if (!decryptedBuffer) {
  //   return res.status(500).json({ message: "Internal Server Error" });
  // }

  // res.setHeader("Content-Type", file.fileType);
  // res.setHeader("Content-Disposition", `attachment; filename=${file.fileName}`);
  // res.setHeader("Content-Length", file.fileSize);

  // return res.status(200).send(decryptedBuffer);
  return res.status(200).send("ASJSJs");
}

// "/file/:id/:fileId"
