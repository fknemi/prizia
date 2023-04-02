import { prisma } from "../../../../../../utils/utils";
import { verifyToken } from "../../../../../../utils/validation";


export async function get({ params, request }) {
  let id = params.id;
  const files = await prisma.files.findUnique({
    where: {
      uploadId: id,
    },
    select: {
      uploadId: true,
      expiresAt: true,
      files: {
        select: {
          id: true,
          fileName: true,
          fileSize: true,
          fileType: true,
        },
      },
    },
  });
  console.log(files);

  return new Response(JSON.stringify(files), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
    status: 200,
  });
}
