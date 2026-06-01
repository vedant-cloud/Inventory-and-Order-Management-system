import { useState, useEffect } from 'react';
import api from '../api.js';
import { useToast } from '../context/ToastContext.jsx';

export default function Dashboard() {
  const { showToast } = useToast();
  const [stats, setStats] = useState({
    totalProducts: 0, totalCustomers: 0, totalOrders: 0, lowStockCount: 0, lowStockItems: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async () => {
    try {
      const [productsRes, customersRes, ordersRes] = await Promise.all([
        api.get('/products'), api.get('/customers'), api.get('/orders')
      ]);

      const products = productsRes.data;
      const lowStock = products.filter(p => p.quantity < 5);

      setStats({
        totalProducts: products.length,
        totalCustomers: customersRes.data.length,
        totalOrders: ordersRes.data.length,
        lowStockCount: lowStock.length,
        lowStockItems: lowStock.slice(0, 5)
      });
    } catch (err) {
      showToast(err, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading System Data...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">System Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Products" value={stats.totalProducts} color="bg-blue-50 text-blue-700 border-blue-100" />
        <StatCard title="Total Customers" value={stats.totalCustomers} color="bg-emerald-50 text-emerald-700 border-emerald-100" />
        <StatCard title="Total Orders" value={stats.totalOrders} color="bg-purple-50 text-purple-700 border-purple-100" />
        <StatCard title="Low Stock Alerts" value={stats.lowStockCount} color="bg-red-50 text-red-700 border-red-100" />
      </div>
    </div>
  );
}

function StatCard({ title, value, color }) {
  return (
    <div className={`${color} border rounded-lg p-6 shadow-sm`}>
      <h3 className="text-sm font-bold uppercase tracking-wider opacity-80">{title}</h3>
      <p className="mt-2 text-4xl font-black">{value}</p>
    </div>
  );
}