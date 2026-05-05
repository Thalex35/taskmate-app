import DevoirList from "../components/devoirs/DevoirList";
import "../styles/DevoirList.css";

export default function Devoirs() {
  return (
    <section className="devoirs-page">
      <div className="devoirs-header">
        <h1>Mes Devoirs</h1>
        <p>Retrouve, filtre et termine tes devoirs enregistrés.</p>
      </div>

      <DevoirList />
    </section>
  );
}
