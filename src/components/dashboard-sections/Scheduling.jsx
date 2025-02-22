import React, { useState, useEffect } from 'react';
import { getNiveaux, createCours } from '../../api';

export default function Scheduling() {
  const [niveauxCoran, setNiveauxCoran] = useState([]);
  const [selectedNiveau, setSelectedNiveau] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCours, setNewCours] = useState({
    nomCours: '',
    type: 'MATIERE'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createCours(newCours);
      setIsDialogOpen(false);
      // Rafraîchir la liste des niveaux
      const niveaux = await getNiveaux();
      setNiveauxCoran(niveaux);
      // Réinitialiser le formulaire
      setNewCours({
        nomCours: '',
        type: 'MATIERE'
      });
    } catch (err) {
      setError("Erreur lors de la création du cours");
    } finally {
      setLoading(false);
    }
  };

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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Emploi du temps</h2>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="bg-accent text-white px-4 py-2 rounded-md hover:bg-primary-dark"
        >
          Ajouter un cours
        </button>
      </div>
      
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

      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Ajouter un nouveau cours</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du cours
                </label>
                <input
                  type="text"
                  value={newCours.nomCours}
                  onChange={(e) => setNewCours({...newCours, nomCours: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setNewCours({ nomCours: '', type: 'MATIERE' });
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-accent text-white px-4 py-2 rounded-md hover:bg-primary-dark"
                  disabled={loading}
                >
                  {loading ? 'Création...' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}