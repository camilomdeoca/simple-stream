import "./Sidebar.scss";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(true);
  return (
    <aside className={collapsed ? "collapsed" : ""}>
      <nav>
        <input type="button" id="burger" value="☰" onClick={() => { setCollapsed(collapsed => !collapsed); }}></input>
        <ul>
          <li>
            <Link to="/" className="sidebar-link">Home</Link>
          </li>
          <li>
            <Link to="/list" className="sidebar-link">List</Link>
          </li>
        </ul>
      </nav>
    </aside>
  )
}
