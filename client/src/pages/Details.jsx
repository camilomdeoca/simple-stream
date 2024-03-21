import Header from "../components/Header";
import ErrorComponent from "../components/ErrorComponent";
import MovieDetails from "../components/MovieDetails";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Details() {
  const [details, setDetails] = useState(undefined);
  let { title } = useParams();

  const movieTitle = title;

  const toFetchURL = new URL("api/details", "http://" + process.env.REACT_APP_VIDEO_SERVER_URL);
  if (movieTitle) {
    toFetchURL.searchParams.append("title", movieTitle);
  }

  useEffect(() => {
    if (movieTitle != null) {
      fetch(toFetchURL)
        .then((result) => result.json())
        .then(data => {
          setDetails(_ => data);
        })
        .catch((err) => {
          console.warn(err);
        });
    }
  }, [toFetchURL, setDetails, movieTitle]);

  if (movieTitle == null) {
    return (
      <div className="vertical-array expand">
        <Header />
        <ErrorComponent code="404" message="Movie Title not provided" />
      </div>
    );
  }
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
