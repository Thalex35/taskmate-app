import NavBar from "./NavBar";
import Menu from "./Menu";
import "../../styles/index.css";

export default function Layout({
  children,
  ShowAddBtn = true,
  showLogout = false,
}) {
  return (
    <div>
      <NavBar ShowAddBtn={ShowAddBtn} showLogout={showLogout} />
      <div className="body_pages">
        <Menu />
        <main>{children}</main>
      </div>
    </div>
  );
}
