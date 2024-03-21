import "./App.scss";
import Sidebar from "./components/Sidebar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import List from "./pages/List";
import Home from "./pages/Home";
import Details from "./pages/Details";

function App() {
  return (
    <BrowserRouter>
      <div className="App horizontal-array">
        <Sidebar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/list" element={<List />} />
          <Route path="/details/:title" element={<Details />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
