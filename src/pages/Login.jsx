import { Link } from "react-router-dom";
import "../styles/login.css";

export default function Login() {
  return (
    <div className="login">
      <div className="login__header">
        <h1>
          Task<span>Mate</span>
        </h1>
        <h2>Welcome back!</h2>
      </div>

      <form className="login__form">
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
            placeholder="theodore.louisjuste@gmail.com"
            required
          />
        </div>

        <div className="login__field">
          <label htmlFor="password">MOT DE PASSE</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="********"
            required
          />
        </div>

        <div className="login__actions">
          <button className="login__button" type="submit">
            Se connecter
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
