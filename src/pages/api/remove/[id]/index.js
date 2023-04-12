import { prisma, validId } from "../../../../../utils/utils.js";
import fs from "fs";
export async function del({ params, request }) {
  const id = params.id;
  const { fileName } = await request.json();

  if (!id || !fileName) {
    return new Response("Missing id or fileName", {
      status: 400,
      statusText: "Bad Request",
    });
  }
  let isValidId = await validId(id);
  if (!isValidId) {
    return new Response("Invalid id", {
      status: 400,
      statusText: "Bad Request",
    });
  }
  try {
    const file = await prisma.files.findUnique({
      where: {
        uploadId: id,
      },
      include: {
        files: {
          where: {
            fileName: fileName,
          },
          select: {
            id: true,
            fileStoredPath: true,
            uploadId: true,
          },
        },
      },
    });
    await prisma.file.delete({
      where: {
        id: file.files[0].id,
      },
    });
    if (file.files) {
      fs.rm(`${file.files[0].fileStoredPath}`, {}, (err) => {
        if (err) {
          console.log(err);
        }
      });
    }
  } catch (err) {
    console.log(err);
    return new Response("Failed to Remove File", {
      status: 500,
      statusText: "Internal Server Error",
    });
  }

  return new Response("Removed File", {
    status: 200,
    statusText: "OK",
  });
}
