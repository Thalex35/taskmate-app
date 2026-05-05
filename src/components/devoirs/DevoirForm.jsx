import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import "../../styles/DevoirForm.css";

const priorites = [
  { label: "Haute", value: "haute" },
  { label: "Moyenne", value: "moyenne" },
  { label: "Basse", value: "basse" },
];

const statuts = [
  { label: "À faire", value: "a_faire" },
  { label: "En cours", value: "en_cours" },
  { label: "Terminé", value: "termine" },
];

export default function DevoirForm() {
  const navigate = useNavigate();

  const [matieres, setMatieres] = useState([]);
  const [loadingMatieres, setLoadingMatieres] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [erreurs, setErreurs] = useState({});
  const [form, setForm] = useState({
    titre: "",
    matiereId: "",
    priorite: "moyenne",
    statut: "a_faire",
    dateLimite: "",
    description: "",
  });

  useEffect(() => {
    async function fetchMatieres() {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setErrorMessage("Utilisateur non connecté.");
        setLoadingMatieres(false);
        return;
      }

      const { data, error } = await supabase
        .from("matieres")
        .select("id, nom")
        .eq("user_id", user.id)
        .order("nom", { ascending: true });

      if (error) {
        setErrorMessage(error.message);
      } else {
        setMatieres(data);
        setForm((prev) => ({
          ...prev,
          matiereId: data[0]?.id || "",
        }));
      }

      setLoadingMatieres(false);
    }

    fetchMatieres();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErreurs((prev) => ({ ...prev, [name]: "" }));
    setErrorMessage("");
  };

  const valider = () => {
    const nouvellesErreurs = {};

    if (!form.titre.trim()) nouvellesErreurs.titre = "Le titre est requis.";
    if (!form.matiereId) nouvellesErreurs.matiereId = "La matière est requise.";
    if (!form.priorite) nouvellesErreurs.priorite = "La priorité est requise.";
    if (!form.statut) nouvellesErreurs.statut = "Le statut est requis.";
    if (!form.dateLimite)
      nouvellesErreurs.dateLimite = "La date limite est requise.";

    return nouvellesErreurs;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    const nouvellesErreurs = valider();
    if (Object.keys(nouvellesErreurs).length > 0) {
      setErreurs(nouvellesErreurs);
      return;
    }

    setLoadingSubmit(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setErrorMessage("Utilisateur non connecté.");
      setLoadingSubmit(false);
      return;
    }

    const { error } = await supabase.from("devoirs").insert({
      user_id: user.id,
      matiere_id: form.matiereId,
      titre: form.titre.trim(),
      description: form.description.trim() || null,
      date_limite: form.dateLimite,
      priorite: form.priorite,
      statut: form.statut,
    });

    if (error) {
      setErrorMessage(error.message);
      setLoadingSubmit(false);
      return;
    }

    navigate("/devoirs");
  };

  const handleAnnuler = () => {
    navigate("/devoirs");
  };

  return (
    <div className="form-page">
      <form className="form-container" onSubmit={handleSubmit}>
        <h1 className="form-titre">Nouveau devoir</h1>

        {errorMessage && <p className="form-error-message">{errorMessage}</p>}

        <div className="form-group form-group-full">
          <label className="form-label" htmlFor="titre">
            TITRE
          </label>
          <input
            id="titre"
            type="text"
            name="titre"
            value={form.titre}
            onChange={handleChange}
            placeholder="Exercices chapitre 5"
            className={`form-input ${erreurs.titre ? "input-erreur" : ""}`}
            required
          />
          {erreurs.titre && (
            <span className="form-erreur">{erreurs.titre}</span>
          )}
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label" htmlFor="matiereId">
              MATIÈRE
            </label>
            <select
              id="matiereId"
              name="matiereId"
              value={form.matiereId}
              onChange={handleChange}
              disabled={loadingMatieres}
              className={`form-input ${
                erreurs.matiereId ? "input-erreur" : ""
              }`}
            >
              <option value="">
                {loadingMatieres ? "Chargement..." : "Choisir une matière"}
              </option>
              {matieres.map((matiere) => (
                <option key={matiere.id} value={matiere.id}>
                  {matiere.nom}
                </option>
              ))}
            </select>
            {erreurs.matiereId && (
              <span className="form-erreur">{erreurs.matiereId}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="dateLimite">
              DEADLINE
            </label>
            <input
              id="dateLimite"
              type="date"
              name="dateLimite"
              value={form.dateLimite}
              onChange={handleChange}
              className={`form-input ${
                erreurs.dateLimite ? "input-erreur" : ""
              }`}
              required
            />
            {erreurs.dateLimite && (
              <span className="form-erreur">{erreurs.dateLimite}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="priorite">
              PRIORITÉ
            </label>
            <select
              id="priorite"
              name="priorite"
              value={form.priorite}
              onChange={handleChange}
              className={`form-input ${erreurs.priorite ? "input-erreur" : ""}`}
              required
            >
              {priorites.map((priorite) => (
                <option key={priorite.value} value={priorite.value}>
                  {priorite.label}
                </option>
              ))}
            </select>
            {erreurs.priorite && (
              <span className="form-erreur">{erreurs.priorite}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="statut">
              STATUT
            </label>
            <select
              id="statut"
              name="statut"
              value={form.statut}
              onChange={handleChange}
              className={`form-input ${erreurs.statut ? "input-erreur" : ""}`}
              required
            >
              {statuts.map((statut) => (
                <option key={statut.value} value={statut.value}>
                  {statut.label}
                </option>
              ))}
            </select>
            {erreurs.statut && (
              <span className="form-erreur">{erreurs.statut}</span>
            )}
          </div>
        </div>

        <div className="form-group form-group-full">
          <label className="form-label" htmlFor="description">
            DESCRIPTION
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Instructions, détails..."
            className="form-input form-textarea"
          />
        </div>

        <div className="form-btns">
          <button type="button" className="btn-annuler" onClick={handleAnnuler}>
            Annuler
          </button>
          <button
            type="submit"
            className="btn-soumettre"
            disabled={loadingSubmit || loadingMatieres}
          >
            {loadingSubmit ? "Ajout..." : "Ajouter le devoir"}
          </button>
        </div>
      </form>
    </div>
  );
}
