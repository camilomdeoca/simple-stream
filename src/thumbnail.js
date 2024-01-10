import fs from "fs";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import config from "../config.json" with { type: "json" };

export async function sendThumbnail(req, res) {
  const moviesFolder = config.moviesFolder;
  const title = decodeURIComponent(req.query.title);
  const moviePath = path.join(moviesFolder, title);
  console.log(`Generating thumbnail for ${title}`);

  const thumbFolder = "./thumb";
  const thumbFileName = `${title}-thumb.png`;

  await new Promise((resolve, reject) => {
    ffmpeg.ffprobe(moviePath, (err, metadata) => {
      const height = config.thumbnailHeight;
      const ratio = metadata.streams[0].width / metadata.streams[0].height;
      const width = Math.round(height * ratio);
      ffmpeg(moviePath)
        .on("end", () => {
          resolve();
        })
        .thumbnail({
          timestamps: ["30%"],
          filename: thumbFileName,
          folder: thumbFolder,
          size: `${width}x${height}`,
        });
    });
  });

  const head = {
    "Content-Type": "image/png",
  };

  res.writeHead(200, head);

  fs.createReadStream(path.join(thumbFolder, thumbFileName))
    .pipe(res)
    .on("finish", () => {
      fs.unlinkSync(path.join(thumbFolder, thumbFileName));
    });
}
