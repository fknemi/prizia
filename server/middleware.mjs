import { responseIterator } from './response-iterator.mjs';
function middleware_default(app) {
  return async function (req, res, next) {
    try {
      const route = app.match(req);
      if (route) {
        try {
          const response = await app.render(req);
          await writeWebResponse(app, res, response);
        } catch (err) {
          if (next) {
            next(err);
          } else {
            throw err;
          }
        }
      } else if (next) {
        return next();
      } else {
        res.writeHead(404);
        res.end('Not found');
      }
    } catch (err) {
      if (!res.headersSent) {
        res.writeHead(500, `Server error`);
        res.end();
      }
    }
  };
}
async function writeWebResponse(app, res, webResponse) {
  const { status, headers } = webResponse;
  if (app.setCookieHeaders) {
    const setCookieHeaders = Array.from(app.setCookieHeaders(webResponse));
    if (setCookieHeaders.length) {
      res.setHeader('Set-Cookie', setCookieHeaders);
    }
  }
  res.writeHead(status, Object.fromEntries(headers.entries()));
  console.log("HELLo")
  if (webResponse.body) {
    for await (const chunk of responseIterator(webResponse)) {
      res.write(chunk);
    }
  }
  res.end();
}
export { middleware_default as default };
