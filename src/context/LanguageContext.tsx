"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "id" | "en";

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  id: {
    // Navbar
    nav_features: "Fitur",
    nav_about: "Tentang",
    nav_pricing: "Harga",
    nav_dashboard: "Buka Dashboard",

    // Home Landing
    hero_badge: "Platform Ekosistem Mahasiswa #1",
    hero_title_1: "Satu Platform untuk ",
    hero_title_2: "Belajar, Berkolaborasi,",
    hero_title_3: " dan Berkembang",
    hero_desc: "UniTech menghubungkan mahasiswa dalam ekosistem digital terpadu: cari tim lomba, belajar dengan AI, mentoring sebaya, hingga buka toko digital, semua dalam satu platform.",
    hero_cta_1: "Mulai Sekarang",
    hero_cta_2: "Pelajari Lebih Lanjut",
    stats_mhs: "Mahasiswa Aktif",
    stats_tim: "Tim Terbentuk",
    stats_lomba: "Lomba Tersedia",
    stats_tutor: "Tutor Sebaya",
    features_title_1: "Semua yang Kamu Butuhkan, ",
    features_title_2: "Dalam Satu Platform",
    features_desc: "UniTech menghadirkan layanan terintegrasi untuk mendukung aktivitas akademik, kolaborasi, dan kewirausahaan mahasiswa.",
    features_try: "Coba Sekarang",
    how_title: "Bagaimana UniTech Bekerja?",
    how_desc: "Tiga langkah mudah untuk memulai perjalananmu",
    how_step_1_title: "Daftar & Lengkapi Profil",
    how_step_1_desc: "Buat akun gratis dengan email kampus dan lengkapi profil skill, minat, serta tujuanmu.",
    how_step_2_title: "Temukan & Bergabung",
    how_step_2_desc: "Jelajahi fitur-fitur UniTech: cari tim lomba, mulai belajar dengan AI, atau buka tokomu.",
    how_step_3_title: "Berkolaborasi & Berkembang",
    how_step_3_desc: "Terhubung dengan sesama mahasiswa, bangun portofolio, dan raih prestasi bersama.",
    pricing_title: "Pilih Paket yang Sesuai",
    pricing_desc: "Mulai gratis, upgrade kapan saja sesuai kebutuhanmu",
    pricing_free: "Gratis",
    pricing_free_cta: "Daftar Gratis",
    pricing_premium_cta: "Upgrade Premium",
    pricing_populer: "Populer",
    pricing_free_feat_1: "Daftar akun & join komunitas",
    pricing_free_feat_2: "Cari info lomba & basic matchmaking",
    pricing_free_feat_3: "Akses materi umum & forum",
    pricing_free_feat_4: "Daftar sebagai tutor/seller",
    pricing_premium_feat_1: "Semua fitur Gratis",
    pricing_premium_feat_2: "Kuota AI lebih besar (100x/hari)",
    pricing_premium_feat_3: "Bank soal eksklusif",
    pricing_premium_feat_4: "Advanced team matching (AI)",
    pricing_premium_feat_5: "Portofolio builder & sertifikat",
    pricing_premium_feat_6: "Kelas mentoring eksklusif",
    pricing_premium_feat_7: "Priority exposure di marketplace",
    testimonials_title_1: "Apa Kata Mereka ",
    testimonials_title_2: "Tentang Kami",
    testimonials_desc: "Testimoni nyata dari rekan mahasiswa yang telah meningkatkan prestasi, berkolaborasi, dan berkembang bersama UniTech.",
    cta_title: "Siap Bergabung dengan Komunitas UniTech?",
    cta_desc: "Temukan teman, belajar, dan berkembang bersama. UniTech akan menjadi pintu utama seluruh aktivitas digitalmu.",
    cta_btn: "Daftar Sekarang",

    // UniMatch Prefs Screen
    match_portal: "MATCHMAKING PORTAL",
    match_prefs: "RECRUITMENT PREFERENCES",
    match_prefs_desc: "Tentukan fokus kompetisi dan slot tim yang Anda butuhkan",
    match_step_1: "1. PILIH FOKUS KOMPETISI",
    match_opt_general: "🌐 General / Semua",
    match_opt_general_desc: "Lihat semua kandidat dari segala bidang",
    match_opt_cp: "💻 Competitive Programming (CP)",
    match_opt_cp_desc: "Fokus algoritma & pemecahan masalah cepat",
    match_opt_ctf: "🛡️ Capture The Flag (CTF)",
    match_opt_ctf_desc: "Fokus keamanan siber, hacking & defense",
    match_opt_datamining: "📊 Data Mining & AI",
    match_opt_datamining_desc: "Fokus analisis data, statistik & ML",
    match_opt_uiux: "🎨 UI/UX Design",
    match_opt_uiux_desc: "Fokus desain antarmuka, Figma & prototyping",
    match_step_2: "2. SQUAD SLOTS NEEDED",
    match_step_2_desc: "Berapa banyak anggota tim yang ingin Anda rekrut?",
    match_heroes: "ANGGOTA",
    match_btn_continue: "LANJUTKAN KE AVATAR STUDIO →",

    // UniMatch Customizer
    custom_badge: "CREATE YOUR HERO",
    custom_title: "AVATAR STUDIO",
    custom_desc: "Desain pahlawanmu sebelum memasuki dunia",
    custom_hero: "PAHLAWANMU",
    custom_skin: "WARNA KULIT",
    custom_style: "GAYA RAMBUT",
    custom_hair: "WARNA RAMBUT",
    custom_outfit: "WARNA PAKAIAN",
    custom_acc: "AKSESORIS",
    custom_btn_back: "← PREFS",
    custom_btn_enter: "ENTER WORLD →",

    // UniMatch Select Path
    select_badge: "CHOOSE YOUR PATH",
    select_title: "SELECT PLAY MODE",
    select_desc: "Bagaimana cara Anda mencari rekan satu tim?",
    select_mode_1_title: "RPG Game Mode",
    select_mode_1_desc: "Jelajahi peta kampus 2D pixel art secara bebas, temui kandidat potensial, ajjak ngobrol, cek stat, dan rekrut mereka!",
    select_mode_1_btn: "Masuk Dunia RPG",
    select_mode_2_title: "Swiper Mode",
    select_mode_2_desc: "Antarmuka swipe modern. Telusuri kartu profil kandidat layaknya tinder, cek skill mereka, like atau pass untuk membentuk tim instan!",
    select_mode_2_btn: "Mulai Swiping",
    select_mode_back: "Ubah Avatar Hero",

    // UniMatch Swiper Mode
    swiper_badge: "🔥 UNIMATCH SWIPER",
    swiper_desc: "Geser kanan untuk rekrut • Geser kiri untuk skip",
    swiper_party: "PARTY:",
    swiper_btn_change: "UBAH MODE",
    swiper_deck_completed: "DECK COMPLETED",
    swiper_deck_completed_desc: "Anda telah mengulas semua kandidat yang tersedia.",
    swiper_deck_start_over: "Ulangi Lagi",
    swiper_deck_back: "Kembali",
    swiper_match_title: "IT'S A MATCH!",
    swiper_match_desc: "Anda dan {name} telah bergabung. Mari bangun karya hebat bersama!",
    swiper_match_continue: "LANJUTKAN SWIPING",

    // UniMatch RPG Mode
    rpg_badge: "⚔️ UNIMATCH WORLD",
    rpg_desc: "Jelajahi peta • Bicara dengan pahlawan • Bangun tim kamu",
    rpg_intro_title: "SELAMAT DATANG, PAHLAWAN!",
    rpg_intro_desc: "Jelajahi kampus untuk mencari anggota tim",
    rpg_intro_controls_1: "WASD / Tombol Arah = Gerak bebas",
    rpg_intro_controls_2: "E = Bicara dengan pahlawan terdekat",
    rpg_intro_loading: "Memuat dunia...",
    rpg_hints_1: "WASD / Tombol Arah = Gerak bebas",
    rpg_hints_2: "E = Bicara dengan hero",
    rpg_hints_3: "Tahan tombol untuk jalan • Bisa diagonal!",
    rpg_abilities: "KEMAMPUAN:",
    rpg_recruit_btn: "⚔️ REKRUT!",
    rpg_recruited_badge: "✓ DI TIM KAMU",

    // Extra Landing Features
    feature_unimatch_desc: "Temukan rekan tim lomba yang tepat berdasarkan minat, skill, dan kebutuhan role tim kamu.",
    feature_uniguide_desc: "AI companion akademik yang membantu menyusun roadmap belajar dan merekomendasikan materi relevan.",
    feature_unimentor_desc: "Platform mentoring sebaya dengan jadwal terstruktur, arsip materi, dan umpan balik tutor.",
    feature_studentshop_desc: "Marketplace khusus mahasiswa untuk jual-beli makanan, produk, dan jasa dengan biaya admin rendah.",
    feature_unicompete_desc: "Platform informasi, promosi, dan penyelenggaraan lomba dengan arsip proposal terpusat.",
    feature_community_desc: "Forum diskusi, chat room per kategori, dan ruang komunitas untuk UKM dan organisasi.",

    // Testimonials quotes & roles
    testi_1_quote: "Gokil sih! Fitur UniMatch RPG dan Swiper-nya ngebantu banget pas nyari tim hackathon. Tim kami terbentuk di sini dan berhasil bawa pulang piala Juara 1!",
    testi_1_role: "Teknik Informatika",
    testi_2_quote: "UniGuide AI ngebantu aku bikin roadmap belajar data science dari nol. Sekarang berhasil dapat magang di tech company impian berkat roadmap belajarnya yang presisi.",
    testi_2_role: "Sistem Informasi",
    testi_3_quote: "Jualan aset 3D dan template UI/UX di StudentShop beneran ngebantu nambah uang jajan. Sistemnya instan, terpercaya, dan bebas biaya admin yang memberatkan mahasiswa.",
    testi_3_role: "Desain Komunikasi Visual",

    // Hair styles
    style_spiky: "Spiky",
    style_short: "Pendek",
    style_long: "Panjang",
    style_bun: "Kuncir",

    // Accessories
    acc_none: "Tidak Ada",
    acc_glasses: "Kacamata",
    acc_headband: "Ikat Kepala",
    acc_earring: "Anting",

    // NPCs
    npc_1_title: "Sang Penjaga Backend",
    npc_1_quest: "Mencari tim untuk Hackathon Nasional 2025!",
    npc_2_title: "Sang Penyihir Pixel",
    npc_2_quest: "Mencari tim developer untuk mendesain UI keren!",
    npc_3_title: "Sang Peramal Data",
    npc_3_quest: "Butuh frontend + desainer untuk kompetisi visualisasi data!",
    npc_4_title: "Ahli Strategi Misi",
    npc_4_quest: "Membangun tim rencana bisnis terbaik!",
    npc_5_title: "Penjaga Frontend",
    npc_5_quest: "UI cepat & pixel-perfect, mari bergabung!",
    npc_6_title: "Bayangan Mobile",
    npc_6_quest: "Spesialis dev mobile sedang mencari regu kompetisi!",

    // Dashboard
    dash_hello: "Halo, {name}! 👋",
    dash_welcome: "Selamat datang kembali di UniTech",
    dash_action_match: "Cari Tim",
    dash_action_guide: "Tanya AI",
    dash_action_mentor: "Mentoring",
    dash_action_shop: "Belanja",
    dash_action_compete: "Lomba",
    dash_action_community: "Komunitas",
    dash_stats_title: "Statistik Kamu",
    dash_stats_ai: "AI Queries Hari Ini",
    dash_stats_team: "Tim Aktif",
    dash_stats_mentor: "Mentoring Diikuti",
    dash_stats_compete: "Lomba Terdaftar",
    dash_premium_upgrade: "Upgrade Premium",
    dash_premium_desc: "Kuota AI 100x/hari, bank soal eksklusif, dan advanced matching.",
    dash_comp_title: "Lomba Terbaru",
    dash_see_all: "Lihat Semua",
    dash_ment_title: "Mentoring Mendatang",
    dash_by: "oleh",
    dash_participants: "peserta",
    dash_today: "Hari ini",
    dash_tomorrow: "Besok",
    dash_tag_nasional: "Nasional",
    dash_tag_kampus: "Kampus",
  },
  en: {
    // Navbar
    nav_features: "Features",
    nav_about: "About",
    nav_pricing: "Pricing",
    nav_dashboard: "Open Dashboard",

    // Home Landing
    hero_badge: "#1 Student Ecosystem Platform",
    hero_title_1: "One Platform to ",
    hero_title_2: "Learn, Collaborate,",
    hero_title_3: " and Grow",
    hero_desc: "UniTech connects students in an integrated digital ecosystem: find competition teams, study with AI, join peer mentoring, and launch digital shops, all in one platform.",
    hero_cta_1: "Get Started",
    hero_cta_2: "Learn More",
    stats_mhs: "Active Students",
    stats_tim: "Teams Formed",
    stats_lomba: "Competitions",
    stats_tutor: "Peer Mentors",
    features_title_1: "Everything You Need, ",
    features_title_2: "In One Platform",
    features_desc: "UniTech delivers integrated services to support student academic activities, collaboration, and entrepreneurship.",
    features_try: "Try It Now",
    how_title: "How UniTech Works?",
    how_desc: "Three easy steps to start your journey",
    how_step_1_title: "Register & Complete Profile",
    how_step_1_desc: "Create a free account with your campus email and set up your skills, interests, and goals.",
    how_step_2_title: "Explore & Join",
    how_step_2_desc: "Explore UniTech features: find competition squads, learn with AI support, or launch your shop.",
    how_step_3_title: "Collaborate & Grow",
    how_step_3_desc: "Connect with fellow students, build your portfolio, and achieve milestones together.",
    pricing_title: "Choose the Right Plan",
    pricing_desc: "Start for free, upgrade anytime based on your goals",
    pricing_free: "Free",
    pricing_free_cta: "Sign Up Free",
    pricing_premium_cta: "Upgrade Premium",
    pricing_populer: "Popular",
    pricing_free_feat_1: "Register account & join communities",
    pricing_free_feat_2: "Search competitions & basic matchmaking",
    pricing_free_feat_3: "Access public files & forums",
    pricing_free_feat_4: "List as a tutor or seller",
    pricing_premium_feat_1: "All Free features included",
    pricing_premium_feat_2: "Higher AI quota limit (100x/day)",
    pricing_premium_feat_3: "Exclusive exam study banks",
    pricing_premium_feat_4: "Advanced team matching (AI)",
    pricing_premium_feat_5: "Portfolio builder & certificate",
    pricing_premium_feat_6: "Exclusive mentoring classes",
    pricing_premium_feat_7: "Priority exposure in marketplace",
    testimonials_title_1: "What They Said ",
    testimonials_title_2: "About Us",
    testimonials_desc: "Real testimonials from fellow students who have boosted achievements, collaborated, and grown with UniTech.",
    cta_title: "Ready to Join the UniTech Community?",
    cta_desc: "Find teammates, study, and grow together. UniTech will be the portal to all your digital activities.",
    cta_btn: "Join Now",

    // UniMatch Prefs Screen
    match_portal: "MATCHMAKING PORTAL",
    match_prefs: "RECRUITMENT PREFERENCES",
    match_prefs_desc: "Specify your target competition and team slots needed",
    match_step_1: "1. CHOOSE COMPETITION FOCUS",
    match_opt_general: "🌐 General / All",
    match_opt_general_desc: "See all candidates from all fields",
    match_opt_cp: "💻 Competitive Programming (CP)",
    match_opt_cp_desc: "Focus on algorithms & fast problem solving",
    match_opt_ctf: "🛡️ Capture The Flag (CTF)",
    match_opt_ctf_desc: "Focus on cybersecurity, hacking & defense",
    match_opt_datamining: "📊 Data Mining & AI",
    match_opt_datamining_desc: "Focus on data analysis, statistics & ML",
    match_opt_uiux: "🎨 UI/UX Design",
    match_opt_uiux_desc: "Focus on interface design, Figma & prototyping",
    match_step_2: "2. SQUAD SLOTS NEEDED",
    match_step_2_desc: "How many team members do you want to recruit?",
    match_heroes: "MEMBERS",
    match_btn_continue: "CONTINUE TO AVATAR STUDIO →",

    // UniMatch Customizer
    custom_badge: "CREATE YOUR HERO",
    custom_title: "AVATAR STUDIO",
    custom_desc: "Design your hero before entering the world",
    custom_hero: "YOUR HERO",
    custom_skin: "SKIN TONE",
    custom_style: "HAIR STYLE",
    custom_hair: "HAIR COLOR",
    custom_outfit: "OUTFIT COLOR",
    custom_acc: "ACCESSORIES",
    custom_btn_back: "← PREFS",
    custom_btn_enter: "ENTER WORLD →",

    // UniMatch Select Path
    select_badge: "CHOOSE YOUR PATH",
    select_title: "SELECT PLAY MODE",
    select_desc: "How do you want to find your team squad?",
    select_mode_1_title: "RPG Game Mode",
    select_mode_1_desc: "Explore the campus 2D pixel world map freely, walk up to potential candidates, chat, inspect stats, and recruit them into your party!",
    select_mode_1_btn: "Enter RPG World",
    select_mode_2_title: "Swiper Mode",
    select_mode_2_desc: "A modern swipe layout. Go through candidate profile cards tinder-style, view their tech stacks, like or pass to build your ultimate squad instantly!",
    select_mode_2_btn: "Start Swiping",
    select_mode_back: "Edit Hero Avatar",

    // UniMatch Swiper Mode
    swiper_badge: "🔥 UNIMATCH SWIPER",
    swiper_desc: "Swipe right to recruit • Swipe left to pass",
    swiper_party: "PARTY:",
    swiper_btn_change: "CHANGE MODE",
    swiper_deck_completed: "DECK COMPLETED",
    swiper_deck_completed_desc: "You have swiped through all available candidates.",
    swiper_deck_start_over: "Start Over",
    swiper_deck_back: "Back",
    swiper_match_title: "IT'S A MATCH!",
    swiper_match_desc: "You and {name} have joined forces. Let's build something amazing together!",
    swiper_match_continue: "CONTINUE SWIPING",

    // UniMatch RPG Mode
    rpg_badge: "⚔️ UNIMATCH WORLD",
    rpg_desc: "Walk around • Talk to heroes • Build your party",
    rpg_intro_title: "WELCOME, HERO!",
    rpg_intro_desc: "Explore the campus to find your party",
    rpg_intro_controls_1: "WASD / Arrow Keys = Move freely",
    rpg_intro_controls_2: "E = Talk to nearby hero",
    rpg_intro_loading: "Loading world...",
    rpg_hints_1: "WASD / Arrow Keys = Move freely",
    rpg_hints_2: "E = Talk to hero",
    rpg_hints_3: "Hold keys to move • Diagonal works too!",
    rpg_abilities: "ABILITIES:",
    rpg_recruit_btn: "⚔️ RECRUIT!",
    rpg_recruited_badge: "✓ IN YOUR PARTY",

    // Extra Landing Features
    feature_unimatch_desc: "Find the right competition teammates based on your interests, skills, and team role needs.",
    feature_uniguide_desc: "An academic AI companion that helps build a learning roadmap and recommends relevant materials.",
    feature_unimentor_desc: "Peer mentoring platform with structured schedules, material archives, and tutor feedback.",
    feature_studentshop_desc: "Student-exclusive marketplace to buy and sell food, products, and services with low admin fees.",
    feature_unicompete_desc: "Information, promotion, and competition platform with centralized proposal archives.",
    feature_community_desc: "Discussion forum, categorized chat rooms, and community space for student clubs and organizations.",

    // Testimonials quotes & roles
    testi_1_quote: "Crazy good! The UniMatch RPG and Swiper features really helped when searching for a hackathon team. Our team was formed here and we brought home the 1st Place trophy!",
    testi_1_role: "Informatics Engineering",
    testi_2_quote: "UniGuide AI helped me build a data science learning roadmap from scratch. Now I got an internship at my dream tech company thanks to its precise learning roadmap.",
    testi_2_role: "Information Systems",
    testi_3_quote: "Selling 3D assets and UI/UX templates on StudentShop really helped pocket extra money. The system is instant, trusted, and free of administrative fees that burden students.",
    testi_3_role: "Visual Communication Design",

    // Hair styles
    style_spiky: "Spiky",
    style_short: "Short",
    style_long: "Long",
    style_bun: "Bun",

    // Accessories
    acc_none: "None",
    acc_glasses: "Glasses",
    acc_headband: "Headband",
    acc_earring: "Earring",

    // NPCs
    npc_1_title: "The Backend Guardian",
    npc_1_quest: "Seeking a team for Hackathon Nasional 2025!",
    npc_2_title: "The Pixel Enchantress",
    npc_2_quest: "Looking for a dev team to design amazing UIs!",
    npc_3_title: "The Data Oracle",
    npc_3_quest: "Need a frontend + designer for data viz competition!",
    npc_4_title: "The Quest Strategist",
    npc_4_quest: "Building the ultimate business plan team!",
    npc_5_title: "The Frontend Ranger",
    npc_5_quest: "Fast & pixel-perfect UIs, let's team up!",
    npc_6_title: "The Mobile Shadow",
    npc_6_quest: "Mobile dev specialist seeking competition squad!",

    // Dashboard
    dash_hello: "Hello, {name}! 👋",
    dash_welcome: "Welcome back to UniTech",
    dash_action_match: "Find Team",
    dash_action_guide: "Ask AI",
    dash_action_mentor: "Mentoring",
    dash_action_shop: "Shop",
    dash_action_compete: "Competitions",
    dash_action_community: "Community",
    dash_stats_title: "Your Statistics",
    dash_stats_ai: "AI Queries Today",
    dash_stats_team: "Active Teams",
    dash_stats_mentor: "Mentoring Joined",
    dash_stats_compete: "Registered Competitions",
    dash_premium_upgrade: "Upgrade Premium",
    dash_premium_desc: "AI quota 100x/day, exclusive study bank, and advanced matching.",
    dash_comp_title: "Latest Competitions",
    dash_see_all: "See All",
    dash_ment_title: "Upcoming Mentoring",
    dash_by: "by",
    dash_participants: "participants",
    dash_today: "Today",
    dash_tomorrow: "Tomorrow",
    dash_tag_nasional: "National",
    dash_tag_kampus: "Campus",
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("id");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("unitech_lang") as Language;
    if (saved && (saved === "id" || saved === "en")) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("unitech_lang", lang);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === "id" ? "en" : "id");
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
