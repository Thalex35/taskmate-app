import { useState } from "react";
import { Link } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import "../../styles/NavBar.css";

export default function NavBar() {
  const [modeSombre, setModeSombre] = useState(false);

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="navbar-logo">
        <span className="navbar-logo-task">Task</span>
        <span className="navbar-logo-mate">Mate</span>
      </Link>

      <div className="navbar-action">
        <button
          className="navbar-btn-mode"
          onClick={() => setModeSombre(!modeSombre)}
        >
          {modeSombre ? (
            <Sun size={15} color="orange" />
          ) : (
            <Moon size={15} color="black" />
          )}
        </button>

        <Link to="/devoir/nouveau" className="navbar-btn-nouveau">
          + Nouveau Devoir
        </Link>
      </div>
    </nav>
  );
}
