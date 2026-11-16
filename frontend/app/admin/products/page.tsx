'use client';

import React, { useState, useEffect, Suspense } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminApi } from '@/lib/admin-api';
import {
  ShoppingBag,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Eye,
  Tag,
  DollarSign,
  Package,
  Sparkles,
  Loader2,
} from 'lucide-react';

function ProductsContent() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [productCategory, setProductCategory] = useState('Rudraksha');
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState('50');

  useEffect(() => {
    loadProducts();
  }, [category]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getProducts({ category: category === 'all' ? undefined : category, search });
      if (res?.data) {
        setProducts(res.data);
      }
    } catch (e) {
      console.warn('Products load error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setName('');
    setPrice('');
    setProductCategory('Rudraksha');
    setDescription('');
    setStock('50');
    setModalOpen(true);
  };

  const handleOpenEdit = (p: any) => {
    setEditingProduct(p);
    setName(p.name);
    setPrice(String(p.price));
    setProductCategory(p.category || 'Rudraksha');
    setDescription(p.description || '');
    setStock(String(p.stockQuantity || 50));
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id
            ? { ...p, name, price: parseFloat(price) || p.price, category: productCategory, description, stockQuantity: parseInt(stock, 10) }
            : p
        )
      );
    } else {
      const newProd = {
        id: `prod_${Date.now()}`,
        sku: `JV-SKU-${Math.floor(1000 + Math.random() * 9000)}`,
        name,
        price: parseFloat(price) || 999,
        category: productCategory,
        description,
        stockQuantity: parseInt(stock, 10) || 50,
        isActive: true,
        salesCount: 0,
      };
      setProducts([newProd, ...products]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string | number) => {
    if (confirm('Are you sure you want to deactivate this product?')) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  return (
    <AdminLayout
      title="Vedic Shop Products & Inventory"
      subtitle="Manage consecrated Rudrakshas, Yantras, Gemstones, Pooja sets & astrological remedies"
    >
      <div className="space-y-6">
        {/* Top Controls */}
        <div className="bg-[#141021] border border-[#2B233F] rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#786C60] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products by title or SKU..."
              className="w-full bg-[#0D0B16] border border-[#2B233F] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-[#786C60] focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-[#9F96B2]">Category:</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-[#0D0B16] border border-[#2B233F] text-xs text-white px-3 py-2 rounded-xl focus:outline-none focus:border-amber-500"
              >
                <option value="all">All Categories</option>
                <option value="Rudraksha">Rudraksha</option>
                <option value="Yantra">Yantra</option>
                <option value="Gemstones">Gemstones</option>
                <option value="Mala">Mala</option>
                <option value="Books">Vedic Books</option>
              </select>
            </div>

            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl flex items-center space-x-1 shadow-lg shadow-amber-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
          </div>
        </div>

        {/* Product Cards Table */}
        <div className="bg-[#141021] border border-[#2B233F] rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-[#261E38] flex items-center justify-between">
            <h3 className="font-serif font-bold text-sm text-white">Product Catalog ({products.length})</h3>
            <span className="text-xs text-[#9F96B2]">Pran Pratishtha Energized Remedia</span>
          </div>

          {loading ? (
            <div className="p-12 flex flex-col items-center justify-center text-amber-400 space-y-2">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-xs">Loading Vedic catalogue...</span>
            </div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center text-xs text-[#9F96B2]">No products found in this category.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#E5DFD7]">
                <thead className="bg-[#0D0B16] border-b border-[#261E38] text-[11px] uppercase tracking-wider text-[#9F96B2]">
                  <tr>
                    <th className="py-3 px-4">Item &amp; Details</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price (INR)</th>
                    <th className="py-3 px-4">Inventory Stock</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#261E38]/60">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-amber-500/5 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{p.name}</div>
                        <div className="text-[10px] text-[#9F96B2] font-mono mt-0.5">SKU: {p.sku || p.id}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                          {p.category || 'Remedy'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                        ₹{(p.price || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-white font-semibold">{p.stockQuantity || 45} units</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center space-x-1 text-[11px] text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>Active / Published</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="px-2.5 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-lg text-xs inline-flex items-center space-x-1 transition-all"
                        >
                          <Edit className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="px-2.5 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg text-xs inline-flex items-center space-x-1 transition-all"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add/Edit Product Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs">
            <form onSubmit={handleSave} className="bg-[#141021] border border-[#2B233F] rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-[#261E38]">
                <h3 className="font-serif font-bold text-base text-white">
                  {editingProduct ? 'Edit Product Details' : 'Add New Vedic Store Item'}
                </h3>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#0D0B16] text-[#9F96B2] hover:text-white flex items-center justify-center border border-[#2B233F]"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[#9F96B2] mb-1 font-semibold">Product Title</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. 5-Mukhi Nepali Rudraksha Mala"
                    className="w-full bg-[#0D0B16] border border-[#2B233F] rounded-xl px-3 py-2 text-white placeholder-[#786C60] focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#9F96B2] mb-1 font-semibold">Price (₹ INR)</label>
                    <input
                      type="number"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="999"
                      className="w-full bg-[#0D0B16] border border-[#2B233F] rounded-xl px-3 py-2 text-white placeholder-[#786C60] focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[#9F96B2] mb-1 font-semibold">Category</label>
                    <select
                      value={productCategory}
                      onChange={(e) => setProductCategory(e.target.value)}
                      className="w-full bg-[#0D0B16] border border-[#2B233F] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="Rudraksha">Rudraksha</option>
                      <option value="Yantra">Yantra</option>
                      <option value="Gemstones">Gemstones</option>
                      <option value="Mala">Mala</option>
                      <option value="Books">Vedic Books</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[#9F96B2] mb-1 font-semibold">Available Stock Quantity</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="50"
                    className="w-full bg-[#0D0B16] border border-[#2B233F] rounded-xl px-3 py-2 text-white placeholder-[#786C60] focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[#9F96B2] mb-1 font-semibold">Description &amp; Vedic Consecration Notes</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Authentic consecrated product energized with Vedic mantras..."
                    className="w-full bg-[#0D0B16] border border-[#2B233F] rounded-xl px-3 py-2 text-white placeholder-[#786C60] focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-[#0D0B16] text-[#9F96B2] hover:text-white rounded-xl text-xs font-semibold border border-[#2B233F]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-amber-400 text-xs">Loading Products...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
