import PointageCoursActuel from "../PointageCoursActuel";

export default function Attendance() {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-8 shadow-lg">
      Section Présences
      <PointageCoursActuel />
    </div>
  );
} 