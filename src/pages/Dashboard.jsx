import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Dashboard() {
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

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <h1>Bonjour {user?.user_metadata?.first_name || "utilisateur"}</h1>
    </div>
  );
}
