import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaRobot,
  FaArrowLeft,
  FaCheckCircle,
  FaCrown,
  FaCalendarAlt,
  FaChartBar,
  FaKey,
  FaShieldAlt,
  FaCode,
  FaCopy,
  FaCheck,
  FaPalette,
  FaMicrophone,
  FaGlobe,
  FaBolt,
  FaSlidersH,
  FaBookOpen,
  FaComments,
  FaReact,
  FaHtml5,
  FaWaveSquare,
  FaPlay,
} from "react-icons/fa";
import { IoSparkles } from "react-icons/io5";

const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL || "https://your-domain.com";

const THEMES = {
  dark: {
    name: "Dark",
    background: "#101936",
    surface: "#172447",
    text: "#F8FAFC",
    accent: "#7657FF",
    orb: "from-violet-600 via-fuchsia-500 to-cyan-400",
  },
  light: {
    name: "Light",
    background: "#FFFFFF",
    surface: "#F1F5F9",
    text: "#172033",
    accent: "#6553F5",
    orb: "from-blue-500 via-indigo-400 to-purple-400",
  },
  glass: {
    name: "Glass",
    background: "#202A43",
    surface: "#34415E",
    text: "#FFFFFF",
    accent: "#38BDF8",
    orb: "from-cyan-400 via-blue-400 to-indigo-400",
  },
  neon: {
    name: "Neon",
    background: "#190D2E",
    surface: "#2B1646",
    text: "#FFFFFF",
    accent: "#D946EF",
    orb: "from-fuchsia-500 via-pink-500 to-rose-400",
  },
};

