import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  return (
    <div className="min-h-screen bg-primary p-4 sm:p-8">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">Tableau de bord</h1>
          <button
            onClick={handleLogout}
            className="w-full sm:w-auto px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Se déconnecter
          </button>
        </div>
        <div className="bg-white rounded-2xl p-4 sm:p-8 shadow-lg">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Bienvenue sur votre espace personnel</h2>
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 