import { useContext, useEffect, useState } from "react";
import { Moon, Pencil, Sun } from "lucide-react";
import { ThemeContext } from "../context/theme";
import { supabase } from "../lib/supabase";
import "../styles/profile.css";

export default function Profile() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [university, setUniversity] = useState("Uespoir");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  useEffect(() => {
    async function fetchUser() {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error("Erreur getUser:", error.message);
        setLoading(false);
        return;
      }

      const currentUser = data.user;
      setUser(currentUser);
      setFirstName(currentUser?.user_metadata?.first_name || "");
      setLastName(currentUser?.user_metadata?.last_name || "");
      setUniversity(currentUser?.user_metadata?.university || "Uespoir");
      setLoading(false);
    }

    fetchUser();
  }, []);

  const initials =
    `${firstName.charAt(0) || ""}${lastName.charAt(0) || ""}` || "U";
  const fullName = `${firstName} ${lastName}`.trim() || "Utilisateur";
  const isDarkMode = theme === "dark";

  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);
  };

  const handleProfileSave = async () => {
    setSaving(true);
    setMessage("");

    const metadata = {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      university: university.trim() || "Uespoir",
    };

    const { data, error } = await supabase.auth.updateUser({
      data: metadata,
    });

    if (error) {
      showMessage(`Erreur: ${error.message}`, "error");
      setSaving(false);
      return;
    }

    setUser(data.user);
    setEditMode(false);
    showMessage("Profil mis a jour.");
    setSaving(false);
  };

  const handlePasswordSave = async () => {
    setSaving(true);
    setMessage("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      showMessage("Tous les champs du mot de passe sont requis.", "error");
      setSaving(false);
      return;
    }

    if (newPassword.length < 6) {
      showMessage("Le nouveau mot de passe doit contenir au moins 6 caracteres.", "error");
      setSaving(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      showMessage("Les mots de passe ne correspondent pas.", "error");
      setSaving(false);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (signInError) {
      showMessage("Le mot de passe actuel est incorrect.", "error");
      setSaving(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      showMessage(`Erreur: ${error.message}`, "error");
      setSaving(false);
      return;
    }

    setPasswordMode(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    showMessage("Mot de passe mis a jour.");
    setSaving(false);
  };

  if (loading) {
    return <div className="profile-page">Chargement...</div>;
  }

  return (
    <div className="profile-page">
      {message && (
        <div className={`profile-message profile-message--${messageType}`}>
          {message}
        </div>
      )}

      <h1 className="profile-title">Mon Profil</h1>

      <section className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">{initials.toUpperCase()}</div>

          <div className="profile-identity">
            <h2>{fullName}</h2>
            <p>{user.email}</p>

            <div className="profile-tags">
              <span>Etudiant</span>
              <span>{university}</span>
            </div>
          </div>
        </div>

        {editMode ? (
          <div className="profile-actions">
            <button type="button" onClick={handleProfileSave} disabled={saving}>
              {saving ? "Sauvegarde..." : "Sauvegarder"}
            </button>
            <button type="button" onClick={() => setEditMode(false)}>
              Annuler
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="profile-edit-btn"
            onClick={() => setEditMode(true)}
          >
            <Pencil size={16} />
            Modifier
          </button>
        )}
      </section>

      <section className="profile-section">
        <h2>Informations personnelles</h2>

        <div className="profile-row">
          <span>Nom complet</span>
          {editMode ? (
            <div className="profile-inline-inputs">
              <input
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                placeholder="Prenom"
              />
              <input
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                placeholder="Nom"
              />
            </div>
          ) : (
            <strong>{fullName}</strong>
          )}
        </div>

        <div className="profile-row">
          <span>Email</span>
          <strong>{user.email}</strong>
        </div>

        <div className="profile-row">
          <span>Universite</span>
          {editMode ? (
            <input
              value={university}
              onChange={(event) => setUniversity(event.target.value)}
              placeholder="Universite"
            />
          ) : (
            <strong>{university}</strong>
          )}
        </div>
      </section>

      <section className="profile-section">
        <h2>Securite</h2>

        <div className="profile-row profile-row--top">
          <span>Mot de passe</span>
          {passwordMode ? (
            <div className="profile-password-form">
              <input
                type="password"
                placeholder="Mot de passe actuel"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
              />
              <input
                type="password"
                placeholder="Nouveau mot de passe"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
              />
              <input
                type="password"
                placeholder="Confirmer le nouveau mot de passe"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
              <div className="profile-actions">
                <button type="button" onClick={handlePasswordSave} disabled={saving}>
                  {saving ? "Sauvegarde..." : "Changer"}
                </button>
                <button type="button" onClick={() => setPasswordMode(false)}>
                  Annuler
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              className="profile-outline-btn"
              onClick={() => setPasswordMode(true)}
            >
              Modifier le mot de passe
            </button>
          )}
        </div>
      </section>

      <section className="profile-section">
        <h2>Preferences</h2>

        <div className="profile-row">
          <div>
            <span>Mode sombre</span>
            <p className="profile-subtitle">Personnalisez votre experience.</p>
          </div>

          <button
            type="button"
            className="profile-theme-toggle"
            onClick={toggleTheme}
            aria-pressed={isDarkMode}
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            {isDarkMode ? "Mode clair" : "Mode sombre"}
          </button>
        </div>
      </section>
    </div>
  );
}
