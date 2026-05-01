import "../../styles/DevoirCard.css";

export default function DevoirCard({ devoir, onMarquerTermine }) {
  const { id, titre, matiere, priorite, statut, dateLimit, joursRestants } =
    devoir;

  const statutClass =
    statut === "Terminé"
      ? "badge badge-termine"
      : statut === "En cours"
        ? "badge badge-encours"
        : "badge badge-afaire";

  const prioriteClass =
    priorite === "Haute"
      ? "badge badge-haute"
      : priorite === "Moyenne"
        ? "badge badge-moyenne"
        : "badge badge-basse";

  const joursTexte =
    joursRestants === 0 ? "Aujourd'hui !" : `${joursRestants}j restants`;

  const joursClass = joursRestants <= 2 ? "card-jours urgent" : "card-jours";

  return (
    <div className="devoir-card">
      <div className="card-header">
        <h3 className="card-titre">{titre}</h3>
        <div className="card-icons">
          <span>✏️</span>
          <span>🗑️</span>
        </div>
      </div>

      <div className="card-badges">
        <span className="badge badge-matiere">{matiere}</span>
        <span className={prioriteClass}>{priorite}</span>
        <span className={statutClass}>{statut}</span>
      </div>

      <div className="card-footer">
        <span className="card-date">
          {new Date(dateLimit).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
        <span className={joursClass}>{joursTexte}</span>
      </div>

      {statut !== "Terminé" ? (
        <button
          className="card-btn-terminer"
          onClick={() => onMarquerTermine(id)}
        >
          Marquer comme terminé
        </button>
      ) : (
        <div className="card-termine-label">✅ Terminé</div>
      )}
    </div>
  );
}
