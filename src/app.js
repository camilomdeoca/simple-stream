const { streamVideo } = require("./stream.js");
const { sendThumbnail } = require("./thumbnail.js");
const { sendMoviesList } = require("./listMovies.js");
const express = require("express");
const config = require("../config.json");

const app = express();

const hostname = config.serverIP;
const port = config.serverPort;

app.get("/movie", (req, res) => {
  streamVideo(req, res);
});

/* This could be requested at the same time so, the temporal images have to have different names
 * always, in the future i may allow for different movie folders so the name of the image cant be
 * the name of the movie file in that case.
 */
app.get("/thumb", async (req, res) => {
  sendThumbnail(req, res);
});

app.get("/list", async (req, res) => {
  sendMoviesList(req, res);
});

app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
