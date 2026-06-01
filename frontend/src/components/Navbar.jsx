import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  const getLinkClass = (path) => {
    const baseClass = "transition-colors font-medium text-sm sm:text-base ";
    return location.pathname === path 
      ? baseClass + "text-blue-600 border-b-2 border-blue-600 pb-1" 
      : baseClass + "text-gray-600 hover:text-blue-600";
  };

  return (
    <nav className="bg-white shadow-sm border-b px-6 py-4 mb-8 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-xl font-bold text-blue-600 tracking-wide">
          Inventory Manager
        </h1>
        <div className="flex space-x-6">
          <Link to="/" className={getLinkClass('/')}>Dashboard</Link>
          <Link to="/products" className={getLinkClass('/products')}>Products</Link>
          <Link to="/customers" className={getLinkClass('/customers')}>Customers</Link>
          <Link to="/orders" className={getLinkClass('/orders')}>Orders</Link>
        </div>
      </div>
    </nav>
  );
}