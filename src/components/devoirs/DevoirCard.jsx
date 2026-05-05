import { Pencil, Trash2 } from "lucide-react";
import "../../styles/DevoirCard.css";

export default function DevoirCard({
  devoir,
  onMarquerTermine,
  onSelect,
  onEdit,
  onDelete,
}) {
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
  const statutTexte = statut === "Terminé" ? "Terminé" : statut;

  return (
    <article
      className="devoir-card"
      role="button"
      tabIndex={0}
      onClick={() => onSelect(devoir)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(devoir);
        }
      }}
    >
      <div className="card-header">
        <h3 className="card-titre">{titre}</h3>
        <div className="card-icons" onClick={(event) => event.stopPropagation()}>
          <button
            type="button"
            className="card-icon-btn"
            onClick={() => onEdit(devoir)}
            aria-label={`Modifier ${titre}`}
            title="Modifier"
          >
            <Pencil size={16} strokeWidth={2.2} />
          </button>
          <button
            type="button"
            className="card-icon-btn card-icon-delete"
            onClick={() => onDelete(devoir)}
            aria-label={`Supprimer ${titre}`}
            title="Supprimer"
          >
            <Trash2 size={16} strokeWidth={2.2} />
          </button>
        </div>
      </div>

      <div className="card-badges">
        <span className="badge badge-matiere">{matiere}</span>
        <span className={prioriteClass}>{priorite}</span>
        <span className={statutClass}>{statutTexte}</span>
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
          onClick={(event) => {
            event.stopPropagation();
            onMarquerTermine(id);
          }}
        >
          Marquer comme terminé
        </button>
      ) : (
        <div className="card-termine-label">Terminé</div>
      )}
    </article>
  );
}
