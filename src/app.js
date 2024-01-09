const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const express = require("express");
const path = require("path");

const app = express();

const hostname = "127.0.0.1";
const port = 3001;
const moviesFolder = "/mnt/disk1/Movies/";

app.get("/movie", (req, res) => {
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
});

/* This could be requested at the same time so, the temporal images have to have different names
 * always, in the future i may allow for different movie folders so the name of the image cant be
 * the name of the movie file in that case.
 */
app.get("/thumb", async (req, res) => {
  const title = decodeURIComponent(req.query.title);
  const moviePath = path.join(moviesFolder, title);
  console.log(`Generating thumbnail for ${title}`);

  const thumbFolder = "./thumb";
  const thumbFileName = `${title}-thumb.png`;

  await new Promise((resolve, reject) => {
    ffmpeg(moviePath)
      .on("end", () => {
        resolve();
      })
      .thumbnail({
        timestamps: ["20%"],
        filename: thumbFileName,
        folder: thumbFolder,
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
});

app.get("/list", async (req, res) => {
  const movieFileNames = fs.readdirSync(moviesFolder);
  const moviesData = [];
  for (const movieTitle of movieFileNames) {
    const moviePath = path.join(moviesFolder, movieTitle);
    await new Promise((resolve, reject) => {
      ffmpeg
        .ffprobe(moviePath, (err, metadata) => {
          const totalMinutes = Math.floor(metadata.format.duration / 60);
          const hours = Math.floor(totalMinutes / 60);
          const minutes = totalMinutes - hours * 60;
          const quality = metadata.streams[0].height;
          moviesData.push({
            title: movieTitle,
            thumbnail: `/thumb?title=${encodeURIComponent(movieTitle)}`,
            duration: `${hours}:${minutes}`,
            quality: `${quality}p`,
            url: `/movie?title=${encodeURIComponent(movieTitle)}`,
          });
          resolve();
        })
    });
  }
  res.send(moviesData);
});

app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
