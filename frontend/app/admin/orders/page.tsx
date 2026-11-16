'use client';

import React, { useState, useEffect, Suspense } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminApi } from '@/lib/admin-api';
import {
  Package,
  Search,
  Filter,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  MapPin,
  ExternalLink,
  DollarSign,
  Loader2,
} from 'lucide-react';

function OrdersContent() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  useEffect(() => {
    loadOrders();
  }, [status]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getOrders({ status: status === 'all' ? undefined : status, search });
      if (res?.data) {
        setOrders(res.data);
      }
    } catch (e) {
      console.warn('Orders load error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setOrders(orders.map((o) => (o.id === id ? { ...o, orderStatus: newStatus } : o)));
    if (selectedOrder?.id === id) {
      setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
    }
  };

  return (
    <AdminLayout
      title="Shop Orders &amp; Fulfillment"
      subtitle="Track customer shipments, dispatch consecrated parcels &amp; monitor payment statuses"
    >
      <div className="space-y-6">
        {/* Filters */}
        <div className="bg-[#141021] border border-[#2B233F] rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#786C60] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order #, customer, phone..."
              className="w-full bg-[#0D0B16] border border-[#2B233F] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-[#786C60] focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center space-x-2 w-full md:w-auto">
            <span className="text-xs text-[#9F96B2]">Status:</span>
            {['all', 'processing', 'shipped', 'delivered', 'pending'].map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium uppercase text-[10px] tracking-wider transition-colors ${
                  status === s
                    ? 'bg-amber-500 text-black font-bold'
                    : 'bg-[#0D0B16] text-[#9F96B2] hover:text-white border border-[#2B233F]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-[#141021] border border-[#2B233F] rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-[#261E38] flex items-center justify-between">
            <h3 className="font-serif font-bold text-sm text-white">Customer Orders ({orders.length})</h3>
            <span className="text-xs text-[#9F96B2]">Real-time Store Purchases</span>
          </div>

          {loading ? (
            <div className="p-12 flex flex-col items-center justify-center text-amber-400 space-y-2">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-xs">Loading orders...</span>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center text-xs text-[#9F96B2]">No orders found for this status.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#E5DFD7]">
                <thead className="bg-[#0D0B16] border-b border-[#261E38] text-[11px] uppercase tracking-wider text-[#9F96B2]">
                  <tr>
                    <th className="py-3 px-4">Order # / Date</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Items</th>
                    <th className="py-3 px-4">Total Amount</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4">Fulfillment</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#261E38]/60">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-amber-500/5 transition-colors">
                      <td className="py-3.5 px-4 font-mono">
                        <div className="font-bold text-amber-300">{o.orderNumber}</div>
                        <div className="text-[10px] text-[#9F96B2] mt-0.5">
                          {new Date(o.placedAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{o.customerName}</div>
                        <div className="text-[11px] text-[#9F96B2]">{o.shippingAddress?.city}, {o.shippingAddress?.state}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="truncate max-w-[200px] text-white">
                          {o.items.map((it: any) => `${it.quantity}x ${it.name}`).join(', ')}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                        ₹{o.totalAmount?.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            o.paymentStatus === 'paid'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {o.paymentStatus.toUpperCase()} ({o.paymentMethod})
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            o.orderStatus === 'delivered'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : o.orderStatus === 'shipped'
                              ? 'bg-blue-500/20 text-blue-300'
                              : o.orderStatus === 'processing'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-gray-500/20 text-gray-300'
                          }`}
                        >
                          {o.orderStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(o)}
                          className="px-3 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-semibold inline-flex items-center space-x-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs">
            <div className="bg-[#141021] border border-[#2B233F] rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-[#261E38]">
                <div>
                  <h3 className="font-serif font-bold text-base text-white">
                    Order {selectedOrder.orderNumber}
                  </h3>
                  <p className="text-xs text-[#9F96B2]">Placed by {selectedOrder.customerName}</p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-8 h-8 rounded-full bg-[#0D0B16] text-[#9F96B2] hover:text-white flex items-center justify-center border border-[#2B233F]"
                >
                  ✕
                </button>
              </div>

              {/* Status Selector */}
              <div className="bg-[#0D0B16] p-3.5 rounded-xl border border-[#261E38] flex items-center justify-between text-xs">
                <span className="text-[#9F96B2] font-semibold">Change Delivery Status:</span>
                <div className="flex items-center space-x-1">
                  {['processing', 'shipped', 'delivered'].map((st) => (
                    <button
                      key={st}
                      onClick={() => handleUpdateStatus(selectedOrder.id, st)}
                      className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${
                        selectedOrder.orderStatus === st
                          ? 'bg-amber-500 text-black'
                          : 'bg-[#141021] text-[#9F96B2] hover:text-white border border-[#2B233F]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-2 text-xs">
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Ordered Items</span>
                <div className="bg-[#0D0B16] rounded-xl border border-[#261E38] divide-y divide-[#261E38] p-3">
                  {selectedOrder.items.map((it: any, i: number) => (
                    <div key={i} className="py-2 first:pt-0 last:pb-0 flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">{it.name}</div>
                        <div className="text-[10px] text-[#9F96B2]">Qty: {it.quantity}</div>
                      </div>
                      <div className="font-mono font-bold text-emerald-400">₹{it.price * it.quantity}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-[#0D0B16] p-3 rounded-xl border border-[#261E38] text-xs space-y-1">
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">Shipping Address</span>
                <div className="text-white font-semibold">{selectedOrder.shippingAddress?.fullName}</div>
                <div className="text-[#9F96B2]">
                  {selectedOrder.shippingAddress?.addressLine1}, {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode}
                </div>
                <div className="text-[#9F96B2] pt-1">Phone: {selectedOrder.customerPhone}</div>
                {selectedOrder.trackingNumber && (
                  <div className="text-amber-300 font-mono text-[11px] pt-1 flex items-center space-x-1">
                    <Truck className="w-3.5 h-3.5" />
                    <span>Tracking: {selectedOrder.trackingNumber}</span>
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="p-8 text-amber-400 text-xs">Loading Orders...</div>}>
      <OrdersContent />
    </Suspense>
  );
}
