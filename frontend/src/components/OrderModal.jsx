import { useState, useEffect } from 'react';

export default function OrderModal({ isOpen, onClose, onSubmit, customers, products }) {
  const [formData, setFormData] = useState({ customer_id: '', product_id: '', quantity: 1 });

  // Reset form when opened
  useEffect(() => {
    setFormData({ customer_id: '', product_id: '', quantity: 1 });
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Parse to integers to perfectly match the backend Pydantic schema
    onSubmit({
      customer_id: parseInt(formData.customer_id, 10),
      product_id: parseInt(formData.product_id, 10),
      quantity: parseInt(formData.quantity, 10)
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-bold text-gray-900">Create New Order</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 text-2xl leading-none">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Select Customer</label>
            <select 
              required 
              value={formData.customer_id} 
              onChange={(e) => setFormData({...formData, customer_id: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
            >
              <option value="" disabled>-- Choose a customer --</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>CUST-{c.id.toString().padStart(4, '0')} - {c.full_name} ({c.email})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Select Product</label>
            <select 
              required 
              value={formData.product_id} 
              onChange={(e) => setFormData({...formData, product_id: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
            >
              <option value="" disabled>-- Choose a product --</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name} - ${p.price.toFixed(2)} (In Stock: {p.quantity})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Quantity</label>
            <input 
              required 
              type="number" 
              min="1" 
              value={formData.quantity} 
              onChange={(e) => setFormData({...formData, quantity: e.target.value})} 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
            />
          </div>
          
          <div className="pt-6 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 font-bold hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-colors shadow-sm">
              Place Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}