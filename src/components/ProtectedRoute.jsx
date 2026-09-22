import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function ProtectedRoute({ children }) {
  const [sessao, setSessao] = useState(undefined); // undefined = carregando

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSessao(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessao(session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (sessao === undefined) return <p style={{ color: '#fff' }}>Verificando login...</p>;
  if (!sessao) return <Navigate to="/login" replace />;

  return children;
}