export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-400 to-blue-600/40">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 shadow-lg"></div>
      <p className="ml-3 text-gray-700">Loading...</p>
    </div>
  );
}
