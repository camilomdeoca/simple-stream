import path from "path";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import mime from "mime";
import config from "../config.json" with { type: "json" };

export let filesTranscoding = new Map();

export function transcodeVideo(req, res) {
  const filename = req.query.title;
  console.log("Transcoding: ", filename);
  const filepath = path.join(config.moviesFolder, filename);
  const outFilepath = path.join(
    config.transcodedMoviesFolder,
    filename.replace(/\.[^/.]+$/, "") + config.transcodeFormat
  );

  if (!fs.existsSync(filepath)) {
    res.status(400).send("File requested to be transcoded does not exist");
    return;
  } else if (mime.getType(filename) === "video/mp4") {
    res.status(400).send("File requested to be transcoded is already in a compatible format");
    return;
  }

  if (filesTranscoding.has(filename)) {
    res.sendStatus(200);
    return;
  }

  filesTranscoding.set(filename, {
    progress: 0,
    socketsToNotify: [],
  });

  res.sendStatus(200);

  ffmpeg()
    .input(filepath)
    .on("progress", (info) => {
      console.log(`Progress on ${filename}: ${info.percent}%`);
      if (info.percent) {
        console.log("Notifying:", filename, info.percent);
        for (const socket of filesTranscoding.get(filename).socketsToNotify) {
          console.log("sending to a socket");
          socket.send(
            JSON.stringify({
              title: filename,
              progress: info.percent / 100,
            })
          );
        }
      }
    })
    .on("end", (err, stdout, stderr) => {
      for (const socket of filesTranscoding.get(filename).socketsToNotify) {
        socket.send(
          JSON.stringify({
            filename: filename,
            progress: 1,
          })
        );
      }
      filesTranscoding.delete(filename);
    })
    //.format("hls")
    .save(outFilepath);
}
