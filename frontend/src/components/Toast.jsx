export default function Toast({ message, type, onClose }) {
  if (!message) return null;

  const bgColor = type === 'error' ? 'bg-red-100 border-red-500 text-red-700' : 'bg-green-100 border-green-500 text-green-700';

  return (
    <div className={`fixed bottom-4 right-4 px-6 py-4 border-l-4 rounded shadow-lg ${bgColor} transition-all duration-300 z-50 flex justify-between items-center min-w-[300px]`}>
      <p className="font-medium">{message}</p>
      <button onClick={onClose} className="ml-4 text-gray-500 hover:text-gray-900 font-bold">
        ✕
      </button>
    </div>
  );
}