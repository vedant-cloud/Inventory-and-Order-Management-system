export default function Toast({ message, type, onClose }) {
  if (!message) return null;

  const isError = type === 'error';
  const bgColor = isError ? 'bg-red-50 border-red-500 text-red-800' : 'bg-green-50 border-green-500 text-green-800';

  return (
    <div className={`fixed bottom-4 right-4 px-6 py-4 border-l-4 rounded shadow-lg ${bgColor} z-50 flex justify-between items-center min-w-[300px] animate-fade-in-up`}>
      <p className="font-medium text-sm">{message}</p>
      <button onClick={onClose} className="ml-4 opacity-70 hover:opacity-100 font-bold">
        ✕
      </button>
    </div>
  );
}