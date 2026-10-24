import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiArrowRight as ArrowRight,
  FiMic as Mic,
  FiHeart as Heart,
} from "react-icons/fi";

const Footer = ({ user }) => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate(user ? "/builder" : "/login");
  };

  return (
    <footer className="border-t border-white/[0.06] bg-[#04040A]">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-5 py-8 text-center sm:flex-row sm:px-8 lg:px-10">
        
        {/* 1. Logo (Left) */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-xl font-bold tracking-tight text-white sm:flex-1 sm:justify-start"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500">
            <Mic size={16} className="text-white" />
          </div>
          Lumora{" "}
          <span className="bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">
            AI
          </span>
        </button>

        {/* 2. Center Content (Copyright & Made By) */}
        <div className="flex flex-col items-center justify-center gap-1.5 sm:flex-1">
          <p className="text-xs text-slate-500 sm:text-sm">
            © {new Date().getFullYear()} Lumora AI. Built for better
            conversations.
          </p>
          
          {/* Centered "Made by" Text */}
          <p className="flex items-center justify-center gap-1 text-[11px] font-medium text-slate-600 sm:text-xs">
            Made with <Heart size={10} className="text-rose-500/80" /> by{" "}
            <span className="cursor-pointer text-slate-400 transition-colors hover:text-violet-400">
              Yeasin Riyad
            </span>
          </p>
        </div>

        {/* 3. Get Started Button (Right) */}
        <div className="flex sm:flex-1 sm:justify-end">
          <button
            type="button"
            onClick={handleGetStarted}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 transition hover:text-white"
          >
            Get started
            <ArrowRight size={15} />
          </button>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;