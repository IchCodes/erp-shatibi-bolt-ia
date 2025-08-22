import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import moment from 'moment';
import { useAuth } from '../context/AuthContext';

const PointageCoursActuel = () => {
  const now = moment('2025-05-18 15:30:00');
  const [coursActuel, setCoursActuel] = useState(null);
  const [tousLesCours, setTousLesCours] = useState([]);
  const [eleves, setEleves] = useState([]);
  const [pointage, setPointage] = useState({});
  const { user, role, loading } = useAuth();
  const cookies = new Cookies();

  useEffect(() => {
    const fetchCoursEtEleves = async () => {
      try {
        const token = cookies.get('token');
        if (!user?.id || role !== 'PROFESSEUR') return;

        const { data: emploiDuTemps } = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/emploi-du-temps/professeur/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const coursDuJour = emploiDuTemps.filter((item) =>
          item.jour === now.format('dddd').toUpperCase()
        );

        setTousLesCours(coursDuJour);

        const actuel = coursDuJour.find((item) => {
          const aujourdhui = now.format('YYYY-MM-DD');
          const debut = moment(`${aujourdhui} ${item.heureDebut}`);
          const fin = moment(`${aujourdhui} ${item.heureFin}`);
          return now.isBetween(debut, fin);
        });

        if (actuel) {
          setCoursActuel(actuel);
          await fetchEleves(actuel.classeId, token);
        }
      } catch (err) {
        console.error('Erreur récupération cours ou élèves :', err);
      }
    };

    if (!loading) fetchCoursEtEleves();
  }, [user, role, loading]);

  const fetchEleves = async (classeId, token) => {
    try {
      const { data: elevesClasse } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/classes/${classeId}/eleves`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEleves(elevesClasse);
      const initPointage = {};
      elevesClasse.forEach((e) => {
        initPointage[e.id] = 'PRESENT';
      });
      setPointage(initPointage);
    } catch (err) {
      console.error('Erreur récupération élèves :', err);
    }
  };

  const handleCoursChange = async (e) => {
    const coursId = e.target.value;
    if (coursId === '') {
      setCoursActuel(null);
      setEleves([]);
      setPointage({});
      return;
    }
    
    const cours = tousLesCours.find(c => c.emploiDuTempsId === parseInt(coursId));
    if (cours) {
      setCoursActuel(cours);
      const token = cookies.get('token');
      await fetchEleves(cours.classeId, token);
    }
  };

  const toggleStatut = (eleveId) => {
    setPointage((prev) => ({
      ...prev,
      [eleveId]: prev[eleveId] === 'ABSENT' ? 'PRESENT' : 'ABSENT',
    }));
  };

  const handleSubmit = async () => {
    try {
      const token = cookies.get('token');
      const promises = Object.entries(pointage).map(([eleveId, statut]) =>
        axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/pointage`,
          {
            eleveId: parseInt(eleveId),
            emploiDuTempsId: coursActuel.emploiDuTempsId,
            statut,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
      );
      await Promise.all(promises);
      alert('Pointage effectué !');
    } catch (err) {
      console.error('Erreur lors du pointage :', err);
      alert('Erreur pendant le pointage.');
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto bg-white shadow rounded">
      <div className="mb-4">
        <select 
          onChange={handleCoursChange}
          className="w-full p-2 border rounded"
          value={coursActuel?.emploiDuTempsId || ''}
        >
          <option value="">Sélectionner un cours</option>
          {tousLesCours.map((cours) => (
            <option key={cours.emploiDuTempsId} value={cours.emploiDuTempsId}>
              {cours.matiereNom} - {cours.classeNom} ({cours.heureDebut} - {cours.heureFin})
            </option>
          ))}
        </select>
      </div>

      {coursActuel ? (
        <>
          <h2 className="text-xl font-bold mb-4">
            Pointage - {coursActuel.matiereNom} avec {coursActuel.classeNom}
          </h2>
          <ul className="divide-y">
            {eleves.map((eleve) => (
              <li key={eleve.id} className="py-2 flex justify-between items-center">
                <span>
                  {eleve.prenom} {eleve.nom}
                </span>
                <button
                  onClick={() => toggleStatut(eleve.id)}
                  className={`px-3 py-1 rounded text-white ${
                    pointage[eleve.id] === 'ABSENT' ? 'bg-red-500' : 'bg-green-500'
                  }`}
                >
                  {pointage[eleve.id]}
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-6 text-right">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Valider le pointage
            </button>
          </div>
        </>
      ) : (
        <p className="p-4">Aucun cours sélectionné.</p>
      )}
    </div>
  );
};

export default PointageCoursActuel;