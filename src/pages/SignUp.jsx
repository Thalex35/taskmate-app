import { Link } from "react-router-dom";
import { useState } from "react";
import "../styles/signup.css";
import { supabase } from "../lib/supabase";

export default function SignUp() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    university: "",
    password: "",
    confirm: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirm) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          university: formData.university,
        },
      },
    });
    console.log("data:", data);
    console.log("error:", error);

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }
    setSuccess(
      "Compte créé avec succès ! Veuillez vérifier votre email pour confirmer votre compte.",
    );
  }

  return (
    <div className="signup">
      <div className="signup__header">
        <h1>
          Task<span>Mate</span>
        </h1>
        <h2>Welcome !</h2>
      </div>

      <form className="signup__form" onSubmit={handleSubmit}>
        <div className="signup__intro">
          <h3>Creer un compte</h3>
          <p>C&apos;est gratuit et rapide</p>
        </div>

        <div className="signup__row signup__row--two-columns">
          <div className="signup__field">
            <label htmlFor="firstName">PRENOM</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              placeholder="Jack"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="signup__field">
            <label htmlFor="lastName">NOM</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              placeholder="Skorfild"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="signup__field">
          <label htmlFor="email">EMAIL</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="email@gmail.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="signup__field">
          <label htmlFor="university">SHCOOL</label>
          <input
            type="text"
            id="university"
            name="university"
            placeholder="Uespoir"
            value={formData.university}
            onChange={handleChange}
            required
          />
        </div>

        <div className="signup__row signup__row--two-columns">
          <div className="signup__field">
            <label htmlFor="password">MOT DE PASSE</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="signup__field">
            <label htmlFor="confirm">CONFIRMER</label>
            <input
              type="password"
              id="confirm"
              name="confirm"
              placeholder="********"
              value={formData.confirm}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {error && <p className="signup__error">{error}</p>}
        {success && <p className="signup__success">{success}</p>}

        <button className="signup__button" type="submit" disabled={loading}>
          {loading ? "creation..." : "Creer mon compte"}
        </button>

        <div className="signup__login-link">
          <p>Deja un compte ?</p>
          <Link to="/login">Se connecter</Link>
        </div>
      </form>
    </div>
  );
}
