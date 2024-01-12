import { useState } from "react";
import Header from "./components/Header";
import VideoList from "./components/VideoList";
import "./styles.css";
import SearchOptions from "./components/SearchOptions";

function App() {
  const [query, setQuery] = useState("");
  const [order, setOrder] = useState("date");

  return (
    <div className="App">
      <div className="horizontal-array">
        <div className="vertical-array expand">
          <Header searchCallback={setQuery} />
          <main>
            <div className="vertical-array">
              <SearchOptions changeOrderCallback={setOrder} />
              <VideoList query={query} order={order} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
