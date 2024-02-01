import "./styles.css";
import Sidebar from "./components/Sidebar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import List from "./pages/List";
import Home from "./pages/Home";


function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <div className="horizontal-array">
          <Sidebar />
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/list" element={<List />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
