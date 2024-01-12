import fs from "fs";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import config from "../config.json" with { type: "json" };

export async function sendThumbnail(file, req, res) {
  const moviesFolder = config.moviesFolder;
  const title = file.replace(/\.[^/.]+$/, "");
  const moviePath = path.join(moviesFolder, title);

  const thumbFolder = config.thumbnailFolder;
  const thumbFileName = file + ".png";

  if (!fs.readdirSync(thumbFolder).includes(thumbFileName)) {
    await new Promise((resolve, _) => {
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
  }

  res.sendFile(path.join(thumbFolder, thumbFileName));
}
