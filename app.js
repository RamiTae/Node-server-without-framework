const marked = require("marked");

var http = require("http");
var fs = require("fs");
var path = require("path");

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

const makeHtmlForm = (contents) => {
  return HTML_TEMPLATE.replace("{contents}", contents);
};

http
  .createServer(function (request, response) {
    console.log("request ", request.url);

    let filePath = "." + request.url;
    if (filePath == "./") {
      filePath = "./index.md";
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
      ".html": "text/html",
      ".js": "text/javascript",
      ".css": "text/css",
      ".json": "application/json",
      ".png": "image/png",
      ".jpg": "image/jpg",
      ".gif": "image/gif",
      ".svg": "image/svg+xml",
      ".wav": "audio/wav",
      ".mp4": "video/mp4",
      ".woff": "application/font-woff",
      ".ttf": "application/font-ttf",
      ".eot": "application/vnd.ms-fontobject",
      ".otf": "application/font-otf",
      ".wasm": "application/wasm",
    };

    fs.readFile(filePath, function (error, content) {
      if (error) {
        if (error.code == "ENOENT") {
          fs.readFile("./404.md", function (error, content) {
            const contents = marked.parse(content.toString());
            response.writeHead(404, { "Content-Type": "text/html" });
            response.end(makeHtmlForm(contents), "utf-8");
          });
        } else {
          response.writeHead(500);
          response.end(
            "Sorry, check with the site admin for error: " +
              error.code +
              " ..\n"
          );
        }
      } else {
        response.writeHead(200, { "Content-Type": "text/html" });
        const contents = marked.parse(content.toString());
        console.log(contents);
        response.end(makeHtmlForm(contents), "utf-8");
      }
    });
  })
  .listen(PORT);

console.log(`Server running at http://127.0.0.1:${PORT}/`);
