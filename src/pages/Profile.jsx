import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error("Erreur getUser:", error.message);
      } else {
        setUser(data.user);
      }

      setLoading(false);
    }

    fetchUser();
  }, []);

  const initials =
    `${user?.user_metadata?.first_name?.charAt(0) || ""}${
      user?.user_metadata?.last_name?.charAt(0) || ""
    }` || "U";

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <h1>Profil</h1>
      <div>
        <div className="menu-avatar">{initials}</div>
      </div>
      <div></div>
      <div></div>
    </div>
  );
}
