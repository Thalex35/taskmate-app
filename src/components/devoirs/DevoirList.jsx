import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";
import DevoirCard from "./DevoirCard";
import "../../styles/DevoirList.css";

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
  const value = statut?.toLowerCase();

  if (["termine", "done"].includes(value)) return "Terminé";
  if (["en_cours", "en cours", "in progress"].includes(value))
    return "En cours";

  return "À faire";
}

function valeurPriorite(priorite) {
  if (priorite === "Haute") return "haute";
  if (priorite === "Basse") return "basse";
  return "moyenne";
}

function valeurStatut(statut) {
  if (statut === "Terminé") return "termine";
  if (statut === "En cours") return "en_cours";
  return "a_faire";
}

function getPrioriteClass(priorite) {
  if (priorite === "Haute") return "badge badge-haute";
  if (priorite === "Basse") return "badge badge-basse";
  return "badge badge-moyenne";
}

function getStatutClass(statut) {
  if (statut === "Terminé") return "badge badge-termine";
  if (statut === "En cours") return "badge badge-encours";
  return "badge badge-afaire";
}

function formatDevoir(devoir) {
  return {
    id: devoir.id,
    titre: devoir.titre,
    description: devoir.description,
    matiereId: devoir.matiere_id,
    matiere: devoir.matieres?.nom || "Sans matière",
    priorite: afficherPriorite(devoir.priorite),
    prioriteValue: devoir.priorite,
    statut: afficherStatut(devoir.statut),
    statutValue: devoir.statut,
    dateLimit: devoir.date_limite,
    joursRestants: calculerJoursRestants(devoir.date_limite),
  };
}

