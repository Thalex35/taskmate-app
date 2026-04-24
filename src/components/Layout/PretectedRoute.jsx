import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export default function PretectedRoute({ children }) {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    let isMounted = true;

    async function loadSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (isMounted) {
        setSession(session);
      }
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (isMounted) {
        setSession(currentSession);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (session === undefined) {
    return <p>Chargement...</p>;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
