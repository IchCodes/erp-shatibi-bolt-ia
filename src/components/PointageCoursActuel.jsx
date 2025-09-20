import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import moment from "moment";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { getPointagesProfesseur, getNiveaux } from "../api";

const PointageCoursActuel = () => {
  const now = moment();
  const [coursActuel, setCoursActuel] = useState(null);
  const [tousLesCours, setTousLesCours] = useState([]);
  const [eleves, setEleves] = useState([]);
  const [pointage, setPointage] = useState({});
  const [pointagesEffectues, setPointagesEffectues] = useState({});
  const [listeCours, setListeCours] = useState([]);
  const { user, role, loading } = useAuth();
  const cookies = new Cookies();

  useEffect(() => {
    const fetchCoursEtPointages = async () => {
      try {
        const token = cookies.get("token");
        if (!user?.id || role !== "PROFESSEUR") return;

        const coursResponse = await getNiveaux();
        setListeCours(coursResponse || []);

        const pointages = await getPointagesProfesseur(user.id);
        setPointagesEffectues(pointages || {});
        const { data: emploiDuTemps } = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/emploi-du-temps/professeur/${
            user.id
          }`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const coursDuJour = emploiDuTemps.filter(
          (item) => item.jour === now.format("dddd").toUpperCase()
        );

        setTousLesCours(coursDuJour);

        const actuel = coursDuJour.find((item) => {
          const aujourdhui = now.format("YYYY-MM-DD");
          const debut = moment(`${aujourdhui} ${item.heureDebut}`);
          const fin = moment(`${aujourdhui} ${item.heureFin}`);
          return now.isBetween(debut, fin);
        });

        if (actuel) {
          setCoursActuel(actuel);
          await fetchEleves(actuel.classeId, token);
        }
      } catch (err) {
        console.error("Erreur récupération cours ou pointages :", err);
      }
    };

    if (!loading) fetchCoursEtPointages();
  }, [user, role, loading]);

  const fetchEleves = async (classeId, token) => {
    try {
      const { data: elevesClasse } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/classes/${classeId}/eleves`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEleves(elevesClasse);
      const initPointage = {};
      elevesClasse.forEach((e) => {
        initPointage[e.id] = "PRESENT";
      });
      setPointage(initPointage);
    } catch (err) {
      console.error("Erreur récupération élèves :", err);
    }
  };

  const handleCoursChange = async (e) => {
    const coursId = e.target.value;
    if (coursId === "") {
      setCoursActuel(null);
      setEleves([]);
      setPointage({});
      return;
    }

    const cours = tousLesCours.find(
      (c) => c.emploiDuTempsId === parseInt(coursId)
    );
    if (cours) {
      setCoursActuel(cours);
      const token = cookies.get("token");
      await fetchEleves(cours.classeId, token);
    }
  };

  const toggleStatut = (eleveId) => {
    setPointage((prev) => ({
      ...prev,
      [eleveId]: prev[eleveId] === "ABSENT" ? "PRESENT" : "ABSENT",
    }));
  };

  const isPointageEffectue = (coursActuel) => {
    if (!coursActuel) return false;
    const heures = `${coursActuel.heureDebut} - ${coursActuel.heureFin}`;
    const coursCorrespondant = listeCours.find(
      (c) => c.nomCours === coursActuel.matiereNom
    );
    console.log("Cours correspondant:", coursCorrespondant);
    console.log("Matière actuelle:", coursActuel.matiereNom);
    if (!coursCorrespondant) return false;
    return pointagesEffectues[coursCorrespondant.id]?.[heures] === true;
  };

  const handleSubmit = async () => {
    try {
      const token = cookies.get("token");
      const promises = Object.entries(pointage).map(([eleveId, statut]) =>
        axios.post(
          `${import.meta.env.VITE_BASE_URL}/pointage`,
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

      toast.success("Pointage effectué avec succès !", {
        duration: 3000,
        position: "top-center",
        style: {
          background: "#10B981",
          color: "#fff",
          padding: "16px",
        },
        icon: "✅",
      });
    } catch (err) {
      console.error("Erreur lors du pointage :", err);
      toast.error("Erreur pendant le pointage.", {
        duration: 3000,
        position: "top-center",
        style: {
          background: "#EF4444",
          color: "#fff",
          padding: "16px",
        },
        icon: "❌",
      });
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto bg-white shadow rounded">
      <div className="mb-4">
        <select
          onChange={handleCoursChange}
          className="w-full p-2 border rounded"
          value={coursActuel?.emploiDuTempsId || ""}
        >
          <option value="">Sélectionner un cours</option>
          {tousLesCours.map((cours) => (
            <option key={cours.emploiDuTempsId} value={cours.emploiDuTempsId}>
              {cours.matiereNom} - {cours.classeNom} ({cours.heureDebut} -{" "}
              {cours.heureFin})
            </option>
          ))}
        </select>
      </div>

      {coursActuel ? (
        <>
          <h2 className="text-xl font-bold mb-4">
            Pointage - {coursActuel.matiereNom} avec {coursActuel.classeNom}
          </h2>

          {isPointageEffectue(coursActuel) ? (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
              Pointage déjà effectué pour ce cours
            </div>
          ) : (
            <>
              <ul className="divide-y">
                {eleves.map((eleve) => (
                  <li
                    key={eleve.id}
                    className="py-2 flex justify-between items-center"
                  >
                    <span>
                      {eleve.prenom} {eleve.nom}
                    </span>
                    <button
                      onClick={() => toggleStatut(eleve.id)}
                      className={`px-3 py-1 rounded text-white ${
                        pointage[eleve.id] === "ABSENT"
                          ? "bg-red-500"
                          : "bg-green-500"
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
          )}
        </>
      ) : (
        <p className="p-4">Aucun cours sélectionné.</p>
      )}
      <div>
        <button
          onClick={() => window.open("https://tally.so/r/nGWpMz", "_blank")}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Signaler un problème
        </button>
      </div>
    </div>
  );
};

export default PointageCoursActuel;
