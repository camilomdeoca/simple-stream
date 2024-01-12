import VideoListItem from "./VideoListItem";
import { useState, useEffect } from "react";

const socket = new WebSocket("ws://" + process.env.REACT_APP_VIDEO_SERVER_URL);
socket.addEventListener("open", (_) => {
  console.log("Conected to WebSocket");
});
socket.addEventListener("close", (_) => {
  console.log("Closed WebSocket");
});

export default function VideoList({ query, order }) {
  const [moviesData, setMoviesData] = useState([]);
  const [dataIsFor, setDataIsFor] = useState(undefined);
  const [moviesWithProgressRequested, setMoviesInProgress] = useState(new Map());

  function getMoviesList(query, order) {
    setDataIsFor({ query: query, order: order });
    const toFetchURL = new URL("list", "http://" + process.env.REACT_APP_VIDEO_SERVER_URL);

    if (query) {
      toFetchURL.searchParams.append("q", query);
    }
    toFetchURL.searchParams.append("order", order);

    return fetch(toFetchURL, {
      method: "GET",
    }).then((result) => {
      return result.text().then((str) => {
        const data = JSON.parse(str);
        setMoviesData(data);
        return data;
      });
    });
  }

  useEffect(() => {
    const onMessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);
      setMoviesInProgress(
        (moviesInProgress) => new Map(moviesInProgress.set(data.title, { progress: data.progress }))
      );
    };
    socket.addEventListener("message", onMessage);
    return () => {
      socket.removeEventListener("message", onMessage);
    };
  }, []);

  function requestProgressFor(title) {
    waitForOpenSocket(socket).then(() => {
      socket.send(title);
      setMoviesInProgress(new Map(moviesWithProgressRequested.set(title, { progress: 0 })));
      return;
    });
  }

  function getTranscodeProgressOfExisting(moviesData) {
    return waitForOpenSocket(socket).then(() => {
      console.log(moviesData);
      for (const data of moviesData) {
        console.log(data.title, " ", data.formatState);
        if (data.formatState === "transcoding" && !moviesWithProgressRequested.has(data.title)) {
          console.log("registering for getting", data.title, "progress");
          requestProgressFor(data.title);
        }
      }
      return;
    });
  }

  if (!dataIsFor || query !== dataIsFor.query || order !== dataIsFor.order) {
    getMoviesList(query, order).then((data) => {
      return getTranscodeProgressOfExisting(data);
    });
  }

  const items = [];
  let i = 0;
  for (const data of moviesData) {
    let requestTranscodeCallback = undefined;
    let transcodeProgress = undefined;
    if (data.formatState === "needs-transcode") {
      requestTranscodeCallback = () => {
        const transcodeURL = new URL("transcode", "http://" + process.env.REACT_APP_VIDEO_SERVER_URL);
        transcodeURL.searchParams.append("title", data.title);
        fetch(transcodeURL).then((result) => {
          console.log("Requested transcode for:", data.title);
          requestProgressFor(data.title);
          setMoviesData((moviesData) =>
            moviesData.map((elem) => {
              return elem.title === data.title
                ? {
                    ...elem,
                    formatState: "transcoding",
                  }
                : elem;
            })
          );
        });
      };
    } else if (data.formatState === "transcoding") {
      if (moviesWithProgressRequested.has(data.title)) {
        transcodeProgress = moviesWithProgressRequested.get(data.title).progress;
      }
    }
    items.push(
      <li key={i++}>
        <VideoListItem
          title={data.title}
          thumbnail={new URL(data.thumbnail, "http://" + process.env.REACT_APP_VIDEO_SERVER_URL).href}
          duration={data.duration}
          quality={data.quality}
          url={new URL(data.url, "http://" + process.env.REACT_APP_VIDEO_SERVER_URL).href}
          formatState={data.formatState}
          transcodeProgress={transcodeProgress}
          requestTranscodeCallback={requestTranscodeCallback}
        />
      </li>
    );
  }

  return (
    <div className="video-list vertical-array">
      <ul>{items}</ul>
    </div>
  );
}

function waitForOpenSocket(socket) {
  return new Promise((resolve) => {
    if (socket.readyState !== socket.OPEN) {
      socket.addEventListener("open", (_) => {
        resolve();
      });
    } else {
      resolve();
    }
  });
}
