import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaRobot,
  FaPalette,
  FaBookOpen,
  FaSlidersH,
  FaEye,
  FaEyeSlash,
  FaCheck,
  FaArrowRight,
  FaArrowLeft,
  FaSave,
  FaRocket,
  FaKey,
  FaGlobe,
  FaMicrophone,
  FaComments,
  FaPaperPlane,
  FaBolt,
  FaSpinner,
  FaExclamationCircle,
  FaCheckCircle,
  FaPlus,
  FaTrash,
  FaTimes,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { IoSparkles, IoColorPaletteOutline } from "react-icons/io5";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const STEPS = [
  { label: "Basic Info", icon: FaRobot },
  { label: "Appearance", icon: FaPalette },
  { label: "Knowledge", icon: FaBookOpen },
  { label: "Advanced", icon: FaSlidersH },
];

const THEMES = [
  {
    id: "dark",
    name: "Dark",
    description: "Elegant dark interface",
    background: "#101936",
    surface: "#172447",
    text: "#F8FAFC",
    accent: "#7657FF",
  },
  {
    id: "light",
    name: "Light",
    description: "Clean and minimal",
    background: "#FFFFFF",
    surface: "#F1F5F9",
    text: "#172033",
    accent: "#6553F5",
  },
  {
    id: "glass",
    name: "Glass",
    description: "Modern glass appearance",
    background: "#202A43",
    surface: "#34415E",
    text: "#FFFFFF",
    accent: "#38BDF8",
  },
  {
    id: "neon",
    name: "Neon",
    description: "Vibrant neon appearance",
    background: "#190D2E",
    surface: "#2B1646",
    text: "#FFFFFF",
    accent: "#D946EF",
  },
];

const DEFAULT_PAGES = [
  { name: "Home", path: "/", keywords: ["home", "homepage", "welcome"] },
  { name: "About", path: "/about", keywords: ["about", "company", "who we are"] },
  { name: "Services", path: "/services", keywords: ["services", "features", "solutions"] },
  { name: "Pricing", path: "/pricing", keywords: ["pricing", "plans", "cost"] },
  { name: "Contact", path: "/contact", keywords: ["contact", "support", "email"] },
];

const INITIAL_FORM = {
  assistantName: "Lumora Assistant",
  businessName: "Lumora AI",
  businessType: "Technology",
  businessDescription:
    "Lumora AI helps businesses create intelligent virtual assistants for their websites. Our AI assistants answer customer questions, provide instant support, guide website visitors, and deliver personalized conversations using AI-powered chat and voice capabilities.",
  tone: "friendly",
  theme: "dark",
  geminiApiKey: "",
  pages: DEFAULT_PAGES,
  enableVoice: true,
  enableNavigation: true,
  isSetupComplete: false,
};

const inputClass =
  "w-full rounded-xl border border-white/10 bg-[#0A1024] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10";

const labelClass = "mb-2 block text-sm font-medium text-slate-200";

const normalizePages = (pages) => {
  if (!Array.isArray(pages)) return DEFAULT_PAGES;
  return pages
    .filter((page) => page && typeof page === "object")
    .map((page) => ({
      name: page.name || "",
      path: page.path || "",
      keywords: Array.isArray(page.keywords) ? page.keywords : [],
    }));
};

