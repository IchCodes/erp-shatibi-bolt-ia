import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Cookies from "universal-cookie";

const Scheduling = () => {
  const { user, role, loading } = useAuth();
  const [schedule, setSchedule] = useState([]);
  const cookies = new Cookies();

  const translateDay = (day) => {
    const translations = {
      SUNDAY: "Dimanche",
      MONDAY: "Lundi",
      TUESDAY: "Mardi",
      WEDNESDAY: "Mercredi",
      THURSDAY: "Jeudi",
      FRIDAY: "Vendredi",
      SATURDAY: "Samedi",
    };
    return translations[day] || day;
  };

  useEffect(() => {
    const fetchSchedule = async () => {
      if (role === "ELEVE" || role === "PROFESSEUR") {
        try {
          const token = cookies.get("token");
          const url =
            role === "ELEVE"
              ? `${import.meta.env.VITE_BASE_URL}/emploi-du-temps/eleve/${
                  user.id
                }`
              : `${import.meta.env.VITE_BASE_URL}/emploi-du-temps/professeur/${
                  user.id
                }`;

          const response = await fetch(url, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          setSchedule(data);
        } catch (error) {
          console.error(
            "Erreur lors de la récupération de l'emploi du temps:",
            error
          );
        }
      }
    };

    if (!loading) {
      fetchSchedule();
    }
  }, [user, role, loading]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  const sortedSchedule = [...schedule].sort((a, b) => {
    const days = [
      "SUNDAY",
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
    ];
    const dayDiff = days.indexOf(a.jour) - days.indexOf(b.jour);
    if (dayDiff !== 0) return dayDiff;
    return a.heureDebut.localeCompare(b.heureDebut);
  });

  const scheduleByDay = sortedSchedule.reduce((acc, course) => {
    if (!acc[course.jour]) {
      acc[course.jour] = [];
    }
    acc[course.jour].push(course);
    return acc;
  }, {});

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Emploi du temps</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(scheduleByDay).map(([day, courses]) => (
          <div key={day} className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              {translateDay(day)}
            </h3>
            <div className="space-y-4">
              {courses.map((course, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-md">
                  <div className="flex justify-between items-start">
                    <div className="font-medium text-gray-900">
                      {role === "ELEVE" ? course.matiere : course.matiereNom}
                    </div>
                    <div className="text-sm text-gray-600">
                      {course.heureDebut} - {course.heureFin}
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    {role === "ELEVE" ? (
                      <>
                        <p>Salle: {course.salle}</p>
                        <p>Enseignant: {course.enseignant}</p>
                      </>
                    ) : (
                      <>
                        <p>Classe: {course.classeNom}</p>
                        <p>Salle: {course.salleNom}</p>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Scheduling;
