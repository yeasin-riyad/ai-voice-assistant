import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowRight as ArrowRight,
  FiMic as Mic,
  FiCpu as Bot,
  FiCheck as Check,
  FiChevronRight as ChevronRight,
  FiGlobe as Globe,
  FiMessageCircle as MessageCircle,
  FiMousePointer as MousePointer2,
  FiStar as Sparkles,
  FiZap as Zap,
  FiCode as Code,
  FiActivity as Activity,
} from "react-icons/fi";
import Footer from "../components/Footer";

const features = [
  {
    icon: Mic,
    title: "Natural Voice Conversations",
    description:
      "Let visitors talk naturally with an AI voice agent that understands context and answers questions in real time with human-like speech.",
    color: "from-violet-500 to-indigo-500",
  },
  {
    icon: Globe,
    title: "Smart Website Navigation",
    description:
      "Help visitors discover important pages, find information, and navigate your website effortlessly just by asking your voice agent.",
    color: "from-cyan-500 to-blue-500",
  },
  {
    icon: Sparkles,
    title: "Your Brand, Your AI",
    description:
      "Personalize your assistant's name, voice personality, appearance, and business knowledge to perfectly match your brand.",
    color: "from-fuchsia-500 to-violet-500",
  },
];

const Home = ({ user }) => {
  const navigate = useNavigate();
   const handleGetStarted = () => {
    navigate(user ? "/builder" : "/login");
  };
  
  // Simulated Voice Agent States
  const [agentState, setAgentState] = useState("idle"); // idle, listening, speaking
  const [currentText, setCurrentText] = useState("Ready to listen...");

  // Simulate the voice agent reacting
  useEffect(() => {
    const sequence = [
      { state: "idle", text: "Ask me anything..." },
      { state: "listening", text: "Listening to you..." },
      { state: "speaking", text: "Welcome to Lumora AI. I can help you navigate the site." },
      { state: "idle", text: "How else can I help?" },
    ];

    let index = 0;
    const interval = setInterval(() => {
      const current = sequence[index];
      setAgentState(current.state);
      setCurrentText(current.text);
      index = (index + 1) % sequence.length;
    }, 4000);

    return () => clearInterval(interval);
  }, []);

 

  return (
    <main className="min-h-screen overflow-hidden bg-[#060612] text-white">
      {/* Hero Section */}
      <section className="relative isolate">
        {/* Background decorations */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-[-200px] h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-violet-600/[0.12] blur-[150px]" />
          <div className="absolute -left-48 top-[400px] h-[400px] w-[400px] rounded-full bg-blue-600/[0.08] blur-[130px]" />
          <div className="absolute -right-48 top-[500px] h-[400px] w-[400px] rounded-full bg-cyan-500/[0.06] blur-[130px]" />

          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
              maskImage: "linear-gradient(to bottom, black, transparent 80%)",
            }}
          />
        </div>

        <div className="mx-auto max-w-7xl px-5 pb-24  sm:px-8 sm:pb-32 pt-10 lg:px-10 ">
          <div className="grid items-center gap-16 lg:grid-cols-[1fr_1fr] lg:gap-12">
            
            {/* Hero Content (Left) */}
            <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/[0.08] px-4 py-2 text-xs font-medium text-violet-200 sm:text-sm">
                <Activity size={15} className="text-violet-300 animate-pulse" />
                <span>Next-Gen Voice AI is here</span>
                <ChevronRight size={15} className="text-violet-300" />
              </div>

              <h1 className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-[68px]">
                Give Your Website
                <br />
                a Voice with
                <br />
                <span className="relative inline-block pb-2 mt-2">
                  <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-300 bg-clip-text text-transparent">
                    AI Assistance.
                  </span>
                  <span className="absolute -bottom-1 left-0 h-[4px] w-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-400 to-cyan-400 opacity-80" />
                </span>
              </h1>

              <p className="mx-auto mt-7 max-w-xl text-base leading-8 text-slate-400 sm:text-lg lg:mx-0">
                Create a smart, voice-enabled SaaS assistant that talks to your
                visitors, answers their questions, and guides them through
                your website — all in real time.
              </p>

              {/* CTA Buttons */}
              <div className="mt-10 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center lg:justify-start">
                <button
                  type="button"
                  onClick={handleGetStarted}
                  className="group inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-4 text-sm font-semibold text-white shadow-[0_0_40px_-10px_rgba(124,58,237,0.6)] transition duration-300 hover:-translate-y-1 hover:from-violet-500 hover:to-indigo-500"
                >
                  Build Your Assistant
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    document
                      .getElementById("features")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-8 py-4 text-sm font-semibold text-slate-200 transition hover:border-white/20 hover:bg-white/[0.06]"
                >
                  <Mic size={17} className="text-violet-400" />
                  See Voice Features
                </button>
              </div>

              {/* Trust / Benefits */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-slate-400 sm:text-sm lg:justify-start">
                <span className="inline-flex items-center gap-1.5">
                  <Check size={16} className="text-emerald-400" />
                  Free plan available
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Check size={16} className="text-emerald-400" />
                  Easy setup
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Check size={16} className="text-emerald-400" />
                  No coding required
                </span>
              </div>
            </div>

            {/* Voice Agent Preview (Right) */}
            <div className="relative mx-auto w-full max-w-md lg:ml-auto">
              {/* Outer Glow */}
              <div className="pointer-events-none absolute -inset-10 rounded-full bg-gradient-to-br from-violet-600/[0.2] via-transparent to-cyan-500/[0.15] blur-[80px]" />

              {/* Main Agent Card */}
              <div className="relative overflow-hidden rounded-[36px] border border-white/[0.08] bg-[#0C0C1F]/90 shadow-2xl shadow-black/50 backdrop-blur-2xl">
                {/* Top Bar */}
                <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20">
                      <Bot size={20} className="text-violet-300" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Lumora Agent</p>
                      <p className="text-[11px] text-slate-500">Voice Enabled AI</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/[0.08] px-3 py-1">
                    <span className={`h-2 w-2 rounded-full ${agentState === 'listening' ? 'bg-rose-400 animate-pulse' : agentState === 'speaking' ? 'bg-cyan-400 animate-pulse' : 'bg-emerald-400'}`} />
                    <span className="text-[10px] font-medium uppercase tracking-wider text-emerald-300">
                      {agentState}
                    </span>
                  </div>
                </div>

                {/* Agent Visualizer Area */}
                <div className="relative flex flex-col items-center justify-center px-6 py-16">
                  
                  {/* The Glowing Orb */}
                  <div className="relative flex h-32 w-32 items-center justify-center">
                    {/* Pulsing Rings (Visible when listening/speaking) */}
                    <div className={`absolute inset-0 rounded-full bg-violet-500/20 ${agentState !== 'idle' ? 'animate-ping' : 'opacity-0'}`} style={{ animationDuration: '3s' }} />
                    <div className={`absolute inset-4 rounded-full bg-cyan-500/20 ${agentState === 'speaking' ? 'animate-ping' : 'opacity-0'}`} style={{ animationDuration: '2s' }} />
                    
                    {/* Core Orb */}
                    <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-gradient-to-tr from-violet-600 via-fuchsia-500 to-cyan-400 shadow-[0_0_50px_rgba(124,58,237,0.5)]">
                      <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
                      {agentState === "listening" ? (
                        <Mic size={36} className="text-white relative z-10 animate-pulse" />
                      ) : agentState === "speaking" ? (
                        <Activity size={36} className="text-white relative z-10 animate-bounce" />
                      ) : (
                        <Sparkles size={36} className="text-white relative z-10" />
                      )}
                    </div>
                  </div>

                  {/* Dynamic Text Display */}
                  <div className="mt-8 h-12 text-center">
                    <p className={`text-sm font-medium transition-all duration-500 ${agentState === 'listening' ? 'text-rose-300' : agentState === 'speaking' ? 'text-cyan-300' : 'text-slate-300'}`}>
                      {currentText}
                    </p>
                  </div>

                  {/* Audio Waveform */}
                  <div className="mt-4 flex h-12 items-end justify-center gap-1.5">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((bar) => (
                      <div
                        key={bar}
                        className={`w-1.5 rounded-full transition-all duration-300 ${
                          agentState === "speaking" 
                            ? "bg-cyan-400 animate-[bounce_1s_infinite]" 
                            : agentState === "listening"
                            ? "bg-violet-400 animate-[pulse_1.5s_infinite]"
                            : "bg-slate-700 h-2"
                        }`}
                        style={{
                          height: agentState === "speaking" 
                            ? `${Math.max(10, Math.random() * 100)}%` 
                            : agentState === "listening"
                            ? `${20 + Math.random() * 30}%`
                            : "8px",
                          animationDelay: `${bar * 0.1}s`
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Bottom Input Bar */}
                <div className="border-t border-white/[0.06] bg-white/[0.02] px-4 py-4">
                  <div className="flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-[#060612] px-4 py-3">
                    <button className="text-slate-400 hover:text-white transition">
                      <Mic size={18} />
                    </button>
                    <input 
                      type="text" 
                      placeholder="Speak or type..." 
                      disabled
                      className="w-full bg-transparent text-sm text-white placeholder-slate-600 outline-none"
                    />
                    <button className="text-violet-500">
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Floating Badge 1 */}
              <div className="absolute -right-6 top-20 hidden items-center gap-3 rounded-2xl border border-white/10 bg-[#15152e]/95 p-3 shadow-xl sm:flex lg:-right-8 animate-[bounce_4s_infinite]">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10">
                  <Activity size={20} className="text-cyan-300" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Real-time</p>
                  <p className="text-[10px] text-slate-400">Audio streaming</p>
                </div>
              </div>

              {/* Floating Badge 2 */}
              <div className="absolute -left-4 bottom-28 hidden items-center gap-3 rounded-2xl border border-white/10 bg-[#15152e]/95 p-3 shadow-xl sm:flex lg:-left-8 animate-[bounce_5s_infinite]">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-400/10">
                  <MessageCircle size={20} className="text-violet-300" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Smart</p>
                  <p className="text-[10px] text-slate-400">Context aware</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="relative border-t border-white/[0.05] bg-[#080817]/50 "
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.08] px-4 py-2 text-xs font-medium text-cyan-300 sm:text-sm">
              <Sparkles size={14} />
              Powerful features, simple setup
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              More than a chatbot.
              <br />
              <span className="bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">
                A voice-first experience.
              </span>
            </h2>

            <p className="mt-5 text-sm leading-7 text-slate-400 sm:text-base">
              Give your visitors instant help with an AI assistant designed
              around your business and your customers.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.title}
                  className="group relative overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.02] p-8 transition duration-300 hover:-translate-y-1 hover:border-violet-400/30 hover:bg-white/[0.04] hover:shadow-[0_10px_40px_-10px_rgba(124,58,237,0.2)]"
                >
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  
                  <div
                    className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color} shadow-lg shadow-black/30 ring-1 ring-white/10`}
                  >
                    <Icon size={26} className="text-white" />
                  </div>

                  <h3 className="text-xl font-semibold text-white">
                    {feature.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-slate-400">
                    {feature.description}
                  </p>

                  <button
                    type="button"
                    onClick={handleGetStarted}
                    className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-violet-300 transition hover:text-violet-200"
                  >
                    Get started
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </button>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative overflow-hidden px-5  sm:px-8 py-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.15),transparent_60%)]" />

        <div className="relative mx-auto max-w-4xl rounded-[40px] border border-violet-400/20 bg-gradient-to-br from-[#120d29] via-[#0C0C1F] to-[#0a1125] px-6 py-16 text-center shadow-2xl shadow-violet-950/20 sm:px-16 sm:py-20">
          
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-400/30 bg-violet-500/10 shadow-[0_0_30px_-5px_rgba(124,58,237,0.4)]">
            <Sparkles size={30} className="text-violet-300" />
          </div>

          <h2 className="mt-8 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Ready to give your website
            <br className="hidden sm:block" /> a voice?
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
            Start building your personalized AI voice assistant and create a more
            helpful, interactive experience for your visitors.
          </p>

          <button
            type="button"
            onClick={handleGetStarted}
            className="group mt-10 inline-flex items-center justify-center gap-2.5 rounded-2xl bg-white px-8 py-4 text-sm font-bold text-[#0C0C1F] shadow-xl transition hover:-translate-y-1 hover:bg-slate-100"
          >
            Create Your Assistant
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>

          <p className="mt-5 text-xs font-medium text-slate-500">
            Get started with the free plan. No credit card required.
          </p>
        </div>
      </section>

      {/* Footer */}
      {/* <Footer user={user}/> */}
     
    </main>
  );
};

export default Home;