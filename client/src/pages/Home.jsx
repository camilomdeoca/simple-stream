import Header from "../components/Header";

function Home() {
  return (
    <div className="vertical-array expand">
      <Header searchInput={false} />
      <div className="vertical-array centered-array">
        <h1 className="main-title">Movies</h1>
        <p>
          This is a simple movies streaming app.
          Movies can also be transcoded if the video format
          is not supported by the browser.
        </p>
      </div>
    </div>
  );
};

export default Home;
