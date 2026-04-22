import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="navbar">
      <Link to="/">TaskMate</Link>
      <Link to="/">Mode Sombre</Link>
      <Link to="/login">login</Link>
      <Link to="/Devoirs">+ Nouveau Devoir </Link>
    </nav>
  );
}
