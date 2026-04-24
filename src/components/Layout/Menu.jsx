import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
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
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error("Erreur getUser:", error.message);
      } else {
        setUser(data.user);
      }

      setLoading(false);
    }

    fetchUser();
  }, []);

  if (loading) {
    return <div>Chargement...</div>;
  }

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
        <div className="menu-avatar">
          {user?.user_metadata?.first_name?.charAt(0) +
            user?.user_metadata?.last_name?.charAt(0) || "U"}
        </div>
        <div className="menu-user-info">
          <p className="menu-user-name">
            {user?.user_metadata?.first_name || "Utilisateur"}
          </p>
          <p className="menu-user-role">Etudiant</p>
        </div>
      </div>
    </aside>
  );
}
