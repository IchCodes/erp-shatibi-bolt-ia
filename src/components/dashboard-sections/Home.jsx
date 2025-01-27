export default function Home({ userName }) {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-8 shadow-lg">
      <h2 className="text-lg sm:text-xl font-semibold mb-4">
        Bienvenue {userName ? userName : "sur votre espace personnel"}
      </h2>
    </div>
  );
} 