export default function LowStockModal({ isOpen, onClose, items }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in-up flex flex-col max-h-[80vh]">
        <div className="px-6 py-4 border-b border-red-100 flex justify-between items-center bg-red-50">
          <h3 className="text-lg font-bold text-red-900">Low Stock Inventory ({items.length} Items)</h3>
          <button onClick={onClose} className="text-red-400 hover:text-red-900 text-2xl leading-none">&times;</button>
        </div>
        
        {/* Scrollable list area */}
        <div className="overflow-y-auto p-0">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-white shadow-sm">
              <tr className="border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-bold">
                <th className="px-6 py-3">SKU</th>
                <th className="px-6 py-3">Product Name</th>
                <th className="px-6 py-3 text-right">Current Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map(item => (
                <tr key={item.id} className="hover:bg-red-50/30">
                  <td className="px-6 py-4 font-mono text-sm text-gray-600">{item.sku}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">{item.name}</td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold border bg-red-50 text-red-700 border-red-200">
                      {item.quantity} left
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-lg transition-colors">
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
}