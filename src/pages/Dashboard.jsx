import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "../styles/dashboard.css";

function normaliserStatut(statut) {
  const value = statut?.toLowerCase();

  if (["termine", "done"].includes(value)) return "termine";
  if (["en_cours", "en cours", "in progress"].includes(value)) {
    return "en_cours";
  }

  return "a_faire";
}

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [devoirs, setDevoirs] = useState([]);

  useEffect(() => {
    async function fetchUser() {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error("Erreur getUser:", error.message);
      } else {
        setUser(data.user);
      }

      const { data: devoirsData, error: devoirsError } = await supabase
        .from("devoirs")
        .select("id, statut");

      if (devoirsError) {
        console.error("Erreur fetch devoirs:", devoirsError.message);
      } else {
        setDevoirs(devoirsData || []);
      }

      setLoading(false);
    }

    fetchUser();
  }, []);

  const totalDevoirs = devoirs.length;
  const devoirsAFaire = devoirs.filter(
    (devoir) => normaliserStatut(devoir.statut) === "a_faire",
  ).length;
  const devoirsEnCours = devoirs.filter(
    (devoir) => normaliserStatut(devoir.statut) === "en_cours",
  ).length;
  const devoirsTermines = devoirs.filter(
    (devoir) => normaliserStatut(devoir.statut) === "termine",
  ).length;

  if (loading) {
    return <div className="dashboard-loading">Chargement...</div>;
  }

  return (
    <section className="dashboard-page">
      <h1 className="dashboard-title">Mon Tableau de bord</h1>
      <h2 className="dashboard-greeting">
        Bonjour {user?.user_metadata?.first_name || "utilisateur"}!
      </h2>

      <div className="cardsDevoir">
        <div className="cardDevoir">
          <p>TOTAL</p>
          <span>{totalDevoirs}</span>
        </div>
        <div className="cardDevoir">
          <p>A FAIRE</p>
          <span>{devoirsAFaire}</span>
        </div>
        <div className="cardDevoir">
          <p>EN COURS</p>
          <span>{devoirsEnCours}</span>
        </div>
        <div className="cardDevoir">
          <p>TERMINE</p>
          <span>{devoirsTermines}</span>
        </div>
      </div>

      <div className="sectionUrgents">
        <div className="h3_btn">
          <h2>Devoirs Urgents</h2>
          <Link to="/devoirs">
            <button type="button" className="btn_see">
              Voir tous &rarr;
            </button>
          </Link>
        </div>
        <div></div>
      </div>
    </section>
  );
}
