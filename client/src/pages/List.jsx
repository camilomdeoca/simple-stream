import { useState } from "react";
import Header from "../components/Header";
import VideoList from "../components/VideoList";
import SearchOptions from "../components/SearchOptions";

function List() {
  const [query, setQuery] = useState("");
  const [order, setOrder] = useState("date");

  return (
    <div className="vertical-array expand">
      <Header searchCallback={setQuery} searchInput={true} />
      <div className="vertical-array centered-array">
        <SearchOptions changeOrderCallback={setOrder} />
        <VideoList query={query} order={order} />
      </div>
    </div>
  );
};

export default List;
