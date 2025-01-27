import React, { useState, useEffect } from 'react';
import { getNiveaux } from '../../api';

export default function Scheduling() {
  const [niveauxCoran, setNiveauxCoran] = useState([]);
  const [selectedNiveau, setSelectedNiveau] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getNiveaux().then(
        (niveaux) => {
            setNiveauxCoran(niveaux);
        }
    ).catch(
        (error) => {
            setError(error);
        }
    );
  }, []);


  return (
    <div className="bg-white rounded-2xl p-4 sm:p-8 shadow-lg">
      <h2 className="text-2xl font-semibold mb-6">Emploi du temps</h2>
      
      <div className="mb-6">
        <label htmlFor="niveau" className="block text-sm font-medium text-gray-700 mb-2">
          Sélectionner un niveau
        </label>
        <select
          id="niveau"
          value={selectedNiveau}
          onChange={(e) => setSelectedNiveau(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary rounded-md"
          disabled={loading}
        >
          <option value="">Sélectionnez un niveau</option>
          {niveauxCoran.map((niveau) => (
            <option key={niveau.id} value={niveau.id}>
              {niveau.nomCours}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="text-center text-gray-600">
          Chargement des niveaux...
        </div>
      )}

      {error && (
        <div className="text-center text-red-600">
          {error}
        </div>
      )}
    </div>
  );
} 