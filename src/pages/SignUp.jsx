import { Link } from "react-router-dom";
import "../styles/signup.css";

export default function SignUp() {
  return (
    <div className="signup">
      <div className="signup__header">
        <h1>
          Task<span>Mate</span>
        </h1>
        <h2>Welcome !</h2>
      </div>

      <form className="signup__form">
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
              placeholder="Theodore"
              required
            />
          </div>

          <div className="signup__field">
            <label htmlFor="lastName">NOM</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              placeholder="Louisjuste"
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
            placeholder="theodore.louisjuste@gmail.com"
            required
          />
        </div>

        <div className="signup__field">
          <label htmlFor="university">UNIVERSITE</label>
          <input
            type="text"
            id="university"
            name="university"
            placeholder="Uespoir"
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
              required
            />
          </div>
        </div>

        <button className="signup__button" type="submit">
          Creer mon compte
        </button>

        <div className="signup__login-link">
          <p>Deja un compte ?</p>
          <Link to="/login">Se connecter</Link>
        </div>
      </form>
    </div>
  );
}
