import React, { useEffect, useState } from 'react';
import { FiGrid, FiHome, FiBook, FiSettings, FiBell } from 'react-icons/fi';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import CourseCard from './components/CourseCard';
import Login from './pages/Login';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const categories = [
    { name: 'All', icon: <FiGrid /> },
    { name: 'IT & Software', icon: '💻' },
    { name: 'Media Training', icon: '🎥' },
    { name: 'Business', icon: '💼' },
    { name: 'Interior', icon: '🏠' },
  ];

  const courses = [
    {
      title: 'CCNA 2020 200-125 Video Boot Camp',
      category: 'IT & Software',
      students: 9530,
      rating: 4.8,
      bgColor: 'bg-secondary'
    },
    {
      title: 'Powerful Business Writing',
      category: 'Business',
      students: 1463,
      rating: 4.9,
      bgColor: 'bg-peach'
    },
    {
      title: 'Certified Six Sigma Yellow Belt Training',
      category: 'Media Training',
      students: 6726,
      rating: 4.9,
      bgColor: 'bg-purple'
    },
    {
      title: 'How to Design a Room in 10 Easy Steps',
      category: 'Interior',
      students: 8735,
      rating: 5.0,
      bgColor: 'bg-accent'
    }
  ];

  return (
    <div className="min-h-screen bg-primary">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-5xl font-bold">Invest in your education</h1>
          <div className="flex gap-4 items-center">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <FiBell className="w-6 h-6" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <FiSettings className="w-6 h-6" />
            </button>
            <button 
              onClick={() => auth.signOut()}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              Sign Out
            </button>
          </div>
        </div>

        <div className="flex gap-4 mb-8 overflow-x-auto">
          {categories.map((category, index) => (
            <button
              key={index}
              className={`px-4 py-2 rounded-full flex items-center gap-2 ${
                index === 0 ? 'bg-black text-white' : 'bg-white'
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        <h2 className="text-xl font-semibold mb-4">Most popular</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((course, index) => (
            <CourseCard key={index} {...course} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
