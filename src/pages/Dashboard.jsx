import React from 'react';
import { useNavigate } from 'react-router-dom';``
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { 
  HomeIcon, 
  UserGroupIcon, 
  UsersIcon, 
  CalendarIcon, 
  ClipboardDocumentCheckIcon, 
  ExclamationTriangleIcon, 
  BuildingLibraryIcon 
} from '@heroicons/react/24/outline';
import Home from '../components/dashboard-sections/Home';
import Students from '../components/dashboard-sections/Students';
import Users from '../components/dashboard-sections/Users';
import Attendance from '../components/dashboard-sections/Attendance';
import Discipline from '../components/dashboard-sections/Discipline';
import School from '../components/dashboard-sections/School';
import Scheduling from '../components/dashboard-sections/Scheduling';
import SchedulingAdmin from '../components/dashboard-sections/SchedulingAdmin';
import { Toaster } from 'react-hot-toast';

function Dashboard() {
  const navigate = useNavigate();
  const { user,role, loading } = useAuth();
  const [userName, setUserName] = React.useState("");
  const [activeSection, setActiveSection] = React.useState(role === "PROFESSEUR" ? "attendance" : "home");
  const [isExpanded, setIsExpanded] = React.useState(false);
  
   React.useEffect(() => {
    if (!loading && role === "PROFESSEUR") {
      setActiveSection("attendance");
    }
  }, [loading, role]);
  console.log("User role:", role);


  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  const handleSectionClick = (section) => {
    setActiveSection(section);
    setIsExpanded(false);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "home":
        return <Home userName={user} />;
      case "students":
        return <Students />;
      case "users":
        return <Users />;
      case "scheduling":
        return <Scheduling />;
      case "attendance":
        return <Attendance />;
      case "discipline":
        return <Discipline />;
      case "school":
        return <School />;
      case "admin":
        return <SchedulingAdmin />;
      default:
        return null;
    }
  };

  const getMenuItems = () => {
    const allItems = [
      { name: "Accueil", section: "home", icon: HomeIcon },
      { name: "Étudiants", section: "students", icon: UserGroupIcon },
      { name: "Utilisateurs", section: "users", icon: UsersIcon },
      { name: "Emploi du temps", section: "scheduling", icon: CalendarIcon },
      { name: "Présences", section: "attendance", icon: ClipboardDocumentCheckIcon },
      { name: "Discipline", section: "discipline", icon: ExclamationTriangleIcon },
      { name: "École", section: "school", icon: BuildingLibraryIcon },
      { name: "ADMIN - Emploi du temps", section: "admin", icon: CalendarIcon },
    ];

    switch (role) {
      case "PROFESSEUR":
        return allItems.filter(item => 
          ["home", "scheduling", "attendance"].includes(item.section)
        );
      case "ELEVE":
        return allItems.filter(item => 
          ["home", "scheduling"].includes(item.section)
        );
      case "ADMIN":
        return allItems;
      default:
        return [];
    }
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="min-h-screen bg-primary flex">
      <Toaster />
      {/* Sidebar */}
      <div className="w-16 hover:w-64 bg-white shadow-lg p-2 transition-all duration-300 ease-in-out group flex flex-col justify-between">
        <div>
          <div className="mb-8 overflow-hidden whitespace-nowrap">
            <h1 className="text-xl font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-2">Tableau de bord</h1>
          </div>

          <nav className="space-y-1">
            {getMenuItems().map((item) => (
              <button
                key={item.section}
                onClick={() => handleSectionClick(item.section)}
                className={`w-full flex items-center px-2 py-2 rounded-lg transition-colors ${
                  activeSection === item.section
                    ? "bg-gray-100 font-semibold"
                    : "hover:bg-gray-50"
                }`}
              >
                <item.icon className="w-5 h-5 min-w-[20px]" />
                <span className="ml-3 overflow-hidden whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {item.name}
                </span>
              </button>
            ))}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="w-full mt-4 flex items-center px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 min-w-[20px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="ml-3 overflow-hidden whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Se déconnecter
          </span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {renderContent()}
      </div>
    </div>
  );
}

export default Dashboard; 