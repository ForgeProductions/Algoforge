"use client";

import Link from "next/link";
import { ArrowRight, Code2, Eye, BarChart3, Zap, Layers, Cpu, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GradientText } from "@/components/shared/GradientText";
import { GlassCard } from "@/components/shared/GlassCard";
import { VisualHero } from "@/components/landing/VisualHero";
import { motion } from "framer-motion";

const features = [
  {
    icon: Code2,
    title: "Topic-Wise Tracks",
    description: "Master DSA with curated sheets for Arrays, Trees, Dynamic Programming, and more.",
    color: "bg-blue-500/20 text-blue-400",
    tag: "Structured"
  },
  {
    icon: Eye,
    title: "Visual Debugging",
    description: "Step through your algorithms line-by-line and watch the state change in real-time.",
    color: "bg-cyan-500/20 text-cyan-400",
    tag: "Exclusive"
  },
  {
    icon: Zap,
    title: "Local Speed",
    description: "Run your code directly on your machine with zero latency using local compilers.",
    color: "bg-yellow-500/20 text-yellow-400",
    tag: "Native"
  },
  {
    icon: BarChart3,
    title: "Global Stats",
    description: "Compare your performance on the global leaderboard and track your daily streaks.",
    color: "bg-purple-500/20 text-purple-400",
    tag: "Competitive"
  },
  {
    icon: Globe,
    title: "Multi-Language",
    description: "Complete support for Python, C++, Java, and JavaScript with high-performance runtimes.",
    color: "bg-green-500/20 text-green-400",
    tag: "Flexible"
  },
  {
    icon: Layers,
    title: "Bento Layout",
    description: "A professional coding environment with resizable panels and VS Code quality editor.",
    color: "bg-pink-500/20 text-pink-400",
    tag: "Premium"
  },
];

