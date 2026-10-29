'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Moon } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const NAKSHATRAS_DATA = [
  { id: 1, name: "Ashwini", lord: "Ketu", deity: "Ashwini Kumaras", symbol: "Horse's Head", degrees: "0°00' - 13°20' Aries", meaning: "The Swift Healers, initiative, courage, vital energy." },
  { id: 2, name: "Bharani", lord: "Venus", deity: "Yama", symbol: "Yoni / Boat", degrees: "13°20' - 26°40' Aries", meaning: "The Bearer of Life, endurance, transformation, moral conviction." },
  { id: 3, name: "Krittika", lord: "Sun", deity: "Agni", symbol: "Razor / Flame", degrees: "26°40' Aries - 10°00' Taurus", meaning: "The Sacred Flame, sharp intellect, purification, discernment." },
  { id: 4, name: "Rohini", lord: "Moon", deity: "Brahma / Prajapati", symbol: "Chariot / Temple", degrees: "10°00' - 23°20' Taurus", meaning: "The Growing One, beauty, fertility, artistic brilliance, devotion." },
  { id: 5, name: "Mrigashira", lord: "Mars", deity: "Soma", symbol: "Deer's Head", degrees: "23°20' Taurus - 6°40' Gemini", meaning: "The Searching Star, quest for truth, gentle nature, curiosity." },
  { id: 6, name: "Ardra", lord: "Rahu", deity: "Rudra", symbol: "Teardrop / Diamond", degrees: "6°40' - 20°00' Gemini", meaning: "The Storm of Transformation, catharsis, breaking delusions." },
  { id: 7, name: "Punarvasu", lord: "Jupiter", deity: "Aditi", symbol: "Bow & Quiver", degrees: "20°00' Gemini - 3°20' Cancer", meaning: "The Return of Light, restoration, boundless grace, forgiveness." },
  { id: 8, name: "Pushya", lord: "Saturn", deity: "Brihaspati", symbol: "Cow's Udder / Lotus", degrees: "3°20' - 16°40' Cancer", meaning: "The Supreme Nourisher, wisdom, spiritual guardianship, prosperity." },
  { id: 9, name: "Ashlesha", lord: "Mercury", deity: "Nagas (Serpents)", symbol: "Coiled Serpent", degrees: "16°40' - 30°00' Cancer", meaning: "The Embracing Serpent, deep intuition, psychological insight, kundalini." },
  { id: 10, name: "Magha", lord: "Ketu", deity: "Pitris (Ancestors)", symbol: "Royal Throne", degrees: "0°00' - 13°20' Leo", meaning: "The Great One, ancestral lineage, noble dignity, righteous authority." },
  { id: 11, name: "Purva Phalguni", lord: "Venus", deity: "Bhaga", symbol: "Front Legs of Couch", degrees: "13°20' - 26°40' Leo", meaning: "The Star of Fortune, leisure, romantic union, creative celebration." },
  { id: 12, name: "Uttara Phalguni", lord: "Sun", deity: "Aryaman", symbol: "Back Legs of Bed", degrees: "26°40' Leo - 10°00' Virgo", meaning: "The Patron of Honor, chivalry, steadfast relationships, philanthropic duty." },
  { id: 13, name: "Hasta", lord: "Moon", deity: "Savitr", symbol: "Open Hand / Fist", degrees: "10°00' - 23°20' Virgo", meaning: "The Hand of Skill, craftsmanship, healing touch, precision intellect." },
  { id: 14, name: "Chitra", lord: "Mars", deity: "Vishwakarma", symbol: "Shining Jewel", degrees: "23°20' Virgo - 6°40' Libra", meaning: "The Celestial Architect, aesthetic perfection, structural genius." },
  { id: 15, name: "Swati", lord: "Rahu", deity: "Vayu (Wind)", symbol: "Young Sprout / Sword", degrees: "6°40' - 20°00' Libra", meaning: "The Independent Blade, freedom, adaptability, diplomatic commerce." },
  { id: 16, name: "Vishakha", lord: "Jupiter", deity: "Indra-Agni", symbol: "Triumphal Arch", degrees: "20°00' Libra - 3°20' Scorpio", meaning: "The Star of Purpose, unwavering focus, triumph through perseverance." },
  { id: 17, name: "Anuradha", lord: "Saturn", deity: "Mitra", symbol: "Lotus / Staff", degrees: "3°20' - 16°40' Scorpio", meaning: "The Star of Devotion, friendship, universal harmony, spiritual brotherhood." },
  { id: 18, name: "Jyeshtha", lord: "Mercury", deity: "Indra", symbol: "Circular Amulet", degrees: "16°40' - 30°00' Scorpio", meaning: "The Eldest King, executive leadership, protective fortitude, secret wisdom." },
  { id: 19, name: "Mula", lord: "Ketu", deity: "Nirriti", symbol: "Tied Bunch of Roots", degrees: "0°00' - 13°20' Sagittarius", meaning: "The Root of Truth, penetrating the core, uprooting falsehood." },
  { id: 20, name: "Purva Ashadha", lord: "Venus", deity: "Apas (Cosmic Waters)", symbol: "Fan / Winnowing Basket", degrees: "13°20' - 26°40' Sagittarius", meaning: "The Invincible One, inspirational speech, emotional purification." },
  { id: 21, name: "Uttara Ashadha", lord: "Sun", deity: "Vishwadevas", symbol: "Elephant's Tusk", degrees: "26°40' Sagittarius - 10°00' Capricorn", meaning: "Universal Victory, collective duty, integrity, enduring achievements." },
  { id: 22, name: "Shravana", lord: "Moon", deity: "Vishnu", symbol: "Ear / Three Footsteps", degrees: "10°00' - 23°20' Capricorn", meaning: "The Star of Learning, divine listening, oral wisdom transmission, devotion." },
  { id: 23, name: "Dhanishta", lord: "Mars", deity: "Ashta Vasus", symbol: "Flute / Drum (Mridangam)", degrees: "23°20' Capricorn - 6°40' Aquarius", meaning: "The Symphony of Wealth, musical rhythm, abundance, valor." },
  { id: 24, name: "Shatabhisha", lord: "Rahu", deity: "Varuna", symbol: "100 Physicians / Empty Circle", degrees: "6°40' - 20°00' Aquarius", meaning: "The Hundred Healers, visionary medicines, cosmic laws, solitude." },
  { id: 25, name: "Purva Bhadrapada", lord: "Jupiter", deity: "Aja Ekapada", symbol: "Sword / Two-Faced Man", degrees: "20°00' Aquarius - 3°20' Pisces", meaning: "The Fire Dragon, intense penance, spiritual austerity, esoteric transformation." },
  { id: 26, name: "Uttara Bhadrapada", lord: "Saturn", deity: "Ahirbudhnya", symbol: "Snake of the Deep", degrees: "3°20' - 16°40' Pisces", meaning: "The Deep Serpent, supreme self-restraint, benevolence, wisdom." },
  { id: 27, name: "Revati", lord: "Mercury", deity: "Pushan", symbol: "Fish / Drum", degrees: "16°40' - 30°00' Pisces", meaning: "The Wealthy Nourisher, safe journeys, compassion, final spiritual liberation." },
];

