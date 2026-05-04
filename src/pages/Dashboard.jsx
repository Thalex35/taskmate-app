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

function calculerJoursRestants(dateLimite) {
  const aujourdhui = new Date();
  const limite = new Date(`${dateLimite}T00:00:00`);

  aujourdhui.setHours(0, 0, 0, 0);

  return Math.ceil((limite - aujourdhui) / (1000 * 60 * 60 * 24));
}

function afficherPriorite(priorite) {
  const value = priorite?.toLowerCase();

  if (["haute", "high", "urgent"].includes(value)) return "Haute";
  if (["basse", "low", "faible"].includes(value)) return "Basse";

  return "Moyenne";
}

function afficherStatut(statut) {
  const value = normaliserStatut(statut);

  if (value === "termine") return "Termine";
  if (value === "en_cours") return "En cours";

  return "A faire";
}

function formatUrgence(joursRestants) {
  if (joursRestants < 0) return "En retard";
  if (joursRestants === 0) return "Aujourd'hui !";
  if (joursRestants === 1) return "1j restant";
  return `${joursRestants}j restants`;
}

function formatDate(dateLimite) {
  return new Date(`${dateLimite}T00:00:00`).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
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
        .select(
          `
          id,
          titre,
          date_limite,
          priorite,
          statut,
          matieres (
            nom
          )
        `,
        )
        .order("date_limite", { ascending: true });

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
  const devoirsUrgents = devoirs
    .map((devoir) => ({
      ...devoir,
      joursRestants: calculerJoursRestants(devoir.date_limite),
      prioriteLabel: afficherPriorite(devoir.priorite),
      matiereNom: devoir.matieres?.nom || "Sans matiere",
      statutLabel: afficherStatut(devoir.statut),
    }))
    .filter(
      (devoir) =>
        normaliserStatut(devoir.statut) !== "termine" &&
        devoir.joursRestants <= 2,
    )
    .slice(0, 3);

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
        <div className="dashboard-urgent-list">
          {devoirsUrgents.length > 0 ? (
            devoirsUrgents.map((devoir) => (
              <article
                key={devoir.id}
                className={`dashboard-urgent-card ${
                  devoir.joursRestants <= 0 ? "is-today" : "is-soon"
                }`}
              >
                <div className="dashboard-urgent-header">
                  <h3 className="dashboard-urgent-title">{devoir.titre}</h3>
                  <span className="dashboard-urgent-deadline">
                    {formatUrgence(devoir.joursRestants)}
                  </span>
                </div>

                <div className="dashboard-urgent-badges">
                  <span className="dashboard-urgent-subject">
                    {devoir.matiereNom}
                  </span>
                  <span className="dashboard-urgent-priority">
                    {devoir.prioriteLabel}
                  </span>
                  <span className="dashboard-urgent-status">
                    {devoir.statutLabel}
                  </span>
                </div>

                <p className="dashboard-urgent-date">
                  {formatDate(devoir.date_limite)}
                </p>
              </article>
            ))
          ) : (
            <p className="dashboard-urgent-empty">
              Aucun devoir urgent pour le moment.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
