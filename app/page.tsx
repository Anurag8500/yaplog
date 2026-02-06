"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { 
  Brain, 
  Mic, 
  Sparkles, 
  History, 
  Lightbulb, 
  ArrowRight,
  Menu,
  X
} from "lucide-react";

// --- Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        isScrolled
          ? "bg-neutral-950/80 backdrop-blur-md border-white/5 py-4"
          : "bg-transparent border-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer">
          <span className="text-xl font-bold tracking-tight text-white">
            YAPLOG
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-neutral-400 hover:text-white transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="text-sm text-neutral-400 hover:text-white transition-colors">
            How it Works
          </a>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-6">
          <button className="text-sm text-neutral-300 hover:text-white transition-colors">
            Sign In
          </button>
          <button className="px-5 py-2.5 rounded-full bg-white text-black text-sm font-medium hover:bg-neutral-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            Get Started
          </button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-neutral-300"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 bg-neutral-950 border-b border-white/10 p-6 md:hidden flex flex-col gap-4"
        >
          <a href="#features" className="text-neutral-400 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Features</a>
          <a href="#how-it-works" className="text-neutral-400 hover:text-white" onClick={() => setMobileMenuOpen(false)}>How it Works</a>
          <div className="h-px bg-white/10 my-2" />
          <button className="text-left text-neutral-300 hover:text-white">Sign In</button>
          <button className="px-5 py-2.5 rounded-full bg-white text-black text-sm font-medium text-center">
            Get Started
          </button>
        </motion.div>
      )}
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20 overflow-hidden">
      {/* Background Gradient Spot */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 max-w-4xl mx-auto"
      >
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 text-white">
          YAPLOG
        </h1>
        <h2 className="text-xl md:text-3xl text-neutral-400 font-light leading-relaxed mb-8 max-w-2xl mx-auto">
          A place where your mind can breathe. <br className="hidden md:block" />
          Organize your thoughts. Remember your life.
        </h2>
        <p className="text-sm md:text-base text-neutral-500 mb-12 tracking-wide">
          Turn everyday conversations into lasting memory.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <button className="px-8 py-3.5 rounded-full bg-white text-black text-base font-medium hover:bg-neutral-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:scale-105 active:scale-95">
            Start Yapping
          </button>
          <button className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors group">
            <span>How it works</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </motion.div>
    </section>
  );
};