const stats = [
  { label: "Algorithms", value: "200+" },
  { label: "Daily Users", value: "5k+" },
  { label: "Solve Rate", value: "98%" },
  { label: "Tracks", value: "10+" },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#020617] text-slate-200 overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 h-[500px] w-[500px] bg-accent-purple/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] bg-accent-cyan/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 z-50 flex w-full items-center justify-between border-b border-white/5 bg-[#020617]/80 px-8 py-4 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent-purple to-accent-cyan transition-transform group-hover:scale-105 shadow-lg shadow-accent-purple/20">
            <span className="font-black text-white italic">A</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">AlgoForge</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <Link href="/tracks/dsa" className="hover:text-white transition-colors">DSA Tracks</Link>
          <Link href="/tracks/cp" className="hover:text-white transition-colors">CP Sheets</Link>
          <Link href="/leaderboard" className="hover:text-white transition-colors">Rankings</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-semibold hover:text-white transition-colors">Log in</Link>
          <Link href="/register">
            <Button className="bg-white text-[#020617] hover:bg-slate-200 rounded-full font-bold px-6 border-none shadow-xl transition-all hover:scale-105 active:scale-95">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex min-h-[90vh] flex-col lg:flex-row items-center justify-center px-8 lg:px-20 pt-24 gap-12 overflow-hidden">
        <div className="max-w-2xl text-center lg:text-left flex-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold uppercase tracking-widest text-accent-cyan mb-6">
              <span className="flex h-1.5 w-1.5 rounded-full bg-accent-cyan animate-pulse" />
              The Future of Competitive Programming
            </div>
            <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight text-white mb-6">
              Forge Your <br />
              <GradientText>Algorithm</GradientText> Prowess
            </h1>
            <p className="max-w-xl text-lg lg:text-xl text-slate-400 mb-10 leading-relaxed mx-auto lg:mx-0 font-medium">
              A premium playground for developers. Combine structured learning with real-time visual debugging to master complex data structures.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
              <Link href="/register">
                <Button size="lg" className="bg-gradient-to-r from-accent-purple to-accent-cyan text-white border-none rounded-xl h-14 px-8 font-black shadow-2xl shadow-accent-purple/20 transition-all hover:brightness-110">
                  START PRACTICING NOW
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/tracks/dsa">
                <Button size="lg" variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-xl h-14 px-8 font-bold backdrop-blur-lg">
                  Explore Tracks
                </Button>
              </Link>
            </div>

            {/* Stats Row */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-8 pt-10 border-t border-white/5">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-black text-white">{stat.value}</div>
                  <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex-1 w-full flex justify-center lg:justify-end"
        >
          <VisualHero />
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 px-8 py-24 bg-[#020617]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
            <div className="max-w-2xl">
              <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
                Everything you need to <GradientText>Dominate</GradientText>
              </h2>
              <p className="text-slate-400 text-lg font-medium">
                We've built a world-class environment designed to make complex concepts feel intuitive, fast, and visual.
              </p>
            </div>
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl backdrop-blur-md">
              <div className="flex -space-x-3">
                <div className="h-8 w-8 rounded-full border-2 border-[#020617] bg-accent-purple/40 blur-[1px]" />
                <div className="h-8 w-8 rounded-full border-2 border-[#020617] bg-accent-cyan/40 blur-[1px]" />
                <div className="h-8 w-8 rounded-full border-2 border-[#020617] bg-blue-500/40 blur-[1px]" />
                <div className="h-8 w-8 rounded-full border-2 border-[#020617] bg-pink-500/40 blur-[1px]" />
              </div>
              <div className="text-xs font-bold text-slate-300">
                <span className="text-white">5,000+</span> Devs Joined
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <GlassCard hover className="p-8 h-full flex flex-col items-start gap-5 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Icon className="h-24 w-24 -mr-8 -mt-8 rotate-12" />
                    </div>

                    <div className="flex items-center justify-between w-full">
                      <div className={`p-3 rounded-2xl transition-transform group-hover:scale-110 group-hover:rotate-3 ${feature.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-white/5 px-2 py-1 rounded-md border border-white/5">
                        {feature.tag}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-black text-white mb-2">{feature.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed font-medium">
                        {feature.description}
                      </p>
                    </div>

                    <div className="mt-auto pt-4 flex items-center gap-2 text-xs font-bold text-slate-500 group-hover:text-accent-cyan transition-colors">
                      Learn More <ArrowRight className="h-3 w-3" />
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 px-8 py-24">
        <div className="max-w-5xl mx-auto">
          <GlassCard className="p-12 text-center flex flex-col items-center gap-8 bg-gradient-to-b from-white/5 to-transparent border-white/10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-accent-purple/5 opacity-0 group-hover:opacity-100 transition-opacity blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <h2 className="text-4xl lg:text-6xl font-black text-white mb-6">
                Ready to <GradientText>Forge</GradientText> Your Future?
              </h2>
              <p className="max-w-2xl text-slate-400 text-lg font-medium mb-10 mx-auto">
                Join thousands of developers mastering algorithms and cracking interviews with the world's most visual coding platform.
              </p>

              <Link href="/register">
                <Button size="lg" className="bg-white text-[#020617] hover:bg-slate-200 border-none rounded-2xl h-16 px-12 font-black shadow-2xl transition-all hover:scale-105 active:scale-95 text-lg">
                  CREATE YOUR ACCOUNT — IT'S FREE
                </Button>
              </Link>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-[#010309] px-8 py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 items-center text-center md:text-left">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2.5 justify-center md:justify-start">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 group-hover:scale-105">
                <span className="font-black text-white italic text-xs">A</span>
              </div>
              <span className="text-lg font-bold text-white">AlgoForge</span>
            </Link>
            <p className="text-slate-500 text-sm font-medium">
              Elevating the standard of technical interview preparation.
            </p>
          </div>

          <div className="flex justify-center gap-10 text-sm font-bold text-slate-500 uppercase tracking-widest">
            <Link href="#" className="hover:text-white transition-colors">Tracks</Link>
            <Link href="#" className="hover:text-white transition-colors">Leaderboard</Link>
            <Link href="#" className="hover:text-white transition-colors">Contact</Link>
          </div>

          <div className="flex flex-col gap-4 text-center md:text-right">
            <div className="text-sm text-slate-500 font-medium">
              &copy; {new Date().getFullYear()} AlgoForge. All rights reserved.
            </div>
            <div className="flex gap-4 justify-center md:justify-end text-xs text-slate-600">
              <Link href="#" className="hover:text-white">Privacy Policy</Link>
              <Link href="#" className="hover:text-white">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
