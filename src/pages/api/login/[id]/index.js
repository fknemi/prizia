import { validId } from "../../../../../utils/utils.js";
import { validatePassword } from "../../../../../utils/hash.js";
import {
  generateToken,
  isFileExpired,
} from "../../../../../utils/validation.js";
const failedRequestHeaders = {
  "Set-Cookie": "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT",
};

export async function post({ params, request, cookies }) {
  let id = params.id;
  if (!id)
    return new Response("No ID", { status: 400, statusText: "Bad Request" });
  const { password } = await request.json();

  if (!password)
    return new Response("Password Required", {
      status: 400,
      statusText: "Bad Request",
      headers: failedRequestHeaders
    });
  let file = await validId(id);
  if (!file)
    return new Response("Invalid Password", {
      status: 400,
      statusText: "Bad Request",
      headers: failedRequestHeaders
    });
  let valid = await validatePassword(password, file.password);

  if (!valid)
    return new Response("Invalid Password", {
      status: 400,
      statusText: "Bad Request",
      headers: failedRequestHeaders
    });
  try {
    let token = await generateToken(id, password);
    let didFileExpire = await isFileExpired(id);
    if (didFileExpire) {
      return new Response(`${id} Expired`, {
        status: 400,
        statusText: "Bad Request",
        headers: failedRequestHeaders
      });
    }
    return new Response("Login Successful", {
      status: 200,
      statusText: "OK",
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": `token=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=43200; Secure`,
      },
    });
  } catch (err) {
    console.log(err);
    return new Response("Error", {
      status: 500,
      statusText: "Internal Server Error",
      headers: failedRequestHeaders
    });
  }
}
