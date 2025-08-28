export function Skeleton() {
  return (
    <div className="animate-pulse bg-gray-700 rounded-md">
      <div className="h-48 w-full rounded-t-md bg-gray-600"></div>
      <div className="p-4">
        <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-600 rounded w-1/2"></div>
      </div>
    </div>
  );
}


