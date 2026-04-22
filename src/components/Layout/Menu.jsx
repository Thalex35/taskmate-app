import { useState } from"react";
import { Link } from "react-router-dom";
import "../../styles/Menu.css";

const menuSection = [
    {
        label : "Principal",
        items : [
            { id: "dashboard", label: "Dashboard", path : "/dashboard"},
            { id : "devoirs", label: "Mes Devoirs", path : "/devoirs"},
        ],
    },

    {
        label : "Organisation",
        items : [
            { id : "matieres", label : "Matieres", path: "/matieres"},
        ],
    },

    {
        label : "Compte",
        items : [
            { id : "profil", label : "Profil", path : "/profil"},
        ],
    },
]

export default function Menu() {
    const [active, setActive] = usestate("dashboard");

    return (
        <aside className="menu">
            <nav className="menu-nav">
                {menuSection.map((section) => (
                    <div key={section.label} className="menu-section">
                        <p className="menu-section-label">{section.label}</p>
                        {section.items.map((item) => (
                            <Link
                                key = {item.id}
                                to = {item.path}
                                className = {`menu-item ${active === item.id ? "active" : ""}`}
                                onClick = {() => setActive(item.id)}
                            >
                                <span className="menu-dot"/>
                                {item.label}
                            </Link>   


                        ))}

                    </div>
                ))}

            </nav>

            <div className="menu-profil">
                <div className="menu-avatar">TL</div>
                <div className="menu-user-info">
                    <p className="menu-user-name">Theodore L.</p>
                    <p className="menu-user-role">Etudiant</p>
                </div>

            </div>

        </aside>
    )
}