import React, { useState, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { DollyGallery, type DollyGalleryHandle } from "@/components/ui/dolly-gallery";
import { ChevronLeft, ChevronRight } from "lucide-react";
import abhishekFront from "@/assets/BackgroundRemove/AbhishekFront.png";
import abhishekBack from "@/assets/BackgroundRemove/AbhishekBack.png";
import bharadwajFront from "@/assets/BackgroundRemove/BharadwajFront.png";
import bharadwajBack from "@/assets/BackgroundRemove/BharadwajBack.png";
import kavyaFront from "@/assets/BackgroundRemove/KavyaFront.png";
import kavyaBack from "@/assets/BackgroundRemove/KavyaBack.png";
import manojFront from "@/assets/BackgroundRemove/ManojFront.png";
import manojBack from "@/assets/BackgroundRemove/ManojBack.png";
import neerajFront from "@/assets/BackgroundRemove/NeerajFront.png";
import neerajBack from "@/assets/BackgroundRemove/NeerajBack.png";
import nidhiFront from "@/assets/BackgroundRemove/NidhiFront.png";
import nidhiBack from "@/assets/BackgroundRemove/NidhiBack.png";
import praveenFront from "@/assets/BackgroundRemove/PraveenFront.png";
import praveenBack from "@/assets/BackgroundRemove/PraveenBack.png";
import ramFront from "@/assets/BackgroundRemove/RamFront.png";
import ramBack from "@/assets/BackgroundRemove/RamBack.png";
import yuvarajFront from "@/assets/BackgroundRemove/YuvarajFront.png";
import yuvarajBack from "@/assets/BackgroundRemove/YuvarajBack.png";

import { Crown, HeartHandshake, Network, Terminal } from "lucide-react";

type Category = "founder" | "hr" | "community" | "engineering";

interface TeamMember {
  name: string;
  category: Category;
  label: string;
  badge: string;
  department: string;
  description: string;
  tags: string[];
  frontImage: string;
  backImage: string;
}

interface CategoryTheme {
  name: string;
  icon: typeof Crown;
  badgeBg: string;
  borderFocused: string;
  nameGradient: string;
  rolePill: string;
  pulseDot: string;
  tagClass: string;
  activeDot: string;
  inactiveDot: string;
  orb1: string;
  orb2: string;
  cornerDot: string;
}

const CATEGORY_THEMES: Record<Category, CategoryTheme> = {
  founder: {
    name: "Founders",
    icon: Crown,
    badgeBg: "bg-gradient-to-r from-[#65cff7] via-sky-300 to-[#38bdf8] text-black shadow-[0_0_20px_rgba(101,207,247,0.45)]",
    borderFocused: "border-[#65cff7]/80 shadow-[0_0_70px_rgba(101,207,247,0.35)] bg-gradient-to-br from-neutral-900/98 via-neutral-950/98 to-black",
    nameGradient: "bg-gradient-to-r from-sky-100 via-[#65cff7] to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_2px_22px_rgba(101,207,247,0.4)]",
    rolePill: "bg-[#65cff7]/15 text-[#65cff7] border-[#65cff7]/40 shadow-[0_0_18px_rgba(101,207,247,0.2)]",
    pulseDot: "bg-[#65cff7]",
    tagClass: "bg-[#65cff7]/10 text-[#65cff7] border-[#65cff7]/25",
    activeDot: "w-9 bg-[#65cff7] shadow-[0_0_16px_rgba(101,207,247,0.85)]",
    inactiveDot: "bg-[#65cff7]/30 hover:bg-[#65cff7]/50",
    orb1: "bg-[#65cff7]/20",
    orb2: "bg-sky-400/12",
    cornerDot: "bg-[#65cff7] shadow-[0_0_12px_rgba(101,207,247,0.85)]",
  },
  hr: {
    name: "Human Resources",
    icon: HeartHandshake,
    badgeBg: "bg-gradient-to-r from-rose-400 via-pink-400 to-rose-500 text-black shadow-[0_0_20px_rgba(244,63,94,0.45)]",
    borderFocused: "border-rose-400/80 shadow-[0_0_70px_rgba(244,63,94,0.35)] bg-gradient-to-br from-neutral-900/98 via-neutral-950/98 to-black",
    nameGradient: "bg-gradient-to-r from-rose-200 via-pink-100 to-rose-400 bg-clip-text text-transparent drop-shadow-[0_2px_22px_rgba(244,63,94,0.4)]",
    rolePill: "bg-rose-400/15 text-rose-200 border-rose-400/40 shadow-[0_0_18px_rgba(244,63,94,0.2)]",
    pulseDot: "bg-rose-400",
    tagClass: "bg-rose-400/10 text-rose-200/90 border-rose-400/25",
    activeDot: "w-9 bg-rose-400 shadow-[0_0_16px_rgba(244,63,94,0.85)]",
    inactiveDot: "bg-rose-400/30 hover:bg-rose-400/50",
    orb1: "bg-rose-500/20",
    orb2: "bg-pink-400/12",
    cornerDot: "bg-rose-400 shadow-[0_0_12px_rgba(245,158,11,0.85)]",
  },
  community: {
    name: "Community",
    icon: Network,
    badgeBg: "bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.45)]",
    borderFocused: "border-emerald-400/80 shadow-[0_0_70px_rgba(16,185,129,0.35)] bg-gradient-to-br from-neutral-900/98 via-neutral-950/98 to-black",
    nameGradient: "bg-gradient-to-r from-emerald-200 via-teal-100 to-emerald-400 bg-clip-text text-transparent drop-shadow-[0_2px_22px_rgba(16,185,129,0.4)]",
    rolePill: "bg-emerald-400/15 text-emerald-200 border-emerald-400/40 shadow-[0_0_18px_rgba(16,185,129,0.2)]",
    pulseDot: "bg-emerald-400",
    tagClass: "bg-emerald-400/10 text-emerald-200/90 border-emerald-400/25",
    activeDot: "w-9 bg-emerald-400 shadow-[0_0_16px_rgba(16,185,129,0.85)]",
    inactiveDot: "bg-emerald-400/30 hover:bg-emerald-400/50",
    orb1: "bg-emerald-500/20",
    orb2: "bg-teal-400/12",
    cornerDot: "bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.85)]",
  },
  engineering: {
    name: "Engineering & AI",
    icon: Terminal,
    badgeBg: "bg-gradient-to-r from-purple-400 via-fuchsia-400 to-indigo-500 text-black shadow-[0_0_20px_rgba(168,85,247,0.45)]",
    borderFocused: "border-purple-400/80 shadow-[0_0_70px_rgba(168,85,247,0.35)] bg-gradient-to-br from-neutral-900/98 via-neutral-950/98 to-black",
    nameGradient: "bg-gradient-to-r from-purple-200 via-fuchsia-100 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_2px_22px_rgba(168,85,247,0.4)]",
    rolePill: "bg-purple-500/15 text-purple-200 border-purple-400/40 shadow-[0_0_18px_rgba(168,85,247,0.2)]",
    pulseDot: "bg-purple-400",
    tagClass: "bg-purple-400/10 text-purple-200/90 border-purple-400/25",
    activeDot: "w-9 bg-purple-400 shadow-[0_0_16px_rgba(168,85,247,0.85)]",
    inactiveDot: "bg-purple-400/30 hover:bg-purple-400/50",
    orb1: "bg-purple-600/20",
    orb2: "bg-indigo-400/12",
    cornerDot: "bg-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.85)]",
  },
};

const members: TeamMember[] = [
  {
    name: "Bugtha Bharadwaj",
    category: "founder",
    label: "Director, COO",
    badge: "Founder & Director",
    department: "Executive Leadership",
    description:
      "Directs operational architecture, enterprise execution, and nationwide business scaling across all Getsetai delivery verticals.",
    tags: ["Operations Strategy", "Scale & Execution", "Enterprise Alliances"],
    frontImage: bharadwajFront,
    backImage: bharadwajBack,
  },
  {
    name: "Abhishek Sahoo",
    category: "founder",
    label: "Director, CEO",
    badge: "Founder & Director",
    department: "Executive Leadership",
    description:
      "Architects corporate strategy, technological roadmap, and AI-driven platforms, spearheading Getsetai's innovation ecosystem.",
    tags: ["Corporate Vision", "Product Architecture", "AI Ecosystem"],
    frontImage: abhishekFront,
    backImage: abhishekBack,
  },
  {
    name: "Nidhi Galande",
    category: "hr",
    label: "Human Resources Lead",
    badge: "People & Culture",
    department: "People Operations",
    description:
      "Fosters talent acquisition, employee wellness, and cultural vitality, cultivating a supportive and high-growth team environment.",
    tags: ["Talent Acquisition", "Employee Growth", "Workplace Culture"],
    frontImage: nidhiFront,
    backImage: nidhiBack,
  },
  {
    name: "Kavya Sucharitha",
    category: "hr",
    label: "People Operations",
    badge: "People & Culture",
    department: "Human Resources",
    description:
      "Oversees team engagement, talent pipelines, and organizational practices to empower cross-functional teams to excel.",
    tags: ["People Operations", "Talent Pipeline", "Culture Strategy"],
    frontImage: kavyaFront,
    backImage: kavyaBack,
  },
  {
    name: "Ram Charan",
    category: "community",
    label: "Head Of Community",
    badge: "Community & Ecosystem",
    department: "Developer Relations",
    description:
      "Builds and mobilizes Getsetai's nationwide developer ecosystem, hackathons, academic outreach, and student-creator networks.",
    tags: ["Developer Relations", "Community Growth", "Ecosystem Scale"],
    frontImage: ramFront,
    backImage: ramBack,
  },
  {
    name: "Yuvraj Yadav",
    category: "engineering",
    label: "Chief Technical Officer",
    badge: "Engineering Leadership",
    department: "Systems Architecture",
    description:
      "Directs high-scale cloud infrastructure, backend microservices, and technical excellence across enterprise AI software systems.",
    tags: ["Cloud Architecture", "Distributed Systems", "Tech Direction"],
    frontImage: yuvarajFront,
    backImage: yuvarajBack,
  },
  {
    name: "Gajula Neeraj Kumar",
    category: "engineering",
    label: "Full Stack Developer",
    badge: "Core Engineering",
    department: "Platform Engineering",
    description:
      "Specializes in modern reactive web architectures, secure REST/GraphQL APIs, and resilient full-stack deployment pipelines.",
    tags: ["Full Stack Systems", "API Architectures", "Performance"],
    frontImage: neerajFront,
    backImage: neerajBack,
  },
  {
    name: "Nelluri Praveen Sai",
    category: "engineering",
    label: "Full Stack Developer",
    badge: "Core Engineering",
    department: "Product Engineering",
    description:
      "Crafts high-performance interactive interfaces, intuitive user journeys, and seamless full-stack AI platform integrations.",
    tags: ["Next-Gen Web", "Reactive Architecture", "Full Stack AI"],
    frontImage: praveenFront,
    backImage: praveenBack,
  },
  {
    name: "Manoj",
    category: "engineering",
    label: "AI Engineer",
    badge: "Artificial Intelligence",
    department: "Applied AI Research",
    description:
      "Designs autonomous agentic pipelines, custom neural model integrations, and LLM-powered enterprise automation workflows.",
    tags: ["Agentic AI", "LLM Workflows", "Neural Pipelines"],
    frontImage: manojFront,
    backImage: manojBack,
  },
];

interface HangingIdCardProps {
  member: TeamMember;
  theme: CategoryTheme;
  isFocused: boolean;
  index: number;
}

function HangingIdCard({ member, theme, isFocused, index }: HangingIdCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="relative shrink-0 flex flex-col items-center justify-start h-full w-full sm:w-60 md:w-64 lg:w-72 select-none">
      {/* Top Lanyard Mounting Clamp anchored directly at the top border of the details box */}
      <div className="relative -mt-6 sm:-mt-8 md:-mt-10 z-20 flex flex-col items-center pointer-events-none drop-shadow-lg">
        <div className="w-16 h-3.5 rounded-b-md bg-gradient-to-b from-neutral-700 via-neutral-800 to-neutral-900 border-x border-b border-white/25 shadow-[0_4px_12px_rgba(0,0,0,0.85)] flex items-center justify-center">
          <div className="w-9 h-1 rounded-full bg-black/95 border border-neutral-600/70" />
        </div>
      </div>

      {/* Hanging Badge Container with realistic pendulum sway & 3D perspective */}
      <div
        className={`group/badge relative w-full h-[460px] sm:h-[490px] md:h-[515px] lg:h-[530px] flex items-center justify-center origin-top transition-transform duration-500 ease-out cursor-pointer perspective-1000 ${
          isFocused ? "animate-badge-sway" : ""
        }`}
        onMouseEnter={() => setIsFlipped(true)}
        onMouseLeave={() => setIsFlipped(false)}
        onClick={() => setIsFlipped((prev) => !prev)}
        title="Hover or tap to flip ID card"
      >
        {/* Ambient Back Glow matching Category Theme */}
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-64 rounded-full blur-2xl pointer-events-none transition-opacity duration-700 ${
            isFocused ? `${theme.orb1} opacity-70` : "opacity-0"
          }`}
        />

        {/* 3D Flip Card */}
        <div
          className={`relative w-full h-full flex items-center justify-center transition-transform duration-700 ease-out preserve-3d origin-top ${
            isFlipped ? "rotate-y-180" : "group-hover/badge:rotate-y-180"
          }`}
          style={{
            transform: isFlipped ? "rotateY(180deg)" : undefined,
          }}
        >
          {/* Front Face: Avatar ID Card */}
          <div className="absolute inset-0 flex items-center justify-center backface-hidden">
            <div className="relative h-full aspect-[941/1670] flex items-center justify-center">
              <img
                src={member.frontImage}
                alt={`${member.name} Avatar ID`}
                draggable={false}
                className="w-full h-full object-contain object-top drop-shadow-[0_24px_40px_rgba(0,0,0,0.7)] transition-transform duration-500 group-hover/badge:scale-[1.02]"
              />

              {/* Interactive Flip Hint Pill */}
              <div className="absolute top-[26%] right-0 px-2.5 py-1 rounded-full text-[9px] font-bold tracking-wider uppercase bg-black/85 backdrop-blur-md text-neutral-200 border border-white/20 flex items-center gap-1.5 shadow-xl transition-opacity duration-300 group-hover/badge:opacity-0 pointer-events-none">
                <span className={`w-1.5 h-1.5 rounded-full ${theme.pulseDot} animate-pulse`} />
                <span>Hover to flip</span>
              </div>
            </div>
          </div>

          {/* Back Face: Original Photo ID Card with printed Name and Designation */}
          <div
            className="absolute inset-0 flex items-center justify-center backface-hidden rotate-y-180"
            style={{ transform: "rotateY(180deg)" }}
          >
            <div className="relative h-full aspect-[941/1670] flex items-center justify-center">
              <img
                src={member.backImage}
                alt={`${member.name} Original Photo ID`}
                draggable={false}
                className="w-full h-full object-contain object-top drop-shadow-[0_24px_40px_rgba(0,0,0,0.7)] transition-transform duration-500 group-hover/badge:scale-[1.02]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TeamPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const galleryRef = useRef<DollyGalleryHandle>(null);
  const activeMember = members[activeIndex] || members[0];
  const activeTheme = CATEGORY_THEMES[activeMember.category];
  const ActiveIcon = activeTheme.icon;

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-[var(--background,#050505)] text-[var(--foreground,#fff)] flex flex-col justify-between pt-24 pb-8 overflow-x-clip selection:bg-purple-500/30 w-full">
      {/* Top Header Bar */}
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 z-20 shrink-0">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className={`inline-block w-2.5 h-2.5 rounded-full ${activeTheme.pulseDot} animate-pulse`} />
            <span className="text-xs uppercase tracking-[0.25em] text-neutral-400 font-semibold">
              Getsetai Innovations
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-none">
            Our Team
          </h1>
        </div>

        {/* Current Active Category Pill & Step Indicator */}
        <div className="flex items-center flex-wrap gap-3 text-xs tracking-wider text-neutral-400">
          {/* Live Category Pill */}
          <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border transition-all duration-300 font-medium ${activeTheme.rolePill}`}>
            <ActiveIcon className="w-3.5 h-3.5 shrink-0" />
            <span className="capitalize">{activeTheme.name}</span>
          </div>

          <div className="font-mono text-sm px-3.5 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-neutral-300 shadow-inner">
            <span className="text-white font-bold">{String(activeIndex + 1).padStart(2, "0")}</span>
            <span className="text-neutral-500 mx-1.5">/</span>
            <span>{String(members.length).padStart(2, "0")}</span>
          </div>
        </div>
      </div>

      {/* 3D Dolly Gallery (Full Page, Wide Highlight Cards) */}
      <div 
        className="w-full h-[620px] sm:h-[680px] md:h-[720px] lg:h-[760px] relative flex items-center justify-center"
      >
        <DollyGallery
          ref={galleryRef}
          items={members}
          infinite={false}
          itemWidth={860}
          aspectRatio={1.55}
          borderRadius={32}
          perspective={1100}
          spacing={700}
          spread={0.28}
          scatter={0.04}
          revealRange={2.2}
          passRange={0.8}
          parallaxX={0.08}
          parallaxY={0.05}
          parallaxSmooth={0.85}
          tilt={3.5}
          pulse={0.02}
          drift={0.04}
          smooth={0.88}
          wheelSpeed={1}
          dragSpeed={1.2}
          className="w-full h-full"
          onIndexChange={(idx) => setActiveIndex(idx)}
          renderItem={(member: TeamMember, _index: number, isFocused: boolean) => {
            const theme = CATEGORY_THEMES[member.category];
            const IconComponent = theme.icon;

            return (
              <div
                className={`relative w-full h-full rounded-[32px] overflow-hidden border transition-all duration-500 select-none p-6 sm:p-8 md:p-10 flex flex-col justify-between ${
                  isFocused
                    ? theme.borderFocused
                    : "border-white/10 bg-neutral-950/90 shadow-[0_20px_50px_rgba(0,0,0,0.7)] opacity-75"
                }`}
              >
                {/* Atmospheric Ambient Lighting matching category color */}
                <div
                  className={`absolute -right-16 -top-16 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-opacity duration-500 ${
                    isFocused ? `${theme.orb1} opacity-100` : "opacity-0"
                  }`}
                />
                <div
                  className={`absolute -left-16 -bottom-16 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-opacity duration-500 ${
                    isFocused ? `${theme.orb2} opacity-100` : "opacity-0"
                  }`}
                />

                {/* Subtle tech grid background watermark */}
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />

                {/* Wide Card Content: Horizontal Split on Desktop/Tablet */}
                <div className="relative z-10 w-full h-full flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10">
                  {/* Left Column: Details, Hierarchy & Typography */}
                  <div className="flex-1 flex flex-col justify-between h-full w-full text-left py-1">
                    {/* Top Row: Category Badge + Department + Step Index */}
                    <div className="flex items-center flex-wrap gap-2.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest ${theme.badgeBg}`}
                      >
                        <IconComponent className="w-3 h-3" />
                        {member.badge}
                      </span>

                      <span className="px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-medium tracking-wide bg-white/5 text-neutral-300 border border-white/10 backdrop-blur-sm">
                        {member.department}
                      </span>

                      <span className="font-mono text-xs text-neutral-500 ml-auto">
                        #{String(_index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    {/* Middle: Member Name, Role Pill, and Rich Bio */}
                    <div className="my-auto py-2 md:py-3">
                      <h2
                        className={`font-black tracking-tight leading-tight uppercase transition-all duration-300 text-2xl sm:text-4xl md:text-5xl ${
                          isFocused ? theme.nameGradient : "text-neutral-400"
                        }`}
                      >
                        {member.name}
                      </h2>

                      {/* Role Pill with pulsing color indicator */}
                      <div className="mt-2.5 mb-3 flex items-center gap-3">
                        <div
                          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold tracking-wide border transition-all duration-300 ${
                            isFocused ? theme.rolePill : "bg-white/5 text-neutral-400 border-white/10"
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${isFocused ? theme.pulseDot : "bg-neutral-500"} animate-pulse`} />
                          <span>{member.label}</span>
                        </div>
                        <span className="text-xs text-neutral-500 uppercase tracking-widest font-mono hidden sm:inline">
                          Getsetai
                        </span>
                      </div>

                      {/* 2-Sentence Bio / Impact description */}
                      <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-xl line-clamp-3">
                        {member.description}
                      </p>

                      {/* Skill & Focus Tag Pills */}
                      <div className="mt-3.5 flex flex-wrap gap-2">
                        {member.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium border transition-colors ${
                              isFocused ? theme.tagClass : "bg-white/5 text-neutral-400 border-white/10"
                            }`}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Card Footer Info */}
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
                      <span className="tracking-wide text-neutral-400">HQ · Bhilai / Bengaluru</span>
                      <span className="font-mono text-[11px] text-neutral-500">
                        {_index === 0
                          ? "Starting Member"
                          : _index === members.length - 1
                            ? "Final Member"
                            : `Team Member ${_index + 1} of ${members.length}`}
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Suspended ID Card hanging from details box */}
                  <HangingIdCard
                    member={member}
                    theme={theme}
                    isFocused={isFocused}
                    index={_index}
                  />
                </div>
              </div>
            );
          }}
        />
      </div>

      {/* Bottom Interactive Navigation Controls with Category-Colored Dots */}
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 flex items-center justify-between gap-4 z-20 shrink-0 pt-2">
        {/* Previous Button */}
        <button
          onClick={() => galleryRef.current?.prev()}
          disabled={activeIndex === 0}
          aria-label="Previous team member"
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all duration-300 text-xs sm:text-sm font-semibold ${
            activeIndex === 0
              ? "opacity-30 border-white/5 text-neutral-600 cursor-not-allowed"
              : "border-white/15 bg-white/5 hover:bg-white/10 text-white hover:border-white/40 cursor-pointer shadow-lg active:scale-95"
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Member Dots: Colored by their specific category! */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {members.map((m, i) => {
            const mTheme = CATEGORY_THEMES[m.category];
            const isActive = i === activeIndex;

            return (
              <button
                key={m.name}
                onClick={() => galleryRef.current?.scrollToIndex(i)}
                aria-label={`Jump to ${m.name}`}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  isActive ? mTheme.activeDot : mTheme.inactiveDot
                }`}
                title={`${i + 1}. ${m.name} (${mTheme.name} · ${m.label})`}
              />
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={() => galleryRef.current?.next()}
          disabled={activeIndex === members.length - 1}
          aria-label="Next team member"
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all duration-300 text-xs sm:text-sm font-semibold ${
            activeIndex === members.length - 1
              ? "opacity-30 border-white/5 text-neutral-600 cursor-not-allowed"
              : "border-white/15 bg-white/5 hover:bg-white/10 text-white hover:border-white/40 cursor-pointer shadow-lg active:scale-95"
          }`}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Team — Getsetai Innovations" },
      {
        name: "description",
        content:
          "Meet the Getsetai Innovations team building AI products, digital experiences, and growth systems.",
      },
      { property: "og:title", content: "Team — Getsetai Innovations" },
      {
        property: "og:description",
        content:
          "A multidisciplinary team covering design, product, engineering, strategy, and marketing.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/team" }],
  }),
  component: TeamPage,
});
