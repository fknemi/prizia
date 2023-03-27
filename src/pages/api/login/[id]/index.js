// import { validatePassword } from "@utils/utils.js";
// import { encryptAllFiles } from "@utils/encrypt.js";
// import readable from "readable-url-names";

export async function post({ params, request }) {
  let id = params.id;
  if (!id)
    return new Response("No ID", { status: 400, statusText: "Bad Request" });
  let password = await await request.json().password;

  if (!password)
    return new Response("Password Required", {
      status: 400,
      statusText: "Bad Request",
    });
  let file = await validId(id);
  if (!file)
    return new Response("Invalid Password", {
      status: 400,
      statusText: "Bad Request",
    });
  // let valid = await validatePassword(password, file.password);
  let valid = true;
  if (!valid)
    return new Response("Invalid Password", {
      status: 400,
      statusText: "Bad Request",
    });
  try {
    // await encryptAllFiles(id, password);
  } catch {
    return new Response("Failed to encrypt files", {
      status: 400,
      statusText: "Bad Request",
    });
  }
  
  return new Response("Success", { status: 200, statusText: "OK" });
}
