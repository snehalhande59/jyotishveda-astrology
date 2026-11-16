'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import Modal from '@/components/admin/Modal';
import { adminApi } from '@/lib/admin-api';
import {
  Sparkles,
  PlusCircle,
  Search,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Star,
  Clock,
  Phone,
  Mail,
  RotateCw,
  AlertCircle,
  Power,
  Loader2,
} from 'lucide-react';

function AstrologersManagementContent() {
  const searchParams = useSearchParams();
  const [astrologers, setAstrologers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAstrologer, setEditingAstrologer] = useState<any | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    email: '',
    phone: '',
    experienceYears: 10,
    specialties: 'Kundli Analysis, Career, Marriage',
    languages: 'English, Marathi, Hindi',
    consultationFee: 1200,
    perMinuteRate: 25,
    bio: '',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300',
    availableSlots: '10:00 AM, 02:00 PM, 05:00 PM, 07:00 PM',
    isOnline: true,
    isActive: true,
    isFeatured: false,
  });

  const loadAstrologers = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getAstrologers({ search, status: statusFilter !== 'all' ? statusFilter : undefined });
      if (res && res.data) {
        setAstrologers(res.data);
      }
    } catch (err: any) {
      console.warn('Astrologers API fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAstrologers();
  }, [search, statusFilter]);

  useEffect(() => {
    const q = searchParams?.get('search');
    if (q) {
      setSearch(q);
    }
    const status = searchParams?.get('status');
    if (status) {
      setStatusFilter(status);
    }
    if (searchParams?.get('action') === 'new') {
      handleOpenCreate();
    }
  }, [searchParams]);

  const handleOpenCreate = () => {
    setEditingAstrologer(null);
    setFormData({
      name: '',
      title: 'Certified Vedic Astrologer & Jyotish Acharya',
      email: '',
      phone: '',
      experienceYears: 12,
      specialties: 'Kundli Matching, Career Transitions, Vedic Remedies',
      languages: 'Marathi, Hindi, English',
      consultationFee: 1499,
      perMinuteRate: 25,
      bio: 'Scholar of classical Parashara astrology with dedicated focus on client empowerment and accurate transit timing.',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300',
      availableSlots: '10:00 AM, 02:00 PM, 05:00 PM, 07:00 PM',
      isOnline: true,
      isActive: true,
      isFeatured: false,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (astro: any) => {
    setEditingAstrologer(astro);
    const toCsv = (val: any) => (Array.isArray(val) ? val.join(', ') : val || '');
    setFormData({
      name: astro.name || '',
      title: astro.title || '',
      email: astro.email || '',
      phone: astro.phone || '',
      experienceYears: astro.experienceYears || 10,
      specialties: toCsv(astro.specialties),
      languages: toCsv(astro.languages),
      consultationFee: astro.consultationFee || 1000,
      perMinuteRate: astro.perMinuteRate || 25,
      bio: astro.bio || '',
      avatarUrl: astro.avatarUrl || '',
      availableSlots: toCsv(astro.availableSlots),
      isOnline: astro.isOnline !== false,
      isActive: astro.isActive !== false,
      isFeatured: Boolean(astro.isFeatured),
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleToggleOnline = async (astro: any) => {
    try {
      const next = !astro.isOnline;
      await adminApi.updateAstrologer(astro.id, { isOnline: next });
      setAstrologers((prev) => prev.map((a) => (a.id === astro.id ? { ...a, isOnline: next } : a)));
    } catch (err: any) {
      alert('Failed to toggle status: ' + err.message);
    }
  };

  const handleToggleActive = async (astro: any) => {
    try {
      const next = astro.isActive === false ? true : false;
      await adminApi.updateAstrologer(astro.id, { isActive: next });
      setAstrologers((prev) => prev.map((a) => (a.id === astro.id ? { ...a, isActive: next } : a)));
    } catch (err: any) {
      alert('Failed to update publication status: ' + err.message);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete astrologer "${name}"? This action cannot be undone.`)) {
      return;
    }
    try {
      await adminApi.deleteAstrologer(id);
      setAstrologers((prev) => prev.filter((a) => a.id !== id));
    } catch (err: any) {
      alert('Failed to delete astrologer: ' + err.message);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.title.trim()) {
      setFormError('Name and Professional Title are required');
      return;
    }

    setFormLoading(true);
    setFormError(null);

    try {
      const payload = {
        ...formData,
        experienceYears: Number(formData.experienceYears) || 5,
        consultationFee: Number(formData.consultationFee) || 1000,
        perMinuteRate: Number(formData.perMinuteRate) || 25,
        specialties: formData.specialties.split(',').map((s) => s.trim()).filter(Boolean),
        languages: formData.languages.split(',').map((s) => s.trim()).filter(Boolean),
        availableSlots: formData.availableSlots.split(',').map((s) => s.trim()).filter(Boolean),
      };

      if (editingAstrologer) {
        await adminApi.updateAstrologer(editingAstrologer.id, payload);
      } else {
        await adminApi.createAstrologer(payload);
      }

      setIsModalOpen(false);
      loadAstrologers();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save astrologer');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <AdminLayout
      title="Astrologer Roster Management"
      subtitle="Add, modify, publish, and control online status for all verified scholars"
    >
      {/* Controls Bar */}
      <div className="bg-[#141021] border border-[#2B233F] rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#7A7091] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name, title, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-[#0C0A14] border border-[#2B233F] rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-[#0C0A14] border border-[#2B233F] rounded-xl text-xs text-white focus:outline-none"
          >
            <option value="all">All Astrologers</option>
            <option value="online">Online Only</option>
            <option value="offline">Offline Only</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={loadAstrologers}
            className="p-2 rounded-xl bg-[#1D162C] hover:bg-[#251D38] border border-[#2B233F] text-[#9F96B2] hover:text-white transition-colors"
            title="Refresh List"
          >
            <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
          </button>
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-extrabold text-xs shadow-md shadow-amber-600/20 flex items-center space-x-1.5 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Astrologer</span>
          </button>
        </div>
      </div>

      {/* Astrologers Table */}
      <div className="bg-[#141021] border border-[#2B233F] rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0F0C1A] text-[#8E84A6] uppercase tracking-wider font-semibold border-b border-[#261E38]">
              <tr>
                <th className="py-3.5 px-4">Astrologer</th>
                <th className="py-3.5 px-4">Experience &amp; Fees</th>
                <th className="py-3.5 px-4">Languages &amp; Skills</th>
                <th className="py-3.5 px-4 text-center">Online Status</th>
                <th className="py-3.5 px-4 text-center">Published</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#211A31] text-[#D6CEE5]">
              {loading && astrologers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#8E84A6]">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <RotateCw className="w-6 h-6 animate-spin text-amber-400" />
                      <span>Loading Astrologers Directory...</span>
                    </div>
                  </td>
                </tr>
              ) : astrologers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#8E84A6]">
                    No astrologers found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                astrologers.map((astro) => (
                  <tr key={astro.id} className="hover:bg-[#1A1428] transition-colors group">
                    {/* Name & Photo */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={astro.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300'}
                          alt={astro.name}
                          className="w-10 h-10 rounded-full object-cover border border-amber-500/30"
                        />
                        <div>
                          <strong className="text-white block font-semibold">{astro.name}</strong>
                          <span className="text-[11px] text-[#8E84A6] line-clamp-1">{astro.title}</span>
                          {astro.isFeatured && (
                            <span className="inline-block mt-0.5 text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-bold uppercase">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Experience & Fees */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <div className="font-semibold text-white">
                          ₹{astro.consultationFee} <span className="text-[10px] text-[#8E84A6] font-normal">/ session</span>
                        </div>
                        <div className="text-[11px] text-amber-400 font-mono">
                          ₹{astro.perMinuteRate || 25}/min
                        </div>
                        <div className="text-[10px] text-[#8E84A6]">{astro.experienceYears || 10} yrs experience</div>
                      </div>
                    </td>

                    {/* Languages & Skills */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1 max-w-xs">
                        <div className="text-[11px] text-[#C7BED6] truncate">
                          {Array.isArray(astro.specialties) ? astro.specialties.join(', ') : astro.specialties}
                        </div>
                        <div className="text-[10px] text-[#7A7091]">
                          {Array.isArray(astro.languages) ? astro.languages.join(' • ') : astro.languages}
                        </div>
                      </div>
                    </td>

                    {/* Online Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleToggleOnline(astro)}
                        className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                          astro.isOnline
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            astro.isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-gray-400'
                          }`}
                        />
                        <span>{astro.isOnline ? 'Online' : 'Offline'}</span>
                      </button>
                    </td>

                    {/* Published Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleToggleActive(astro)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase transition-all ${
                          astro.isActive !== false
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}
                      >
                        {astro.isActive !== false ? 'Published' : 'Hidden'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleOpenEdit(astro)}
                          className="p-1.5 rounded-lg bg-[#231B36] hover:bg-amber-500/20 hover:text-amber-300 text-gray-300 transition-colors"
                          title="Edit Astrologer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(astro.id, astro.name)}
                          className="p-1.5 rounded-lg bg-[#231B36] hover:bg-red-500/20 hover:text-red-300 text-gray-300 transition-colors"
                          title="Delete Astrologer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAstrologer ? `Edit Astrologer: ${editingAstrologer.name}` : 'Add New Vedic Astrologer'}
        subtitle="Manage scholar bio, consultation pricing, specialization, and availability"
        maxWidth="2xl"
      >
        {formError && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="font-bold text-[#C7BED6] block">Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Acharya Vidyadhar Shastri"
                className="w-full px-3 py-2 bg-[#0C0A14] border border-[#2B233F] rounded-xl text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Title */}
            <div className="space-y-1">
              <label className="font-bold text-[#C7BED6] block">Professional Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Senior Jyotish Ratna & Vedic Scholar"
                className="w-full px-3 py-2 bg-[#0C0A14] border border-[#2B233F] rounded-xl text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="font-bold text-[#C7BED6] block">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="astrologer@astroveda.com"
                className="w-full px-3 py-2 bg-[#0C0A14] border border-[#2B233F] rounded-xl text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="font-bold text-[#C7BED6] block">Mobile Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 bg-[#0C0A14] border border-[#2B233F] rounded-xl text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Experience Years */}
            <div className="space-y-1">
              <label className="font-bold text-[#C7BED6] block">Experience (Years)</label>
              <input
                type="number"
                min="1"
                max="60"
                value={formData.experienceYears}
                onChange={(e) => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-[#0C0A14] border border-[#2B233F] rounded-xl text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Consultation Fee */}
            <div className="space-y-1">
              <label className="font-bold text-[#C7BED6] block">Session Fee (₹) *</label>
              <input
                type="number"
                min="100"
                required
                value={formData.consultationFee}
                onChange={(e) => setFormData({ ...formData, consultationFee: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-[#0C0A14] border border-[#2B233F] rounded-xl text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Per-minute Rate */}
            <div className="space-y-1">
              <label className="font-bold text-[#C7BED6] block">Per-Minute Chat Rate (₹)</label>
              <input
                type="number"
                min="5"
                value={formData.perMinuteRate}
                onChange={(e) => setFormData({ ...formData, perMinuteRate: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-[#0C0A14] border border-[#2B233F] rounded-xl text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Photo Avatar URL */}
            <div className="space-y-1">
              <label className="font-bold text-[#C7BED6] block">Profile Photo URL</label>
              <input
                type="url"
                value={formData.avatarUrl}
                onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 bg-[#0C0A14] border border-[#2B233F] rounded-xl text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Specialties */}
          <div className="space-y-1">
            <label className="font-bold text-[#C7BED6] block">Specializations (comma separated)</label>
            <input
              type="text"
              value={formData.specialties}
              onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
              placeholder="Kundli Matching, Love &amp; Marriage, Prashna Shastra, Vastu Shastra"
              className="w-full px-3 py-2 bg-[#0C0A14] border border-[#2B233F] rounded-xl text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Languages */}
          <div className="space-y-1">
            <label className="font-bold text-[#C7BED6] block">Languages Known (comma separated)</label>
            <input
              type="text"
              value={formData.languages}
              onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
              placeholder="English, Marathi, Hindi, Sanskrit"
              className="w-full px-3 py-2 bg-[#0C0A14] border border-[#2B233F] rounded-xl text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Bio */}
          <div className="space-y-1">
            <label className="font-bold text-[#C7BED6] block">Bio &amp; Description</label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Detailed background, lineage, Vedic university degrees, and counseling approach..."
              className="w-full px-3 py-2 bg-[#0C0A14] border border-[#2B233F] rounded-xl text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Available Slots */}
          <div className="space-y-1">
            <label className="font-bold text-[#C7BED6] block">Working Hours / Slots (comma separated)</label>
            <input
              type="text"
              value={formData.availableSlots}
              onChange={(e) => setFormData({ ...formData, availableSlots: e.target.value })}
              placeholder="09:00 AM, 11:30 AM, 02:30 PM, 05:00 PM, 08:00 PM"
              className="w-full px-3 py-2 bg-[#0C0A14] border border-[#2B233F] rounded-xl text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Flags */}
          <div className="flex flex-wrap items-center gap-6 pt-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isOnline}
                onChange={(e) => setFormData({ ...formData, isOnline: e.target.checked })}
                className="rounded border-[#2B233F] text-amber-500 focus:ring-0"
              />
              <span className="font-semibold text-white">Online Now</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded border-[#2B233F] text-amber-500 focus:ring-0"
              />
              <span className="font-semibold text-white">Published on Frontend</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="rounded border-[#2B233F] text-amber-500 focus:ring-0"
              />
              <span className="font-semibold text-white">Featured Badge</span>
            </label>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#261E38]">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-[#231B36] hover:bg-[#2C2243] text-white font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formLoading}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-extrabold shadow-md flex items-center space-x-1.5 transition-all disabled:opacity-50"
            >
              {formLoading ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{editingAstrologer ? 'Update Profile' : 'Create Astrologer'}</span>
              )}
            </button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
}

export default function AstrologersManagementPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0A0812] flex items-center justify-center text-amber-400">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      }
    >
      <AstrologersManagementContent />
    </Suspense>
  );
}
