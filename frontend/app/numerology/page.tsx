'use client';

import React, { useState } from 'react';
import { calculateNumerology } from '@/lib/numerology';
import { Sparkles, Hash, Calendar, User, Compass, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function NumerologyPage() {
  const { language } = useLanguage();
  const [fullName, setFullName] = useState('Aryavarta Sharma');
  const [birthDate, setBirthDate] = useState('1995-08-15');
  const [result, setResult] = useState<any>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !birthDate) return;
    const res = calculateNumerology(fullName, birthDate);
    setResult(res);
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen text-[#2D1810] pb-24 font-sans">
      {/* Banner */}
      <section className="bg-gradient-to-b from-[#FFFDF9] via-[#FAF7F2] to-[#FFF9EB] py-16 px-4 sm:px-6 lg:px-8 border-b border-[#EAE1D2] text-center">
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 bg-[#FFFBEB] border border-[#FDE68A] px-3.5 py-1 rounded-full text-xs font-semibold text-[#92400E]">
            <Hash className="w-3.5 h-3.5 text-[#D97706]" />
            <span>{language === 'mr' ? 'सांख्य शास्त्र • ब्रह्मांडीय अंकशास्त्र' : 'Sankhya Shastra • Cosmic Numerology'}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2D1810]">
            {language === 'mr' ? 'वैदिक अंकशास्त्र गणक' : 'Vedic & Classical Numerology Calculator'}
          </h1>
          <p className="text-xs sm:text-sm text-[#786C60] max-w-xl mx-auto leading-relaxed">
            {language === 'mr'
              ? 'आपला मूलांक (Life Path), भाग्यांक (Destiny Number) आणि नामांक (Soul Urge) वैदिक ग्रह स्वामिनीसह जाणून घ्या.'
              : 'Calculate your Life Path Number, Destiny/Expression Number, and Soul Urge with classical planetary deities.'}
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-12">
        {/* Form Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#EAE1D2] shadow-sm max-w-2xl mx-auto">
          <form onSubmit={handleCalculate} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#5C4033] mb-1 flex items-center space-x-1.5">
                <User className="w-3.5 h-3.5 text-[#D97706]" />
                <span>{language === 'mr' ? 'पूर्ण नाव (जन्माच्या वेळी दिलेले)' : 'Full Name (as given at birth)'}</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Aryavarta Sharma"
                className="w-full px-4 py-2.5 bg-[#FFFDF9] border border-[#EAE1D2] rounded-xl text-sm focus:outline-none focus:border-[#D97706] text-[#2D1810]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5C4033] mb-1 flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#D97706]" />
                <span>{language === 'mr' ? 'जन्म तारीख' : 'Date of Birth'}</span>
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#FFFDF9] border border-[#EAE1D2] rounded-xl text-sm focus:outline-none focus:border-[#D97706] text-[#2D1810]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-[#D97706] to-[#B45309] hover:from-[#B45309] hover:to-[#92400E] text-white font-bold text-sm rounded-xl shadow-md transition-all"
            >
              {language === 'mr' ? 'अंकशास्त्र अंक मोजा' : 'Calculate Cosmic Numbers'}
            </button>
          </form>
        </div>

        {/* Results Showcase */}
        {result && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center">
              <span className="text-xs font-semibold text-[#B45309] uppercase tracking-widest">
                {language === 'mr' ? 'अंकशास्त्र ब्लूप्रिंट' : 'Numerology Blueprint'}
              </span>
              <h2 className="font-serif text-3xl font-bold text-[#2D1810] mt-1">
                {result.fullName}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Life Path Card */}
              <div className="bg-white text-[#2D1810] p-6 rounded-2xl border-2 border-[#D97706] shadow-md space-y-3 text-center">
                <span className="text-[10px] text-[#B45309] font-bold uppercase tracking-wider block">
                  {language === 'mr' ? 'मूलांक (Life Path)' : 'Life Path Number'}
                </span>
                <div className="w-16 h-16 rounded-full bg-[#FFFBEB] border-2 border-[#D97706] flex items-center justify-center font-serif text-3xl font-extrabold text-[#D97706] mx-auto">
                  {result.lifePath.number}
                </div>
                <h4 className="font-serif text-base font-bold text-[#2D1810]">
                  {language === 'mr' ? 'स्वामी ग्रह:' : 'Ruling Lord:'} {result.lifePath.planet}
                </h4>
                <span className="text-xs text-[#B45309] block font-semibold">({result.lifePath.sanskrit})</span>
                <p className="text-xs text-[#786C60] leading-relaxed pt-2 border-t border-[#EAE1D2]">
                  {result.lifePath.description}
                </p>
              </div>

              {/* Destiny Card */}
              <div className="bg-white p-6 rounded-2xl border border-[#EAE1D2] shadow-sm space-y-3 text-center">
                <span className="text-[10px] text-[#B45309] font-bold uppercase tracking-wider block">
                  {language === 'mr' ? 'भाग्यांक (Destiny Number)' : 'Destiny / Expression Number'}
                </span>
                <div className="w-16 h-16 rounded-full bg-[#FAF7F2] border-2 border-[#EAE1D2] flex items-center justify-center font-serif text-3xl font-extrabold text-[#2D1810] mx-auto">
                  {result.destiny.number}
                </div>
                <h4 className="font-serif text-base font-bold text-[#2D1810]">
                  {language === 'mr' ? 'स्वामी ग्रह:' : 'Ruling Lord:'} {result.destiny.planet}
                </h4>
                <span className="text-xs text-[#B45309] block font-semibold">({result.destiny.sanskrit})</span>
                <p className="text-xs text-[#786C60] leading-relaxed pt-2 border-t border-[#EAE1D2]">
                  {result.destiny.description}
                </p>
              </div>

              {/* Soul Urge Card */}
              <div className="bg-white p-6 rounded-2xl border border-[#EAE1D2] shadow-sm space-y-3 text-center">
                <span className="text-[10px] text-[#B45309] font-bold uppercase tracking-wider block">
                  {language === 'mr' ? 'नामांक (Soul Urge)' : "Soul Urge (Heart's Desire)"}
                </span>
                <div className="w-16 h-16 rounded-full bg-[#FAF7F2] border-2 border-[#EAE1D2] flex items-center justify-center font-serif text-3xl font-extrabold text-[#2D1810] mx-auto">
                  {result.soulUrge.number}
                </div>
                <h4 className="font-serif text-base font-bold text-[#2D1810]">
                  {language === 'mr' ? 'स्वामी ग्रह:' : 'Ruling Lord:'} {result.soulUrge.planet}
                </h4>
                <span className="text-xs text-[#B45309] block font-semibold">({result.soulUrge.sanskrit})</span>
                <p className="text-xs text-[#786C60] leading-relaxed pt-2 border-t border-[#EAE1D2]">
                  {result.soulUrge.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Educational Rules Section */}
        <section className="bg-white p-8 rounded-2xl border border-[#EAE1D2] shadow-sm space-y-4">
          <h3 className="font-serif text-xl font-bold text-[#2D1810]">
            {language === 'mr' ? 'वैदिक सांख्य शास्त्र कसे कार्य करते' : 'How Vedic Numerology (Sankhya Shastra) Operates'}
          </h3>
          <p className="text-xs text-[#786C60] leading-relaxed">
            {language === 'mr'
              ? 'सांख्य शास्त्रामध्ये १ ते ९ अंक ९ नवग्रहांशी निगडित ऊर्जा दर्शवतात:'
              : 'In Sankhya Shastra, numbers 1 through 9 are energetic resonances linked with the 9 celestial Grahas:'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#5C4033] pt-2">
            <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EAE1D2]">
              <strong>1 = Surya (Sun):</strong> Sovereign leadership, radiance, ambition.
            </div>
            <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EAE1D2]">
              <strong>2 = Chandra (Moon):</strong> Receptivity, empathy, diplomacy, imagination.
            </div>
            <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EAE1D2]">
              <strong>3 = Guru (Jupiter):</strong> Wisdom, expansive creation, optimistic counsel.
            </div>
            <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EAE1D2]">
              <strong>4 = Rahu:</strong> Pragmatic structure, rebellious ingenuity, persistence.
            </div>
            <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EAE1D2]">
              <strong>5 = Budha (Mercury):</strong> Speed, communication, commerce, intelligence.
            </div>
            <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EAE1D2]">
              <strong>6 = Shukra (Venus):</strong> Refinement, aesthetics, matrimonial harmony.
            </div>
            <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EAE1D2]">
              <strong>7 = Ketu:</strong> Introspection, psychic insight, contemplative detachment.
            </div>
            <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EAE1D2]">
              <strong>8 = Shani (Saturn):</strong> Justice, endurance, organizational mastery.
            </div>
            <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EAE1D2]">
              <strong>9 = Mangala (Mars):</strong> Courage, vitality, protection, righteous initiative.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}