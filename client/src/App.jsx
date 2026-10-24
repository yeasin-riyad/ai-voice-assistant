
import { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import axios from "axios";
import {Toaster} from "react-hot-toast"

import Home from "./pages/Home";
import Login from "./pages/Login";
import Builder from "./pages/Builder";
import Billing from "./pages/Billing";

import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedLayout from "./components/ProtectedLayout";
import AssistantView from "./pages/AssistantView";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/current-user`,
          { withCredentials: true },
        );

        // Supports either { user: {...} } or a direct user object.
        setUser(res.data.user ?? res.data);
      } catch (error) {
        if (error.response?.status !== 401) {
          console.error("Failed to fetch current user:", error);
        }

        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080817]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-500/20 border-t-violet-500" />
      </div>
    );
  }

  return (
    <>
    <Toaster position="bottom-right"/>
    <Routes>
      {/* Public routes */}

      <Route
        path="/login"
        element={
          user ? (
            <Navigate to="/builder" replace />
          ) : (
            <Login setUser={setUser} />
          )
        }
      />

      {/* Protected routes */}
      <Route element={<ProtectedRoute user={user} loading={loading} />}>
        <Route
          element={
            <ProtectedLayout user={user} setUser={setUser} />
          }
        >
                <Route path="/" element={<Home user={user} />} />

          <Route
            path="/builder"
            element={<Builder user={user} setUser={setUser} />}
          />

                  <Route path="/assistant" element={<AssistantView user={user} setUser={setUser} />} />


          {/* <Route
            path="/billing"
            element={<Billing user={user} />}
          /> */}
        </Route>


      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </>
  );
};

export default App;
