import { validId, prisma } from "../../../../../utils/utils.js";
import busboy from "busboy";
import fs from "fs";
import { init } from "@paralleldrive/cuid2";

const createFileId = init({
  random: Math.random,
  length: 25,
  fingerprint: "a-custom-host-fingerprint",
});

export async function post(test) {
  let { params, request } = test;
  let id = params.id;
  const MAX_FILE_SIZE = 524288000; // 500MB
  if (!id) {
    return new Response("Missing ID", {
      status: 400,
      statusText: "Bad Request",
    });
  }
  // check if process.env.UPLOADS_FOLDER/ID has less than 3 files
  if (!validId(id)) {
    return new Response("Invalid ID", {
      status: 400,
      statusText: "Bad Request",
    });
  }
  const files = await prisma.files.findUnique({
    where: {
      uploadId: id,
    },
    include: {
      files: true,
    },
  });

  if (files && files.files.length >= 3) {
    return new Response("Maximum number of files reached", {
      status: 400,
      statusText: "Bad Request",
    });
  }

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
        if (totalBytesReceived > MAX_FILE_SIZE) {
          file.resume();
          return new Response("File Size Too Large", {
            status: 400,
            statusText: "Bad Request",
          });
        }
      });
      file.on("end", async () => {
        let fileId = createFileId();
        let buf = Buffer.concat(buffers);
        let fileExtension = info.filename.substring(
          info.filename.lastIndexOf(".") + 1,
          info.filename.length
        );
        fs.writeFileSync(`${savePath}/${fileId}.${fileExtension}`, buf);
        let fileData = {
          fileStoredPath: `${savePath}/${fileId}.${fileExtension}`,
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
      return new Response("Failed to Save File", {
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

  return new Response(
    "File Uploaded",

    {
      status: 200,
      statusText: "OK",
    }
  );
}
