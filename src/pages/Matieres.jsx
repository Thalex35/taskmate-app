import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MatieresList from "../components/matieres/matieresList";
import { supabase } from "../lib/supabase";
import "../styles/matieres.css";

export default function Matieres() {
  const [matieres, setMatieres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [matiereASupprimer, setMatiereASupprimer] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function fetchMatieres() {
      const { data, error } = await supabase
        .from("matieres")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setErrorMessage(error.message);
      } else {
        setMatieres(data);
      }

      setLoading(false);
    }

    fetchMatieres();
  }, []);

  async function handleDeleteMatiere() {
    setDeleting(true);
    setErrorMessage("");

    const { error } = await supabase
      .from("matieres")
      .delete()
      .eq("id", matiereASupprimer.id);

    if (error) {
      setErrorMessage(error.message);
      setDeleting(false);
      return;
    }

    setMatieres((currentMatieres) =>
      currentMatieres.filter((matiere) => matiere.id !== matiereASupprimer.id),
    );
    setMatiereASupprimer(null);
    setDeleting(false);
  }

  if (loading) {
    return <p className="matieresPage__loading">Chargement des matieres...</p>;
  }

  return (
    <div className="matieresPage">
      <h1>Mes matieres</h1>

      {errorMessage && <p className="matieresPage__error">{errorMessage}</p>}

      <MatieresList
        matieres={matieres}
        onDeleteMatiere={setMatiereASupprimer}
      />

      <Link className="matieresPage__add" to="/new-matieres">
        + Ajouter une matiere
      </Link>

      {matiereASupprimer && (
        <div
          className="matiere-confirm-backdrop"
          onClick={() => setMatiereASupprimer(null)}
        >
          <section
            className="matiere-confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="matiere-delete-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="matiere-delete-title">Supprimer cette matiere ?</h2>
            <p>
              Cette action supprimera "{matiereASupprimer.nom}" de ta liste.
            </p>

            <div className="matiere-confirm-actions">
              <button
                type="button"
                className="matiere-confirm-cancel"
                onClick={() => setMatiereASupprimer(null)}
              >
                Annuler
              </button>
              <button
                type="button"
                className="matiere-confirm-delete"
                onClick={handleDeleteMatiere}
                disabled={deleting}
              >
                {deleting ? "Suppression..." : "Supprimer"}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
