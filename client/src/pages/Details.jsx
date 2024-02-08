import { useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import ErrorComponent from "../components/ErrorComponent";
import MovieDetails from "../components/MovieDetails";
import { useState } from "react";

function Details() {
  const [details, setDetails] = useState(undefined);
  const [searchParams, _] = useSearchParams();

  const movieTitle = searchParams.get("title");

  if (movieTitle == null) {
    return (
      <div className="vertical-array expand">
        <Header />
        <ErrorComponent code="404" message="Movie Title not provided" />
      </div>
    );
  }

  const toFetchURL = new URL("details", "http://" + process.env.REACT_APP_VIDEO_SERVER_URL);
  toFetchURL.searchParams.append("title", movieTitle);

  fetch(toFetchURL)
    .then((result) => result.json())
    .then(data => {
      setDetails(data);
    })
    .catch((err) => {
      console.warn(err);
    });

  if (details)
    return (
      <div className="vertical-array expand">
        <Header />
        <MovieDetails details={details} />
      </div>
    );
  else
    return (
      <div className="vertical-array expand">
        <Header />
        <h1 className="movie-details-title">{movieTitle}</h1>
      </div>
    );
};

export default Details;
