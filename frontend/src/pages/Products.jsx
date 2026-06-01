import { useState, useEffect } from 'react';
import api from '../api.js';
import { useToast } from '../context/ToastContext.jsx';
import ProductModal from '../components/ProductModal.jsx';

export default function Products() {
  const { showToast } = useToast();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      showToast(error, 'error');
    } finally { setIsLoading(false); }
  };

  const handleSaveProduct = async (productData) => {
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, productData);
        showToast('Product updated successfully!');
      } else {
        await api.post('/products', productData);
        showToast('Product added successfully!');
      }
      setIsModalOpen(false);
      fetchProducts(); 
    } catch (error) {
      showToast(error, 'error'); 
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      showToast('Product deleted successfully!');
      fetchProducts();
    } catch (error) { showToast(error, 'error'); }
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading inventory...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Product Management</h2>
        <button onClick={() => { setEditingProduct(null); setIsModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-bold">
          + Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-600 font-bold">
              <th className="px-6 py-4">SKU</th><th className="px-6 py-4">Name</th><th className="px-6 py-4">Price</th><th className="px-6 py-4">Stock</th><th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.length === 0 ? (
              <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-500">No products found. Start by adding one!</td></tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="hover:bg-blue-50/50">
                  <td className="px-6 py-4 font-mono text-sm">{p.sku}</td>
                  <td className="px-6 py-4 font-bold">{p.name}</td>
                  <td className="px-6 py-4">${p.price.toFixed(2)}</td>
                  <td className="px-6 py-4">{p.quantity}</td>
                  <td className="px-6 py-4 text-right space-x-4">
                    <button onClick={() => { setEditingProduct(p); setIsModalOpen(true); }} className="text-blue-600 font-bold">Edit</button>
                    <button onClick={() => handleDelete(p.id)} className="text-red-600 font-bold">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleSaveProduct} initialData={editingProduct} />
    </div>
  );
}
