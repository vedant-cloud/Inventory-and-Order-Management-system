import { useState, useEffect } from 'react';
import api from '../api.js';
import { useToast } from '../context/ToastContext.jsx';
import OrderModal from '../components/OrderModal.jsx';

export default function Orders() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => { fetchAllData(); }, []);

  const fetchAllData = async () => {
    try {
      // Fetch all three datasets concurrently for speed
      const [ordersRes, customersRes, productsRes] = await Promise.all([
        api.get('/orders'), api.get('/customers'), api.get('/products')
      ]);
      setOrders(ordersRes.data);
      setCustomers(customersRes.data);
      setProducts(productsRes.data);
    } catch (error) {
      showToast(error, 'error');
    } finally { setIsLoading(false); }
  };

  const handleCreateOrder = async (orderData) => {
    try {
      await api.post('/orders', orderData);
      showToast('Order placed successfully!');
      setIsModalOpen(false);
      fetchAllData(); // Refresh everything because product stock just decreased!
    } catch (error) {
      showToast(error, 'error'); // Catches "Insufficient inventory" from backend
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this order? The inventory will be restored.")) return;
    try {
      await api.delete(`/orders/${id}`);
      showToast('Order canceled and inventory restored!');
      fetchAllData();
    } catch (error) { showToast(error, 'error'); }
  };

  // Helper functions to map IDs to actual names for the UI
  const getCustomerDetails = (id) => {
    const c = customers.find(c => c.id === id);
    if (!c) return 'Deleted Customer';
    return `CUST-${c.id.toString().padStart(4, '0')} - ${c.full_name}`;
  };
  const getProductName = (id) => products.find(p => p.id === id)?.name || 'Deleted Product';

  if (isLoading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading orders...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Order Management</h2>
        <button onClick={() => setIsModalOpen(true)} className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg font-bold shadow-sm transition-transform hover:-translate-y-0.5">
          + Place Order
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-600 font-bold">
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Qty</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-500">No orders placed yet.</td></tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} className="hover:bg-purple-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-sm font-bold text-gray-500">#{o.id}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">{getCustomerDetails(o.customer_id)}</td>
                    <td className="px-6 py-4 text-gray-700">{getProductName(o.product_id)}</td>
                    <td className="px-6 py-4 font-bold text-gray-700">{o.quantity}</td>
                    <td className="px-6 py-4 font-bold text-green-700">${o.total_amount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleDelete(o.id)} className="text-red-600 hover:text-red-900 font-bold text-sm">Cancel Order</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <OrderModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCreateOrder} 
        customers={customers}
        products={products}
      />
    </div>
  );
}