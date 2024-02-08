import fs from "fs";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import mime from "mime";
import { filesTranscoding } from "./transcode.js";
import config from "../config.json" with { type: "json" };

export async function sendMoviesList(req, res) {
  const searchQuery = req.query.q;
  const order = req.query.order;
  const moviesFolder = config.moviesFolder;

  let movieFileNames = fs.readdirSync(moviesFolder)
    .filter(filename => fs.statSync(path.join(moviesFolder, filename)).isFile());

  if (order == "name") {
    movieFileNames.sort();
  } else {
    movieFileNames.sort((a, b) =>
      fs.statSync(path.join(moviesFolder, b)).birthtime
      - fs.statSync(path.join(moviesFolder, a)).birthtime);
  }

  const moviesData = [];

  let numOfMoviesInDataArray = 0;
  for (const movieFilename of movieFileNames) {
    const moviePath = path.join(moviesFolder, movieFilename);
    let metadata = undefined;
    try {
      metadata = await getVideoMetadata(moviePath);
    } catch (err) {
      continue;
    }

    const totalMinutes = Math.floor(metadata.seconds / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes - hours * 60;
    const quality = metadata.quality;

    // transcoding, compatible, transcoded, needs-transcode
    const formatState = getFormatState(movieFilename);

    const url =
      formatState === "compatible"
        ? `/movie/${encodeURIComponent(movieFilename)}`
        : formatState === "transcoded"
          ? `/movie/transcoded/${encodeURIComponent(movieFilename.replace(/\.[^/.]+$/, "") + config.transcodeFormat)}`
          : "";

    if (
      searchQuery == undefined ||
      movieFilename
        .replace(/\.[^/.]+$/, "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    ) {
      if (numOfMoviesInDataArray++ >= config.maxSearchResults) {
        break;
      }
      moviesData.push({
        title: movieFilename,
        thumbnail: `/thumb/${encodeURIComponent(movieFilename) + ".png"}`,
        duration: `${hours}:${String(minutes).padStart(2, "0")}`,
        modifiedTime: fs.statSync(path.join(moviesFolder, movieFilename)).birthtime,
        quality: `${quality}p`,
        url: url,
        formatState: formatState,
      });
    }
  }
  res.send(moviesData);
}

async function getVideoMetadata(path) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(path, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          seconds: metadata.format.duration,
          quality: metadata.streams[0].height,
        });
      }
    });
  });
}

function getFormatState(filename) {
  if (filesTranscoding.has(filename)) {
    console.log(filename, "is transcoding");
    return "transcoding";
  } else if (mime.getType(filename) === "video/mp4") {
    return "compatible";
  } else if (
    fs
      .readdirSync(config.transcodedMoviesFolder)
      .includes(filename.replace(/\.[^/.]+$/, "") + config.transcodeFormat)
  ) {
    return "transcoded";
  } else {
    return "needs-transcode";
  }
}
