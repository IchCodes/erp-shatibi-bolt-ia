import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import moment from 'moment';
import { useAuth } from '../context/AuthContext';

const PointageCoursActuel = () => {
  const now = moment();
  const [coursActuel, setCoursActuel] = useState(null);
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
          `http://localhost:8080/api/emploi-du-temps/professeur/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const coursDuJour = emploiDuTemps.filter((item) =>
          item.jour === now.format('dddd').toUpperCase()
        );

        const actuel = coursDuJour.find((item) => {
          const debut = moment(item.heureDebut, 'HH:mm:ss');
          const fin = moment(item.heureFin, 'HH:mm:ss');
          console.log("couurs du jour", coursDuJour);

          return now.isBetween(debut, fin);
        });
        console.log("cours actuel", actuel);

        if (actuel) {
          setCoursActuel(actuel);
          const { data: elevesClasse } = await axios.get(
            `http://localhost:8080/api/classes/${actuel.classeId}/eleves`,
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
        }
      } catch (err) {
        console.error('Erreur récupération cours ou élèves :', err);
      }
    };

    if (!loading) fetchCoursEtEleves();
  }, [user, role, loading]);

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
          'http://localhost:8080/api/pointage',
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

  if (!coursActuel) return <p className="p-4">Aucun cours en cours actuellement.</p>;

  return (
    <div className="p-4 max-w-2xl mx-auto bg-white shadow rounded">
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
    </div>
  );
};

export default PointageCoursActuel;
