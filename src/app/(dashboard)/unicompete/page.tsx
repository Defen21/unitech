"use client";

import { useState } from "react";
import { Trophy, Search, Users, Clock, Bookmark } from "lucide-react";

const tabs = ["Semua Lomba", "Diikuti", "Arsip"];
const categories = ["Semua", "Pemrograman", "UI/UX", "Business Plan", "Data Science", "Cyber Security", "IoT"];

interface Competition {
  title: string;
  organizer: string;
  deadline: string;
  prize: string;
  tag: string;
  tagColor: string;
  participants: number;
  maxTeam: number;
  instagram: string;
  description: string;
  partners: string[];
  imagePath?: string;
  poster: {
    gradient: string;
    bgPattern: string;
    icon: string;
    accent: string;
    decoColor: string;
    year: string;
    badge: string;
  };
}

const competitions: Competition[] = [
  {
    title: "Coding & Algorithms Tournament (CAT) 2026",
    organizer: "Ecommurz & CSRelatedCompetitions",
    deadline: "Extended - see catournament.org",
    prize: "IDR 135,000,000",
    tag: "Nasional", tagColor: "bg-red-500/10 text-red-400",
    participants: 87, maxTeam: 1,
    instagram: "@csrelatedcompetitions",
    description: "A nationwide competitive programming open to ALL Indonesians worldwide. No LLMs. No vibe coding. Just you, your raw logic, and the anxiety of a time limit.",
    partners: ["Google Cloud", "Virtu Financial", "Indosat", "DANA", "HRT"],
    imagePath: "/cat2026.png",
    poster: {
      gradient: "from-red-600 via-orange-500 to-yellow-500",
      bgPattern: "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 40%)",
      icon: "💻", accent: "bg-white/20", decoColor: "white",
      year: "2026", badge: "🏆 COMPETITIVE PROGRAMMING",
    },
  },
  {
    title: "V HACK 2026: All in One",
    organizer: "Universiti Sains Malaysia (USM)",
    deadline: "14 Maret 2026",
    prize: "To be announced",
    tag: "Internasional", tagColor: "bg-purple-500/10 text-purple-400",
    participants: 42, maxTeam: 4,
    instagram: "@csrelatedcompetitions",
    description: "Showcase your skills & ideas. Build, Innovate & Compete. Hackathon themes: Artificial Intelligence, Blockchain, and Web Applications.",
    partners: [],
    imagePath: "/vhack2026.png",
    poster: {
      gradient: "from-violet-600 via-purple-500 to-pink-500",
      bgPattern: "radial-gradient(circle at 70% 70%, rgba(255,255,255,0.12) 0%, transparent 50%), linear-gradient(135deg, rgba(255,255,255,0.05) 25%, transparent 25%)",
      icon: "⚡", accent: "bg-white/20", decoColor: "white",
      year: "2026", badge: "🚀 HACKATHON",
    },
  },
  {
    title: "Project 2030: MyAI Future Hackathon",
    organizer: "GDG on Campus UTM (Google Developer Groups)",
    deadline: "20 April 2026",
    prize: "RM 15,000",
    tag: "Internasional", tagColor: "bg-purple-500/10 text-purple-400",
    participants: 56, maxTeam: 4,
    instagram: "@csrelatedcompetitions",
    description: "A national AI innovation challenge under the Build with AI initiative. Build AI-powered solutions using Google technologies across Agrotech, GovTech, Healthcare, Smart Cities, and FinTech.",
    partners: ["Google", "UTM"],
    imagePath: "/project2030.png",
    poster: {
      gradient: "from-emerald-600 via-teal-500 to-cyan-500",
      bgPattern: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(255,255,255,0.06) 0%, transparent 50%)",
      icon: "🧠", accent: "bg-white/20", decoColor: "white",
      year: "2026", badge: "🤖 AI HACKATHON",
    },
  },
  {
    title: "ICPC Algo Queen 2026 - The Girls' Programming Cup",
    organizer: "ICPC Foundation & Amrita Vishwa Vidyapeetham",
    deadline: "11 Mei - Agustus 2026",
    prize: "₹3,00,000+ (≈Rp 55 Juta+)",
    tag: "Global", tagColor: "bg-pink-500/10 text-pink-400",
    participants: 120, maxTeam: 1,
    instagram: "@csrelatedcompetitions",
    description: "The International Competitive Programming Competition for Girls. Empowering the next generation of women in tech. Completely FREE for both school and college students.",
    partners: ["ICPC Foundation", "CodeChef"],
    imagePath: "/algoqueen2026.png",
    poster: {
      gradient: "from-pink-500 via-rose-500 to-fuchsia-600",
      bgPattern: "radial-gradient(circle at 50% 0%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(circle at 0% 100%, rgba(255,255,255,0.08) 0%, transparent 40%)",
      icon: "👑", accent: "bg-white/20", decoColor: "white",
      year: "2026", badge: "👩‍💻 WOMEN IN TECH",
    },
  },
  {
    title: "TECHNOTAINMENT '26 - UI/UX Design Competition",
    organizer: "Telkom University",
    deadline: "Juni 2026",
    prize: "To be announced",
    tag: "Kampus", tagColor: "bg-blue-500/10 text-blue-400",
    participants: 25, maxTeam: 3,
    instagram: "@csrelatedcompetitions",
    description: "Integrating Technology and Creativity. Technotainment tahun ini kembali menghadirkan kompetisi UI/UX Design untuk mahasiswa dan umum.",
    partners: [],
    imagePath: "/technotainment2026.png",
    poster: {
      gradient: "from-blue-700 via-indigo-600 to-purple-700",
      bgPattern: "radial-gradient(circle at 80% 30%, rgba(255,255,255,0.1) 0%, transparent 40%), radial-gradient(circle at 20% 70%, rgba(255,255,255,0.06) 0%, transparent 50%)",
      icon: "🎨", accent: "bg-white/20", decoColor: "white",
      year: "2026", badge: "🎨 UI/UX DESIGN",
    },
  },
];

