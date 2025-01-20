import React from 'react';
import { FiGrid, FiHome, FiBook, FiSettings, FiBell } from 'react-icons/fi';
import CourseCard from './components/CourseCard';
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();

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
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-5xl font-bold text-center sm:text-left">Invest in your education</h1>
          <div className="flex gap-4 items-center">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <FiBell className="w-6 h-6" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <FiSettings className="w-6 h-6" />
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Se connecter
            </button>
          </div>
        </div>

        <div className="flex gap-2 sm:gap-4 mb-6 sm:mb-8 overflow-x-auto pb-2">
          {categories.map((category, index) => (
            <button
              key={index}
              className={`px-3 sm:px-4 py-2 rounded-full flex items-center gap-2 whitespace-nowrap ${
                index === 0 ? 'bg-black text-white' : 'bg-white'
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        <h2 className="text-lg sm:text-xl font-semibold mb-4">Most popular</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {courses.map((course, index) => (
            <CourseCard key={index} {...course} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