export default function DevoirList() {
  const [devoirs, setDevoirs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [recherche, setRecherche] = useState("");
  const [filtreMatiere, setFiltreMatiere] = useState("Toutes");
  const [filtreStatut, setFiltreStatut] = useState("Tous");
  const [filtrePriorite, setFiltrePriorite] = useState("Toutes");
  const [selectedDevoir, setSelectedDevoir] = useState(null);
  const [matieresOptions, setMatieresOptions] = useState([]);
  const [devoirEnEdition, setDevoirEnEdition] = useState(null);
  const [editForm, setEditForm] = useState({
    titre: "",
    matiereId: "",
    priorite: "moyenne",
    statut: "a_faire",
    dateLimite: "",
    description: "",
  });
  const [devoirASupprimer, setDevoirASupprimer] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function fetchDevoirs() {
      setLoading(true);
      setErrorMessage("");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setErrorMessage("Utilisateur non connecté.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("devoirs")
        .select(
          `
          id,
          matiere_id,
          titre,
          description,
          date_limite,
          priorite,
          statut,
          matieres (
            nom,
            couleur
          )
        `
        )
        .eq("user_id", user.id)
        .order("date_limite", { ascending: true });

      const { data: matieresData, error: matieresError } = await supabase
        .from("matieres")
        .select("id, nom")
        .eq("user_id", user.id)
        .order("nom", { ascending: true });

      if (error) {
        console.error("Erreur fetch devoirs:", error.message);
        setErrorMessage("Impossible de charger les devoirs.");
      } else {
        setDevoirs(data.map(formatDevoir));
      }

      if (matieresError) {
        console.error("Erreur fetch matieres:", matieresError.message);
      } else {
        setMatieresOptions(matieresData || []);
      }

      setLoading(false);
    }

    fetchDevoirs();
  }, []);

  const matieres = useMemo(
    () => ["Toutes", ...new Set(devoirs.map((d) => d.matiere))],
    [devoirs]
  );
  const statuts = ["Tous", "À faire", "En cours", "Terminé"];
  const priorites = ["Toutes", "Haute", "Moyenne", "Basse"];

  const marquerTermine = async (id) => {
    const { error } = await supabase
      .from("devoirs")
      .update({ statut: "termine" })
      .eq("id", id);

    if (error) {
      console.error("Erreur update devoir:", error.message);
      setErrorMessage("Impossible de mettre le devoir à jour.");
      return;
    }

    setDevoirs((prev) =>
      prev.map((d) =>
        d.id === id
          ? { ...d, statut: "Terminé", statutValue: "termine" }
          : d
      )
    );
  };

  const ouvrirEdition = (devoir) => {
    setSelectedDevoir(null);
    setDevoirEnEdition(devoir);
    setEditForm({
      titre: devoir.titre,
      matiereId: devoir.matiereId || "",
      priorite: devoir.prioriteValue || valeurPriorite(devoir.priorite),
      statut: devoir.statutValue || valeurStatut(devoir.statut),
      dateLimite: devoir.dateLimit,
      description: devoir.description || "",
    });
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
    setErrorMessage("");
  };

  const fermerEdition = () => {
    setDevoirEnEdition(null);
    setSavingEdit(false);
  };

  const enregistrerModification = async (event) => {
    event.preventDefault();
    setSavingEdit(true);
    setErrorMessage("");

    const payload = {
      titre: editForm.titre.trim(),
      matiere_id: editForm.matiereId || null,
      priorite: editForm.priorite,
      statut: editForm.statut,
      date_limite: editForm.dateLimite,
      description: editForm.description.trim() || null,
    };

    const { error } = await supabase
      .from("devoirs")
      .update(payload)
      .eq("id", devoirEnEdition.id);

    if (error) {
      console.error("Erreur update devoir:", error.message);
      setErrorMessage("Impossible de modifier le devoir.");
      setSavingEdit(false);
      return;
    }

    const matiere = matieresOptions.find((m) => m.id === editForm.matiereId);

    setDevoirs((prev) =>
      prev.map((devoir) =>
        devoir.id === devoirEnEdition.id
          ? {
              ...devoir,
              titre: payload.titre,
              description: payload.description,
              matiereId: payload.matiere_id,
              matiere: matiere?.nom || "Sans matière",
              priorite: afficherPriorite(payload.priorite),
              prioriteValue: payload.priorite,
              statut: afficherStatut(payload.statut),
              statutValue: payload.statut,
              dateLimit: payload.date_limite,
              joursRestants: calculerJoursRestants(payload.date_limite),
            }
          : devoir
      )
    );

    fermerEdition();
  };

  const ouvrirSuppression = (devoir) => {
    setSelectedDevoir(null);
    setDevoirASupprimer(devoir);
  };

  const supprimerDevoir = async () => {
    setDeleting(true);
    setErrorMessage("");

    const { error } = await supabase
      .from("devoirs")
      .delete()
      .eq("id", devoirASupprimer.id);

    if (error) {
      console.error("Erreur delete devoir:", error.message);
      setErrorMessage("Impossible de supprimer le devoir.");
      setDeleting(false);
      return;
    }

    setDevoirs((prev) =>
      prev.filter((devoir) => devoir.id !== devoirASupprimer.id)
    );
    setDevoirASupprimer(null);
    setDeleting(false);
  };

  const devoirsFiltres = devoirs.filter((d) => {
    const matchRecherche = d.titre
      .toLowerCase()
      .includes(recherche.toLowerCase());
    const matchMatiere =
      filtreMatiere === "Toutes" || d.matiere === filtreMatiere;
    const matchStatut = filtreStatut === "Tous" || d.statut === filtreStatut;
    const matchPriorite =
      filtrePriorite === "Toutes" || d.priorite === filtrePriorite;

    return matchRecherche && matchMatiere && matchStatut && matchPriorite;
  });

  const resetFiltres = () => {
    setRecherche("");
    setFiltreMatiere("Toutes");
    setFiltreStatut("Tous");
    setFiltrePriorite("Toutes");
  };

  if (loading) {
    return <p className="list-state">Chargement des devoirs...</p>;
  }

  return (
    <div className="devoir-list">
      {errorMessage && <p className="list-error">{errorMessage}</p>}

      <div className="list-filtres">
        <input
          type="text"
          placeholder="Chercher..."
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          className="filtre-search"
        />

        <select
          value={filtreMatiere}
          onChange={(e) => setFiltreMatiere(e.target.value)}
          className="filtre-select"
        >
          {matieres.map((m) => (
            <option key={m} value={m}>
              {m === "Toutes" ? "Toutes les matières" : m}
            </option>
          ))}
        </select>

        <select
          value={filtreStatut}
          onChange={(e) => setFiltreStatut(e.target.value)}
          className="filtre-select"
        >
          {statuts.map((s) => (
            <option key={s} value={s}>
              {s === "Tous" ? "Tous statuts" : s}
            </option>
          ))}
        </select>

        <select
          value={filtrePriorite}
          onChange={(e) => setFiltrePriorite(e.target.value)}
          className="filtre-select"
        >
          {priorites.map((p) => (
            <option key={p} value={p}>
              {p === "Toutes" ? "Priorité" : p}
            </option>
          ))}
        </select>

        <button type="button" className="filtre-reset" onClick={resetFiltres}>
          Reset
        </button>
      </div>

      <div className="list-grid">
        {devoirsFiltres.length > 0 ? (
          devoirsFiltres.map((devoir) => (
            <DevoirCard
              key={devoir.id}
              devoir={devoir}
              onMarquerTermine={marquerTermine}
              onSelect={setSelectedDevoir}
              onEdit={ouvrirEdition}
              onDelete={ouvrirSuppression}
            />
          ))
        ) : (
          <p className="list-empty">Aucun devoir trouvé.</p>
        )}
      </div>

      {devoirEnEdition && (
        <div className="devoir-detail-backdrop" onClick={fermerEdition}>
          <form
            className="devoir-edit-modal"
            onSubmit={enregistrerModification}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="devoir-detail-header">
              <h2>Modifier le devoir</h2>
              <button
                type="button"
                className="devoir-detail-close"
                onClick={fermerEdition}
                aria-label="Fermer"
              >
                X
              </button>
            </div>

            <div className="devoir-edit-grid">
              <label className="devoir-edit-field">
                <span>Titre</span>
                <input
                  type="text"
                  name="titre"
                  value={editForm.titre}
                  onChange={handleEditChange}
                  required
                />
              </label>

              <label className="devoir-edit-field">
                <span>Matière</span>
                <select
                  name="matiereId"
                  value={editForm.matiereId}
                  onChange={handleEditChange}
                  required
                >
                  <option value="">Choisir une matière</option>
                  {matieresOptions.map((matiere) => (
                    <option key={matiere.id} value={matiere.id}>
                      {matiere.nom}
                    </option>
                  ))}
                </select>
              </label>

              <label className="devoir-edit-field">
                <span>Date limite</span>
                <input
                  type="date"
                  name="dateLimite"
                  value={editForm.dateLimite}
                  onChange={handleEditChange}
                  required
                />
              </label>

              <label className="devoir-edit-field">
                <span>Priorité</span>
                <select
                  name="priorite"
                  value={editForm.priorite}
                  onChange={handleEditChange}
                  required
                >
                  <option value="haute">Haute</option>
                  <option value="moyenne">Moyenne</option>
                  <option value="basse">Basse</option>
                </select>
              </label>

              <label className="devoir-edit-field">
                <span>Statut</span>
                <select
                  name="statut"
                  value={editForm.statut}
                  onChange={handleEditChange}
                  required
                >
                  <option value="a_faire">À faire</option>
                  <option value="en_cours">En cours</option>
                  <option value="termine">Terminé</option>
                </select>
              </label>

              <label className="devoir-edit-field devoir-edit-full">
                <span>Description</span>
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                  placeholder="Instructions, détails..."
                />
              </label>
            </div>

            <div className="devoir-edit-actions">
              <button type="button" className="btn-annuler" onClick={fermerEdition}>
                Annuler
              </button>
              <button type="submit" className="btn-soumettre" disabled={savingEdit}>
                {savingEdit ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </form>
        </div>
      )}

      {devoirASupprimer && (
        <div
          className="devoir-detail-backdrop"
          onClick={() => setDevoirASupprimer(null)}
        >
          <section
            className="devoir-confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="delete-title">Supprimer ce devoir ?</h2>
            <p>
              Cette action supprimera "{devoirASupprimer.titre}" de ta liste.
            </p>
            <div className="devoir-edit-actions">
              <button
                type="button"
                className="btn-annuler"
                onClick={() => setDevoirASupprimer(null)}
              >
                Annuler
              </button>
              <button
                type="button"
                className="btn-delete-confirm"
                onClick={supprimerDevoir}
                disabled={deleting}
              >
                {deleting ? "Suppression..." : "Supprimer"}
              </button>
            </div>
          </section>
        </div>
      )}

      {selectedDevoir && (
        <div
          className="devoir-detail-backdrop"
          onClick={() => setSelectedDevoir(null)}
        >
          <section
            className="devoir-detail"
            role="dialog"
            aria-modal="true"
            aria-labelledby="devoir-detail-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="devoir-detail-header">
              <div>
                <h2 id="devoir-detail-title">{selectedDevoir.titre}</h2>
                <div className="devoir-detail-badges">
                  <span className="badge badge-matiere">
                    {selectedDevoir.matiere}
                  </span>
                  <span className={getPrioriteClass(selectedDevoir.priorite)}>
                    {selectedDevoir.priorite}
                  </span>
                  <span className={getStatutClass(selectedDevoir.statut)}>
                    {selectedDevoir.statut}
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="devoir-detail-close"
                onClick={() => setSelectedDevoir(null)}
                aria-label="Fermer"
              >
                X
              </button>
            </div>

            <div className="devoir-detail-grid">
              <div>
                <p className="devoir-detail-label">Date limite</p>
                <p>
                  {new Date(selectedDevoir.dateLimit).toLocaleDateString(
                    "fr-FR",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }
                  )}
                </p>
              </div>

              <div>
                <p className="devoir-detail-label">Temps restant</p>
                <p>
                  {selectedDevoir.joursRestants === 0
                    ? "Aujourd'hui"
                    : `${selectedDevoir.joursRestants}j restants`}
                </p>
              </div>
            </div>

            <div>
              <p className="devoir-detail-label">Description</p>
              <p className="devoir-detail-description">
                {selectedDevoir.description || "Aucune description."}
              </p>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
