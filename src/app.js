import { streamVideo } from "./stream.js";
import { sendThumbnail } from "./thumbnail.js";
import { sendMoviesList } from "./listMovies.js";
import express from "express";
import cors from "cors";
import config from "../config.json" with { type: "json" };

const app = express();

app.use(cors());

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

app.listen(config.serverPort, () => {
  console.log(`Server running on port: ${config.serverPort}`);
});
