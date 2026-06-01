import { useState, useEffect } from 'react';
import api from '../api.js';
import { useToast } from '../context/ToastContext.jsx';
import CustomerModal from '../components/CustomerModal.jsx';

export default function Customers() {
  const { showToast } = useToast();
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  useEffect(() => { fetchCustomers(); }, []);

  const fetchCustomers = async () => {
    try {
      const response = await api.get('/customers');
      setCustomers(response.data);
    } catch (error) {
      showToast(error, 'error');
    } finally { setIsLoading(false); }
  };

  const handleSaveCustomer = async (customerData) => {
    try {
      if (editingCustomer) {
        await api.put(`/customers/${editingCustomer.id}`, customerData);
        showToast('Customer updated successfully!');
      } else {
        await api.post('/customers', customerData);
        showToast('Customer added successfully!');
      }
      setIsModalOpen(false);
      fetchCustomers(); 
    } catch (error) {
      showToast(error, 'error'); // Catches duplicate email errors!
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    try {
      await api.delete(`/customers/${id}`);
      showToast('Customer deleted successfully!');
      fetchCustomers();
    } catch (error) { showToast(error, 'error'); }
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading customers...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Customer Management</h2>
        <button onClick={() => { setEditingCustomer(null); setIsModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-bold shadow-sm transition-transform hover:-translate-y-0.5">
          + Add Customer
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-600 font-bold">
                <th className="px-6 py-4">Cust ID</th> {/* <--- NEW COLUMN */}
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {customers.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-500">No customers found. Add your first customer!</td></tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id} className="hover:bg-blue-50/50 transition-colors">
                    {/* NEW DATA CELL: Formats integer 1 to "CUST-0001" */}
                    <td className="px-6 py-4 font-mono text-sm font-bold text-gray-500 bg-gray-50/30">
                      CUST-{c.id.toString().padStart(4, '0')}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">{c.full_name}</td>
                    <td className="px-6 py-4 text-gray-600">{c.email}</td>
                    <td className="px-6 py-4 text-gray-600">{c.phone_number}</td>
                    <td className="px-6 py-4 text-right space-x-4 text-sm">
                      <button onClick={() => { setEditingCustomer(c); setIsModalOpen(true); }} className="text-blue-600 hover:text-blue-900 font-bold">Edit</button>
                      <button onClick={() => handleDelete(c.id)} className="text-red-600 hover:text-red-900 font-bold">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CustomerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleSaveCustomer} initialData={editingCustomer} />
    </div>
  );
}