// ✅ Format a date nicely
const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// ✅ Days remaining until expiry
const daysRemaining = (value) => {
  if (!value) return null;
  const end = new Date(value).getTime();
  if (Number.isNaN(end)) return null;
  const diff = end - Date.now();
  if (diff <= 0) return 0;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const AssistantView = ({ user }) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [embedTab, setEmbedTab] = useState("html"); // "html" | "react"

  // Read-only account data pulled from `user`
  const plan = user?.plan || "free";
  const isPro = plan === "pro";
  const proExpiresAt = user?.proExpiresAt || null;
  const daysLeft = daysRemaining(proExpiresAt);
  const totalMessages = Number(user?.totalMessages ?? 0);
  const requestLimit = Number(user?.requestLimit ?? 100);
  const usagePercent =
    requestLimit > 0
      ? Math.min(100, Math.round((totalMessages / requestLimit) * 100))
      : 0;
  const geminiStatus = user?.geminiStatus || "active";
  const hasApiKey = Boolean(user?.geminiApiKey);
  const setupComplete = Boolean(user?.isSetupComplete);

  // Theme + assistant identity
  const themeId = user?.theme || "dark";
  const theme = THEMES[themeId] || THEMES.dark;
  const assistantName = user?.assistantName || "Your AI Assistant";
  const businessName = user?.businessName || "";
  const businessType = user?.businessType || "";
  const businessDescription = user?.businessDescription || "";
  const tone = user?.tone || "friendly";
  const pages = Array.isArray(user?.pages) ? user.pages : [];
  const enableVoice = user?.enableVoice ?? true;
  const enableNavigation = user?.enableNavigation ?? false;
  const userId = user?._id || user?.id || "";

  // ✅ Embed scripts
  const htmlEmbedScript = `<!-- Lumora AI Widget -->
<script
  src="${FRONTEND_URL}/assistant.js"
  data-user-id="${userId}"
  async
></script>`;

  const reactEmbedScript = `import { useEffect } from 'react';

export default function LumoraWidget() {
  useEffect(() => {
    // Prevent duplicate script injection
    if (document.getElementById('lumora-ai-widget')) return;

    const script = document.createElement('script');
    script.id = 'lumora-ai-widget';
    script.src = '${FRONTEND_URL}/assistant.js';
    script.setAttribute('data-user-id', '${userId}');
    script.async = true;
    
    document.body.appendChild(script);

    return () => {
      // Optional cleanup
    };
  }, []);

  return null; // No UI to render here
}`;

  const currentScript = embedTab === "html" ? htmlEmbedScript : reactEmbedScript;

  const copyEmbed = async () => {
    try {
      await navigator.clipboard.writeText(currentScript);
      setCopied(true);
      toast.success(`${embedTab.toUpperCase()} embed copied!`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy. Please copy manually.");
    }
  };

  const geminiStatusLabel =
    {
      active: "Active",
      quota_exceeded: "Quota exceeded",
      invalid: "Invalid key",
    }[geminiStatus] || "Unknown";

  const geminiStatusColor =
    {
      active: "text-emerald-300 border-emerald-500/20 bg-emerald-500/[0.06]",
      quota_exceeded: "text-amber-300 border-amber-500/20 bg-amber-500/[0.06]",
      invalid: "text-red-300 border-red-500/20 bg-red-500/[0.06]",
    }[geminiStatus] || "text-slate-300 border-white/10 bg-white/[0.03]";

  return (
    <div className="min-h-screen bg-[#070B18] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/3 h-96 w-96 rounded-full bg-violet-600/[0.08] blur-[130px]" />
        <div className="absolute right-0 top-1/2 h-96 w-96 rounded-full bg-blue-600/[0.06] blur-[130px]" />
      </div>

      <main className="relative mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Header */}
        <header className="mb-8 flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
          <div>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mb-3 inline-flex items-center gap-2 text-xs font-medium text-slate-400 transition hover:text-white"
            >
              <FaArrowLeft />
              Back
            </button>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
              Your{" "}
              <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
                AI assistant
              </span>
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
              Overview of your assistant, plan, and usage. To change settings,
              go back to the Builder.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs ${
                setupComplete
                  ? "border-emerald-500/20 bg-emerald-500/[0.06] text-emerald-300"
                  : "border-amber-500/20 bg-amber-500/[0.06] text-amber-300"
              }`}
            >
              <FaCheckCircle />
              {setupComplete ? "Configured" : "Setup in progress"}
            </span>

            <button
              type="button"
              onClick={() => navigate("/builder")}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-3 text-sm font-semibold shadow-lg shadow-violet-950/30 transition hover:brightness-110"
            >
              <FaSlidersH />
              Open Builder
            </button>
          </div>
        </header>

        {/* ✅ Account & plan overview */}
        <section className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* Plan */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#0C1225]/90 p-4">
            <div className="mb-2 flex items-center gap-2 text-xs text-slate-400">
              <FaCrown className={isPro ? "text-amber-300" : "text-slate-500"} />
              Plan
            </div>
            <p className="flex items-center gap-2 text-lg font-semibold capitalize">
              {plan}
              {isPro && (
                <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-300">
                  Pro
                </span>
              )}
            </p>
          </div>

          {/* Expiry */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#0C1225]/90 p-4">
            <div className="mb-2 flex items-center gap-2 text-xs text-slate-400">
              <FaCalendarAlt className="text-violet-300" />
              {isPro ? "Pro expires" : "Expiry"}
            </div>
            <p className="text-lg font-semibold">
              {isPro ? formatDate(proExpiresAt) : "—"}
            </p>
            {isPro && daysLeft !== null && (
              <p
                className={`mt-1 text-xs ${
                  daysLeft === 0
                    ? "text-red-300"
                    : daysLeft <= 7
                      ? "text-amber-300"
                      : "text-slate-500"
                }`}
              >
                {daysLeft === 0
                  ? "Expired"
                  : `${daysLeft} day${daysLeft === 1 ? "" : "s"} remaining`}
              </p>
            )}
          </div>

          {/* Messages usage */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#0C1225]/90 p-4">
            <div className="mb-2 flex items-center gap-2 text-xs text-slate-400">
              <FaChartBar className="text-blue-300" />
              Messages used
            </div>
            <p className="text-lg font-semibold">
              {totalMessages}
              <span className="text-sm font-normal text-slate-500">
                {" "}
                / {requestLimit}
              </span>
            </p>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className={`h-full rounded-full ${
                  usagePercent >= 90
                    ? "bg-red-400"
                    : usagePercent >= 70
                      ? "bg-amber-400"
                      : "bg-violet-500"
                }`}
                style={{ width: `${usagePercent}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {usagePercent}% of limit
            </p>
          </div>

          {/* Gemini status */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#0C1225]/90 p-4">
            <div className="mb-2 flex items-center gap-2 text-xs text-slate-400">
              <FaKey className="text-cyan-300" />
              Gemini key
            </div>
            <p className="text-lg font-semibold">
              <span
                className={`inline-flex items-center gap-1.5 rounded-lg border px-2 py-0.5 text-xs ${geminiStatusColor}`}
              >
                <FaShieldAlt />
                {geminiStatusLabel}
              </span>
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {hasApiKey
                ? "Key configured"
                : "Managed securely on the server"}
            </p>
          </div>
        </section>

        {/* ✅ Embed script */}
        <section className="mb-6 rounded-2xl border border-white/[0.08] bg-[#0C1225]/90 p-5">
          <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
            <div>
              <h2 className="flex items-center gap-2 text-sm font-semibold">
                <FaCode className="text-violet-300" />
                Embed your assistant
              </h2>
              <p className="mt-1 text-xs leading-5 text-slate-400">
                Copy the code below and add it to your website to load the assistant widget.
              </p>
            </div>

            <button
              type="button"
              onClick={copyEmbed}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-violet-500/30 bg-violet-500/10 px-4 py-2.5 text-xs font-semibold text-violet-300 transition hover:bg-violet-500/20"
            >
              {copied ? <FaCheck /> : <FaCopy />}
              {copied ? "Copied!" : "Copy script"}
            </button>
          </div>

          {/* Tabs */}
          <div className="mb-3 flex items-center gap-2 border-b border-white/[0.08] pb-2">
            <button
              type="button"
              onClick={() => setEmbedTab("html")}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                embedTab === "html"
                  ? "bg-violet-500/20 text-violet-300"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <FaHtml5 size={14} />
              HTML / Plain JS
            </button>
            <button
              type="button"
              onClick={() => setEmbedTab("react")}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                embedTab === "react"
                  ? "bg-violet-500/20 text-violet-300"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <FaReact size={14} />
              React / Next.js
            </button>
          </div>

          <pre className="overflow-x-auto rounded-xl border border-white/[0.08] bg-[#070B18] p-4 text-xs leading-6 text-slate-300">
            <code>{currentScript}</code>
          </pre>

          <p className="mt-3 text-xs leading-5 text-slate-500">
            {embedTab === "html" 
              ? "Paste this just before the closing </body> tag of your HTML file." 
              : "Create a component and add it to your layout or page to load the widget."}
          </p>
        </section>

        {/* ✅ Assistant summary */}
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
          {/* Configuration details */}
          <section className="min-w-0 overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0C1225]/95">
            <div className="flex items-center gap-3 border-b border-white/[0.07] px-5 py-5 sm:px-7">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/15 text-lg text-violet-300">
                <FaRobot />
              </div>
              <div>
                <h2 className="font-semibold">Assistant configuration</h2>
                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Current saved settings for your assistant.
                </p>
              </div>
            </div>

            <div className="space-y-6 p-5 sm:p-7">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
                  <p className="text-[11px] uppercase tracking-wider text-slate-500">
                    Assistant name
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {assistantName || "Not set"}
                  </p>
                </div>

                <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
                  <p className="text-[11px] uppercase tracking-wider text-slate-500">
                    Business name
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {businessName || "Not set"}
                  </p>
                </div>

                <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
                  <p className="text-[11px] uppercase tracking-wider text-slate-500">
                    Business type
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {businessType || "Not set"}
                  </p>
                </div>

                <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
                  <p className="text-[11px] uppercase tracking-wider text-slate-500">
                    Tone
                  </p>
                  <p className="mt-1 text-sm font-medium capitalize">{tone}</p>
                </div>
              </div>

              <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
                <p className="text-[11px] uppercase tracking-wider text-slate-500">
                  Business description
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {businessDescription || "Not set"}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/15 text-violet-300">
                    <FaMicrophone />
                  </span>
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-slate-500">
                      Voice
                    </p>
                    <p
                      className={`text-sm font-medium ${
                        enableVoice ? "text-emerald-300" : "text-slate-400"
                      }`}
                    >
                      {enableVoice ? "Enabled" : "Disabled"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/15 text-blue-300">
                    <FaGlobe />
                  </span>
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-slate-500">
                      Navigation
                    </p>
                    <p
                      className={`text-sm font-medium ${
                        enableNavigation ? "text-emerald-300" : "text-slate-400"
                      }`}
                    >
                      {enableNavigation ? "Enabled" : "Disabled"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Knowledge pages */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <FaBookOpen className="text-violet-300" />
                  <h3 className="text-sm font-semibold">Knowledge pages</h3>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] text-slate-400">
                    {pages.length}
                  </span>
                </div>

                {pages.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-white/15 p-6 text-center">
                    <FaGlobe className="mx-auto mb-2 text-xl text-slate-500" />
                    <p className="text-xs text-slate-400">
                      No pages added yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {pages.map((page, index) => (
                      <div
                        key={`${page.path}-${index}`}
                        className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-sm font-medium">
                            {page.name || "Unnamed page"}
                          </p>
                          <code className="rounded bg-white/[0.06] px-2 py-0.5 text-[11px] text-slate-300">
                            {page.path || "/"}
                          </code>
                        </div>

                        {Array.isArray(page.keywords) &&
                          page.keywords.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {page.keywords.map((keyword, keywordIndex) => (
                                <span
                                  key={`${keyword}-${keywordIndex}`}
                                  className="rounded-full border border-violet-500/20 bg-violet-500/10 px-2 py-0.5 text-[10px] text-violet-200"
                                >
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ✅ REDESIGNED: Voice AI Appearance preview */}
          <aside className="min-w-0 xl:sticky xl:top-6">
            <section className="overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0C1225]/95">
              <div className="flex items-center gap-2 border-b border-white/[0.07] p-5">
                <FaPalette className="text-violet-300" />
                <h2 className="font-semibold">Voice Agent Preview</h2>
              </div>

              <div className="p-4 sm:p-6">
                {/* The Agent UI */}
                <div
                  className="relative overflow-hidden rounded-[2rem] border shadow-2xl"
                  style={{
                    backgroundColor: theme.background,
                    borderColor: `${theme.accent}40`,
                  }}
                >
                  {/* Glow Background */}
                  <div
                    className="absolute -inset-10 opacity-20 blur-3xl"
                    style={{
                      background: `radial-gradient(circle at center, ${theme.accent}, transparent 70%)`,
                    }}
                  />

                  {/* Header */}
                  <div
                    className="relative z-10 flex items-center justify-between border-b px-5 py-4"
                    style={{
                      borderColor: `${theme.text}10`,
                      backgroundColor: `${theme.surface}cc`,
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20"
                        style={{ color: theme.accent }}
                      >
                        <FaRobot />
                      </div>
                      <div>
                        <h3
                          className="text-sm font-semibold"
                          style={{ color: theme.text }}
                        >
                          {assistantName}
                        </h3>
                        <p
                          className="mt-0.5 text-[10px]"
                          style={{ color: `${theme.text}80` }}
                        >
                          Voice Enabled AI
                        </p>
                      </div>
                    </div>
                    <div
                      className="flex items-center gap-1.5 rounded-full border px-2.5 py-1"
                      style={{
                        borderColor: `${theme.text}20`,
                        backgroundColor: `${theme.text}05`,
                      }}
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"
                      />
                      <span
                        className="text-[9px] font-medium uppercase tracking-wider"
                        style={{ color: theme.text }}
                      >
                        Ready
                      </span>
                    </div>
                  </div>

                  {/* Visualizer Area */}
                  <div className="relative z-10 flex flex-col items-center justify-center px-5 py-12">
                    {/* Glowing Orb */}
                    <div className="relative flex h-28 w-28 items-center justify-center">
                      <div
                        className="absolute inset-0 rounded-full opacity-40 animate-ping"
                        style={{ backgroundColor: theme.accent, animationDuration: "3s" }}
                      />
                      <div
                        className={`relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gradient-to-tr ${theme.orb} shadow-lg`}
                      >
                        <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
                        <FaWaveSquare className="relative z-10 text-white/80 animate-pulse" size={28} />
                      </div>
                    </div>

                    {/* Text */}
                    <div className="mt-6 h-8 text-center">
                      <p
                        className="text-xs font-medium"
                        style={{ color: `${theme.text}cc` }}
                      >
                        Listening...
                      </p>
                    </div>

                    {/* Fake Waveform */}
                    <div className="mt-2 flex h-10 items-end justify-center gap-1">
                      {[1, 2, 3, 4, 5, 6, 7].map((bar) => (
                        <div
                          key={bar}
                          className="w-1 rounded-full animate-[bounce_1s_infinite]"
                          style={{
                            backgroundColor: theme.accent,
                            height: `${Math.max(15, Math.random() * 100)}%`,
                            animationDelay: `${bar * 0.1}s`,
                            opacity: 0.8,
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Input Bar */}
                  <div
                    className="relative z-10 border-t px-4 py-3"
                    style={{
                      borderColor: `${theme.text}10`,
                      backgroundColor: `${theme.surface}cc`,
                    }}
                  >
                    <div
                      className="flex items-center gap-2 rounded-xl border px-3 py-2"
                      style={{
                        borderColor: `${theme.text}15`,
                        backgroundColor: `${theme.background}80`,
                      }}
                    >
                      <button style={{ color: `${theme.text}60` }}>
                        <FaMicrophone size={14} />
                      </button>
                      <input
                        type="text"
                        placeholder="Speak or type..."
                        disabled
                        className="w-full bg-transparent text-xs outline-none"
                        style={{ color: theme.text }}
                      />
                      <button style={{ color: theme.accent }}>
                        <FaPlay size={12} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Features below preview */}
                <div className="mt-5 grid grid-cols-3 gap-2">
                  {[
                    { icon: FaRobot, title: "Smart", desc: "AI assistant" },
                    { icon: FaBolt, title: "Fast", desc: "Quick support" },
                    { icon: FaPalette, title: "Custom", desc: "Your style" },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div key={i} className="min-w-0 rounded-xl p-2 text-center">
                        <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
                          <Icon size={16} />
                        </div>
                        <p className="text-xs font-semibold">{item.title}</p>
                        <p className="mt-1 text-[10px] text-slate-500">
                          {item.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-3 flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.02] p-3">
                  <span className="text-xs text-slate-400">Current theme</span>
                  <span className="flex items-center gap-1.5 text-xs font-semibold capitalize text-slate-200">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: theme.accent }}
                    />
                    {theme.name}
                  </span>
                </div>
              </div>
            </section>
          </aside>
        </div>

        <footer className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-white/[0.07] pt-5 text-center text-xs text-slate-500 sm:flex-row sm:text-left">
          <p>© {new Date().getFullYear()} Lumora AI</p>
          <p className="flex items-center gap-2">
            <FaCheckCircle className="text-emerald-400" />
            Your assistant, your rules.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default AssistantView;