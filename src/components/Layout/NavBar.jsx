import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { User } from "lucide-react";

import "../../styles/NavBar.css";

export default function NavBar({
  ShowAddBtn = true,
  showLogout = false,
  showMode = true,
}) {
  const [modeSombre, setModeSombre] = useState(false);

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="navbar-logo">
        <span className="navbar-logo-task">Task</span>
        <span className="navbar-logo-mate">Mate</span>
      </Link>

      <div className="navbar-action">
        {showMode && (
          <button
            className="navbar-btn-mode"
            onClick={() => setModeSombre(!modeSombre)}
          >
            {modeSombre ? "☀️ Mode clair" : "🌙 Mode sombre"}
          </button>
        )}

        {showLogout ? (
          <Link to="/login" className="navbar-btn-logout">
            Déconnexion
          </Link>
        ) : ShowAddBtn ? (
          <Link to="/new-devoir" className="navbar-btn-nouveau">
            + Nouveau Devoir
          </Link>
        ) : null}

        <Link to="/profile" className="navbar-btn-profile">
          <User size={24} color="white" />
        </Link>
      </div>
    </nav>
  );
}
