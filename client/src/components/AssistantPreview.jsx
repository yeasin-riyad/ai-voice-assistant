import { useState } from "react";
import {
  FaRobot,
  FaMicrophone,
  FaPaperPlane,
  FaVolumeUp,
  FaRegLightbulb,
  FaRegComments,
  FaCheckCircle,
  FaSun,
  FaMoon,
  FaMagic,
  FaBolt,
  FaTimes,
} from "react-icons/fa";
import { IoSparkles, IoColorPalette } from "react-icons/io5";

const themes = [
  {
    id: "light",
    name: "Light",
    icon: FaSun,
    color: "bg-amber-400",
    preview: "bg-white",
  },
  {
    id: "dark",
    name: "Dark",
    icon: FaMoon,
    color: "bg-violet-500",
    preview: "bg-[#17172b]",
  },
  {
    id: "glass",
    name: "Glass",
    icon: IoColorPalette,
    color: "bg-cyan-400",
    preview: "bg-slate-400/30",
  },
  {
    id: "neon",
    name: "Neon",
    icon: FaMagic,
    color: "bg-fuchsia-500",
    preview: "bg-fuchsia-950",
  },
];

const suggestions = [
  "What can you help me with?",
  "Tell me about your services",
  "How does it work?",
];

const initialMessages = [
  {
    id: 1,
    role: "assistant",
    text: "Hey there! 👋 Welcome to Lumora. I'm your AI assistant. How can I help you today?",
    time: "10:42 AM",
  },
  {
    id: 2,
    role: "user",
    text: "What can you help me with?",
    time: "10:42 AM",
  },
  {
    id: 3,
    role: "assistant",
    text: "Great question! ✨ I can answer questions, guide visitors around a website, and help them find exactly what they need.",
    time: "10:42 AM",
  },
];

const demoReplies = [
  "Absolutely! I'm here to help visitors find information, explore services, and get answers quickly. ✨",
  "Lumora makes websites more interactive with personalized AI conversations and voice-powered assistance.",
  "It's simple! Customize your assistant, choose a theme, and add it to your website. You're ready to go! 🚀",
];

