import React, { createContext, useEffect, useState } from "react";
import supabase from "../supabase";

export const AuthContext = createContext({
  user: null,
  session: null,
  loading: true,
  setUser: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load on app start
  useEffect(() => {
    const fetchSession = async () => {
      const { data: sessionData } = await supabase.auth.getSession();

      setSession(sessionData.session);
      setUser(sessionData.session?.user ?? null);
      setLoading(false);
    };

    fetchSession();

    // Real-time listener
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
