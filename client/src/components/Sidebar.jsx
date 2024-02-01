import { useState } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(true);
  return (
    <aside className={collapsed ? "collapsed" : ""}>
      <nav>
        <input type="button" id="burger" value="☰" onClick={() => { setCollapsed(collapsed => !collapsed); }}></input>
        <ul>
          <li>
            <Link to="/" className="sidebar-link">Inicio</Link>
          </li>
          <li>
            <Link to="/list" className="sidebar-link">Lista</Link>
          </li>
          <li>
            <Link to="#" className="sidebar-link">Opciones</Link>
          </li>
        </ul>
      </nav>
    </aside>
  )
}
