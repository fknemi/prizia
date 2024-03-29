import { decrypt } from "../../../../../../utils/decrypt.js";
import { prisma } from "../../../../../../utils/utils.js";
import { verifyToken } from "../../../../../../utils/validation.js";

const headers = {
  "Set-Cookie": "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT",
};

export async function get({ params, request, response }) {
  let fileId = params.fileId;
  let { id, password } = await verifyToken(
    request.headers.get("cookie").replace("token=", "")
  );
  let file = null;
  if (!password || !id) {
    return new Response("Unauthorized", {
      status: 401,
      statusText: "Unauthorized",
      headers,
    });
  }
  try {
    file = await prisma.file.update({
      where: {
        id: fileId,
      },
      select: {
        id: true,
        fileName: true,
        fileType: true,
        encryptedFileStoredPath: true,
      },
      data: {
        lastDownloaded: new Date(),
        timesDownloaded: {
          increment: 1,
        },
      },
    });
  } catch (err) {
    console.log(err);
    return new Response("Internal Server Error", {
      status: 500,
      statusText: "Internal Server Error",
      headers,
    });
  }
  if (!file) {
    return new Response("File not found", {
      status: 400,
      statusText: "Bad Request",
      headers,
    });
  }
  let decryptedBuffer = null;
  try {
    decryptedBuffer = await decrypt(file.encryptedFileStoredPath, password);
  } catch (err) {
    console.log(err);
    return new Response("Internal Server Error", {
      status: 500,
      statusText: "Internal Server Error",
      headers,
    });
  }
  if (!decryptedBuffer) {
    return new Response("Internal Server Error", {
      status: 500,
      statusText: "Internal Server Error",
      headers,
    });
  }

  return new Response(decryptedBuffer, {
    status: 200,
    statusText: "OK",
    headers: {
      "Content-Type": `${file.fileType}`,
      "Content-Disposition": `attachment; filename=${file.fileName}`,
      "Content-Length": decryptedBuffer.length,
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: 0,
    },
  });
}
