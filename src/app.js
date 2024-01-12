import { streamVideo } from "./stream.js";
import { sendThumbnail } from "./thumbnail.js";
import { sendMoviesList } from "./listMovies.js";
import { transcodeVideo } from "./transcode.js";
import { handleProgressConnection } from "./progress.js";
import express from "express";
import { WebSocketServer } from "ws";
import cors from "cors";
import http from "http";
import path from "path";
import config from "../config.json" with { type: "json" };

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
wss.on("connection", handleProgressConnection);

app.use(cors());

app.get("/movie/transcoded/:file", (req, res) => streamVideo(path.join(config.transcodedMoviesFolder, req.params.file), req, res));

app.get("/movie/:file", (req, res) => streamVideo(path.join(config.moviesFolder, req.params.file), req, res));

app.get("/transcode", transcodeVideo);

/* This could be requested at the same time so, the temporal images have to have different names
 * always, in the future i may allow for different movie folders so the name of the image cant be
 * the name of the movie file in that case.
 */
app.get("/thumb/:file", (req, res) => sendThumbnail(req.params.file, req, res));

app.get("/list", sendMoviesList);

app.use(express.static('client/build'));

server.listen(config.serverPort, () => {
  console.log(`Server running on port: ${config.serverPort}`);
});
