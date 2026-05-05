import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import "../../styles/matieresForm.css";

export default function MatieresForm() {
  const navigate = useNavigate();
  const colorOptions = [
    "#2c867a",
    "#3b82f6",
    "#f97316",
    "#ef4444",
    "#eab308",
    "#8b5cf6",
    "#ec4899",
  ];

  const [nom, setNom] = useState("");
  const [couleur, setCouleur] = useState("#2c867a");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setErrorMessage("Utilisateur non connecté.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("matieres").insert({
      user_id: user.id,
      nom: nom.trim(),
      couleur,
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
      return;
    }

    setNom("");
    setCouleur("#2c867a");
    setLoading(false);
    navigate("/matieres");
  }

  return (
    <div className="newMat">
      <div className="newMat__card">
        <div className="newMat__header">
          <h1>Nouvelle matière</h1>
          <Link to="/matieres" className="newMat__close" aria-label="Annuler">
            X
          </Link>
        </div>

        <form className="newMat__form" onSubmit={onSubmit}>
          <div className="newMat__field">
            <label htmlFor="nom">NOM</label>
            <input
              id="nom"
              type="text"
              placeholder="Ex : Math"
              value={nom}
              onChange={(event) => setNom(event.target.value)}
              required
            />
          </div>

          <div className="newMat__field">
            <label htmlFor="couleur">Couleur</label>
            <div className="newMat__palette">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`newMat__swatch ${
                    couleur === color ? "newMat__swatch--active" : ""
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label={`Choisir ${color}`}
                  onClick={() => setCouleur(color)}
                />
              ))}

              <label className="newMat__customColor" htmlFor="couleur">
                <span style={{ backgroundColor: couleur }} />
                Palette
              </label>
              <input
                id="couleur"
                type="color"
                value={couleur}
                onChange={(event) => setCouleur(event.target.value)}
              />
            </div>
          </div>

          {errorMessage && <p className="newMat__error">{errorMessage}</p>}

          <div className="newMat__actions">
            <Link to="/matieres">
              <button className="btnAnnuler" type="button">
                Annuler
              </button>
            </Link>

            <button className="btnCreate" type="submit" disabled={loading}>
              {loading ? "Creation..." : "Ajouter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
