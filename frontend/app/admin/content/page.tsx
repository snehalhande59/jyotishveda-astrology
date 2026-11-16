'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Modal from '@/components/admin/Modal';
import { adminApi } from '@/lib/admin-api';
import {
  FileText,
  Sparkles,
  HelpCircle,
  Settings,
  PlusCircle,
  Edit2,
  Trash2,
  CheckCircle,
  RotateCw,
  ExternalLink,
  Save,
} from 'lucide-react';

export default function CMSContentManagementPage() {
  const [activeTab, setActiveTab] = useState<'services' | 'articles' | 'faqs' | 'site-setting'>('services');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Form Models
  const [serviceForm, setServiceForm] = useState({
    title: '',
    category: 'report',
    shortDescription: '',
    fullDescription: '',
    price: 999,
    discountedPrice: 699,
    deliveryTime: 'Instant Online Access',
    badge: 'Popular',
    isFeatured: true,
  });

  const [articleForm, setArticleForm] = useState({
    title: '',
    category: 'Planetary Transits',
    author: 'Pandit Rajesh Shastri',
    readTime: '5 min read',
    excerpt: '',
    content: '',
  });

  const [faqForm, setFaqForm] = useState({
    question: '',
    answer: '',
    category: 'General Astrology',
    order: 1,
  });

  const [siteSettings, setSiteSettings] = useState({
    siteName: 'JyotishVeda',
    heroTitle: 'Discover Your True Celestial Blueprint',
    heroSubtitle: 'Uncover your true karmic path, planetary alignments, and authentic Jyotish forecasts through classical Lahiri sidereal calculations.',
    announcementBar: '✨ Auspicious Muhurat Consultations Now Open for this Vedic Season',
    contactEmail: 'contact@jyotishveda.com',
    contactPhone: '+91 (0) 11 4987 6543',
    defaultAyanamsa: 'Lahiri (Chitrapaksha)',
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  const loadContent = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getContent(activeTab);
      if (res && res.data) {
        if (activeTab === 'site-setting') {
          const setting = Array.isArray(res.data) ? res.data[0] : res.data;
          if (setting) {
            setSiteSettings({
              siteName: setting.siteName || 'JyotishVeda',
              heroTitle: setting.heroTitle || '',
              heroSubtitle: setting.heroSubtitle || '',
              announcementBar: setting.announcementBar || '',
              contactEmail: setting.contactEmail || '',
              contactPhone: setting.contactPhone || '',
              defaultAyanamsa: setting.defaultAyanamsa || 'Lahiri (Chitrapaksha)',
            });
          }
        } else {
          setItems(Array.isArray(res.data) ? res.data : []);
        }
      }
    } catch (err: any) {
      console.warn('CMS content loading fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, [activeTab]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    if (activeTab === 'services') {
      setServiceForm({
        title: '',
        category: 'report',
        shortDescription: '',
        fullDescription: '',
        price: 999,
        discountedPrice: 699,
        deliveryTime: 'Instant Online Access',
        badge: 'Recommended',
        isFeatured: true,
      });
    } else if (activeTab === 'articles') {
      setArticleForm({
        title: '',
        category: 'Planetary Transits',
        author: 'Pandit Rajesh Shastri',
        readTime: '5 min read',
        excerpt: '',
        content: '',
      });
    } else if (activeTab === 'faqs') {
      setFaqForm({
        question: '',
        answer: '',
        category: 'General Astrology',
        order: (items.length || 0) + 1,
      });
    }
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    if (activeTab === 'services') {
      setServiceForm({
        title: item.title || '',
        category: item.category || 'report',
        shortDescription: item.shortDescription || '',
        fullDescription: item.fullDescription || '',
        price: item.price || 999,
        discountedPrice: item.discountedPrice || 699,
        deliveryTime: item.deliveryTime || 'Instant Online Access',
        badge: item.badge || '',
        isFeatured: Boolean(item.isFeatured),
      });
    } else if (activeTab === 'articles') {
      setArticleForm({
        title: item.title || '',
        category: item.category || 'Planetary Transits',
        author: item.author || 'Pandit Rajesh Shastri',
        readTime: item.readTime || '5 min read',
        excerpt: item.excerpt || '',
        content: item.content || '',
      });
    } else if (activeTab === 'faqs') {
      setFaqForm({
        question: item.question || '',
        answer: item.answer || '',
        category: item.category || 'General Astrology',
        order: item.order || 1,
      });
    }
    setIsModalOpen(true);
  };

  const handleDeleteItem = async (id: number) => {
    if (!confirm('Are you sure you want to delete this CMS content item?')) return;
    try {
      await adminApi.deleteContent(activeTab, id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err: any) {
      alert('Delete failed: ' + err.message);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      let data: any = {};
      if (activeTab === 'services') data = serviceForm;
      if (activeTab === 'articles') data = articleForm;
      if (activeTab === 'faqs') data = faqForm;

      if (editingItem) {
        await adminApi.updateContent(activeTab, editingItem.id, data);
      } else {
        await adminApi.createContent(activeTab, data);
      }

      setIsModalOpen(false);
      loadContent();
    } catch (err: any) {
      alert('Save failed: ' + err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleSaveSiteSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsSuccess(false);
    try {
      await adminApi.updateContent('site-setting', 1, siteSettings);
      setSettingsSuccess(true);
      setTimeout(() => setSettingsSuccess(false), 2000);
    } catch (err: any) {
      alert('Failed to update website settings: ' + err.message);
    } finally {
      setSavingSettings(false);
    }
  };

  return (
    <AdminLayout
      title="CMS Content &amp; Services Management"
      subtitle="Directly control astrology services, reports, articles, FAQs, and site banners without opening Strapi"
    >
      {/* Category Tabs */}
      <div className="flex items-center space-x-2 border-b border-[#261E38] pb-3 overflow-x-auto no-scrollbar">
        {[
          { id: 'services', label: 'Services & Reports', icon: Sparkles },
          { id: 'articles', label: 'Articles & Blog', icon: FileText },
          { id: 'faqs', label: 'FAQs Directory', icon: HelpCircle },
          { id: 'site-setting', label: 'Website Settings & Banners', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                  : 'bg-[#141021] hover:bg-[#1D162C] text-[#A69CBE] hover:text-white border border-[#2B233F]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      {activeTab === 'site-setting' ? (
        /* Site Setting Editor */
        <div className="bg-[#141021] border border-[#2B233F] rounded-2xl p-6 shadow-xl max-w-3xl space-y-6">
          <div className="border-b border-[#261E38] pb-3">
            <h3 className="font-bold text-white text-base">Global AstroVeda Platform Settings</h3>
            <p className="text-xs text-[#8E84A6]">Changes directly update the public website headers, banners, and contact information</p>
          </div>

          {settingsSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>Platform settings updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleSaveSiteSettings} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-[#C7BED6] block">Platform Name</label>
              <input
                type="text"
                value={siteSettings.siteName}
                onChange={(e) => setSiteSettings({ ...siteSettings, siteName: e.target.value })}
                className="w-full px-3 py-2 bg-[#0C0A14] border border-[#2B233F] rounded-xl text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#C7BED6] block">Hero Banner Main Heading</label>
              <input
                type="text"
                value={siteSettings.heroTitle}
                onChange={(e) => setSiteSettings({ ...siteSettings, heroTitle: e.target.value })}
                className="w-full px-3 py-2 bg-[#0C0A14] border border-[#2B233F] rounded-xl text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#C7BED6] block">Hero Subtitle</label>
              <textarea
                rows={2}
                value={siteSettings.heroSubtitle}
                onChange={(e) => setSiteSettings({ ...siteSettings, heroSubtitle: e.target.value })}
                className="w-full px-3 py-2 bg-[#0C0A14] border border-[#2B233F] rounded-xl text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#C7BED6] block">Top Utility Announcement Ticker</label>
              <input
                type="text"
                value={siteSettings.announcementBar}
                onChange={(e) => setSiteSettings({ ...siteSettings, announcementBar: e.target.value })}
                className="w-full px-3 py-2 bg-[#0C0A14] border border-[#2B233F] rounded-xl text-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-[#C7BED6] block">Contact Email</label>
                <input
                  type="email"
                  value={siteSettings.contactEmail}
                  onChange={(e) => setSiteSettings({ ...siteSettings, contactEmail: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0C0A14] border border-[#2B233F] rounded-xl text-white focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-[#C7BED6] block">Contact Phone Number</label>
                <input
                  type="text"
                  value={siteSettings.contactPhone}
                  onChange={(e) => setSiteSettings({ ...siteSettings, contactPhone: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0C0A14] border border-[#2B233F] rounded-xl text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#C7BED6] block">Default Ephemeris Ayanamsa</label>
              <input
                type="text"
                value={siteSettings.defaultAyanamsa}
                onChange={(e) => setSiteSettings({ ...siteSettings, defaultAyanamsa: e.target.value })}
                className="w-full px-3 py-2 bg-[#0C0A14] border border-[#2B233F] rounded-xl text-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={savingSettings}
              className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 text-black font-extrabold flex items-center space-x-2 shadow-lg"
            >
              <Save className="w-4 h-4" />
              <span>{savingSettings ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </form>
        </div>
      ) : (
        /* Collection Table for Services / Articles / FAQs */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8E84A6]">
              {items.length} {activeTab} configured
            </span>
            <button
              onClick={handleOpenAdd}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 text-black font-bold text-xs flex items-center space-x-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add {activeTab === 'services' ? 'Service' : activeTab === 'articles' ? 'Article' : 'FAQ'}</span>
            </button>
          </div>

          <div className="bg-[#141021] border border-[#2B233F] rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0F0C1A] text-[#8E84A6] uppercase tracking-wider font-semibold border-b border-[#261E38]">
                  <tr>
                    <th className="py-3 px-4">Title / Query</th>
                    <th className="py-3 px-4">Category</th>
                    {activeTab === 'services' && <th className="py-3 px-4">Pricing</th>}
                    {activeTab === 'articles' && <th className="py-3 px-4">Author</th>}
                    {activeTab === 'faqs' && <th className="py-3 px-4">Order</th>}
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#211A31] text-[#D6CEE5]">
                  {loading && items.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-[#8E84A6]">
                        Loading content items...
                      </td>
                    </tr>
                  ) : items.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-[#8E84A6]">
                        No items found in this collection.
                      </td>
                    </tr>
                  ) : (
                    items.map((item) => (
                      <tr key={item.id} className="hover:bg-[#1A1428] transition-colors">
                        <td className="py-3 px-4">
                          <strong className="text-white block font-semibold">
                            {item.title || item.question}
                          </strong>
                          {item.shortDescription && (
                            <span className="text-[11px] text-[#8E84A6] line-clamp-1">
                              {item.shortDescription}
                            </span>
                          )}
                          {item.answer && (
                            <span className="text-[11px] text-[#8E84A6] line-clamp-1">
                              {item.answer}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold uppercase">
                            {item.category || 'Standard'}
                          </span>
                        </td>
                        {activeTab === 'services' && (
                          <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                            ₹{item.discountedPrice || item.price} <span className="text-[10px] text-gray-500 line-through">₹{item.price}</span>
                          </td>
                        )}
                        {activeTab === 'articles' && (
                          <td className="py-3 px-4 text-[#C7BED6]">{item.author || 'Pandit Rajesh'}</td>
                        )}
                        {activeTab === 'faqs' && (
                          <td className="py-3 px-4 font-mono text-amber-400">#{item.order || 1}</td>
                        )}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleOpenEdit(item)}
                              className="p-1.5 rounded-lg bg-[#231B36] hover:bg-amber-500/20 hover:text-amber-300 text-gray-300 transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              className="p-1.5 rounded-lg bg-[#231B36] hover:bg-red-500/20 hover:text-red-300 text-gray-300 transition-colors"
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
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? `Edit ${activeTab.slice(0, -1)}` : `Add New ${activeTab.slice(0, -1)}`}
        maxWidth="lg"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {activeTab === 'services' && (
            <>
              <div className="space-y-1">
                <label className="font-bold text-[#C7BED6] block">Service Title *</label>
                <input
                  type="text"
                  required
                  value={serviceForm.title}
                  onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0C0A14] border border-[#2B233F] rounded-xl text-white focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#C7BED6] block">Regular Price (₹)</label>
                  <input
                    type="number"
                    value={serviceForm.price}
                    onChange={(e) => setServiceForm({ ...serviceForm, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#0C0A14] border border-[#2B233F] rounded-xl text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#C7BED6] block">Discounted Price (₹)</label>
                  <input
                    type="number"
                    value={serviceForm.discountedPrice}
                    onChange={(e) => setServiceForm({ ...serviceForm, discountedPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#0C0A14] border border-[#2B233F] rounded-xl text-white focus:outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="font-bold text-[#C7BED6] block">Short Summary</label>
                <textarea
                  rows={2}
                  value={serviceForm.shortDescription}
                  onChange={(e) => setServiceForm({ ...serviceForm, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0C0A14] border border-[#2B233F] rounded-xl text-white focus:outline-none"
                />
              </div>
            </>
          )}

          {activeTab === 'articles' && (
            <>
              <div className="space-y-1">
                <label className="font-bold text-[#C7BED6] block">Article Title *</label>
                <input
                  type="text"
                  required
                  value={articleForm.title}
                  onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0C0A14] border border-[#2B233F] rounded-xl text-white focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#C7BED6] block">Category</label>
                  <input
                    type="text"
                    value={articleForm.category}
                    onChange={(e) => setArticleForm({ ...articleForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0C0A14] border border-[#2B233F] rounded-xl text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#C7BED6] block">Author</label>
                  <input
                    type="text"
                    value={articleForm.author}
                    onChange={(e) => setArticleForm({ ...articleForm, author: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0C0A14] border border-[#2B233F] rounded-xl text-white focus:outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="font-bold text-[#C7BED6] block">Article Content</label>
                <textarea
                  rows={5}
                  value={articleForm.content}
                  onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0C0A14] border border-[#2B233F] rounded-xl text-white focus:outline-none"
                />
              </div>
            </>
          )}

          {activeTab === 'faqs' && (
            <>
              <div className="space-y-1">
                <label className="font-bold text-[#C7BED6] block">Question *</label>
                <input
                  type="text"
                  required
                  value={faqForm.question}
                  onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0C0A14] border border-[#2B233F] rounded-xl text-white focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-[#C7BED6] block">Answer *</label>
                <textarea
                  rows={3}
                  required
                  value={faqForm.answer}
                  onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0C0A14] border border-[#2B233F] rounded-xl text-white focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#C7BED6] block">Category</label>
                  <input
                    type="text"
                    value={faqForm.category}
                    onChange={(e) => setFaqForm({ ...faqForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0C0A14] border border-[#2B233F] rounded-xl text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#C7BED6] block">Display Order</label>
                  <input
                    type="number"
                    value={faqForm.order}
                    onChange={(e) => setFaqForm({ ...faqForm, order: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#0C0A14] border border-[#2B233F] rounded-xl text-white focus:outline-none"
                  />
                </div>
              </div>
            </>
          )}

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#261E38]">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-[#231B36] text-white font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formLoading}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 text-black font-extrabold"
            >
              {formLoading ? 'Saving...' : 'Save Item'}
            </button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
}
