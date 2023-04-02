import { decrypt } from "../../../../../../utils/decrypt";
import { prisma } from "../../../../../../utils/utils";
import { verifyToken } from "../../../../../../utils/validation";

export async function get({ params, request, response }) {
  let fileId = params.fileId;
  let { password } = await verifyToken(
    request.headers.get("cookie").replace("token=", "")
  );
  let file = null;
  try {
    file = await prisma.file.findFirst({
      where: {
        id: fileId,
      },
    });
  } catch (err) {
    console.log(err);
    return new Response("Internal Server Error", {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
  if (!file) {
    return new Response("File not found", {
      status: 400,
      statusText: "Bad Request",
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
    });
  }
  if (!decryptedBuffer) {
    return new Response("Internal Server Error", {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
  

  return new Response(decryptedBuffer, {
    status: 200,
    statusText: "OK",
    headers: {
      "Content-Type": `${file.fileType}`,
      "Content-Disposition": `attachment; filename=${file.fileName}`,
      "Content-Length": decryptedBuffer.length,
    },
  });
}
