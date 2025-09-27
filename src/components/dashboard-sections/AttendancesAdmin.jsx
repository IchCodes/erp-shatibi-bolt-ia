import { getAbsentStudentsByDate } from "../../api";
import { useEffect, useState } from "react";


function AttendancesAdmin() {
  const [selectedDate, setSelectedDate] = useState('');
  const [absentStudents, setAbsentStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState('');
  const [availableClasses, setAvailableClasses] = useState([]);

  const fetchAbsentStudents = async (date) => {
    setLoading(true);
    try {
      const data = await getAbsentStudentsByDate(date);
      console.log(data);
      setAbsentStudents(data || []);
      
      // Extract unique classes from the data
      const classes = [...new Set((data || []).map(student => student.nomclasse))].sort();
      setAvailableClasses(classes);
    } catch (error) {
      console.error("Error fetching absent students:", error);
      setAbsentStudents([]);
      setAvailableClasses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAbsentStudents(selectedDate);
  }, [selectedDate]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchAbsentStudents(selectedDate);
  };

  // Filter students based on selected class
  const filteredStudents = selectedClass 
    ? absentStudents.filter(student => student.nomclasse === selectedClass)
    : absentStudents;
    
    
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Admin - Absences</h2>
      
      {/* Date Selection Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-4 items-end flex-wrap">
          <div className="flex flex-col">
            <label htmlFor="date" className="text-sm font-medium text-gray-700 mb-1">
              Sélectionner une date
            </label>
            <input
              type="date"
              id="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="class" className="text-sm font-medium text-gray-700 mb-1">
              Filtrer par classe
            </label>
            <select
              id="class"
              value={selectedClass}
              onChange={handleClassChange}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[200px]"
            >
              <option value="">Toutes les classes</option>
              {availableClasses.map((className, index) => (
                <option key={index} value={className}>
                  {className}
                </option>
              ))}
            </select>
          </div>
        </div>
      </form>

      {/* Results Display */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">
            Étudiants absents le {selectedDate}
            {selectedClass && ` - Classe: ${selectedClass}`}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {filteredStudents.length} étudiant(s) absent(s)
            {selectedClass && ` dans la classe ${selectedClass}`}
            {absentStudents.length > filteredStudents.length && 
              ` (sur ${absentStudents.length} au total)`
            }
          </p>
        </div>
        
        {loading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Chargement des données...</p>
          </div>
        ) : filteredStudents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prénom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Classe
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date de pointage
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student.nom}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.prenom}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.nomclasse}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        {student.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.datepointage}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">Aucun étudiant absent</h3>
            <p className="text-sm text-gray-500">
              {selectedClass 
                ? `Aucun étudiant absent trouvé dans la classe "${selectedClass}" pour la date sélectionnée.`
                : "Aucun étudiant absent trouvé pour la date sélectionnée."
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AttendancesAdmin;
