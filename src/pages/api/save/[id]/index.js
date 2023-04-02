import {
  validId,
  saveFile,
  deleteFolder,
  prisma,
} from "../../../../../utils/utils";
import { encryptAllFiles } from "../../../../../utils/encrypt";

export async function put({ params, request, response }) {
  const id = params.id;

  const { password } = await request.json();

  if (!id || !password) {
    return new Response("Missing id or password", {
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
  let didSave = await saveFile(id, password);
  if (!didSave) {
    const didDeleteFolder = await deleteFolder(id);
    if (didDeleteFolder) {
      console.log(`DELETED ${id}`);
    } else {
      console.log(`FAILED TO DELETE ${id}`);
    }
    return new Response("Failed to Save Files", {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
  try {
    const files = await prisma.files.findFirst({
      where: {
        uploadId: id,
      },
      include: {
        files: true,
      },
    });
    await encryptAllFiles(files.files, password, id);
  } catch (err) {
    console.log(err);
    return new Response("Failed to Save Files", {
      status: 500,
      statusText: "Internal Server Error",
    });
  }

  return new Response("Saved Files", {
    status: 200,
    statusText: "OK",
  });
}
