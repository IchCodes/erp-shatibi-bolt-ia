import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, getIdToken } from 'firebase/auth';
import Cookies from 'universal-cookie';
import { auth } from '../firebase';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const cookies = new Cookies();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRole = async (token) => {
    try {
      const res = await fetch('http://localhost:8080/api/utilisateurs/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      console.log(data)
      setRole(data.role);
      setUser(data); // On garde les données du backend
      cookies.set('role', data.role, { path: '/', maxAge: 3600 });
    } catch (err) {
      console.error('Erreur lors de la récupération du rôle :', err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await getIdToken(firebaseUser);
        cookies.set('token', token, { path: '/', maxAge: 3600 });
        await fetchRole(token); // On ne met plus à jour user avec firebaseUser
      } else {
        setUser(null);
        setRole(null);
        cookies.remove('token', { path: '/' });
        cookies.remove('role', { path: '/' });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
