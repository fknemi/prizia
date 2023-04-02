import {App} from "astro/app"
const clientAddressSymbol = Symbol.for('astro.clientAddress');



function createRequestFromNodeRequest(req, body) {
    let url = `http://${req.headers.host}${req.url}`;
    let rawHeaders = req.headers;
    const entries = Object.entries(rawHeaders);
    const method = req.method || 'GET';
    let request = new Request(url, {
      method,
      headers: new Headers(entries),
      body: ['HEAD', 'GET'].includes(method) ? null : body,
    });
    request.req = req;
    if (req.socket?.remoteAddress) {
      Reflect.set(request, clientAddressSymbol, req.socket.remoteAddress);
    }
    return request;
  }


  class ExpressApp extends App {
    match(req, opts = {}) {
      return super.match(
        req instanceof Request ? req : createRequestFromNodeRequest(req),
        opts
      );
    }
    render(req, routeData) {
      if ('on' in req) {
        let body = Buffer.from([]);
        let reqBodyComplete = null;
        if (req.body) {
          reqBodyComplete = new Promise((resolve, reject) => {
            body = Buffer.from(JSON.stringify(req.body));
            resolve(body);
          });
        } else {
          reqBodyComplete = new Promise((resolve, reject) => {
            req.on('data', (d) => {
              body = Buffer.concat([body, d]);
            });
            req.on('end', () => {
              resolve(body);
            });
            req.on('error', (err) => {
              reject(err);
            });
          });
        }
        return reqBodyComplete.then(() => {
          return super.render(
            req instanceof Request
              ? req
              : createRequestFromNodeRequest(req, body),
            routeData
          );
        });
      }
      return super.render(
        req instanceof Request ? req : createRequestFromNodeRequest(req),
        routeData
      );
    }
  }
  export { ExpressApp };
  