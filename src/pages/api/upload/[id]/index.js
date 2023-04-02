import { validId, prisma } from "../../../../../utils/utils.js";
import busboy from "busboy";
import fs from "fs";
export async function post(test) {
  let { params, request } = test;
  let id = params.id;
  if (!id)
    return new Response("Missing id", {
      status: 400,
      statusText: "Bad Request",
    });
  const bb = busboy({
    headers: {
      "content-length": request.headers.get("content-length"),
      "content-type": request.headers.get("content-type"),
      ...Object.fromEntries(request.headers),
    },
  });

  if (!fs.existsSync(`./${process.env.UPLOADS_FOLDER}/${id}`)) {
    fs.mkdirSync(`./${process.env.UPLOADS_FOLDER}/${id}`);
  }

  const savePath = `./${process.env.UPLOADS_FOLDER}/${id}`;
  let totalBytesReceived = 0;
  let fileSize = 0;
  let buffers = [];
  if (!fs.existsSync(savePath)) {
    fs.mkdirSync(savePath);
  }
  bb.on("file", function (_, file, info) {
    try {
      file.on("data", (chunk) => {
        buffers.push(chunk);
        totalBytesReceived += chunk.length;
        if (fileSize === 0) {
          fileSize = request.headers["content-length"];
        }
        // const progress = Math.floor((totalBytesReceived / fileSize) * 100);
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
      return new Response("Failed to Save Files", {
        status: 500,
        statusText: "Internal Server Error",
      });
    }
  });
  try {
    let stream = await request.body.getReader().read();
    bb.write(stream.value);
  } catch (err) {
    console.log(err);
  }

  return new Response("Saved Files", {
    status: 200,
    statusText: "OK",
  });
}
