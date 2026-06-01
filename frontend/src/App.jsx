import { Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-sm border-b px-6 py-4 mb-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between">
          <h1 className="text-xl font-bold text-blue-600 tracking-wide mb-4 sm:mb-0">
            InventoryManager Pro
          </h1>
          <div className="flex space-x-6 font-medium text-gray-600">
            <Link to="/" className="hover:text-blue-600 transition-colors">Dashboard</Link>
            <Link to="/products" className="hover:text-blue-600 transition-colors">Products</Link>
            <Link to="/customers" className="hover:text-blue-600 transition-colors">Customers</Link>
            <Link to="/orders" className="hover:text-blue-600 transition-colors">Orders</Link>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 pb-12">
        <Routes>
          <Route path="/" element={<h2 className="text-3xl font-bold">Dashboard Overview</h2>} />
          <Route path="/products" element={<h2 className="text-3xl font-bold">Product Management</h2>} />
          <Route path="/customers" element={<h2 className="text-3xl font-bold">Customer Management</h2>} />
          <Route path="/orders" element={<h2 className="text-3xl font-bold">Order Management</h2>} />
        </Routes>
      </main>
      
    </div>
  );
}

export default App;