const Problem = () => {
  return (
    <section className="py-32 px-6 bg-neutral-950">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-12 text-3xl md:text-5xl font-light leading-tight text-neutral-500">
          <motion.p
            initial={{ opacity: 0.2, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            Memory is fragile.
          </motion.p>
          <motion.p
            initial={{ opacity: 0.2, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Conversations vanish.
          </motion.p>
          <motion.p
            initial={{ opacity: 0.2, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Valuable insights from your daily life are lost in the noise.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-white font-normal pt-8"
          >
            What if you could capture everything without trying?
          </motion.p>
        </div>
      </div>
    </section>
  );
};

const phases = [
  {
    id: "01",
    title: "Chaos Thinking",
    desc: "The constant stream of unfiltered thoughts.",
  },
  {
    id: "02",
    title: "AI Understanding",
    desc: "Recognizing intent, emotion, and context.",
  },
  {
    id: "03",
    title: "Memory Formation",
    desc: "Storing vital details for the long term.",
  },
  {
    id: "04",
    title: "Insight Generation",
    desc: "Connecting dots you didn't see before.",
  },
  {
    id: "05",
    title: "Decision Guidance",
    desc: "Turning intelligence into action.",
  },
];

const Phases = () => {
  return (
    <section id="how-it-works" className="py-40 px-6 border-t border-white/5 bg-neutral-950 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        {/* Intro */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-40 text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold tracking-widest text-neutral-500 uppercase mb-6">
            How YAPLOG Works
          </h2>
          <p className="text-4xl md:text-6xl font-medium text-white tracking-tight mb-4">
            From chaos to clarity.
          </p>
          <p className="text-xl text-neutral-400 font-light">
            A guided journey through your thoughts.
          </p>
        </motion.div>

        {/* Roadmap */}
        <div className="relative">
          {/* Central Line */}
          <div className="absolute top-0 bottom-0 left-8 md:left-1/2 w-px bg-gradient-to-b from-transparent via-neutral-800 to-transparent -translate-x-1/2" />

          {phases.map((phase, index) => {
            const isEven = index % 2 === 0;
            return (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ margin: "-20% 0px -20% 0px", once: false }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className={`relative flex items-center gap-8 md:gap-16 mb-32 last:mb-0 ${
                  isEven ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Content Side */}
                <div className={`flex-1 pl-20 md:pl-0 ${isEven ? "md:text-right" : "md:text-left"}`}>
                  <motion.div 
                    initial={{ opacity: 0.5 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ margin: "-20% 0px -20% 0px" }}
                    className="flex flex-col gap-3"
                  >
                    <span className="text-lg font-bold font-mono text-indigo-400 tracking-widest uppercase">
                      Phase {phase.id}
                    </span>
                    <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                      {phase.title}
                    </h3>
                    <p className="text-lg text-neutral-400 font-light leading-relaxed">
                      {phase.desc}
                    </p>
                  </motion.div>
                </div>

                {/* Center Node */}
                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0.8, backgroundColor: "#171717" }}
                    whileInView={{ scale: 1.2, backgroundColor: "#ffffff" }}
                    viewport={{ margin: "-45% 0px -45% 0px" }}
                    transition={{ duration: 0.5 }}
                    className="w-4 h-4 rounded-full border-4 border-neutral-950 z-10 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                  />
                </div>

                {/* Empty Side for Balance (Desktop only) */}
                <div className="hidden md:block flex-1" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const features = [
  {
    id: "01",
    title: "Natural Thought Capture",
    desc: "Just talk. YAPLOG listens and understands without friction.",
    caps: ["Text & voice input", "Casual journaling", "Zero-friction capture"],
  },
  {
    id: "02",
    title: "AI Understanding & Structuring",
    desc: "Turns chaos into clarity by detecting intent and emotion.",
    caps: ["Intent detection", "Emotion awareness", "Semantic rewriting"],
  },
  {
    id: "03",
    title: "Living Memory System",
    desc: "A daily evolving timeline that grows with you.",
    caps: ["Daily evolving memory", "Auto-merged entries", "Long-term recall"],
  },
  {
    id: "04",
    title: "Recall, Insights & Patterns",
    desc: "Context-aware search connecting dots in your life.",
    caps: ["Natural language recall", "Pattern detection", "Weekly insights"],
  },
  {
    id: "05",
    title: "Guidance, Goals & Control",
    desc: "Smart nudges that keep you on track while respecting privacy.",
    caps: ["Smart reminders", "Goal recognition", "Focus & privacy control"],
  },
];

const Features = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);

  return (
    <section ref={targetRef} id="features" className="relative h-[400vh] bg-neutral-950">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        {/* Section Header */}
        <div className="absolute top-10 left-6 md:left-20 z-10 pointer-events-none max-w-xl">
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight uppercase opacity-50 mb-2">Core Systems</h2>
          <p className="text-base md:text-lg text-neutral-500 font-light leading-relaxed">
            Scroll to explore the intelligence modules that power your new second brain.
          </p>
        </div>

        {/* System Rail */}
        <motion.div style={{ x }} className="flex gap-20 pl-6 md:pl-20 items-center">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative shrink-0 w-[85vw] md:w-[600px] flex flex-col justify-center group"
            >
              {/* System Index */}
              <span className="text-sm font-mono text-neutral-600 mb-6 tracking-widest opacity-50 group-hover:opacity-100 transition-opacity duration-500">
                SYSTEM {feature.id}
              </span>

              {/* System Title */}
              <h3 className="text-4xl md:text-6xl font-bold text-neutral-300 mb-6 tracking-tight group-hover:text-white transition-colors duration-500">
                {feature.title}
              </h3>

              {/* Divider Line */}
              <div className="w-12 h-px bg-neutral-700 mb-8 group-hover:w-24 group-hover:bg-white transition-all duration-700 ease-out" />

              {/* Description */}
              <p className="text-xl text-neutral-500 font-light leading-relaxed mb-10 max-w-md group-hover:text-neutral-300 transition-colors duration-500">
                {feature.desc}
              </p>

              {/* Micro-capabilities */}
              <div className="flex flex-wrap gap-x-8 gap-y-3">
                {feature.caps.map((cap, i) => (
                  <span 
                    key={i} 
                    className="text-sm font-medium text-neutral-600 uppercase tracking-wide group-hover:text-neutral-400 transition-colors duration-500 delay-[50ms]"
                  >
                    {cap}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const Companion = () => {
  return (
    <section className="py-40 px-6 flex items-center justify-center bg-neutral-950">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-sm tracking-[0.2em] text-neutral-500 mb-6 uppercase">
            Always by your side
          </h2>
          <p className="text-2xl md:text-4xl font-light text-neutral-300 leading-relaxed">
            "A silent observer that becomes an <span className="text-white font-normal">active partner</span> when you need it most."
          </p>
        </motion.div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-12 px-6 border-t border-white/5 bg-neutral-950">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight text-white">
            YAPLOG
          </span>
        </div>
        
        <div className="flex gap-8 text-sm text-neutral-500">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
        </div>

        <div className="text-xs text-neutral-600">
          © {new Date().getFullYear()} YAPLOG. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-200 selection:bg-white/20">
      <Navbar />
      <Hero />
      <Problem />
      <Phases />
      <Features />
      <Companion />
      
      {/* Final CTA */}
      <section className="py-32 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <span className="text-sm md:text-base font-bold tracking-widest text-indigo-400 mb-6 block uppercase">
            Start Now
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Your thoughts deserve better memory.
          </h2>
          <p className="text-xl text-neutral-400 mb-10 font-light">
            Start remembering your life.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="px-8 py-4 rounded-full bg-white text-black text-lg font-medium hover:bg-neutral-200 transition-all shadow-[0_0_25px_rgba(255,255,255,0.1)] w-full sm:w-auto">
              Get Started
            </button>
            <button className="px-8 py-4 rounded-full text-neutral-400 hover:text-white transition-colors text-lg w-full sm:w-auto">
              Sign In
            </button>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
