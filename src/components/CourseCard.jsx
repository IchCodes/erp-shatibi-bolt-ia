import React from 'react';

function CourseCard({ title, category, students, rating, bgColor }) {
  return (
    <div className={`course-card ${bgColor}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm">{category}</span>
        <div className="flex items-center gap-1 bg-white rounded-full px-2 py-1">
          <span>⭐</span>
          <span className="text-sm">{rating}</span>
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{students.toLocaleString()} students</p>
    </div>
  );
}

export default CourseCard;
