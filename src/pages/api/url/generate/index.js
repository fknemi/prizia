import { validId } from "../../../../../utils/utils.js";
import readable from "readable-url-names";

export async function get({ params, req }) {
  let generator = new readable();
  let id = generator.generate();
  let isValid = await validId(id);
  while (isValid !== null) {
    id = generator.generate();
    isValid = await validId(id);
  }
  return new Response(id, {
    headers: {
      "Content-Type": "text/plain",
    },
    status: 200,
    statusText: "OK",
  });
}
