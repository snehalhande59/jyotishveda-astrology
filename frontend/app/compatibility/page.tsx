'use client';

import React, { useState } from 'react';
import { api } from '@/lib/api';
import { POPULAR_CITIES } from '@/lib/cities';
import { Heart, Sparkles, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function CompatibilityPage() {
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
    <div className="bg-[#FAF6F0] min-h-screen text-[#1A1423] pb-24 font-sans">
      {/* Banner */}
      <section className="bg-gradient-to-b from-[#0F0B1E] via-[#150D2A] to-[#1E1138] text-[#FDFBF7] py-16 px-4 sm:px-6 lg:px-8 border-b border-[#D4AF37]/20 text-center">
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 bg-[#25184B] border border-[#D4AF37]/40 px-3 py-1 rounded-full text-xs text-[#F7DF94]">
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
            <span>Ashta Kuta Milan (36 Gunas)</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FDFBF7]">
            Kundli Compatibility &amp; Guna Milan
          </h1>
          <p className="text-xs sm:text-sm text-[#D8C7A5] max-w-xl mx-auto">
            Calculate classical 36-point marriage compatibility between prospective partners across all 8 Vedic Kutas.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-12">
        {/* Form Inputs */}
        <form onSubmit={handleMatch} className="bg-white p-6 sm:p-10 rounded-3xl border border-[#D4AF37]/25 shadow-sm space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Boy Birth Box */}
            <div className="p-6 bg-[#FAF6F0] rounded-2xl border border-[#D4AF37]/30 space-y-4">
              <div className="flex items-center space-x-2 border-b border-[#D4AF37]/20 pb-2">
                <span className="w-3 h-3 rounded-full bg-blue-500" />
                <h3 className="font-serif text-base font-bold text-[#150D2A]">Boy&apos;s Birth Details (Var)</h3>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={boyName}
                  onChange={(e) => setBoyName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={boyDob}
                    onChange={(e) => setBoyDob(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Time of Birth</label>
                  <input
                    type="time"
                    value={boyTob}
                    onChange={(e) => setBoyTob(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Birth City</label>
                <select
                  value={boyCity.name}
                  onChange={(e) => {
                    const c = POPULAR_CITIES.find((city) => city.name === e.target.value);
                    if (c) setBoyCity(c);
                  }}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs"
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
            <div className="p-6 bg-[#FAF6F0] rounded-2xl border border-[#D4AF37]/30 space-y-4">
              <div className="flex items-center space-x-2 border-b border-[#D4AF37]/20 pb-2">
                <span className="w-3 h-3 rounded-full bg-pink-500" />
                <h3 className="font-serif text-base font-bold text-[#150D2A]">Girl&apos;s Birth Details (Kanya)</h3>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={girlName}
                  onChange={(e) => setGirlName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={girlDob}
                    onChange={(e) => setGirlDob(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Time of Birth</label>
                  <input
                    type="time"
                    value={girlTob}
                    onChange={(e) => setGirlTob(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Birth City</label>
                <select
                  value={girlCity.name}
                  onChange={(e) => {
                    const c = POPULAR_CITIES.find((city) => city.name === e.target.value);
                    if (c) setGirlCity(c);
                  }}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs"
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
            className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#A67C1E] text-[#0F0B1E] font-serif font-bold text-sm rounded-xl shadow-gold hover:opacity-95 transition-all flex items-center justify-center space-x-2"
          >
            {loading ? (
              <span>Matching 36 Kuta Gunas...</span>
            ) : (
              <>
                <Heart className="w-4 h-4" />
                <span>Calculate 36 Guna Milan</span>
              </>
            )}
          </button>
        </form>

        {/* Results */}
        {result && (
          <div className="bg-[#150D2A] text-[#FDFBF7] p-6 sm:p-10 rounded-3xl border-2 border-[#D4AF37] shadow-cosmic space-y-8 animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-[#D4AF37]/20 gap-4">
              <div>
                <span className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-wider block">
                  Match Evaluation Result
                </span>
                <h3 className="font-serif text-3xl font-bold text-[#F7DF94]">
                  {result.gunaMilan.totalScore} / 36 Gunas ({result.gunaMilan.percentage}%)
                </h3>
                <p className="text-xs text-[#D8C7A5] mt-1 font-semibold">
                  Status: {result.gunaMilan.recommendation}
                </p>
              </div>

              <div className="px-5 py-2.5 bg-[#25184B] rounded-xl border border-[#D4AF37]/40 text-xs">
                {result.gunaMilan.totalScore >= 18 ? (
                  <span className="text-emerald-400 font-bold flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Auspicious Match (Approved)</span>
                  </span>
                ) : (
                  <span className="text-amber-400 font-bold flex items-center space-x-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Astrological Remedies Advised</span>
                  </span>
                )}
              </div>
            </div>

            {/* 8 Kutas Table Breakdown */}
            <div className="space-y-3">
              <h4 className="font-serif text-lg font-bold text-[#F7DF94]">
                The 8 Classical Kutas (Ashta Kuta Breakdown)
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#D4AF37]/30 bg-[#191233] text-[#F7DF94]">
                      <th className="py-2.5 px-4">Kuta Name</th>
                      <th className="py-2.5 px-4">Significance</th>
                      <th className="py-2.5 px-4">Points Obtained</th>
                      <th className="py-2.5 px-4">Maximum Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D4AF37]/15 text-[#D8C7A5]">
                    <tr>
                      <td className="py-2.5 px-4 font-bold text-[#FDFBF7]">1. Varna</td>
                      <td className="py-2.5 px-4">Work ego &amp; spiritual harmony</td>
                      <td className="py-2.5 px-4 font-bold text-[#D4AF37]">{result.gunaMilan.kutas.varna.points}</td>
                      <td className="py-2.5 px-4">1</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-bold text-[#FDFBF7]">2. Vashya</td>
                      <td className="py-2.5 px-4">Mutual influence &amp; respect</td>
                      <td className="py-2.5 px-4 font-bold text-[#D4AF37]">{result.gunaMilan.kutas.vashya.points}</td>
                      <td className="py-2.5 px-4">2</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-bold text-[#FDFBF7]">3. Tara</td>
                      <td className="py-2.5 px-4">Birth star destiny &amp; longevity</td>
                      <td className="py-2.5 px-4 font-bold text-[#D4AF37]">{result.gunaMilan.kutas.tara.points}</td>
                      <td className="py-2.5 px-4">3</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-bold text-[#FDFBF7]">4. Yoni</td>
                      <td className="py-2.5 px-4">Physical &amp; intimate compatibility</td>
                      <td className="py-2.5 px-4 font-bold text-[#D4AF37]">{result.gunaMilan.kutas.yoni.points}</td>
                      <td className="py-2.5 px-4">4</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-bold text-[#FDFBF7]">5. Graha Maitri</td>
                      <td className="py-2.5 px-4">Mental friendship &amp; intellectual rapport</td>
                      <td className="py-2.5 px-4 font-bold text-[#D4AF37]">{result.gunaMilan.kutas.grahaMaitri.points}</td>
                      <td className="py-2.5 px-4">5</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-bold text-[#FDFBF7]">6. Gana</td>
                      <td className="py-2.5 px-4">Temperament (Deva, Manushya, Rakshasa)</td>
                      <td className="py-2.5 px-4 font-bold text-[#D4AF37]">{result.gunaMilan.kutas.gana.points}</td>
                      <td className="py-2.5 px-4">6</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-bold text-[#FDFBF7]">7. Bhakoot</td>
                      <td className="py-2.5 px-4">Family welfare, children &amp; finances</td>
                      <td className="py-2.5 px-4 font-bold text-[#D4AF37]">{result.gunaMilan.kutas.bhakoot.points}</td>
                      <td className="py-2.5 px-4">7</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-bold text-[#FDFBF7]">8. Nadi</td>
                      <td className="py-2.5 px-4">Genetic &amp; constitutional harmony</td>
                      <td className="py-2.5 px-4 font-bold text-[#D4AF37]">{result.gunaMilan.kutas.nadi.points}</td>
                      <td className="py-2.5 px-4">8</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-[#0F0B1E] p-4 rounded-xl border border-[#D4AF37]/20 text-xs text-[#D8C7A5]/80 flex items-start space-x-2">
              <ShieldCheck className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
              <p>
                <strong>Vedic Matching Principle:</strong> A score of 18 or above (out of 36) is traditionally deemed acceptable for marriage. In addition to Guna Milan, consultation on Manglik Dosha and 7th house strength is recommended.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
