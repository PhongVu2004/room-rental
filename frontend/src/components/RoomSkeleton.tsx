export default function RoomSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow border border-gray-100 animate-pulse">
      <div className="h-48 bg-gray-200"></div>
      <div className="p-5">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-1/3 mt-4"></div>
      </div>
    </div>
  );
}
