import { prisma } from "../../../../../../utils/utils.js";
import icons from "../../../../../icons.json";

export async function get({ params, request }) {
  let id = params.id;
  if (!id) {
    return new Response("No id provided", {
      headers: {
        "Set-Cookie": `token=; Max-Age=0; SameSite=Strict; Secure; HttpOnly`,
      },
    });
  }
  let files = await prisma.files.findUnique({
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

  const newFiles = files.files.map((file) => {
    let icon = null;
    if (file.fileType.includes("image")) {
      icon = icons[0].icon;
    }
    if (file.fileType.includes("video")) {
      icon = icons[1].icon;
    }
    if (file.fileType.includes("audio")) {
      icon = icons[2].icon;
    }
    return { ...file, icon };
  });

  return new Response(
    JSON.stringify({
      ...files,
      files: newFiles,
    }),
    {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
      status: 200,
    }
  );
}
