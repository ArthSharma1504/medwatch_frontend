export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md text-center">
        <h1 className="text-2xl font-bold mb-2 text-red-600">Access Denied</h1>
        <p className="text-gray-700">You do not have permission to view this page.</p>
      </div>
    </div>
  );
}
