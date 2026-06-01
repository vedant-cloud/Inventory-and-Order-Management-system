import { useState, useEffect } from 'react';
import api from '../api.js';
import { useToast } from '../context/ToastContext.jsx';
import LowStockModal from '../components/LowStockModal.jsx';

export default function Dashboard() {
  const { showToast } = useToast();
  const [stats, setStats] = useState({
    totalProducts: 0, totalCustomers: 0, totalOrders: 0, lowStockCount: 0, lowStockItems: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        lowStockItems: lowStock
      });
    } catch (err) {
      showToast(err, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading System Data...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">System Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Products" value={stats.totalProducts} color="bg-blue-50 text-blue-700 border-blue-100" />
        <StatCard title="Total Customers" value={stats.totalCustomers} color="bg-emerald-50 text-emerald-700 border-emerald-100" />
        <StatCard title="Total Orders" value={stats.totalOrders} color="bg-purple-50 text-purple-700 border-purple-100" />
        
        {/* This card passes the onClick function down to the helper below */}
        <StatCard 
          title="Low Stock Alerts" 
          value={stats.lowStockCount} 
          color="bg-red-50 text-red-700 border-red-100"
          onClick={() => {
            if (stats.lowStockCount > 0) setIsModalOpen(true);
            else showToast("All products have healthy stock levels!", "success");
          }}
        />
      </div>

      <LowStockModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        items={stats.lowStockItems} 
      />
    </div>
  );
}

// ==========================================
// THE FIX IS HERE: The StatCard component now accepts and uses 'onClick'
// ==========================================
function StatCard({ title, value, color, onClick }) {
  // If onClick exists, add hover animations and a pointer cursor
  const interactiveClasses = onClick ? "cursor-pointer hover:shadow-md hover:scale-105 transition-all" : "";
  
  return (
    <div onClick={onClick} className={`${color} border rounded-xl p-6 shadow-sm ${interactiveClasses}`}>
      <div className="flex justify-between items-start">
        <h3 className="text-sm font-bold uppercase tracking-wider opacity-80">{title}</h3>
        {/* If onClick exists, show a little "View" badge */}
        {onClick && <span className="text-xs bg-white/50 px-2 py-1 rounded border border-current opacity-70 font-bold">View</span>}
      </div>
      <p className="mt-2 text-4xl font-black">{value}</p>
    </div>
  );
}