const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const config = require("../config.json");

module.exports = {
  sendMoviesList,
};

async function sendMoviesList(req, res) {
  moviesFolder = config.moviesFolder;

  const movieFileNames = fs.readdirSync(moviesFolder);
  const moviesData = [];

  for (const movieTitle of movieFileNames) {
    const moviePath = path.join(moviesFolder, movieTitle);
    const metadata = await getVideoMetadata(moviePath);
    const totalMinutes = Math.floor(metadata.seconds / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes - hours * 60;
    const quality = metadata.quality;

    moviesData.push({
      title: movieTitle,
      thumbnail: `/thumb?title=${encodeURIComponent(movieTitle)}`,
      duration: `${hours}:${String(minutes).padStart(2, "0")}`,
      quality: `${quality}p`,
      url: `/movie?title=${encodeURIComponent(movieTitle)}`,
    });
  }

  res.send(moviesData);
}

async function getVideoMetadata(path) {
  let result = null;
  await new Promise((resolve, reject) => {
    ffmpeg.ffprobe(path, (err, metadata) => {
      result = {
        seconds: metadata.format.duration,
        quality: metadata.streams[0].height,
      };
      resolve();
    });
  });
  return result;
}
