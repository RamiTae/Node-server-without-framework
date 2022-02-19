const marked = require("marked");

const http = require("http");
const fs = require("fs");
const path = require("path");

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
  HTML: "text/html",
  JS: "text/javascript",
  CSS: "text/css",
  JSON: "application/json",
  PNG: "image/png",
  JPG: "image/jpg",
  GIF: "image/gif",
  SVG: "image/svg+xml",
  WAV: "audio/wav",
  MP4: "video/mp4",
  WOFF: "application/font-woff",
  TTF: "application/font-ttf",
  EOT: "application/vnd.ms-fontobject",
  OTF: "application/font-otf",
  WASM: "application/wasm",
};

const makeHtmlForm = (contents) => {
  return HTML_TEMPLATE.replace("{contents}", contents);
};

http
  .createServer(function (request, response) {
    // console.log(request)
    const requestUrl = request.url;
    const requstMethod = request.method;
    console.log({ requestUrl, requstMethod });

    try {
      switch (requestUrl) {
        case "/":
          let filePath = "." + requestUrl;
          if (filePath == "./") {
            filePath = "./index.md";
          }

          fs.readFile(filePath, function (error, content) {
            response.writeHead(200, { "Content-Type": CONTENT_TYPES.HTML });
            const contents = marked.parse(content.toString());
            response.end(makeHtmlForm(contents), "utf-8");
          });
          break;
        default:
          fs.readFile("./404.md", function (error, content) {
            const contents = marked.parse(content.toString());
            response.writeHead(404, { "Content-Type": CONTENT_TYPES.HTML });
            response.end(makeHtmlForm(contents), "utf-8");
          });
      }
    } catch (error) {
      response.writeHead(500, { "Content-Type": CONTENT_TYPES.JSON });
      response.end(
        "Sorry, check with the site admin for error: " + error.code + " ..\n",
        "utf-8"
      );
    }
  })
  .listen(PORT);

console.log(`Server running at http://127.0.0.1:${PORT}/`);
