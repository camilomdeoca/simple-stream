import { filesTranscoding } from "./transcode.js";

export function handleProgressConnection(socket) {
  socket.on("error", (error) => {
    console.error(error);
  });
  socket.on("message", (message) => {
    console.log("%s", message);
    const fileToGetProgress = message.toString();
    if (filesTranscoding.has(fileToGetProgress)) {
      if (
        filesTranscoding
          .get(fileToGetProgress)
          .socketsToNotify.find((elem) => elem.socket.WebSocket === socket.WebSocket)
      ) {
        console.log("Client requested to get notified again");
      } else {
        console.log("Client added");
        filesTranscoding.get(fileToGetProgress).socketsToNotify.push({
          socket: socket,
          timeLast: Date.now(),
          valueLast: 0,
        });
      }
    } else {
      console.log("Client requested to get progress on file that is not transcoding");
    }
  });
  socket.on("close", (event) => {
    for (const [_, fileProgressData] of filesTranscoding) {
      fileProgressData.socketsToNotify.filter(elem => elem.socket.WebSocket !== socket.WebSocket);
    }
  });
}
