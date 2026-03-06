import Link from "next/link";
import { ArrowRight, Code2, Eye, BarChart3, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GradientText } from "@/components/shared/GradientText";
import { GlassCard } from "@/components/shared/GlassCard";

const features = [
  {
    icon: Code2,
    title: "Structured Learning Tracks",
    description:
      "Master DSA with topic-wise tracks like Algoforge DSA Sheet, or sharpen your competitive programming skills with rated problem sets.",
  },
  {
    icon: Eye,
    title: "Code Visualizer",
    description:
      "Step through your code line-by-line. Watch arrays sort, trees traverse, and recursion unfold in real time.",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description:
      "Track your streaks, earn XP, unlock achievements, and see exactly where you need to improve.",
  },
  {
    icon: Zap,
    title: "Built-in Code Editor",
    description:
      "Write, run, and submit code in Python, C++, Java, and JavaScript — all from your browser with a VS Code-quality editor.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 flex w-full items-center justify-between border-b border-border-subtle bg-bg-primary/80 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-bg-primary">
            <span className="text-sm font-bold text-white">A</span>
          </div>
          <span className="text-lg font-bold gradient-text">AlgoForge</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" className="text-text-secondary hover:text-text-primary">
              Log in
            </Button>
          </Link>
          <Link href="/register">
            <Button className="gradient-bg-primary text-white hover:opacity-90">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-16 text-center">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-accent-purple/20 blur-[128px]" />
          <div className="absolute right-1/4 top-1/3 h-64 w-64 rounded-full bg-accent-cyan/10 blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-3xl">
          <h1 className="text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            Forge Your Path to{" "}
            <GradientText as="span">Algorithm Mastery</GradientText>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-text-secondary sm:text-xl">
            Structured DSA tracks, competitive programming sheets, a built-in code
            editor, and a visual debugger — everything you need to crack coding
            interviews and contests.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/register">
              <Button size="lg" className="gradient-bg-primary text-white hover:opacity-90">
                Start Practicing
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/tracks/dsa">
              <Button
                size="lg"
                variant="outline"
                className="border-border-default text-text-primary hover:bg-bg-tertiary"
              >
                Explore Tracks
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 pb-32">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold sm:text-4xl">
            Everything you need to <GradientText as="span">level up</GradientText>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-text-secondary">
            From beginner arrays to advanced graph theory — AlgoForge has you
            covered.
          </p>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <GlassCard key={feature.title} hover className="flex flex-col gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-bg-primary">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-text-secondary">
                    {feature.description}
                  </p>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-subtle px-6 py-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <span className="text-sm text-text-muted">
            &copy; {new Date().getFullYear()} AlgoForge. All rights reserved.
          </span>
          <div className="flex gap-6 text-sm text-text-muted">
            <span className="cursor-pointer hover:text-text-secondary">About</span>
            <span className="cursor-pointer hover:text-text-secondary">Terms</span>
            <span className="cursor-pointer hover:text-text-secondary">Privacy</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
