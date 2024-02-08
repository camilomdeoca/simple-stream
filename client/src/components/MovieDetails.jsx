import "./MovieDetails.scss";

export default function MovieDetails({ details }) {
  return (
    <div className="horizontal-array centered-array">
      <div className="vertical-array">
        <h1 className="movie-details-title">{details.Title}</h1>
        <p className="movie-details-description">{details.Plot}</p>
      </div>
      <div className="vertical-array">
        <img className="movie-details-image" src={details.Poster} alt={`${details.Title} poster`} />
        <p><b>Director:</b> {details.Director}</p>
        <p><b>Actors:</b> {details.Actors}</p>
      </div>
    </div>
  );
};
