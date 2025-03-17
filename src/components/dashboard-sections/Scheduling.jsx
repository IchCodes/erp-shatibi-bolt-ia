import React, { useState, useEffect } from "react";
import {
  getNiveaux,
  createCours,
  createClasse,
  getClasses,
  deleteCours,
  deleteClasse,
  getProfesseurs,
  linkProfToCours,
} from "../../api";

export default function Scheduling() {
  const [niveauxCoran, setNiveauxCoran] = useState([]);
  const [classes, setClasses] = useState([]);
  const [professeurs, setProfesseurs] = useState([]);
  const [selectedNiveau, setSelectedNiveau] = useState("");
  const [selectedClasse, setSelectedClasse] = useState("");
  const [selectedProf, setSelectedProf] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCoursDialogOpen, setIsCoursDialogOpen] = useState(false);
  const [isClasseDialogOpen, setIsClasseDialogOpen] = useState(false);
  const [newCours, setNewCours] = useState({
    nomCours: "",
    type: "MATIERE",
  });
  const [newClasse, setNewClasse] = useState({
    nomClasse: "",
  });

  useEffect(() => {
    Promise.all([getNiveaux(), getClasses(), getProfesseurs()])
      .then(([niveaux, classes, profs]) => {
        setNiveauxCoran(niveaux);
        setClasses(classes);
        setProfesseurs(profs);
      })
      .catch((error) => {
        setError(error);
      });
  }, []);

  const handleCoursSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createCours(newCours);
      setIsCoursDialogOpen(false);
      const niveaux = await getNiveaux();
      setNiveauxCoran(niveaux);
      setNewCours({
        nomCours: "",
        type: "MATIERE",
      });
    } catch (err) {
      setError("Erreur lors de la création du cours");
    } finally {
      setLoading(false);
    }
  };

  const handleClasseSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createClasse(newClasse);
      setIsClasseDialogOpen(false);
      const updatedClasses = await getClasses();
      setClasses(updatedClasses);
      setNewClasse({
        nomClasse: "",
      });
    } catch (err) {
      setError("Erreur lors de la création de la classe");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCours = async () => {
    if (!selectedNiveau) return;

    setLoading(true);
    try {
      await deleteCours(selectedNiveau);
      const niveaux = await getNiveaux();
      setNiveauxCoran(niveaux);
      setSelectedNiveau("");
    } catch (err) {
      setError("Erreur lors de la suppression du cours");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClasse = async () => {
    if (!selectedClasse) return;

    setLoading(true);
    try {
      await deleteClasse(selectedClasse);
      const classes = await getClasses();
      setClasses(classes);
      setSelectedClasse("");
    } catch (err) {
      setError("Erreur lors de la suppression de la classe");
    } finally {
      setLoading(false);
    }
  };

  const handleLinkProfToCours = async () => {
    if (!selectedNiveau || !selectedProf) return;

    setLoading(true);
    try {
      await linkProfToCours(selectedNiveau, selectedProf);
      const niveaux = await getNiveaux();
      setNiveauxCoran(niveaux);
      setSelectedProf("");
    } catch (err) {
      setError("Erreur lors de la liaison professeur-cours");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Section Cours */}
      <div className="bg-white rounded-2xl p-4 sm:p-8 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Gestion des Cours</h2>
          <button
            onClick={() => setIsCoursDialogOpen(true)}
            className="bg-accent text-white px-4 py-2 rounded-md hover:bg-primary-dark"
          >
            Ajouter un cours
          </button>
        </div>

        <div className="mb-6">
          <div className="flex gap-4 items-end">
            <div className="flex-grow">
              <label
                htmlFor="niveau"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
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
            {selectedNiveau && (
              <button
                onClick={handleDeleteCours}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                disabled={loading}
              >
                Supprimer
              </button>
            )}
          </div>

          {/* Nouvelle section pour assigner un professeur */}
          <div className="flex gap-4 items-end mt-4">
            <div className="flex-grow">
              <label
                htmlFor="professeur"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Assigner un professeur
              </label>
              <select
                id="professeur"
                value={selectedProf}
                onChange={(e) => setSelectedProf(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary rounded-md"
                disabled={!selectedNiveau || loading}
              >
                <option value="">Sélectionnez un professeur</option>
                {professeurs.map((prof) => (
                  <option key={prof.id} value={prof.id}>
                    {prof.nom} {prof.prenom}
                  </option>
                ))}
              </select>
            </div>
            {selectedProf && selectedNiveau && (
              <button
                onClick={handleLinkProfToCours}
                className="bg-accent text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
                disabled={loading}
              >
                Assigner
              </button>
            )}
          </div>
        </div>

        {/* Liste des cours */}
        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            Cours existants
          </h3>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {niveauxCoran.map((cours) => (
              <div
                key={cours.id}
                className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <h4 className="font-medium">{cours.nomCours}</h4>
                <p className="text-sm text-gray-500">Type: {cours.type}</p>
                <p className="text-sm text-gray-500">
                  Profs:{" "}
                  {cours.professeurs
                    .map((prof) => prof.nom + " " + prof.prenom)
                    .join(", ")}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section Classes */}
      <div className="bg-white rounded-2xl p-4 sm:p-8 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Gestion des Classes</h2>
          <button
            onClick={() => setIsClasseDialogOpen(true)}
            className="bg-accent text-white px-4 py-2 rounded-md hover:bg-primary-dark"
          >
            Ajouter une classe
          </button>
        </div>

        <div className="mb-6">
          <div className="flex gap-4 items-end">
            <div className="flex-grow">
              <label
                htmlFor="classe"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Sélectionner une classe
              </label>
              <select
                id="classe"
                value={selectedClasse}
                onChange={(e) => setSelectedClasse(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary rounded-md"
                disabled={loading}
              >
                <option value="">Sélectionnez une classe</option>
                {classes.map((classe) => (
                  <option key={classe.id} value={classe.id}>
                    {classe.nomClasse}
                  </option>
                ))}
              </select>
            </div>
            {selectedClasse && (
              <button
                onClick={handleDeleteClasse}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                disabled={loading}
              >
                Supprimer
              </button>
            )}
          </div>
        </div>

        {/* Liste des classes */}
        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            Classes existantes
          </h3>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {classes.map((classe) => (
              <div
                key={classe.id}
                className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <h4 className="font-medium">{classe.nomClasse}</h4>
                <p className="text-sm text-gray-500">
                  {classe.cours.length} cours associés
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-center text-gray-600">Chargement...</div>
      )}

      {error && <div className="text-center text-red-600">{error}</div>}

      {/* Modal Cours */}
      {isCoursDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">
              Ajouter un nouveau cours
            </h3>
            <form onSubmit={handleCoursSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du cours
                </label>
                <input
                  type="text"
                  value={newCours.nomCours}
                  onChange={(e) =>
                    setNewCours({ ...newCours, nomCours: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCoursDialogOpen(false);
                    setNewCours({ nomCours: "", type: "MATIERE" });
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
                  {loading ? "Création..." : "Créer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Classe */}
      {isClasseDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">
              Ajouter une nouvelle classe
            </h3>
            <form onSubmit={handleClasseSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de la classe
                </label>
                <input
                  type="text"
                  value={newClasse.nomClasse}
                  onChange={(e) =>
                    setNewClasse({ ...newClasse, nomClasse: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsClasseDialogOpen(false);
                    setNewClasse({ nomClasse: "" });
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
                  {loading ? "Création..." : "Créer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
