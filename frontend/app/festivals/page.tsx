"use client";

import React, { useState, useEffect } from "react";
import festivals from "@/data/festivals-2027.json";
import { useLanguage } from "@/context/LanguageContext";
import { Calendar, Clock, Search, Loader2 } from "lucide-react";

// Simple type for festival entries
interface Festival {
  date: string; // ISO YYYY-MM-DD
  nameEn: string;
  nameMr: string;
  descriptionEn: string;
  descriptionMr: string;
}

export default function FestivalsPage() {
  const { language, t } = useLanguage();
  const isMr = language === "mr";
  const [upcoming, setUpcoming] = useState<Festival[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Parse dates and filter upcoming relative to today
    const today = new Date();
    const upcomingList = festivals
      .map((f: Festival) => ({ ...f, dateObj: new Date(f.date) }))
      .filter((f) => f.dateObj >= today)
      .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
    setUpcoming(upcomingList as any);
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2D1810] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#2D1810]">
            {isMr ? "आगामी सण व महापर्व 2027" : "Upcoming Festivals & Holy Days 2027"}
          </h1>
          <p className="text-[#786C60] text-sm max-w-lg mx-auto">
            {isMr
              ? "वेदिक कॅलेंडरवर आधारित २०२७ मधील प्रमुख सणांच्या तारखा आणि थोडकमे" :
                "Key festivals for the year 2027 according to the Vedic calendar"}
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center space-x-2 text-[#D97706]">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm font-medium">
              {isMr ? "डेटा लोड होत आहे..." : "Loading festival data..."}
            </span>
          </div>
        )}

        {/* Festival list */}
        {!loading && upcoming.length > 0 && (
          <div className="space-y-4">
            {upcoming.map((f, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#EAE1D2] rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row justify-between"
              >
                <div className="flex items-center space-x-3 mb-3 sm:mb-0">
                  <Calendar className="w-5 h-5 text-[#D97706]" />
                  <span className="font-bold text-[#2D1810]">
                    {new Date(f.date).toLocaleDateString(language, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex-1 sm:ml-6">
                  <h3 className="text-lg font-semibold text-[#2D1810]">
                    {isMr ? f.nameMr : f.nameEn}
                  </h3>
                  <p className="text-sm text-[#786C60] mt-1">
                    {isMr ? f.descriptionMr : f.descriptionEn}
                  </p>
                </div>
                <div className="flex items-center mt-2 sm:mt-0 sm:ml-4">
                  <Clock className="w-4 h-4 text-[#D97706] mr-1" />
                  <span className="text-xs text-[#786C60]">{f.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No upcoming */}
        {!loading && upcoming.length === 0 && (
          <div className="text-center text-[#786C60]">
            {isMr ? "आणखी सण नाहीत उपलब्ध." : "No upcoming festivals found."}
          </div>
        )}
      </div>
    </div>
  );
}
