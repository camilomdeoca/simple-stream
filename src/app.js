import { streamVideo } from "./stream.js";
import { sendThumbnail } from "./thumbnail.js";
import { sendMoviesList } from "./listMovies.js";
import { transcodeVideo } from "./transcode.js";
import { handleProgressConnection } from "./progress.js";
import express from "express";
import { WebSocketServer } from "ws";
import cors from "cors";
import http from "http";
import { fileURLToPath } from 'url'
import path from "path";
import config from "../config.json" with { type: "json" };
import { sendDetails } from "./details.js";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
wss.on("connection", handleProgressConnection);

app.use(cors());

app.get("/api/movie/transcoded/:file", (req, res) => streamVideo(path.join(config.transcodedMoviesFolder, req.params.file), req, res));

app.get("/api/movie/:file", (req, res) => streamVideo(path.join(config.moviesFolder, req.params.file), req, res));

app.get("/api/transcode", transcodeVideo);

/* This could be requested at the same time so, the temporal images have to have different names
 * always, in the future i may allow for different movie folders so the name of the image cant be
 * the name of the movie file in that case.
 */
app.get("/api/thumb/:file", (req, res) => sendThumbnail(req.params.file, req, res));

app.get("/api/list", sendMoviesList);

app.get("/api/details", sendDetails);

app.use(express.static('client/build'));

app.get('*', function(_, res) {
    res.sendFile(path.join(path.dirname(fileURLToPath(import.meta.url)), '../client/build', 'index.html'));
});

server.listen(config.serverPort, () => {
  console.log(`Server running on port: ${config.serverPort}`);
});
