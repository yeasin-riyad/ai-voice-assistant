import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiMenu as Menu,
  FiX as X,
  FiHome as Home,
  FiGrid as LayoutDashboard,
  FiCreditCard as CreditCard,
  FiLogOut as LogOut,
  FiChevronDown as ChevronDown,
  FiStar as Sparkles,
  FiLoader as Loader2,
  FiMic as Mic, 
} from "react-icons/fi";

import toast from "react-hot-toast";

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const navigation = [
    {
      name: "Home",
      path: "/",
      icon: Home,
    },
    {
      name: "Builder",
      path: "/builder",
      icon: LayoutDashboard,
    },
    // {
    //   name: "Billing",
    //   path: "/billing",
    //   icon: CreditCard,
    // },
  ];

  const getInitial = () => {
    return user?.name?.trim()?.charAt(0)?.toUpperCase() || "U";
  };

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`,
        { withCredentials: true },
      );

      setUser(null);
      setProfileOpen(false);
      setMenuOpen(false);
      toast.success("Logout Successfull");
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed");
    } finally {
      setLoggingOut(false);
    }
  };

  const closeMenus = () => {
    setMenuOpen(false);
    setProfileOpen(false);
  };

  const renderNavigation = (mobile = false) =>
    navigation.map(({ name, path, icon: Icon }) => (
      <NavLink
        key={path}
        to={path}
        end={path === "/"}
        onClick={closeMenus}
        className={({ isActive }) =>
          `group flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
            isActive
              ? "bg-violet-500/15 text-violet-300 ring-1 ring-violet-400/20"
              : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
          } ${mobile ? "w-full" : ""}`
        }
      >
        <Icon size={17} />
        <span>{name}</span>
      </NavLink>
    ));

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#080817]/90 backdrop-blur-2xl">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[76px] items-center justify-between gap-4">
          
          {/* Logo (Replaced with Mic) */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="group flex shrink-0 items-center gap-2.5"
            aria-label="Lumora AI home"
          >
            {/* ✅ Replaced Image with Mic Gradient Box */}
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 shadow-lg shadow-violet-950/20 transition-transform group-hover:scale-105">
              <Mic size={20} className="text-white" />
            </div>

            <div className="text-left">
              <h1 className="text-lg font-bold tracking-tight text-white sm:text-xl">
                Lumora{" "}
                <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                  AI
                </span>
              </h1>
              <p className="hidden text-[10px] font-medium tracking-[0.2em] text-slate-500 sm:block">
                YOUR AI, YOUR BUSINESS
              </p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 md:flex">
            {renderNavigation()}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative">
                {/* Profile Button */}
                <button
                  type="button"
                  onClick={() => setProfileOpen((prev) => !prev)}
                  className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] p-1.5 pr-2.5 transition hover:border-violet-400/30 hover:bg-white/[0.06] sm:gap-3 sm:pr-3"
                  aria-expanded={profileOpen}
                  aria-label="Open profile menu"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-bold text-white shadow-lg shadow-violet-900/30">
                    {getInitial()}
                  </div>

                  <div className="hidden min-w-0 text-left sm:block">
                    <p className="max-w-28 truncate text-sm font-semibold text-white">
                      {user?.name || "User"}
                    </p>
                    <p className="max-w-32 truncate text-xs text-slate-500">
                      {user?.email || ""}
                    </p>
                  </div>

                  <ChevronDown
                    size={15}
                    className={`hidden text-slate-500 transition-transform sm:block ${
                      profileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Profile Dropdown */}
                {profileOpen && (
                  <>
                    <button
                      type="button"
                      aria-label="Close profile menu"
                      className="fixed inset-0 z-40 cursor-default"
                      onClick={() => setProfileOpen(false)}
                    />

                    <div className="absolute right-0 top-full z-50 mt-3 w-64 overflow-hidden rounded-2xl border border-white/10 bg-[#111126] p-2 shadow-2xl shadow-black/40">
                      <div className="border-b border-white/[0.08] px-3 py-3">
                        <p className="truncate text-sm font-semibold text-white">
                          {user?.name || "User"}
                        </p>
                        <p className="mt-1 truncate text-xs text-slate-400">
                          {user?.email || ""}
                        </p>
                      </div>

                      <div className="space-y-1 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            navigate("/builder");
                            setProfileOpen(false);
                          }}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
                        >
                          <LayoutDashboard size={17} />
                          Open Builder
                        </button>
                      </div>

                      <div className="border-t border-white/[0.08] pt-2">
                        <button
                          type="button"
                          onClick={handleLogout}
                          disabled={loggingOut}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {loggingOut ? (
                            <Loader2 size={17} className="animate-spin" />
                          ) : (
                            <LogOut size={17} />
                          )}
                          {loggingOut ? "Logging out..." : "Log out"}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:from-violet-500 hover:to-indigo-500"
              >
                Get Started
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] text-slate-300 transition hover:bg-white/[0.06] hover:text-white md:hidden"
              aria-label={menuOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="border-t border-white/[0.08] py-4 md:hidden">
            <div className="space-y-1">
              {renderNavigation(true)}
            </div>

            {user && (
              <div className="mt-4 border-t border-white/[0.08] pt-4">
                <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/[0.03] p-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 font-bold text-white">
                    {getInitial()}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">
                      {user?.name || "User"}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {user?.email || ""}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/10 disabled:opacity-60"
                >
                  {loggingOut ? (
                    <Loader2 size={17} className="animate-spin" />
                  ) : (
                    <LogOut size={17} />
                  )}
                  {loggingOut ? "Logging out..." : "Log out"}
                </button>
              </div>
            )}

            {!user && (
              <button
                type="button"
                onClick={() => {
                  closeMenus();
                  navigate("/login");
                }}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white"
              >
                <Sparkles size={17} />
                Get Started
              </button>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;