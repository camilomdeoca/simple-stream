
import { filesTranscoding } from "./transcode.js";

export function handleProgressConnection(socket) {
  socket.on("error", (error) => {
    console.error(error);
  });
  socket.on("message", (message) => {
    console.log("%s", message);
    const fileToGetProgress = message.toString();
    if (filesTranscoding.has(fileToGetProgress)) {
      if (filesTranscoding.get(fileToGetProgress).socketsToNotify.find((elem) => elem.WebSocket === socket.WebSocket)) {
        console.log("Client requested to get notified again");
      } else {
        console.log("Client added");
        filesTranscoding.get(fileToGetProgress).socketsToNotify.push(socket);
      }
    } else {
      console.log("Client requested to get progress on file that is not transcoding");
    }
  });
  socket.on("close", (event) => {
    for (const [filename, fileProgressData] of filesTranscoding) {
      for (const elem of fileProgressData.socketsToNotify) {
        if (elem.WebSocket === socket.WebSocket) {
          fileProgressData.socketsToNotify.splice(fileProgressData.socketsToNotify.indexOf(elem), 1);
          console.log("Deleting socket from: ", filename);
        }
      }
    }
  });
}