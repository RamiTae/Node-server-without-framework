const marked = require('marked');

const http = require('http');
// const fs = require("fs");
const fsPromise = require('fs/promises');
const path = require('path');

const PORT = 3000;
const HTML_TEMPLATE = `
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content=
      "width=device-width, initial-scale=1.0" />
    <title>HTML render demo</title>
  </head>
  <body>
    {contents}
  </body>
</html>`;

const CONTENT_TYPES = {
  HTML: 'text/html',
  JS: 'text/javascript',
  CSS: 'text/css',
  JSON: 'application/json',
  PNG: 'image/png',
  JPG: 'image/jpg',
  GIF: 'image/gif',
  SVG: 'image/svg+xml',
  WAV: 'audio/wav',
  MP4: 'video/mp4',
  WOFF: 'application/font-woff',
  TTF: 'application/font-ttf',
  EOT: 'application/vnd.ms-fontobject',
  OTF: 'application/font-otf',
  WASM: 'application/wasm',
};

const makeHtmlForm = contents => {
  return HTML_TEMPLATE.replace('{contents}', contents);
};

const sendResponse = response => {
  return ({ state, contentType, contents, encoder = 'utf-8' }) => {
    response.writeHead(state, { 'Content-Type': contentType });
    response.end(contents, encoder);
  };
};

http
  .createServer(async function (request, response) {
    // console.log(request)
    const requestUrl = request.url;
    const requestMethod = request.method;
    console.log({ requestUrl, requestMethod });

    try {
      switch (requestUrl) {
        case '/': {
          const filePath = './pages/index.md';
          const fileData = await fsPromise.readFile(filePath);
          const contents = makeHtmlForm(marked.parse(fileData.toString()));
          sendResponse(response)({
            state: 200,
            contentType: CONTENT_TYPES.HTML,
            contents,
          });
          break;
        }
        case '/api': {
          sendResponse(response)({
            state: 200,
            contentType: CONTENT_TYPES.JSON,
            contents: 'GET /api',
          });
          break;
        }
        case '/error': {
          const fileData = await fsPromise.readFile('./pages/404.md');
          const contents = makeHtmlForm(marked.parse(fileData.toString()));
          sendResponse(response)({
            state: 404,
            contentType: CONTENT_TYPES.HTML,
            contents,
          });
          break;
        }
        case '/me': {
          const filePath = `./pages/me.md`;
          const fileData = await fsPromise.readFile(filePath);

          const contents = makeHtmlForm(marked.parse(fileData.toString()));
          sendResponse(response)({
            state: 200,
            contentType: CONTENT_TYPES.HTML,
            contents,
          });
          break;
        }
        default: {
          response.writeHead(302, {
            Location: '/error',
          });
          return response.end();
        }
      }
    } catch (error) {
      sendResponse(response)({
        state: 500,
        contentType: CONTENT_TYPES.JSON,
        contents:
          'Sorry, check with the site admin for error: ' + error.code + ' ..\n',
      });
    }
  })
  .listen(PORT);

console.log(`Server running at http://127.0.0.1:${PORT}/`);
