import MatieresCard from "./matieresCard";
import "../../styles/matList.css";

export default function MatieresList({ matieres, onDeleteMatiere }) {
  if (matieres.length === 0) {
    return <p className="matList__empty">Aucune matière pour le moment.</p>;
  }

  return (
    <div className="matList">
      {matieres.map((matiere) => (
        <MatieresCard
          key={matiere.id}
          matiere={matiere}
          onDelete={() => onDeleteMatiere(matiere)}
        />
      ))}
    </div>
  );
}
