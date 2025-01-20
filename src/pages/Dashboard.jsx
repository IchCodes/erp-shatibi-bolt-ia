import React from 'react';
import { useNavigate } from 'react-router-dom';
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

function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = React.useState("");
  const [activeSection, setActiveSection] = React.useState("home");
  const [isExpanded, setIsExpanded] = React.useState(false);

  React.useEffect(() => {
    const user = auth.currentUser;
    if (user?.displayName) {
      setUserName(user.displayName);
    }
  }, []);

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
        return (
          <div className="bg-white rounded-2xl p-4 sm:p-8 shadow-lg">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">
              Bienvenue {userName ? userName : "sur votre espace personnel"}
            </h2>
          </div>
        );
      case "students":
        return <div className="bg-white rounded-2xl p-4 sm:p-8 shadow-lg">Section Étudiants</div>;
      case "users":
        return <div className="bg-white rounded-2xl p-4 sm:p-8 shadow-lg">Section Utilisateurs</div>;
      case "scheduling":
        return <div className="bg-white rounded-2xl p-4 sm:p-8 shadow-lg">Section Emploi du temps</div>;
      case "attendance":
        return <div className="bg-white rounded-2xl p-4 sm:p-8 shadow-lg">Section Présences</div>;
      case "discipline":
        return <div className="bg-white rounded-2xl p-4 sm:p-8 shadow-lg">Section Discipline</div>;
      case "school":
        return <div className="bg-white rounded-2xl p-4 sm:p-8 shadow-lg">Section École</div>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-primary flex">
      {/* Sidebar */}
      <div className="w-16 hover:w-64 bg-white shadow-lg p-2 transition-all duration-300 ease-in-out group">
        <div className="mb-8 overflow-hidden whitespace-nowrap">
          <h1 className="text-xl font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-2">Tableau de bord</h1>
        </div>
        <nav className="space-y-1">
          {[
            { name: "Accueil", section: "home", icon: HomeIcon },
            { name: "Étudiants", section: "students", icon: UserGroupIcon },
            { name: "Utilisateurs", section: "users", icon: UsersIcon },
            { name: "Emploi du temps", section: "scheduling", icon: CalendarIcon },
            { name: "Présences", section: "attendance", icon: ClipboardDocumentCheckIcon },
            { name: "Discipline", section: "discipline", icon: ExclamationTriangleIcon },
            { name: "École", section: "school", icon: BuildingLibraryIcon },
          ].map((item) => (
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

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="flex justify-end mb-8">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Se déconnecter
          </button>
        </div>
        {renderContent()}
      </div>
    </div>
  );
}

export default Dashboard; 