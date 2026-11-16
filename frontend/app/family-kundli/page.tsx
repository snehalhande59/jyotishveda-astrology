'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { getCurrentUser } from '@/lib/auth';
import BirthDetailsForm, { BirthFormData } from '@/components/BirthDetailsForm';
import { useLanguage } from '@/context/LanguageContext';
import {
  Users,
  User,
  Heart,
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  PlusCircle,
  Trash2,
  Edit2,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Printer,
  ChevronRight,
  X,
} from 'lucide-react';

const RELATIONSHIP_OPTIONS = [
  { value: 'Self', labelEn: 'Self (माझे स्वतःचे)', labelMr: 'स्वतः' },
  { value: 'Spouse', labelEn: 'Spouse / Partner (पती / पत्नी)', labelMr: 'पती / पत्नी' },
  { value: 'Father', labelEn: 'Father (वडील)', labelMr: 'वडील' },
  { value: 'Mother', labelEn: 'Mother (आई)', labelMr: 'आई' },
  { value: 'Son', labelEn: 'Son (मुलगा)', labelMr: 'मुलगा' },
  { value: 'Daughter', labelEn: 'Daughter (मुलगी)', labelMr: 'मुलगी' },
  { value: 'Brother', labelEn: 'Brother (भाऊ)', labelMr: 'भाऊ' },
  { value: 'Sister', labelEn: 'Sister (बहीण)', labelMr: 'बहीण' },
  { value: 'Other', labelEn: 'Other Relative (इतर नातेवाईक)', labelMr: 'इतर' },
];

