'use client';

import React, { useState } from 'react';
import { api } from '@/lib/api';
import { POPULAR_CITIES } from '@/lib/cities';
import { useLanguage } from '@/context/LanguageContext';
import { Heart, Sparkles, CheckCircle2, AlertTriangle, ShieldCheck, ChevronRight } from 'lucide-react';

export default function CompatibilityPage() {
  const { language, t, translateSign, formatNumber } = useLanguage();
  const [boyName, setBoyName] = useState('Rahul Verma');
  const [boyDob, setBoyDob] = useState('1993-04-12');
  const [boyTob, setBoyTob] = useState('08:30');
  const [boyCity, setBoyCity] = useState(POPULAR_CITIES[0]);

  const [girlName, setGirlName] = useState('Pooja Iyer');
  const [girlDob, setGirlDob] = useState('1995-11-20');
  const [girlTob, setGirlTob] = useState('14:45');
  const [girlCity, setGirlCity] = useState(POPULAR_CITIES[1]);

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const boyBirth = {
        fullName: boyName,
        dateOfBirth: boyDob,
        timeOfBirth: boyTob,
        placeOfBirth: boyCity.name,
        latitude: boyCity.latitude,
        longitude: boyCity.longitude,
      };

      const girlBirth = {
        fullName: girlName,
        dateOfBirth: girlDob,
        timeOfBirth: girlTob,
        placeOfBirth: girlCity.name,
        latitude: girlCity.latitude,
        longitude: girlCity.longitude,
      };

      const res = await api.calculateCompatibility(boyBirth, girlBirth);
      setResult(res);
    } catch (err: any) {
      alert(err.message || 'Error matching Kundlis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen text-[#2D1810] pb-24 font-sans">
      {/* Banner */}
      <section className="bg-gradient-to-b from-[#FFFDF9] via-[#FAF7F2] to-[#FFF9EB] py-14 px-4 sm:px-6 lg:px-8 border-b border-[#EAE1D2] text-center">
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 bg-[#FFFBEB] border border-[#FDE68A] px-3.5 py-1 rounded-full text-xs font-semibold text-[#92400E]">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>{language === 'mr' ? 'अष्टकूट विवाह गुणमेलन (३६ गुण)' : 'Ashta Kuta Milan (36 Gunas)'}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2D1810]">
            {language === 'mr' ? 'कुंडली मिलन आणि गुणमेलन' : 'Kundli Compatibility & Guna Milan'}
          </h1>
          <p className="text-xs sm:text-sm text-[#786C60] max-w-xl mx-auto leading-relaxed">
            {language === 'mr'
              ? 'वर आणि वधू यांच्या चंद्र कुंडली व नक्षत्रावर आधारित शास्त्रीय ३६ गुण मिलन विश्लेषण.'
              : 'Calculate classical 36-point marriage compatibility between prospective partners across all 8 Vedic Kutas.'}
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-10">
        {/* Form Inputs */}
        <form onSubmit={handleMatch} className="bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-[#EAE1D2] shadow-sm space-y-6 sm:space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Boy Birth Box */}
            <div className="p-4 sm:p-6 bg-[#FFFDF9] rounded-2xl border border-[#EAE1D2] space-y-4">
              <div className="flex items-center space-x-2 border-b border-[#F5EFE6] pb-2.5">
                <span className="w-3 h-3 rounded-full bg-blue-500" />
                <h3 className="font-serif text-base font-bold text-[#2D1810]">
                  {language === 'mr' ? 'वराचे जन्मतपशील (वर)' : "Boy's Birth Details (Vara)"}
                </h3>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A2E18] mb-1.5">{language === 'mr' ? 'पूर्ण नाव' : 'Full Name'}</label>
                <input
                  type="text"
                  value={boyName}
                  onChange={(e) => setBoyName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#EAE1D2] rounded-xl text-xs text-[#2D1810] focus:outline-none focus:border-[#F59E0B]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#4A2E18] mb-1.5">{language === 'mr' ? 'जन्मतारीख' : 'Date of Birth'}</label>
                  <input
                    type="date"
                    value={boyDob}
                    onChange={(e) => setBoyDob(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#EAE1D2] rounded-xl text-xs text-[#2D1810] focus:outline-none focus:border-[#F59E0B]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4A2E18] mb-1.5">{language === 'mr' ? 'जन्मवेळ' : 'Time of Birth'}</label>
                  <input
                    type="time"
                    value={boyTob}
                    onChange={(e) => setBoyTob(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#EAE1D2] rounded-xl text-xs text-[#2D1810] focus:outline-none focus:border-[#F59E0B]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A2E18] mb-1.5">{language === 'mr' ? 'जन्मस्थान' : 'Birth City'}</label>
                <select
                  value={boyCity.name}
                  onChange={(e) => {
                    const c = POPULAR_CITIES.find((city) => city.name === e.target.value);
                    if (c) setBoyCity(c);
                  }}
                  className="w-full px-3 py-2.5 bg-white border border-[#EAE1D2] rounded-xl text-xs text-[#2D1810] focus:outline-none focus:border-[#F59E0B]"
                >
                  {POPULAR_CITIES.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name} ({c.stateCountry})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Girl Birth Box */}
            <div className="p-4 sm:p-6 bg-[#FFFDF9] rounded-2xl border border-[#EAE1D2] space-y-4">
              <div className="flex items-center space-x-2 border-b border-[#F5EFE6] pb-2.5">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <h3 className="font-serif text-base font-bold text-[#2D1810]">
                  {language === 'mr' ? 'वधूचे जन्मतपशील (वधू)' : "Girl's Birth Details (Kanya)"}
                </h3>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A2E18] mb-1.5">{language === 'mr' ? 'पूर्ण नाव' : 'Full Name'}</label>
                <input
                  type="text"
                  value={girlName}
                  onChange={(e) => setGirlName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#EAE1D2] rounded-xl text-xs text-[#2D1810] focus:outline-none focus:border-[#F59E0B]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#4A2E18] mb-1.5">{language === 'mr' ? 'जन्मतारीख' : 'Date of Birth'}</label>
                  <input
                    type="date"
                    value={girlDob}
                    onChange={(e) => setGirlDob(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#EAE1D2] rounded-xl text-xs text-[#2D1810] focus:outline-none focus:border-[#F59E0B]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4A2E18] mb-1.5">{language === 'mr' ? 'जन्मवेळ' : 'Time of Birth'}</label>
                  <input
                    type="time"
                    value={girlTob}
                    onChange={(e) => setGirlTob(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#EAE1D2] rounded-xl text-xs text-[#2D1810] focus:outline-none focus:border-[#F59E0B]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A2E18] mb-1.5">{language === 'mr' ? 'जन्मस्थान' : 'Birth City'}</label>
                <select
                  value={girlCity.name}
                  onChange={(e) => {
                    const c = POPULAR_CITIES.find((city) => city.name === e.target.value);
                    if (c) setGirlCity(c);
                  }}
                  className="w-full px-3 py-2.5 bg-white border border-[#EAE1D2] rounded-xl text-xs text-[#2D1810] focus:outline-none focus:border-[#F59E0B]"
                >
                  {POPULAR_CITIES.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name} ({c.stateCountry})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white font-serif font-bold text-sm rounded-xl shadow-md hover:shadow-lg hover:from-[#D97706] hover:to-[#B45309] transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span>{language === 'mr' ? '३६ गुणांचे गुणमेलन करत आहे...' : 'Matching 36 Kuta Gunas...'}</span>
            ) : (
              <>
                <Heart className="w-4 h-4 fill-white" />
                <span>{language === 'mr' ? '३६ गुण गुणमेलन काढा' : 'Calculate 36 Guna Milan'}</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Results */}
        {result && (
          <div className="bg-white text-[#2D1810] p-4 sm:p-6 md:p-10 rounded-3xl border-2 border-[#FDE68A] shadow-md space-y-6 sm:space-y-8 animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-[#F5EFE6] gap-4">
              <div>
                <span className="text-[10px] text-[#D97706] font-bold uppercase tracking-wider bg-[#FFFBEB] px-3 py-1 rounded-full border border-[#FDE68A] inline-block mb-1">
                  {language === 'mr' ? 'गुणमेलन निकाल' : 'Match Evaluation Result'}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2D1810] mt-1">
                  {result.gunaMilan?.totalScore} / 36 {language === 'mr' ? 'गुण' : 'Gunas'}
                </h3>
                <p className="text-xs text-[#786C60] mt-1">
                  {result.gunaMilan?.recommendation}
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right text-xs">
                  <div className="text-[#786C60]">
                    {language === 'mr' ? 'वर:' : 'Boy:'} <strong className="text-[#2D1810]">{translateSign(result.boyChart?.moonSign?.signName)}</strong>
                  </div>
                  <div className="text-[#786C60]">
                    {language === 'mr' ? 'वधू:' : 'Girl:'} <strong className="text-[#2D1810]">{translateSign(result.girlChart?.moonSign?.signName)}</strong>
                  </div>
                </div>
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex flex-col items-center justify-center font-bold text-base sm:text-lg shadow-sm ${
                    result.gunaMilan?.totalScore >= 18
                      ? 'bg-emerald-50 text-emerald-800 border-2 border-emerald-300'
                      : 'bg-rose-50 text-rose-800 border-2 border-rose-300'
                  }`}
                >
                  <span>{result.gunaMilan?.totalScore}</span>
                  <span className="text-[10px] font-normal">/36</span>
                </div>
              </div>
            </div>

            {/* Kutas Table */}
            <div className="space-y-4">
              <h4 className="font-serif text-lg font-bold text-[#2D1810]">
                {language === 'mr' ? '८ अष्टकूट सविस्तर विश्लेषण' : '8 Ashta Kuta Detailed Breakdown'}
              </h4>

              <div className="overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0">
                <table className="w-full text-left text-xs border-collapse min-w-[500px]">
                  <thead>
                    <tr className="border-b border-[#EAE1D2] bg-[#FAF7F2] text-[#4A2E18] font-bold">
                      <th className="py-3 px-3">{language === 'mr' ? 'कूट नाव' : 'Kuta'}</th>
                      <th className="py-3 px-3">{language === 'mr' ? 'कमाल गुण' : 'Max Points'}</th>
                      <th className="py-3 px-3">{language === 'mr' ? 'प्राप्त गुण' : 'Obtained'}</th>
                      <th className="py-3 px-3">{language === 'mr' ? 'क्षेत्र / विश्लेषण' : 'Domain / Description'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F5EFE6] text-[#2D1810]">
                    {(result.gunaMilan?.kutas || []).map((k: any, idx: number) => (
                      <tr key={idx} className="hover:bg-[#FFFDF9]">
                        <td className="py-2.5 px-3 font-bold text-[#2D1810]">
                          {k.name} ({k.sanskrit})
                        </td>
                        <td className="py-2.5 px-3 font-mono font-semibold text-[#786C60]">{k.maxPoints}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-[#B45309]">
                          {k.obtainedPoints}
                        </td>
                        <td className="py-2.5 px-3 text-[#6B5A4E]">
                          {k.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Dosha & Remedial Advice */}
            <div className="p-5 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] text-xs text-[#78350F] flex items-start space-x-3">
              <ShieldCheck className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="block font-bold">
                  {language === 'mr' ? 'ज्योतिषीय सल्ला आणि नाडी/भकूट दोष विचार:' : 'Vedic Astrological Guidance & Dosha Analysis:'}
                </strong>
                <p className="leading-relaxed">
                  {language === 'mr'
                    ? 'अष्टकूट मिलनात १८ किंवा त्यापेक्षा जास्त गुण विवाहानुकूल मानले जातात. नाडी किंवा भकूट दोषासाठी अनुभवी ज्योतिषांचा सल्ला घ्यावा.'
                    : 'A score of 18 or higher is traditionally considered auspicious for marriage. In case of Nadi or Bhakoot variations, our certified Vedic pandits can suggest authentic shanti pujas.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
