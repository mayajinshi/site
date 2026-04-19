import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { API } from "@/App";
import { useAuth } from "@/App";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const hash = window.location.hash || "";
    const sid = new URLSearchParams(hash.replace(/^#/, "")).get("session_id");
    if (!sid) {
      navigate("/login", { replace: true });
      return;
    }
    (async () => {
      try {
        const res = await axios.post(`${API}/auth/session`, { session_id: sid });
        setUser(res.data.user);
        toast.success(`Welcome, ${res.data.user.name.split(" ")[0]}!`);
        window.history.replaceState(null, "", "/dashboard");
        navigate("/dashboard", { replace: true, state: { user: res.data.user } });
      } catch (e) {
        toast.error("Sign-in failed. Please try again.");
        navigate("/login", { replace: true });
      }
    })();
  }, [navigate, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]" data-testid="auth-callback">
      <div className="font-heading text-4xl text-[#2C2927] animate-pulse">Welcoming you in…</div>
    </div>
  );
}
