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
    await new Promise((resolve, reject) => {
      ffmpeg.ffprobe(moviePath, (err, metadata) => {
        const totalMinutes = Math.floor(metadata.format.duration / 60);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes - hours * 60;
        const quality = metadata.streams[0].height;
        moviesData.push({
          title: movieTitle,
          thumbnail: `/thumb?title=${encodeURIComponent(movieTitle)}`,
          duration: `${hours}:${String(minutes).padStart(2, "0")}`,
          quality: `${quality}p`,
          url: `/movie?title=${encodeURIComponent(movieTitle)}`,
        });
        resolve();
      });
    });
  }
  res.send(moviesData);
}