const Builder = ({ user, setUser }) => {
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);
  const [form, setForm] = useState(INITIAL_FORM);
  const [showApiKey, setShowApiKey] = useState(false);
  const [newKeyword, setNewKeyword] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [previewInput, setPreviewInput] = useState("");
  const [previewMessages, setPreviewMessages] = useState([
    {
      role: "assistant",
      text: "Hi there! 👋 Welcome to Lumora AI. How can I help you today?",
    },
  ]);

  useEffect(() => {
    if (!user) return;

    setForm((previous) => ({
      ...previous,
      assistantName: user.assistantName || previous.assistantName,
      businessName: user.businessName ?? previous.businessName,
      businessType: user.businessType || previous.businessType,
      businessDescription:
        user.businessDescription ?? previous.businessDescription,
      tone: user.tone || previous.tone,
      theme: user.theme || previous.theme,
      pages: normalizePages(user.pages),
      enableVoice: user.enableVoice ?? previous.enableVoice,
      enableNavigation: user.enableNavigation ?? previous.enableNavigation,
      isSetupComplete: user.isSetupComplete ?? false,
    }));
  }, [user]);

  const updateField = (field, value) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    setError("");
    setSuccess("");
  };

  const updatePage = (index, field, value) => {
    setForm((previous) => ({
      ...previous,
      pages: previous.pages.map((page, pageIndex) =>
        pageIndex === index ? { ...page, [field]: value } : page,
      ),
    }));
    setError("");
    setSuccess("");
  };

  const addPage = () => {
    setForm((previous) => ({
      ...previous,
      pages: [...previous.pages, { name: "", path: "", keywords: [] }],
    }));
  };

  const removePage = (index) => {
    setForm((previous) => ({
      ...previous,
      pages: previous.pages.filter((_, pageIndex) => pageIndex !== index),
    }));
  };

  const addKeyword = (index) => {
    const keyword = (newKeyword[index] || "").trim();
    if (!keyword) return;

    setForm((previous) => ({
      ...previous,
      pages: previous.pages.map((page, pageIndex) => {
        if (pageIndex !== index) return page;
        if (
          page.keywords.some(
            (item) => item.toLowerCase() === keyword.toLowerCase(),
          )
        ) {
          return page;
        }
        return { ...page, keywords: [...page.keywords, keyword] };
      }),
    }));

    setNewKeyword((previous) => ({ ...previous, [index]: "" }));
  };

  const removeKeyword = (pageIndex, keywordIndex) => {
    setForm((previous) => ({
      ...previous,
      pages: previous.pages.map((page, index) =>
        index === pageIndex
          ? {
              ...page,
              keywords: page.keywords.filter(
                (_, index) => index !== keywordIndex,
              ),
            }
          : page,
      ),
    }));
  };

  const nextStep = () => {
    setError("");
    setSuccess("");

    if (activeStep === 0) {
      if (!form.assistantName.trim()) {
        setError("Please enter an assistant name.");
        return;
      }
      if (!form.businessName.trim()) {
        setError("Please enter your business name.");
        return;
      }
      if (!form.businessDescription.trim()) {
        setError("Please enter a business description.");
        return;
      }
      if (!["friendly", "professional", "sales"].includes(form.tone)) {
        setError("Please choose a valid assistant tone.");
        return;
      }
    }

    if (activeStep === 2) {
      const invalidPage = form.pages.some(
        (page) => !page.name.trim() || !page.path.trim(),
      );
      if (invalidPage) {
        setError("Every page needs a name and a path.");
        return;
      }
      const invalidPath = form.pages.some(
        (page) => !page.path.startsWith("/") || /\s/.test(page.path),
      );
      if (invalidPath) {
        setError("Page paths must start with / and must not contain spaces.");
        return;
      }
    }

    setActiveStep((previous) => Math.min(previous + 1, STEPS.length - 1));
  };

  const previousStep = () => {
    setError("");
    setSuccess("");
    setActiveStep((previous) => Math.max(previous - 1, 0));
  };

  const handlePreviewSend = (event) => {
    event.preventDefault();
    const message = previewInput.trim();
    if (!message) return;

    setPreviewMessages((previous) => [
      ...previous,
      { role: "user", text: message },
      {
        role: "assistant",
        text: `Thanks for your message! I'm ${form.assistantName}. I'm here to help you learn about ${form.businessName || "our business"}. This is a preview—connect your AI backend to enable real answers.`,
      },
    ]);

    setPreviewInput("");
  };

  const saveAssistant = async () => {
    setError("");
    setSuccess("");

    if (!API_URL) {
      setError("VITE_BACKEND_URL is not configured in your environment.");
      return;
    }
    if (
      !form.assistantName.trim() ||
      !form.businessName.trim() ||
      !form.businessDescription.trim()
    ) {
      setError("Please complete the required business information.");
      setActiveStep(0);
      return;
    }
    if (!["friendly", "professional", "sales"].includes(form.tone)) {
      setError("Invalid tone selected.");
      setActiveStep(0);
      return;
    }
    if (!THEMES.some((theme) => theme.id === form.theme)) {
      setError("Please choose a valid theme.");
      setActiveStep(1);
      return;
    }
    if (
      form.pages.some(
        (page) =>
          !page.name.trim() ||
          !page.path.trim() ||
          !page.path.startsWith("/") ||
          /\s/.test(page.path),
      )
    ) {
      setError("Please check each page name and path.");
      setActiveStep(2);
      return;
    }

    try {
      setSaving(true);

      

      const payload = {
        assistantName: form.assistantName.trim(),
        businessName: form.businessName.trim(),
        businessType: form.businessType,
        businessDescription: form.businessDescription.trim(),
        tone: form.tone,
        theme: form.theme,
        pages: form.pages.map((page) => ({
          name: page.name.trim(),
          path: page.path.trim(),
          keywords: page.keywords
            .map((keyword) => keyword.trim())
            .filter(Boolean),
        })),
        enableVoice: form.enableVoice,
        enableNavigation: form.enableNavigation,
        isSetupComplete: true
      };

      if (form.geminiApiKey.trim()) {
        payload.geminiApiKey = form.geminiApiKey.trim();
      }

      const response = await fetch(`${API_URL}/api/user/save-assistant`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Failed to save assistant settings.");
      }

      setForm((previous) => ({
        ...previous,
        geminiApiKey: "",
        isSetupComplete: true,
      }));

      if (setUser) {
        setUser((previous) => ({
          ...previous,
          ...(data.user || {}),
          ...payload,
          geminiApiKey: undefined,
        }));
      }

      toast.success("Your Lumora AI assistant was saved successfully.");
      setSuccess(
        data.message || "Your Lumora AI assistant was saved successfully.",
      );

      navigate("/assistant");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const selectedTheme =
    THEMES.find((theme) => theme.id === form.theme) || THEMES[0];

  // ✅ Whether the user has already saved an assistant
  const hasSavedAssistant = Boolean(user?.isSetupComplete);

  // ✅ Progress for the header ring
  const completedChecks = [
    Boolean(form.assistantName.trim()),
    Boolean(form.businessName.trim() && form.businessDescription.trim()),
    Boolean(form.theme),
    form.pages.length > 0 &&
      form.pages.every((page) => page.name.trim() && page.path.trim()),
  ].filter(Boolean).length;
  const progressPercent = Math.round((completedChecks / 4) * 100);

  return (
    <div className="min-h-screen bg-[#070B18] text-white">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-violet-600/[0.10] blur-[130px]" />
        <div className="absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-blue-600/[0.08] blur-[130px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(118,87,255,0.08),transparent_45%)]" />
      </div>

      <main className="relative mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* ============ HERO HEADER ============ */}
        <header className="mb-8 overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#0E1430]/95 via-[#0C1225]/95 to-[#0A1024]/95 p-6 shadow-2xl shadow-black/20 sm:p-8">
          <div className="flex flex-col justify-between gap-6 xl:flex-row xl:items-center">
            <div className="min-w-0">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/[0.10] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-violet-300">
                <IoSparkles />
                Lumora AI Studio
              </div>

              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                {hasSavedAssistant ? "Refine your" : "Build your"}{" "}
                <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  AI assistant
                </span>
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                {hasSavedAssistant
                  ? "Your assistant is already saved. Update the details below or view the full overview."
                  : "Customize your assistant, add your website knowledge, and create a helpful experience for your visitors."}
              </p>

              {/* Progress bar */}
              <div className="mt-5 max-w-md">
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Setup progress</span>
                  <span className="font-semibold text-slate-200">
                    {progressPercent}%
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-400 transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex shrink-0 flex-wrap items-center gap-3">
              <span
                className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-medium ${
                  hasSavedAssistant
                    ? "border-emerald-500/25 bg-emerald-500/[0.08] text-emerald-300"
                    : "border-amber-500/25 bg-amber-500/[0.08] text-amber-300"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    hasSavedAssistant ? "bg-emerald-400" : "bg-amber-400"
                  }`}
                />
                {hasSavedAssistant ? "Assistant saved" : "Setup in progress"}
              </span>

              {/* ✅ Show "View Assistant" only when saved */}
              {hasSavedAssistant && (
                <button
                  type="button"
                  onClick={() => navigate("/assistant")}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.10] bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-violet-400/40 hover:bg-white/[0.08]"
                >
                  <FaExternalLinkAlt className="text-xs" />
                  View Assistant
                </button>
              )}

              <button
                type="button"
                onClick={saveAssistant}
                disabled={saving}
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-2.5 text-sm font-semibold shadow-lg shadow-violet-950/40 transition hover:brightness-110 disabled:opacity-60"
              >
                {saving ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <FaRocket className="transition-transform group-hover:-translate-y-0.5" />
                )}
                {saving ? "Saving..." : hasSavedAssistant ? "Update" : "Save Assistant"}
              </button>
            </div>
          </div>
        </header>

        {/* ============ STEP NAVIGATION ============ */}
        <section className="mb-6 rounded-3xl border border-white/[0.08] bg-[#0C1225]/80 p-2.5 backdrop-blur-sm sm:p-4">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
            {STEPS.map((step, index) => {
              const StepIcon = step.icon;
              const active = activeStep === index;
              const complete = activeStep > index;

              return (
                <button
                  type="button"
                  key={step.label}
                  onClick={() => {
                    setActiveStep(index);
                    setError("");
                    setSuccess("");
                  }}
                  className={`group relative flex items-center gap-3 overflow-hidden rounded-2xl border p-3 text-left transition-all sm:p-4 ${
                    active
                      ? "border-violet-500/50 bg-gradient-to-br from-violet-500/[0.18] to-violet-500/[0.06] shadow-lg shadow-violet-950/30"
                      : complete
                        ? "border-emerald-500/20 bg-emerald-500/[0.04] hover:bg-emerald-500/[0.08]"
                        : "border-white/[0.06] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]"
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm transition ${
                      active
                        ? "bg-gradient-to-br from-violet-500 to-blue-500 text-white shadow-lg shadow-violet-950/40"
                        : complete
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "bg-white/[0.06] text-slate-400 group-hover:text-slate-200"
                    }`}
                  >
                    {complete ? <FaCheck /> : <StepIcon />}
                  </span>

                  <span className="min-w-0">
                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      Step {index + 1}
                    </span>
                    <span
                      className={`mt-0.5 block truncate text-xs font-semibold sm:text-sm ${
                        active ? "text-white" : "text-slate-300"
                      }`}
                    >
                      {step.label}
                    </span>
                  </span>

                  {active && (
                    <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-gradient-to-r from-violet-500 to-blue-500" />
                  )}
                </button>
              );
            })}
          </div>
        </section>

        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)]">
          {/* ============ BUILDER FORM ============ */}
          <section className="min-w-0 overflow-hidden rounded-3xl border border-white/[0.09] bg-[#0C1225]/95 shadow-2xl shadow-black/20">
            <div className="flex items-center gap-3 border-b border-white/[0.07] bg-white/[0.015] px-5 py-5 sm:px-7">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/25 to-blue-500/15 text-lg text-violet-300 ring-1 ring-violet-400/20">
                {React.createElement(STEPS[activeStep].icon)}
              </div>

              <div className="min-w-0">
                <h2 className="truncate font-semibold">
                  {
                    [
                      "Assistant information",
                      "Appearance & branding",
                      "Website knowledge",
                      "Assistant behavior",
                    ][activeStep]
                  }
                </h2>
                <p className="mt-1 text-xs leading-5 text-slate-400">
                  {
                    [
                      "Configure your business and assistant identity.",
                      "Choose a visual theme for your assistant.",
                      "Add the website pages your assistant should know.",
                      "Enable the features you want to offer.",
                    ][activeStep]
                  }
                </p>
              </div>
            </div>

            <div className="space-y-6 p-5 sm:p-7">
              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/[0.08] p-4 text-sm text-red-300"
                >
                  <FaExclamationCircle className="mt-0.5 shrink-0" />
                  <span>{error}</span>
                  <button
                    type="button"
                    onClick={() => setError("")}
                    className="ml-auto"
                    aria-label="Dismiss error"
                  >
                    <FaTimes />
                  </button>
                </div>
              )}

              {success && (
                <div
                  role="status"
                  className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.08] p-4 text-sm text-emerald-300"
                >
                  <FaCheckCircle className="mt-0.5 shrink-0" />
                  <span>{success}</span>
                </div>
              )}

              {/* Basic information */}
              {activeStep === 0 && (
                <>
                  <div>
                    <label className={labelClass} htmlFor="assistantName">
                      Assistant name <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="assistantName"
                      className={inputClass}
                      maxLength={60}
                      value={form.assistantName}
                      onChange={(e) =>
                        updateField("assistantName", e.target.value)
                      }
                      placeholder="e.g. Lumora Assistant"
                    />
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="businessName">
                      Business name <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="businessName"
                      className={inputClass}
                      maxLength={100}
                      value={form.businessName}
                      onChange={(e) =>
                        updateField("businessName", e.target.value)
                      }
                      placeholder="e.g. Lumora AI"
                    />
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="businessType">
                      Business type
                    </label>
                    <select
                      id="businessType"
                      className={inputClass}
                      value={form.businessType}
                      onChange={(e) =>
                        updateField("businessType", e.target.value)
                      }
                    >
                      {[
                        "Technology",
                        "E-commerce",
                        "Education",
                        "Healthcare",
                        "Real Estate",
                        "Finance",
                        "Travel",
                        "Food & Restaurant",
                        "Agency",
                        "Other",
                      ].map((type) => (
                        <option
                          key={type}
                          value={type}
                          className="bg-[#0C1225]"
                        >
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="businessDescription">
                      Business description{" "}
                      <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      id="businessDescription"
                      className={`${inputClass} min-h-36 resize-y leading-6`}
                      maxLength={500}
                      value={form.businessDescription}
                      onChange={(e) =>
                        updateField("businessDescription", e.target.value)
                      }
                      placeholder="Explain what your business does and how the assistant should help visitors..."
                    />
                    <p className="mt-2 text-right text-xs text-slate-500">
                      {form.businessDescription.length}/500 characters
                    </p>
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="tone">
                      Assistant tone
                    </label>
                    <select
                      id="tone"
                      className={inputClass}
                      value={form.tone}
                      onChange={(e) => updateField("tone", e.target.value)}
                    >
                      <option value="friendly" className="bg-[#0C1225]">
                        Friendly — warm and approachable
                      </option>
                      <option value="professional" className="bg-[#0C1225]">
                        Professional — clear and formal
                      </option>
                      <option value="sales" className="bg-[#0C1225]">
                        Sales — persuasive and helpful
                      </option>
                    </select>
                  </div>
                </>
              )}

              {/* Appearance */}
              {activeStep === 1 && (
                <>
                  <div>
                    <h3 className="text-sm font-semibold">Choose a theme</h3>
                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      Your selection updates the preview instantly.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {THEMES.map((theme) => {
                      const selected = form.theme === theme.id;

                      return (
                        <button
                          type="button"
                          key={theme.id}
                          onClick={() => updateField("theme", theme.id)}
                          className={`rounded-2xl border p-3 text-left transition ${
                            selected
                              ? "border-violet-500 bg-violet-500/[0.08] ring-1 ring-violet-500/20"
                              : "border-white/[0.08] hover:border-white/20"
                          }`}
                        >
                          <div
                            className="relative mb-3 overflow-hidden rounded-xl p-3"
                            style={{ backgroundColor: theme.background }}
                          >
                            <div className="mb-3 flex items-center gap-2">
                              <span
                                className="h-6 w-6 rounded-full"
                                style={{ backgroundColor: theme.accent }}
                              />
                              <span
                                className="h-2 w-20 rounded-full"
                                style={{
                                  backgroundColor: theme.text,
                                  opacity: 0.8,
                                }}
                              />
                            </div>
                            <div
                              className="rounded-lg p-3"
                              style={{ backgroundColor: theme.surface }}
                            >
                              <span
                                className="block h-1.5 w-20 rounded-full"
                                style={{
                                  backgroundColor: theme.text,
                                  opacity: 0.6,
                                }}
                              />
                            </div>
                            {selected && (
                              <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-violet-500 text-xs">
                                <FaCheck />
                              </span>
                            )}
                          </div>

                          <span className="block text-sm font-medium">
                            {theme.name}
                          </span>
                          <span className="mt-1 block text-xs text-slate-500">
                            {theme.description}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-4">
                    <div className="flex items-start gap-3">
                      <IoColorPaletteOutline className="mt-0.5 text-xl text-violet-300" />
                      <div>
                        <h4 className="text-sm font-medium">
                          Match your brand
                        </h4>
                        <p className="mt-1 text-xs leading-5 text-slate-400">
                          Your theme is stored using the supported database
                          values: light, dark, glass, and neon.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Knowledge */}
              {activeStep === 2 && (
                <>
                  <div>
                    <h3 className="text-sm font-semibold">Gemini API key</h3>
                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      Connect Google's AI model through your backend.
                    </p>
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="geminiApiKey">
                      Google Gemini API key
                    </label>
                    <div className="relative">
                      <FaKey className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        id="geminiApiKey"
                        type={showApiKey ? "text" : "password"}
                        autoComplete="off"
                        spellCheck={false}
                        className={`${inputClass} pl-11 pr-12`}
                        value={form.geminiApiKey}
                        onChange={(e) =>
                          updateField("geminiApiKey", e.target.value)
                        }
                        placeholder="Enter a new API key (optional)"
                      />
                      <button
                        type="button"
                        onClick={() => setShowApiKey((previous) => !previous)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                        aria-label={
                          showApiKey ? "Hide API key" : "Show API key"
                        }
                      >
                        {showApiKey ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      Leave blank to keep the existing key. The key is never
                      included in the response displayed by this page.
                    </p>
                  </div>

                  <a
                    href="https://aistudio.google.com/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-violet-300 hover:text-violet-200"
                  >
                    <FaKey />
                    Get your API key from Google AI Studio
                    <FaArrowRight className="-rotate-45 text-xs" />
                  </a>

                  <div className="rounded-xl border border-amber-400/15 bg-amber-400/[0.05] p-4">
                    <div className="flex items-start gap-3">
                      <FaKey className="mt-0.5 text-amber-300" />
                      <div>
                        <h4 className="text-sm font-medium text-amber-200">
                          Protect your API key
                        </h4>
                        <p className="mt-1 text-xs leading-5 text-slate-400">
                          Store and use API keys on the server only. Never
                          expose them in frontend code or API responses.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold">Knowledge pages</h3>
                      <p className="mt-1 text-xs leading-5 text-slate-400">
                        Add pages and keywords to help your assistant identify
                        relevant website content.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={addPage}
                      className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-2 text-xs font-semibold text-violet-300 hover:bg-violet-500/20"
                    >
                      <FaPlus />
                      Add page
                    </button>
                  </div>

                  <div className="space-y-4">
                    {form.pages.map((page, index) => (
                      <div
                        key={`${index}-${page.path}`}
                        className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4"
                      >
                        <div className="mb-4 flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-300">
                            Page {index + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => removePage(index)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-red-500/10 hover:text-red-400"
                            aria-label={`Remove page ${index + 1}`}
                          >
                            <FaTrash />
                          </button>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <label
                              className={labelClass}
                              htmlFor={`page-name-${index}`}
                            >
                              Page name
                            </label>
                            <input
                              id={`page-name-${index}`}
                              className={inputClass}
                              value={page.name}
                              onChange={(e) =>
                                updatePage(index, "name", e.target.value)
                              }
                              placeholder="e.g. Services"
                            />
                          </div>

                          <div>
                            <label
                              className={labelClass}
                              htmlFor={`page-path-${index}`}
                            >
                              URL path
                            </label>
                            <input
                              id={`page-path-${index}`}
                              className={inputClass}
                              value={page.path}
                              onChange={(e) =>
                                updatePage(index, "path", e.target.value)
                              }
                              placeholder="e.g. /services"
                            />
                          </div>
                        </div>

                        <div className="mt-4">
                          <label
                            className={labelClass}
                            htmlFor={`keyword-${index}`}
                          >
                            Keywords
                          </label>

                          <div className="flex gap-2">
                            <input
                              id={`keyword-${index}`}
                              className={inputClass}
                              value={newKeyword[index] || ""}
                              onChange={(e) =>
                                setNewKeyword((previous) => ({
                                  ...previous,
                                  [index]: e.target.value,
                                }))
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  addKeyword(index);
                                }
                              }}
                              placeholder="e.g. services, solutions"
                            />
                            <button
                              type="button"
                              onClick={() => addKeyword(index)}
                              className="rounded-xl bg-violet-600 px-4 text-sm font-semibold hover:bg-violet-500"
                            >
                              Add
                            </button>
                          </div>

                          <div className="mt-3 flex flex-wrap gap-2">
                            {page.keywords.map((keyword, keywordIndex) => (
                              <span
                                key={`${keyword}-${keywordIndex}`}
                                className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 text-xs text-violet-200"
                              >
                                {keyword}
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeKeyword(index, keywordIndex)
                                  }
                                  aria-label={`Remove keyword ${keyword}`}
                                  className="text-violet-300 hover:text-white"
                                >
                                  <FaTimes />
                                </button>
                              </span>
                            ))}

                            {page.keywords.length === 0 && (
                              <p className="text-xs text-slate-500">
                                No keywords added yet.
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {form.pages.length === 0 && (
                      <div className="rounded-xl border border-dashed border-white/15 p-8 text-center">
                        <FaGlobe className="mx-auto mb-3 text-2xl text-slate-500" />
                        <p className="text-sm text-slate-300">
                          No pages added yet
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Add a page to give your assistant website context.
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Advanced settings */}
              {activeStep === 3 && (
                <>
                  <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-4">
                    <div className="flex items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
                        <FaMicrophone />
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold">
                          Voice assistance
                        </h3>
                        <p className="mt-1 text-xs leading-5 text-slate-400">
                          Enable voice features supported by your assistant
                          widget.
                        </p>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={form.enableVoice}
                        onClick={() =>
                          updateField("enableVoice", !form.enableVoice)
                        }
                        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                          form.enableVoice ? "bg-violet-500" : "bg-slate-700"
                        }`}
                      >
                        <span
                          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${
                            form.enableVoice ? "left-6" : "left-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-4">
                    <div className="flex items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300">
                        <FaGlobe />
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold">
                          Website navigation
                        </h3>
                        <p className="mt-1 text-xs leading-5 text-slate-400">
                          Allow your assistant to guide visitors to relevant
                          pages on your website.
                        </p>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={form.enableNavigation}
                        onClick={() =>
                          updateField(
                            "enableNavigation",
                            !form.enableNavigation,
                          )
                        }
                        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                          form.enableNavigation
                            ? "bg-violet-500"
                            : "bg-slate-700"
                        }`}
                      >
                        <span
                          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${
                            form.enableNavigation ? "left-6" : "left-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/[0.04] p-4">
                    <div className="flex items-start gap-3">
                      <FaCheckCircle className="mt-0.5 text-emerald-400" />
                      <div>
                        <h3 className="text-sm font-semibold text-emerald-200">
                          Ready to save your assistant
                        </h3>
                        <p className="mt-1 text-xs leading-5 text-slate-400">
                          Your configuration will be saved to your account. The
                          selected options must also be respected by your
                          backend and embedded widget.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 rounded-xl border border-white/[0.08] p-4">
                    <h3 className="text-sm font-semibold">
                      Configuration summary
                    </h3>
                    {[
                      ["Assistant", form.assistantName || "Not set"],
                      ["Business", form.businessName || "Not set"],
                      ["Business type", form.businessType || "Not set"],
                      ["Tone", form.tone],
                      ["Theme", selectedTheme.name],
                      ["Knowledge pages", `${form.pages.length} pages`],
                      [
                        "Voice assistance",
                        form.enableVoice ? "Enabled" : "Disabled",
                      ],
                      [
                        "Website navigation",
                        form.enableNavigation ? "Enabled" : "Disabled",
                      ],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="flex items-center justify-between gap-4 border-b border-white/[0.05] pb-3 last:border-0 last:pb-0"
                      >
                        <span className="text-xs text-slate-400">{label}</span>
                        <span className="text-right text-xs font-medium text-slate-200">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Navigation buttons */}
              <div className="flex flex-col-reverse gap-3 border-t border-white/[0.07] pt-5 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={previousStep}
                  disabled={activeStep === 0}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.10] px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/[0.05] disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <FaArrowLeft />
                  Previous
                </button>

                {activeStep < STEPS.length - 1 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-3 text-sm font-semibold transition hover:brightness-110"
                  >
                    Continue to {STEPS[activeStep + 1].label}
                    <FaArrowRight />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={saveAssistant}
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-3 text-sm font-semibold transition hover:brightness-110 disabled:opacity-60"
                  >
                    {saving ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      <FaSave />
                    )}
                    {saving ? "Saving..." : "Save Assistant"}
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* ============ LIVE PREVIEW ============ */}
          <aside className="min-w-0 xl:sticky xl:top-6">
            <section className="overflow-hidden rounded-3xl border border-white/[0.09] bg-[#0C1225]/95 shadow-2xl shadow-black/20">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] bg-white/[0.015] p-5">
                <div>
                  <div className="flex items-center gap-2">
                    <FaEye className="text-violet-300" />
                    <h2 className="font-semibold">Live preview</h2>
                  </div>
                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    Preview your assistant's appearance.
                  </p>
                </div>

                <select
                  aria-label="Preview theme"
                  value={form.theme}
                  onChange={(e) => updateField("theme", e.target.value)}
                  className="max-w-full rounded-lg border border-white/[0.10] bg-[#101831] px-3 py-2 text-xs text-slate-200 outline-none focus:border-violet-500"
                >
                  {THEMES.map((theme) => (
                    <option key={theme.id} value={theme.id}>
                      {theme.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-4 sm:p-6">
                <div
                  className="overflow-hidden rounded-2xl border shadow-2xl"
                  style={{
                    backgroundColor: selectedTheme.background,
                    color: selectedTheme.text,
                    borderColor: `${selectedTheme.accent}99`,
                  }}
                >
                  <div
                    className="flex items-center gap-3 border-b px-4 py-4"
                    style={{
                      borderColor: `${selectedTheme.text}12`,
                      backgroundColor: selectedTheme.surface,
                    }}
                  >
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xl text-white"
                      style={{
                        background: `linear-gradient(135deg, ${selectedTheme.accent}, #3979F6)`,
                      }}
                    >
                      <FaRobot />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-semibold">
                        {form.assistantName || "Your AI Assistant"}
                      </h3>
                      <p className="mt-1 flex items-center gap-1.5 text-xs opacity-70">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Online · Ready to help
                      </p>
                    </div>

                    <FaComments
                      className="shrink-0"
                      style={{ color: selectedTheme.accent }}
                    />
                  </div>

                  <div
                    className="flex min-h-[280px] max-h-[400px] flex-col gap-4 overflow-y-auto p-4"
                    aria-live="polite"
                  >
                    <div className="self-center rounded-full px-3 py-1 text-[10px] opacity-70">
                      TODAY
                    </div>

                    {previewMessages.map((message, index) => (
                      <div
                        key={`${index}-${message.role}`}
                        className={`flex max-w-[95%] items-end gap-2 ${
                          message.role === "user" ? "self-end" : "self-start"
                        }`}
                      >
                        {message.role === "assistant" && (
                          <div
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs text-white"
                            style={{
                              background: `linear-gradient(135deg, ${selectedTheme.accent}, #3979F6)`,
                            }}
                          >
                            <FaRobot />
                          </div>
                        )}

                        <div
                          className="rounded-2xl px-3.5 py-3 text-xs leading-6 sm:text-sm"
                          style={{
                            backgroundColor:
                              message.role === "user"
                                ? selectedTheme.accent
                                : selectedTheme.surface,
                            color:
                              message.role === "user"
                                ? "#FFFFFF"
                                : selectedTheme.text,
                            borderBottomRightRadius:
                              message.role === "user" ? "5px" : undefined,
                            borderBottomLeftRadius:
                              message.role === "assistant" ? "5px" : undefined,
                          }}
                        >
                          {message.text}
                        </div>
                      </div>
                    ))}

                    {form.pages.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-2">
                        {form.pages.slice(0, 3).map((page, index) => (
                          <span
                            key={`${page.path}-${index}`}
                            className="rounded-full border px-3 py-2 text-xs"
                            style={{
                              borderColor: `${selectedTheme.accent}60`,
                              backgroundColor: `${selectedTheme.accent}12`,
                            }}
                          >
                            {page.name || "Unnamed page"}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <form
                    onSubmit={handlePreviewSend}
                    className="mx-3 mb-3 flex items-center gap-2 rounded-2xl p-2 sm:mx-4 sm:mb-4"
                    style={{ backgroundColor: selectedTheme.surface }}
                  >
                    <input
                      aria-label="Preview message"
                      value={previewInput}
                      onChange={(e) => setPreviewInput(e.target.value)}
                      placeholder="Type your message..."
                      className="min-w-0 flex-1 bg-transparent px-2 py-2 text-xs outline-none placeholder:opacity-50 sm:text-sm"
                    />

                    {form.enableVoice && (
                      <span
                        title="Voice option enabled"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                        style={{
                          backgroundColor: `${selectedTheme.accent}22`,
                        }}
                      >
                        <FaMicrophone style={{ color: selectedTheme.accent }} />
                      </span>
                    )}

                    <button
                      type="submit"
                      aria-label="Send preview message"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white transition hover:scale-105"
                      style={{ backgroundColor: selectedTheme.accent }}
                    >
                      <FaPaperPlane className="text-xs" />
                    </button>
                  </form>

                  <div className="pb-4 text-center text-[10px] tracking-wide opacity-60">
                    <IoSparkles className="mr-1 inline" />
                    Powered by Lumora AI
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-2">
                  {[
                    {
                      icon: FaRobot,
                      title: "Smart",
                      description: "AI assistant",
                      color: "text-violet-300",
                      bg: "bg-violet-500/10",
                    },
                    {
                      icon: FaBolt,
                      title: "Fast",
                      description: "Quick support",
                      color: "text-blue-300",
                      bg: "bg-blue-500/10",
                    },
                    {
                      icon: FaPalette,
                      title: "Custom",
                      description: "Your style",
                      color: "text-emerald-300",
                      bg: "bg-emerald-500/10",
                    },
                  ].map((item) => {
                    const FeatureIcon = item.icon;

                    return (
                      <div key={item.title} className="min-w-0 rounded-xl p-2">
                        <div
                          className={`mb-2 flex h-9 w-9 items-center justify-center rounded-xl ${item.bg} ${item.color}`}
                        >
                          <FeatureIcon />
                        </div>
                        <p className="text-xs font-semibold">{item.title}</p>
                        <p className="mt-1 text-[10px] leading-4 text-slate-500">
                          {item.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Setup status */}
            <section className="mt-5 rounded-3xl border border-white/[0.08] bg-[#0C1225]/80 p-5">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold">
                <FaCheckCircle className="text-emerald-400" />
                Setup checklist
              </h3>

              {[
                ["Assistant name", Boolean(form.assistantName.trim())],
                [
                  "Business details",
                  Boolean(
                    form.businessName.trim() && form.businessDescription.trim(),
                  ),
                ],
                ["Appearance", Boolean(form.theme)],
                [
                  "Knowledge pages",
                  form.pages.length > 0 &&
                    form.pages.every(
                      (page) => page.name.trim() && page.path.trim(),
                    ),
                ],
              ].map(([label, complete]) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-3 py-2"
                >
                  <span className="text-xs text-slate-400">{label}</span>
                  <span
                    className={`flex items-center gap-1.5 text-xs ${
                      complete ? "text-emerald-400" : "text-slate-500"
                    }`}
                  >
                    {complete ? <FaCheckCircle /> : <FaExclamationCircle />}
                    {complete ? "Ready" : "Incomplete"}
                  </span>
                </div>
              ))}

              {/* ✅ View Assistant shortcut inside the sidebar too */}
              {hasSavedAssistant && (
                <button
                  type="button"
                  onClick={() => navigate("/assistant")}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-violet-500/30 bg-violet-500/10 px-4 py-2.5 text-xs font-semibold text-violet-300 transition hover:bg-violet-500/20"
                >
                  <FaExternalLinkAlt className="text-[10px]" />
                  View full assistant overview
                </button>
              )}
            </section>
          </aside>
        </div>

  
      </main>
    </div>
  );
};

export default Builder;