export default function NakshatrasDirectoryPage() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2D1810] py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] text-xs font-semibold uppercase tracking-wider">
            <Moon className="w-3.5 h-3.5 text-[#D97706]" />
            <span>{language === 'mr' ? '२७ चंद्र नक्षत्रे' : 'The 27 Lunar Mansions'}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#2D1810]">
            {language === 'mr' ? '२७ वैदिक नक्षत्रे निर्देशिका' : 'The 27 Vedic Nakshatras'}
          </h1>
          <p className="text-[#786C60] text-sm sm:text-base leading-relaxed">
            {language === 'mr'
              ? 'वैदिक खगोलशास्त्रात चंद्र २७ नक्षत्रांमधून (प्रत्येक १३° २०′) प्रवास करतो, ज्यामुळे मानवी मनाची आणि कर्माची सूक्ष्म रचना तयार होते.'
              : 'In Vedic Astronomy, the Moon traverses 27 Nakshatras (each 13° 20\'), creating the subtle psychological and karmic texture of human consciousness.'}
          </p>
          <div className="pt-2">
            <Link
              href="/nakshatra-finder"
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold shadow-md transition-all"
            >
              <span>{language === 'mr' ? 'माझे जन्म नक्षत्र व चरण शोधा' : 'Calculate My Natal Nakshatra & Pada'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 27 Nakshatras Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {NAKSHATRAS_DATA.map((nak) => (
            <div
              key={nak.id}
              className="bg-white border border-[#EAE1D2] rounded-2xl p-6 hover:border-[#D97706] transition-all hover:shadow-md duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#B45309] uppercase tracking-wider">
                      Nakshatra #{nak.id} • Lord: {nak.lord}
                    </span>
                    <h3 className="font-serif text-xl font-bold text-[#2D1810] group-hover:text-[#D97706] transition-colors">
                      {nak.name}
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#FFFBEB] border border-[#FDE68A] flex items-center justify-center text-xs font-bold text-[#D97706]">
                    #{nak.id}
                  </div>
                </div>

                <div className="text-xs text-[#5C4033] space-y-1.5 pt-2 border-t border-[#EAE1D2]">
                  <div className="flex justify-between">
                    <span className="text-[#786C60]">{language === 'mr' ? 'प्रमुख देवता:' : 'Presiding Deity:'}</span>
                    <strong className="text-[#2D1810]">{nak.deity}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#786C60]">{language === 'mr' ? 'चिन्ह:' : 'Symbol:'}</span>
                    <strong className="text-[#B45309]">{nak.symbol}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#786C60]">{language === 'mr' ? 'विस्तार:' : 'Arc Span:'}</span>
                    <strong className="text-[#D97706] text-[11px] font-mono">{nak.degrees}</strong>
                  </div>
                  <p className="pt-2 text-xs text-[#786C60] leading-relaxed italic">
                    {nak.meaning}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
