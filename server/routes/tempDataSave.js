import busboy from "busboy";
import fs from "fs";
import os from "os";
import * as ks from "binary-type"
import { Router } from "express";
const router = Router();








// function ab2str(buf) {
//   return String.fromCharCode.apply(null, new Uint16Array(buf));
// }

// function str2ab(str) {
//   var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
//   var bufView = new Uint16Array(buf);
//   for (var i=0, strLen=str.length; i<strLen; i++) {
//     bufView[i] = str.charCodeAt(i);
//   }
//   return buf;
// }













router.post("/temp/upload", async (req, res) => {
  if (fs.existsSync(`./temp/${req.headers["id"]}`)) {
  } else {
    fs.mkdirSync(`./temp/${req.headers["id"]}`, { recursive: true });
  }



// 10kb
// 12kb




let buffer = str2ab(req.body.data)






// `./temp/${req.headers["id"]}/${req.body.fileName}`
 

  







 

  
  
  


  

  return res.status(200).send("adkad");
});

export { router };
