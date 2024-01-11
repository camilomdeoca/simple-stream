import fs from "fs";
import path from "path";
import mime from "mime";
import config from "../config.json" with { type: "json" };

export function streamVideo(videoFile, req, res) {
  const moviesFolder = config.moviesFolder;
  const moviePath = videoFile;
  console.log("STREAM:", moviePath);

  // Validate that file isnt in a folder outside the allowed
  if (!path.resolve(moviePath).startsWith(path.resolve(config.moviesFolder))) {
    res.sendStatus(400);
    return;
  }

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
      "Content-Type": mime.getType(moviePath),
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
