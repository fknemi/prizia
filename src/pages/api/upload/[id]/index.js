import readable from "readable-url-names";
import { validId } from "../../../../../utils/utils";



export async function post({ params, req }) {
  // return new Response(null, {
  //   status: 404,
  //   statusText: 'Not found'
  // });
  return new Response("Hello World", {
    status: 200,
    statusText: "OK",
  })
}