export default function FamilyKundliPage() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const isMr = language === 'mr';

  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedRelation, setSelectedRelation] = useState('Spouse');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingProfile, setEditingProfile] = useState<any | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Quick Compare state
  const [compareA, setCompareA] = useState<string>('');
  const [compareB, setCompareB] = useState<string>('');

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push('/login?redirect=/family-kundli');
      return;
    }
    loadProfiles();
  }, [router]);

  const loadProfiles = async () => {
    setLoading(true);
    try {
      const data = await api.getMyBirthProfiles();
      const list = Array.isArray(data) ? data : [];
      setProfiles(list);
      if (list.length >= 2) {
        setCompareA(String(list[0].id));
        setCompareB(String(list[1].id));
      }
    } catch (err: any) {
      setFeedbackMsg({
        type: 'error',
        text: err.message || (isMr ? 'प्रोफाइल्स लोड करण्यात अडचण आली.' : 'Failed to load family profiles.'),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdateProfile = async (formData: BirthFormData) => {
    setSubmitting(true);
    setFeedbackMsg(null);
    try {
      const payload = {
        ...formData,
        relationship: selectedRelation,
        notes: notes.trim(),
      };

      if (editingProfile) {
        await api.updateBirthProfile(editingProfile.id, payload);
        setFeedbackMsg({
          type: 'success',
          text: isMr
            ? `${formData.fullName} यांची जन्म पत्रिका यशस्वीरित्या अद्ययावत केली!`
            : `Updated horoscope profile for ${formData.fullName} successfully!`,
        });
      } else {
        await api.saveBirthProfile(payload);
        setFeedbackMsg({
          type: 'success',
          text: isMr
            ? `${formData.fullName} यांची कौटुंबिक पत्रिका जोडली गेली!`
            : `Added ${formData.fullName} to your Family Vedic Kundli Vault!`,
        });
      }

      setShowAddModal(false);
      setEditingProfile(null);
      setNotes('');
      await loadProfiles();
    } catch (err: any) {
      setFeedbackMsg({
        type: 'error',
        text: err.message || (isMr ? 'प्रोफाइल जतन करताना त्रुटी आली.' : 'Failed to save family profile.'),
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProfile = async (id: number, name: string) => {
    if (
      !confirm(
        isMr
          ? `तुम्ही खात्रीपूर्वक ${name} यांची जन्म प्रोफाइल डिलीट करू इच्छिता?`
          : `Are you sure you want to remove the birth profile for ${name}?`
      )
    ) {
      return;
    }

    try {
      await api.deleteBirthProfile(id);
      setFeedbackMsg({
        type: 'success',
        text: isMr ? 'प्रोफाइल यशस्वीरित्या हटवली.' : 'Profile successfully removed.',
      });
      setProfiles((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      setFeedbackMsg({
        type: 'error',
        text: err.message || (isMr ? 'प्रोफाइल हटवताना अडचण आली.' : 'Error deleting profile.'),
      });
    }
  };

  const handleOpenEdit = (profile: any) => {
    setEditingProfile(profile);
    setSelectedRelation(profile.relationship || 'Other');
    setNotes(profile.notes || '');
    setShowAddModal(true);
  };

  const handleLoadInKundli = (profile: any) => {
    try {
      localStorage.setItem('active_kundli_profile', JSON.stringify(profile));
    } catch {}
    router.push(
      `/kundli?name=${encodeURIComponent(profile.fullName)}&dob=${encodeURIComponent(profile.dateOfBirth)}&tob=${encodeURIComponent(profile.timeOfBirth)}&place=${encodeURIComponent(profile.placeOfBirth)}&lat=${profile.latitude}&lon=${profile.longitude}&tz=${profile.timezoneOffset || 5.5}`
    );
  };

  const handlePrintSummary = () => {
    window.print();
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen text-[#2D1810] pb-24 font-sans print:bg-white print:text-black">
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-[#FFFDF9] via-[#FAF7F2] to-[#FFF9EB] py-14 px-4 sm:px-6 lg:px-8 border-b border-[#EAE1D2] print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-[#FFFBEB] border border-[#FDE68A] px-3.5 py-1 rounded-full text-xs font-semibold text-[#92400E]">
              <Users className="w-3.5 h-3.5 text-[#D97706]" />
              <span>{isMr ? 'कौटुंबिक जन्म पत्रिका तिजोरी' : 'Family Vedic Horoscope Vault'}</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#2D1810] mt-2">
              {isMr ? 'कुटुंब कुंडली व्यवस्थापन' : 'Family Kundli & Charts Vault'}
            </h1>
            <p className="text-xs sm:text-sm text-[#786C60] max-w-xl mt-1 leading-relaxed">
              {isMr
                ? 'तुमच्या संपूर्ण कुटुंबातील सदस्यांच्या जन्मपत्रिका एकाच खात्यात सुरक्षित ठेवा. कोणत्याही सदस्याची पत्रिका १-क्लिकने लोड करा, गोचर तपासा व गुणमेलन करा.'
                : 'Safely store, manage, and compare authentic Parashari birth charts for your spouse, children, parents, and loved ones under one secure account.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={() => {
                setEditingProfile(null);
                setSelectedRelation('Spouse');
                setNotes('');
                setShowAddModal(true);
              }}
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-[#D97706] to-[#B45309] hover:from-[#B45309] hover:to-[#92400E] text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isMr ? '+ कुटुंब सदस्य जोडा' : '+ Add Family Member'}</span>
            </button>
            {profiles.length > 0 && (
              <button
                onClick={handlePrintSummary}
                className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-white border border-[#EAE1D2] text-[#2D1810] text-xs font-bold rounded-xl hover:border-[#D97706] shadow-sm transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4 text-[#786C60]" />
                <span>{isMr ? 'प्रिंट / PDF' : 'Print Vault'}</span>
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {/* Feedback Alert */}
        {feedbackMsg && (
          <div
            className={`p-4 rounded-2xl text-xs flex items-center justify-between border ${
              feedbackMsg.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            <div className="flex items-center space-x-2">
              {feedbackMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span className="font-medium">{feedbackMsg.text}</span>
            </div>
            <button onClick={() => setFeedbackMsg(null)} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Profiles Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl font-bold text-[#2D1810] flex items-center space-x-2">
              <span>{isMr ? 'नोंदणीकृत कौटुंबिक पत्रिका' : 'Saved Family Profiles'}</span>
              <span className="text-xs font-mono font-bold text-[#D97706] bg-[#FFFBEB] border border-[#FDE68A] px-2.5 py-0.5 rounded-full">
                {profiles.length}
              </span>
            </h2>
            <Link
              href="/dashboard"
              className="text-xs text-[#D97706] hover:underline font-semibold flex items-center space-x-1"
            >
              <span>{isMr ? 'डॅशबोर्डवर जा' : 'Back to Dashboard'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="py-20 text-center text-[#786C60] space-y-3 bg-white rounded-3xl border border-[#EAE1D2]">
              <Sparkles className="w-7 h-7 text-[#D97706] animate-spin mx-auto" />
              <p className="text-xs font-medium">{isMr ? 'कौटुंबिक पत्रिका लोड होत आहेत...' : 'Loading Family Vedic Horoscopes...'}</p>
            </div>
          ) : profiles.length === 0 ? (
            <div className="py-16 text-center text-[#786C60] space-y-4 bg-white rounded-3xl border border-[#EAE1D2] p-6 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] text-[#D97706] flex items-center justify-center mx-auto">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#2D1810]">
                {isMr ? 'अद्याप कोणतेही कौटुंबिक सदस्य जोडलेले नाहीत' : 'No Family Profiles Added Yet'}
              </h3>
              <p className="text-xs text-[#786C60] max-w-md mx-auto">
                {isMr
                  ? 'तुमच्या पती, पत्नी, मुले किंवा आई-वडिलांची जन्म पत्रिका जोडून संपूर्ण कुटुंबाची कुंडली एकाच ठिकाणी सांभाळा.'
                  : 'Start adding birth coordinates for your family members to unlock unified charts, dasha timelines, and compatibility comparisons.'}
              </p>
              <button
                onClick={() => {
                  setEditingProfile(null);
                  setSelectedRelation('Self');
                  setShowAddModal(true);
                }}
                className="px-6 py-2.5 bg-gradient-to-r from-[#D97706] to-[#B45309] text-white font-bold text-xs rounded-xl shadow-md hover:opacity-95"
              >
                {isMr ? 'पहिली पत्रिका जोडा' : 'Add First Member'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {profiles.map((p) => {
                const chart = p.chartData || {};
                const ascSign = chart.ascendantSign || chart.ascendant?.signName || chart.lagna || 'Aries';
                const moonSign = chart.moonSign || chart.moonSign?.signName || chart.rashi || 'Taurus';
                const nakshatra = chart.nakshatra || chart.moonSign?.nakshatra || 'Rohini';
                const pada = chart.pada || 1;
                const rel = p.relationship || 'Self';

                return (
                  <div
                    key={p.id}
                    className="bg-white rounded-2xl border border-[#EAE1D2] p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative overflow-hidden"
                  >
                    {/* Top Row: Relation Badge & Options */}
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-[#F3ECE1]">
                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E]">
                          <Heart className="w-3 h-3 text-[#D97706]" />
                          <span>{rel}</span>
                        </span>

                        <div className="flex items-center space-x-1 text-[#786C60]">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 rounded-lg hover:bg-[#FAF7F2] hover:text-[#D97706] transition-colors"
                            title={isMr ? 'संपादित करा' : 'Edit profile'}
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProfile(p.id, p.fullName)}
                            className="p-1.5 rounded-lg hover:bg-rose-50 hover:text-rose-600 transition-colors"
                            title={isMr ? 'हटवा' : 'Delete profile'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Name & Basic Birth Coordinates */}
                      <div className="mt-3 space-y-1">
                        <h3 className="font-serif text-lg font-bold text-[#2D1810] truncate">
                          {p.fullName}
                        </h3>
                        <div className="text-xs text-[#786C60] flex flex-col space-y-0.5">
                          <span className="flex items-center space-x-1.5">
                            <Calendar className="w-3 h-3 text-[#D97706]" />
                            <span>{p.dateOfBirth} at {p.timeOfBirth}</span>
                          </span>
                          <span className="flex items-center space-x-1.5 truncate">
                            <MapPin className="w-3 h-3 text-[#D97706] shrink-0" />
                            <span className="truncate">{p.placeOfBirth}</span>
                          </span>
                        </div>
                      </div>

                      {/* Astrological Coordinates Box */}
                      <div className="mt-4 p-3 bg-[#FAF7F2] rounded-xl border border-[#EAE1D2] grid grid-cols-3 gap-2 text-center">
                        <div>
                          <span className="text-[9px] uppercase font-bold text-[#786C60] block">
                            {isMr ? 'लग्न' : 'Lagna'}
                          </span>
                          <strong className="text-xs font-serif font-bold text-[#D97706] block truncate">
                            {ascSign}
                          </strong>
                        </div>
                        <div className="border-x border-[#EAE1D2]">
                          <span className="text-[9px] uppercase font-bold text-[#786C60] block">
                            {isMr ? 'राशी' : 'Rashi'}
                          </span>
                          <strong className="text-xs font-serif font-bold text-[#D97706] block truncate">
                            {moonSign}
                          </strong>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-bold text-[#786C60] block">
                            {isMr ? 'नक्षत्र' : 'Star'}
                          </span>
                          <strong className="text-xs font-serif font-bold text-[#D97706] block truncate" title={`${nakshatra} (P${pada})`}>
                            {nakshatra}
                          </strong>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 flex flex-wrap gap-2">
                      <button
                        onClick={() => handleLoadInKundli(p)}
                        className="flex-1 py-2 px-3 bg-gradient-to-r from-[#D97706] to-[#B45309] text-white text-xs font-bold rounded-xl shadow-xs hover:opacity-95 flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        <Compass className="w-3.5 h-3.5" />
                        <span>{isMr ? 'कुंडली उघडा' : 'View Kundli'}</span>
                      </button>
                      <Link
                        href={`/calculators/transit-chart`}
                        className="py-2 px-3 bg-[#FAF7F2] border border-[#EAE1D2] hover:border-[#D97706] text-[#2D1810] text-xs font-semibold rounded-xl flex items-center justify-center"
                        title={isMr ? 'गोचर ग्रह भ्रमण' : 'Transits'}
                      >
                        <span>{isMr ? 'गोचर' : 'Transits'}</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Family Compatibility Comparator (When >= 2 members exist) */}
        {profiles.length >= 2 && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EAE1D2] shadow-sm space-y-6 print:hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F3ECE1]">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] flex items-center justify-center text-[#D97706]">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#2D1810]">
                    {isMr ? 'कौटुंबिक गुणमेलन व परस्पर संवाद' : 'Family Astrological Harmony Comparator'}
                  </h3>
                  <p className="text-xs text-[#786C60]">
                    {isMr
                      ? 'कुटुंबातील कोणत्याही दोन सदस्यांची पत्रिका निवडून अष्टकूट गुण आणि परस्पर ग्रहमैत्री तपासा.'
                      : 'Select any two family members to instantly check Ashta Koota compatibility and planetary harmony.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              <div className="sm:col-span-5">
                <label className="text-xs font-bold text-[#5C4033] block mb-1">
                  {isMr ? 'पहिली पत्रिका (सदस्य १)' : 'First Chart (Member 1)'}
                </label>
                <select
                  value={compareA}
                  onChange={(e) => setCompareA(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EAE1D2] rounded-xl text-xs font-semibold text-[#2D1810] focus:outline-none focus:border-[#D97706]"
                >
                  {profiles.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.fullName} ({p.relationship || 'Member'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2 text-center text-xs font-serif font-bold text-[#D97706]">
                VS
              </div>

              <div className="sm:col-span-5">
                <label className="text-xs font-bold text-[#5C4033] block mb-1">
                  {isMr ? 'दुसरी पत्रिका (सदस्य २)' : 'Second Chart (Member 2)'}
                </label>
                <select
                  value={compareB}
                  onChange={(e) => setCompareB(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EAE1D2] rounded-xl text-xs font-semibold text-[#2D1810] focus:outline-none focus:border-[#D97706]"
                >
                  {profiles.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.fullName} ({p.relationship || 'Member'})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Link
                href={`/compatibility`}
                className="inline-flex items-center space-x-2 px-6 py-2.5 bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold rounded-xl shadow-xs transition-all"
              >
                <span>{isMr ? 'विस्तृत सुसंगतता तपासा' : 'Launch 36 Guna Comparison'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Family Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl border border-[#EAE1D2] max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#F3ECE1]">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-[#D97706]" />
                <h3 className="font-serif text-lg font-bold text-[#2D1810]">
                  {editingProfile
                    ? isMr
                      ? 'कौटुंबिक पत्रिका संपादित करा'
                      : 'Edit Family Member Profile'
                    : isMr
                    ? 'नवीन कौटुंबिक पत्रिका जोडा'
                    : 'Add Family Member Profile'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingProfile(null);
                }}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Relationship Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#5C4033] block">
                {isMr ? 'नातेसंबंध निवडा (Relationship)' : 'Relationship to Account Holder'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {RELATIONSHIP_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSelectedRelation(opt.value)}
                    className={`px-2.5 py-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                      selectedRelation === opt.value
                        ? 'bg-[#FFFBEB] border-[#D97706] text-[#92400E] font-bold shadow-2xs'
                        : 'bg-[#FAF7F2] border-[#EAE1D2] text-[#5C4033] hover:border-[#D97706]'
                    }`}
                  >
                    {isMr ? opt.labelMr : opt.value}
                  </button>
                ))}
              </div>
            </div>

            {/* Birth Details Form */}
            <BirthDetailsForm
              onSubmit={handleCreateOrUpdateProfile}
              isLoading={submitting}
              showGender={true}
              buttonText={
                editingProfile
                  ? isMr
                    ? 'पत्रिका अद्ययावत करा'
                    : 'Update Vedic Profile'
                  : isMr
                  ? 'कुटुंब तिजोरीत जतन करा'
                  : 'Save to Family Vault'
              }
              initialData={
                editingProfile
                  ? {
                      fullName: editingProfile.fullName,
                      dateOfBirth: editingProfile.dateOfBirth,
                      timeOfBirth: editingProfile.timeOfBirth,
                      placeOfBirth: editingProfile.placeOfBirth,
                      latitude: editingProfile.latitude,
                      longitude: editingProfile.longitude,
                      timezoneOffset: editingProfile.timezoneOffset,
                      gender: editingProfile.gender,
                    }
                  : undefined
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
