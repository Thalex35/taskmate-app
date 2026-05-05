import { useContext } from "react";
import { ThemeContext } from "../../context/theme";
import { Link } from "react-router-dom";
import { Moon, Sun, User } from "lucide-react";

import "../../styles/NavBar.css";

export default function NavBar({
  ShowAddBtn = true,
  showLogout = false,
  showMode = true,
}) {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDarkMode = theme === "dark";

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
            onClick={toggleTheme}
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            {isDarkMode ? "Mode clair" : "Mode sombre"}
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
