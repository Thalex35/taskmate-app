import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../lib/supabase";
import "../styles/login.css";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
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
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });
    console.log("data:", data);
    console.log("error:", error);
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    navigate("/dashboard");
  }

  return (
    <div className="login">
      <div className="login__header">
        <h1>
          Task<span>Mate</span>
        </h1>
        <h2>Welcome back!</h2>
      </div>

      <form className="login__form" onSubmit={handleSubmit}>
        <div className="login__intro">
          <h3>TaskMate</h3>
          <p>Connecte-toi a ton compte</p>
        </div>

        <div className="login__field">
          <label htmlFor="email">EMAIL</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="email@gmail.com"
          />
        </div>

        <div className="login__field">
          <label htmlFor="password">MOT DE PASSE</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="********"
            required
          />
        </div>

        {error && <p className="login__error">{error}</p>}

        <div className="login__actions">
          <button className="login__button" type="submit" disabled={loading}>
            {loading ? "Connection..." : "Se connecter"}
          </button>

          <div className="login__signup-link">
            <p>Pas encore de compte?</p>
            <Link to="/signup">Creer un compte</Link>
          </div>
        </div>
      </form>
    </div>
  );
}
