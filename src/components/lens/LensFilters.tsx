export function LensFilters() {
  return (
    <div className="p-4 bg-gray-800 rounded-lg mb-4">
      <h2 className="text-xl font-bold mb-2 text-white">Filter Your LENS Feed</h2>
      {/* Placeholder for filter options */}
      <div className="flex space-x-2">
        <button className="px-3 py-1 bg-blue-600 text-white rounded-md">Trending</button>
        <button className="px-3 py-1 bg-gray-700 text-gray-300 rounded-md">Following</button>
        <button className="px-3 py-1 bg-gray-700 text-gray-300 rounded-md">Categories</button>
      </div>
    </div>
  );
}