const AssistantPreview = () => {
  const [activeTheme, setActiveTheme] = useState("dark");
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const currentTheme =
    themes.find((theme) => theme.id === activeTheme) || themes[1];

  const isLight = activeTheme === "light";
  const isGlass = activeTheme === "glass";
  const isNeon = activeTheme === "neon";

  const textColor = isLight ? "text-slate-900" : "text-white";
  const mutedColor = isLight ? "text-slate-500" : "text-slate-400";

  const panelBackground = isLight
    ? "bg-white"
    : isGlass
      ? "bg-slate-800/50 backdrop-blur-xl"
      : isNeon
        ? "bg-[#160b25]"
        : "bg-[#141428]";

  const borderColor = isLight
    ? "border-slate-200"
    : isNeon
      ? "border-fuchsia-500/30"
      : "border-white/[0.08]";

  const accentBackground = isNeon
    ? "bg-fuchsia-600"
    : "bg-gradient-to-br from-violet-600 to-indigo-600";

  const assistantBubble = isLight
    ? "bg-slate-100 text-slate-800"
    : isNeon
      ? "bg-fuchsia-500/10 text-fuchsia-100 border border-fuchsia-500/20"
      : "bg-white/[0.06] text-slate-200";

  const handleSend = (text = input) => {
    const trimmedText = text.trim();

    if (!trimmedText) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      text: trimmedText,
      time: "Now",
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
    ]);
    setInput("");
    setListening(false);

    // This is a frontend demo, not a real AI API call.
    const reply =
      demoReplies[
        Math.floor(Math.random() * demoReplies.length)
      ];

    setTimeout(() => {
      setMessages((previous) => [
        ...previous,
        {
          id: Date.now() + 1,
          role: "assistant",
          text: reply,
          time: "Now",
        },
      ]);
    }, 650);
  };

  const handleVoice = () => {
    // Visual demo only. No microphone permission is requested.
    setListening((previous) => !previous);
  };

  const handleReset = () => {
    setMessages(initialMessages);
    setInput("");
    setListening(false);
  };

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border shadow-2xl transition-colors duration-300 sm:rounded-3xl ${
        borderColor
      } ${panelBackground} ${
        isNeon
          ? "shadow-fuchsia-950/30"
          : "shadow-black/30"
      }`}
    >
      {/* Assistant Header */}
      <div
        className={`flex items-center justify-between gap-3 border-b px-4 py-4 sm:px-5 ${
          borderColor
        }`}
      >
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg ${
              accentBackground
            }`}
          >
            <FaRobot size={21} />

            <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-[#141428] bg-emerald-400" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className={`truncate text-sm font-bold ${textColor}`}>
                Shifra AI
              </h3>
              <FaCheckCircle
                className="shrink-0 text-blue-400"
                size={12}
              />
            </div>

            <p className={`mt-1 flex items-center gap-1.5 text-xs ${mutedColor}`}>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Online · Ready to assist
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          title="Reset conversation"
          aria-label="Reset conversation"
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition ${
            isLight
              ? "text-slate-500 hover:bg-slate-100"
              : "text-slate-400 hover:bg-white/[0.08] hover:text-white"
          }`}
        >
          <FaRegComments size={16} />
        </button>
      </div>

      {/* Theme Selector */}
      <div
        className={`flex items-center justify-between gap-3 border-b px-4 py-3 sm:px-5 ${
          borderColor
        }`}
      >
        <div className={`flex items-center gap-2 text-xs ${mutedColor}`}>
          <IoColorPalette size={16} />
          <span>Customize theme</span>
        </div>

        <div className="flex items-center gap-1.5">
          {themes.map((theme) => {
            const Icon = theme.icon;
            const selected = activeTheme === theme.id;

            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => setActiveTheme(theme.id)}
                title={`${theme.name} theme`}
                aria-label={`${theme.name} theme`}
                aria-pressed={selected}
                className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all ${
                  selected
                    ? isLight
                      ? "border-violet-400 bg-violet-50 text-violet-600"
                      : "border-violet-400/50 bg-violet-500/15 text-violet-300"
                    : isLight
                      ? "border-transparent text-slate-400 hover:bg-slate-100"
                      : "border-transparent text-slate-500 hover:bg-white/[0.07] hover:text-white"
                }`}
              >
                <Icon size={14} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Preview Content */}
      <div className="p-3 sm:p-5">
        {/* Welcome Banner */}
        <div
          className={`relative mb-4 overflow-hidden rounded-2xl p-4 sm:p-5 ${
            isLight
              ? "bg-gradient-to-br from-violet-50 to-indigo-50"
              : isNeon
                ? "bg-gradient-to-br from-fuchsia-950/80 to-violet-950/60"
                : "bg-gradient-to-br from-violet-600/20 via-indigo-600/10 to-cyan-500/10"
          }`}
        >
          <div className="pointer-events-none absolute -right-6 -top-8 h-28 w-28 rounded-full bg-violet-500/10 blur-2xl" />

          <div className="relative flex items-start justify-between gap-3">
            <div>
              <div
                className={`mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] ${
                  isLight ? "text-violet-600" : "text-violet-300"
                }`}
              >
                <IoSparkles size={13} />
                Your AI companion
              </div>

              <h4 className={`text-lg font-bold sm:text-xl ${textColor}`}>
                How can I help you?
              </h4>

              <p className={`mt-2 max-w-xs text-xs leading-5 sm:text-sm ${mutedColor}`}>
                Ask me anything. I'm here to make your experience easier.
              </p>
            </div>

            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                isLight
                  ? "bg-white text-violet-600 shadow-sm"
                  : "bg-white/[0.08] text-violet-300"
              }`}
            >
              <FaRegLightbulb size={18} />
            </div>
          </div>
        </div>

        {/* Conversation */}
        <div
          className={`mb-4 max-h-[290px] min-h-[220px] space-y-4 overflow-y-auto rounded-2xl border p-3 sm:p-4 ${
            borderColor
          } ${
            isLight
              ? "bg-slate-50/70"
              : isGlass
                ? "bg-white/[0.025]"
                : "bg-black/[0.10]"
          }`}
        >
          {messages.map((message) => {
            const isUser = message.role === "user";

            return (
              <div
                key={message.id}
                className={`flex items-end gap-2.5 ${
                  isUser ? "justify-end" : "justify-start"
                }`}
              >
                {!isUser && (
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-white ${
                      accentBackground
                    }`}
                  >
                    <FaRobot size={13} />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-3 sm:max-w-[80%] ${
                    isUser
                      ? `${accentBackground} text-white`
                      : assistantBubble
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words text-xs leading-6 sm:text-sm">
                    {message.text}
                  </p>

                  <p
                    className={`mt-1.5 text-[9px] ${
                      isUser
                        ? "text-white/60"
                        : mutedColor
                    }`}
                  >
                    {message.time}
                  </p>
                </div>
              </div>
            );
          })}

          {listening && (
            <div className="flex items-center gap-2 pl-1 text-xs text-violet-400">
              <span className="flex items-center gap-0.5">
                {[0, 1, 2, 3, 4].map((item) => (
                  <span
                    key={item}
                    className="w-1 animate-pulse rounded-full bg-violet-400"
                    style={{
                      height: `${8 + (item % 3) * 5}px`,
                      animationDelay: `${item * 100}ms`,
                    }}
                  />
                ))}
              </span>
              Listening demo...
            </div>
          )}
        </div>

        {/* Suggested Questions */}
        <div className="mb-4">
          <p className={`mb-2.5 text-[10px] font-semibold uppercase tracking-wider ${mutedColor}`}>
            Try asking
          </p>

          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleSend(suggestion)}
                className={`rounded-full border px-3 py-2 text-[10px] transition sm:text-xs ${
                  isLight
                    ? "border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:text-violet-600"
                    : isNeon
                      ? "border-fuchsia-500/20 bg-fuchsia-500/[0.05] text-fuchsia-200 hover:bg-fuchsia-500/15"
                      : "border-white/[0.09] bg-white/[0.025] text-slate-400 hover:border-violet-400/30 hover:bg-violet-500/10 hover:text-violet-200"
                }`}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleSend();
          }}
          className={`flex items-center gap-2 rounded-2xl border p-2 ${
            borderColor
          } ${
            isLight ? "bg-white" : "bg-black/[0.12]"
          }`}
        >
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Type your message..."
            aria-label="Type your message"
            className={`min-w-0 flex-1 bg-transparent px-2 py-2 text-xs outline-none placeholder:text-slate-500 sm:text-sm ${
              textColor
            }`}
          />

          <button
            type="button"
            onClick={handleVoice}
            aria-label={listening ? "Stop voice demo" : "Start voice demo"}
            aria-pressed={listening}
            title="Voice demo"
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition ${
              listening
                ? "animate-pulse bg-red-500 text-white"
                : isLight
                  ? "bg-slate-100 text-slate-600 hover:bg-violet-100 hover:text-violet-600"
                  : "bg-white/[0.06] text-slate-300 hover:bg-violet-500/20 hover:text-violet-300"
            }`}
          >
            {listening ? <FaTimes size={14} /> : <FaMicrophone size={14} />}
          </button>

          <button
            type="submit"
            disabled={!input.trim()}
            aria-label="Send message"
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white transition disabled:cursor-not-allowed disabled:opacity-40 ${
              accentBackground
            }`}
          >
            <FaPaperPlane size={13} />
          </button>
        </form>

        {/* Footer */}
        <div className={`mt-4 flex items-center justify-between gap-3 px-1 ${mutedColor}`}>
          <div className="flex items-center gap-1.5 text-[10px]">
            <FaBolt className="text-amber-400" />
            <span>Powered by AI</span>
          </div>

          <button
            type="button"
            onClick={() => setVoiceEnabled((previous) => !previous)}
            aria-pressed={voiceEnabled}
            className={`flex items-center gap-1.5 text-[10px] transition ${
              voiceEnabled
                ? "text-violet-300"
                : mutedColor
            }`}
          >
            <FaVolumeUp size={12} />
            Voice {voiceEnabled ? "on" : "off"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssistantPreview;
