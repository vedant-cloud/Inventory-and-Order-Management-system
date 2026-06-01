import { useState, useEffect } from 'react';

export default function ProductModal({ isOpen, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState({ name: '', sku: '', price: '', quantity: '' });

  useEffect(() => {
    if (initialData) setFormData({ ...initialData });
    else setFormData({ name: '', sku: '', price: '', quantity: '' });
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity, 10)
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-bold text-gray-900">{initialData ? 'Edit Product' : 'Add New Product'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 text-2xl leading-none">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Product Name</label>
            <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">SKU (Unique Code)</label>
            <input required type="text" value={formData.sku} onChange={(e) => setFormData({...formData, sku: e.target.value.toUpperCase()})} className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50" disabled={!!initialData} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Price ($)</label>
              <input required type="number" step="0.01" min="0.01" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Stock</label>
              <input required type="number" min="0" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>
          </div>
          <div className="pt-6 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 font-bold hover:bg-gray-100 rounded-lg">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm">
              {initialData ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}