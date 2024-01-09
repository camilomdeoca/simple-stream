const fs = require("fs");
const path = require("path");
const config = require("../config.json");

module.exports = {
  streamVideo,
};

function streamVideo(req, res) {
  moviesFolder = config.moviesFolder;
  const moviePath = path.join(moviesFolder, decodeURIComponent(req.query.title));
  const stat = fs.statSync(moviePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    console.log(range);
    let [start, end] = range.replace(/bytes=/, "").split("-");
    start = parseInt(start, 10);
    end = end ? parseInt(end, 10) : fileSize - 1;

    const chunksize = end - start + 1;
    const file = fs.createReadStream(moviePath, { start, end });
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "video/mp4",
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    console.log("no range :c");
    const head = {
      "Accept-Ranges": "bytes",
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    };
    res.writeHead(200, head);
    fs.createReadStream(moviePath).pipe(res);
  }
}
