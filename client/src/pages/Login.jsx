
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import {
  FaMagic,
  FaMicrophone,
  FaCode,
  FaArrowRight,
  FaCheck,
  FaWaveSquare,
} from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  FiArrowUpRight,
  FiShield,
  FiZap
} from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";
import axios from "axios";
import { signInWithGoogle } from "../config/firebase";
import toast from "react-hot-toast";

const features = [
  {
    icon: FaMagic,
    title: "Customize your AI",
    desc: "Give your assistant a unique personality, voice, and style.",
    color: "from-violet-500 to-fuchsia-500",
  },
  {
    icon: FaMicrophone,
    title: "Natural conversations",
    desc: "Create engaging voice experiences for your visitors.",
    color: "from-blue-500 to-cyan-400",
  },
  {
    icon: FaCode,
    title: "One-click integration",
    desc: "Embed your assistant into almost any website.",
    color: "from-emerald-400 to-teal-500",
  },
];

const Login = ({setUser}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const { user } = await signInWithGoogle();

      if (!user?.displayName || !user?.email) {
        throw new Error("Your Google account is missing required profile information.");
      }

      // Send Firebase ID token so the backend can verify the identity.
      const firebaseIdToken = await user.getIdToken();

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/google`,
        {
          name: user.displayName,
          email: user.email,
          firebaseUid: user.uid,
          idToken: firebaseIdToken,
        },
        { withCredentials: true },
      );

      if (response.data.success) {
        setUser(response.data);
        toast.success("Login Successfull.");
        window.location.assign(
        //   response.data.user.isSetupComplete ? "/dashboard" : "/setup",
        "/"
        );
      } else {
        toast.error("Unable to sign in. Please try again.");
        setError(response.data.message || "Unable to sign in. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);

      if (err.code === "auth/popup-closed-by-user") {
        setError("Sign-in was cancelled. You can try again whenever you're ready.");
      } else {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Something went wrong. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080817] font-sans text-white selection:bg-violet-500/30">
      {/* Ambient background */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-violet-600/20 blur-[130px]" />
      <div className="pointer-events-none absolute -bottom-48 right-0 h-[32rem] w-[32rem] rounded-full bg-blue-600/15 blur-[140px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[25rem] w-[25rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-500/[0.06] blur-[100px]" />

      {/* Navbar */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-6 sm:px-8 lg:px-12">
        <a href="/" className="group flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-gradient-to-br from-violet-500 to-blue-500 shadow-lg shadow-violet-500/20 transition-transform group-hover:rotate-6">
            <FaWaveSquare className="text-xl text-white" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight">
              Lumora <span className="text-violet-400">AI</span>
            </span>
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-slate-500">
              Voice intelligence
            </p>
          </div>
        </a>

        <div className="hidden items-center gap-2 text-sm text-slate-400 sm:flex">
          <FiShield className="text-emerald-400" />
          Secure authentication
        </div>
      </header>

      {/* Main content */}
      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-100px)] max-w-7xl grid-cols-1 items-center gap-12 px-5 pb-14 pt-6 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-12 lg:pb-20">
        {/* Left: Brand story */}
        <div className="mx-auto w-full max-w-2xl space-y-8 lg:mx-0 lg:space-y-9">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/[0.09] px-4 py-2 text-xs font-medium text-violet-200 sm:text-sm">
            <HiOutlineSparkles className="text-base text-violet-400" />
            Your next-generation AI voice assistant
            <span className="ml-1 h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
          </div>

          <div className="space-y-5">
            <h1 className="text-4xl font-bold leading-[1.12] tracking-tight sm:text-5xl md:text-6xl xl:text-[4.5rem]">
              Give your website
              <br />
              a voice of its own.
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
                Meet Lumora AI.
              </span>
            </h1>

            <p className="max-w-xl text-base leading-7 text-slate-400 sm:text-lg sm:leading-8">
              Build an intelligent voice assistant that answers questions,
              guides visitors, and turns everyday conversations into meaningful
              customer experiences.
            </p>
          </div>

          {/* Feature highlights */}
          <div className="grid gap-3 sm:grid-cols-3">
            {features.map(({ icon: Icon, title, desc, color }) => (
              <div
                key={title}
                className="group rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/30 hover:bg-white/[0.06]"
              >
                <div
                  className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${color} shadow-lg`}
                >
                  <Icon className="text-base text-white" />
                </div>
                <h3 className="text-sm font-semibold text-white">{title}</h3>
                <p className="mt-2 text-xs leading-5 text-slate-400">{desc}</p>
              </div>
            ))}
          </div>

          {/* Trust points */}
          <div className="flex flex-wrap gap-x-5 gap-y-3 border-t border-white/[0.08] pt-6 text-xs text-slate-400 sm:text-sm">
            <span className="flex items-center gap-2">
              <FaCheck className="text-emerald-400" />
              Easy setup
            </span>
            <span className="flex items-center gap-2">
              <FaCheck className="text-emerald-400" />
              No coding required for setup
            </span>
            <span className="flex items-center gap-2">
              <FaCheck className="text-emerald-400" />
              Start for free
            </span>
          </div>
        </div>

        {/* Right: Sign-in panel */}
        <div className="mx-auto w-full max-w-md lg:ml-auto">
          <div className="relative">
            {/* Decorative glow */}
            <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-br from-violet-500/30 via-blue-500/10 to-fuchsia-500/20 opacity-70 blur-xl" />

            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/[0.12] bg-[#111120]/90 p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:p-9">
              {/* Panel decoration */}
              <div className="pointer-events-none absolute -right-20 -top-24 h-52 w-52 rounded-full bg-violet-500/10 blur-3xl" />

              <div className="relative text-center">
                {/* Voice visual */}
                <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center">
                  <div className="absolute inset-0 rounded-[2rem] border border-violet-400/20 bg-violet-500/[0.07] rotate-12" />
                  <div className="absolute inset-2 rounded-[1.5rem] bg-gradient-to-br from-violet-500/20 to-cyan-500/10" />
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-indigo-500 to-blue-500 shadow-xl shadow-violet-500/30">
                    <FaMicrophone className="text-2xl text-white" />
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-400 ring-4 ring-[#111120]">
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    </span>
                  </div>
                </div>

                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
                  Welcome to Lumora
                </p>
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Start a conversation
                </h2>
                <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-slate-400">
                  Sign in to create your AI assistant and bring your website
                  to life.
                </p>
              </div>

              {/* Sign-in action */}
              <div className="relative mt-8 space-y-4">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-3 rounded-xl bg-white px-5 py-4 text-sm font-semibold text-slate-900 shadow-lg shadow-black/10 transition duration-200 hover:bg-slate-100 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <AiOutlineLoading3Quarters className="animate-spin text-lg" />
                      <span>Connecting to Google...</span>
                    </>
                  ) : (
                    <>
                      <FcGoogle className="text-xl" />
                      <span>Continue with Google</span>
                      <FaArrowRight className="ml-auto text-xs text-slate-400 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>

                {error && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-400/20 bg-red-500/[0.08] px-4 py-3 text-sm leading-5 text-red-300"
                  >
                    {error}
                  </div>
                )}

                <div className="flex items-center gap-3 py-2">
                  <div className="h-px flex-1 bg-white/[0.08]" />
                  <span className="text-[11px] text-slate-500">
                    SIMPLE. SMART. VOICE-POWERED.
                  </span>
                  <div className="h-px flex-1 bg-white/[0.08]" />
                </div>

                {/* Free plan */}
                <div className="flex items-start gap-3 rounded-xl border border-emerald-400/15 bg-emerald-400/[0.05] p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-400/10">
                    <FiZap className="text-lg text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">
                      Start with the free plan
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      Get 200 AI responses to explore the possibilities.
                    </p>
                  </div>
                  <FiArrowUpRight className="mt-1 text-slate-500" />
                </div>

                <div className="flex items-center justify-center gap-2 pt-2 text-xs text-slate-500">
                  <FiShield className="text-emerald-400" />
                  Your account is protected with secure sign-in.
                </div>
              </div>
            </div>
          </div>

          <p className="mt-6 px-3 text-center text-xs leading-6 text-slate-500">
            By continuing, you agree to our{" "}
            <a
              href="/terms"
              className="text-slate-300 underline decoration-slate-600 underline-offset-4 hover:text-white"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              className="text-slate-300 underline decoration-slate-600 underline-offset-4 hover:text-white"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/[0.06] px-5 py-5 text-center text-xs text-slate-600">
        © {new Date().getFullYear()} Lumora AI. Built for better conversations.
      </footer>
    </main>
  );
};

export default Login;