// ============ POSTER COMPONENT ============
function CompetitionPoster({ poster, title, imagePath }: { poster: Competition["poster"]; title: string; imagePath?: string }) {
  return (
    <div className="relative overflow-hidden rounded-t-xl h-44 sm:h-48 group">
      {imagePath ? (
        <img 
          src={imagePath} 
          alt={title} 
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <>
          <div className={`absolute inset-0 bg-gradient-to-br ${poster.gradient}`} />
          {/* Background pattern */}
          <div className="absolute inset-0" style={{ backgroundImage: poster.bgPattern }} />

          {/* Decorative shapes */}
          <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full opacity-10" style={{ background: poster.decoColor }} />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full opacity-8" style={{ background: poster.decoColor, opacity: 0.08 }} />
          <div className="absolute top-4 right-4 w-16 h-16 rounded-full opacity-10" style={{ background: poster.decoColor }} />
          <div className="absolute bottom-8 right-12 w-6 h-6 rotate-45 opacity-15" style={{ background: poster.decoColor }} />
          <div className="absolute top-12 left-8 w-4 h-4 rotate-12 opacity-20" style={{ background: poster.decoColor }} />

          {/* Decorative lines */}
          <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 400 200" fill="none">
            <line x1="0" y1="200" x2="400" y2="0" stroke={poster.decoColor} strokeWidth="1" />
            <line x1="50" y1="200" x2="400" y2="50" stroke={poster.decoColor} strokeWidth="0.5" />
            <line x1="0" y1="150" x2="350" y2="0" stroke={poster.decoColor} strokeWidth="0.5" />
          </svg>

          {/* Main icon */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className={`w-16 h-16 ${poster.accent} backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl shadow-lg border border-white/10`}>
              {poster.icon}
            </div>
          </div>

          {/* Decorative dots grid */}
          <div className="absolute bottom-3 left-3 grid grid-cols-5 gap-1 opacity-20">
            {Array.from({ length: 15 }).map((_, i) => (
              <div key={i} className="w-1 h-1 rounded-full" style={{ background: poster.decoColor }} />
            ))}
          </div>
        </>
      )}

      {/* Badge */}
      <div className="absolute top-3 left-3 z-10">
        <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white text-[10px] font-bold tracking-wider">
          {poster.badge}
        </span>
      </div>

      {/* Year watermark */}
      <div className="absolute -right-2 top-1/2 -translate-y-1/2 z-10">
        <span className="text-[72px] font-black text-white/[0.07] leading-none select-none">{poster.year}</span>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/40 to-transparent z-10" />
    </div>
  );
}

// ============ MAIN COMPONENT ============
export default function UniCompetePage() {
  const [activeTab, setActiveTab] = useState("Semua Lomba");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());

  const toggleBookmark = (title: string) => {
    setBookmarked(prev => {
      const n = new Set(prev);
      n.has(title) ? n.delete(title) : n.add(title);
      return n;
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">UniCompete</h1>
          <p className="text-muted-foreground text-sm mt-1">Temukan lomba, bentuk tim, dan raih prestasi bersama</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white rounded-lg gradient-bg hover:opacity-90 transition-opacity">
          <Trophy size={16} /> Buat Lomba
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted rounded-lg p-1 w-fit">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${activeTab === tab ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Search & Categories */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input type="text" placeholder="Cari lomba..." className="w-full pl-10 pr-4 py-2.5 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground" />
        </div>
        <select className="px-4 py-2.5 text-sm border border-border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground">
          {categories.map((cat) => (<option key={cat}>{cat}</option>))}
        </select>
      </div>

      {/* Competitions with Posters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {competitions.map((c) => (
          <div key={c.title} className="card-hover rounded-xl bg-card border border-border overflow-hidden group">
            {/* Poster Banner */}
            <CompetitionPoster poster={c.poster} title={c.title} imagePath={c.imagePath} />

            {/* Card Body */}
            <div className="p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${c.tagColor}`}>{c.tag}</span>
                    <span className="text-[10px] text-muted-foreground">{c.organizer}</span>
                  </div>
                  <h3 className="font-semibold text-sm leading-snug">{c.title}</h3>
                </div>
                <button onClick={() => toggleBookmark(c.title)} className="p-1.5 hover:bg-muted rounded-lg transition-colors shrink-0">
                  <Bookmark size={16} className={bookmarked.has(c.title) ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"} />
                </button>
              </div>

              {/* Description */}
              <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">{c.description}</p>

              <div className="space-y-2 text-xs text-muted-foreground mb-3">
                <div className="flex items-center gap-2">
                  <Clock size={12} className="text-red-400 shrink-0" />
                  <span>Deadline: <strong className="text-foreground">{c.deadline}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy size={12} className="text-yellow-500 shrink-0" />
                  <span>Total Hadiah: <strong className="text-foreground">{c.prize}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={12} className="text-blue-400 shrink-0" />
                  <span>Peserta: <strong>{c.participants}</strong> {c.maxTeam > 1 ? `(Max ${c.maxTeam}/tim)` : "(Individu)"}</span>
                </div>
              </div>

              {/* Partners */}
              {c.partners.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {c.partners.map((p) => (
                    <span key={p} className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium">{p}</span>
                  ))}
                </div>
              )}

              {/* Instagram Source */}
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-4">
                <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                <span>Source: {c.instagram}</span>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 py-2.5 text-sm font-medium text-white rounded-lg gradient-bg hover:opacity-90 transition-opacity">
                  Daftar Lomba
                </button>
                <button className="py-2.5 px-3 text-sm font-medium border border-border rounded-lg bg-card hover:bg-muted transition-colors flex items-center gap-1 text-foreground">
                  <Users size={14} /> Cari Tim
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
