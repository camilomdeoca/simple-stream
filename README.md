
# Simple Video Streaming App

### Features

* Transcode videos using [fluent-ffmpeg](https://www.npmjs.com/package/fluent-ffmpeg) to `.mp4`
to be compatible with browser's included player.

* Show progress while the file is transcoding.

* List all videos with generated thumbnails.

* Live search.

* Show movie details from [omdbapi](https://www.omdbapi.com/).

----------------------------------------------------------------------------------------------------

Set movies folder in `config.json`.

Run with:
```
npm run build --prefix client/ && npm start
```
