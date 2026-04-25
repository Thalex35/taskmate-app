import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Menu.css";

const menuSection = [
  {
    label: "Principal",
    items: [
      { id: "dashboard", label: "Dashboard", path: "/dashboard" },
      { id: "devoirs", label: "Mes Devoirs", path: "/devoirs" },
    ],
  },

  {
    label: "Organisation",
    items: [{ id: "matieres", label: "Matieres", path: "/matieres" }],
  },

  {
    label: "Compte",
    items: [{ id: "profile", label: "Profil", path: "/profile" }],
  },
];

export default function Menu() {
  const location = useLocation();
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Chargement...</div>;
  }

  const firstName = user?.user_metadata?.first_name ?? "Utilisateur";
  const lastName = user?.user_metadata?.last_name ?? "";
  const avatarInitials = `${firstName.charAt(0)}${lastName.charAt(0)}`.trim();

  return (
    <aside className="menu">
      <nav className="menu-nav">
        {menuSection.map((section) => (
          <div key={section.label} className="menu-section">
            <p className="menu-section-label">{section.label}</p>
            {section.items.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={`menu-item ${
                  location.pathname === item.path ? "active" : ""
                }`}
              >
                <span className="menu-dot" />
                {item.label}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      <div className="menu-profil">
        <div className="menu-avatar">{avatarInitials || "U"}</div>
        <div className="menu-user-info">
          <p className="menu-user-name">{firstName}</p>
          <p className="menu-user-role">Etudiant</p>
        </div>
      </div>
    </aside>
  );
}
