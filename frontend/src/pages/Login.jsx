import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/App";

const authImg =
  "https://images.unsplash.com/photo-1666453579043-fef25e9ce099?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400";

export default function Login() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  const handleGoogleLogin = () => {
    // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    const redirectUrl = window.location.origin + "/dashboard";
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-[#FAF8F5]">
      {/* Left */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col justify-between p-10 md:p-16 relative"
      >
        <Link to="/" className="font-heading text-2xl md:text-3xl tracking-tight" data-testid="login-brand">
          bloom<span className="italic font-light text-[#E8C4C4]">.</span>bakery
        </Link>

        <div className="max-w-md my-auto">
          <div className="overline mb-5">A soft welcome back</div>
          <h1 className="font-heading text-5xl md:text-6xl leading-[1] mb-6">
            Step into
            <br />
            <span className="italic">your bakery.</span>
          </h1>
          <p className="text-[#7E756D] leading-relaxed mb-10">
            One click with Google. Your products, your orders, your quiet little record book — all waiting.
          </p>

          <button
            data-testid="google-signin-btn"
            onClick={handleGoogleLogin}
            className="w-full btn-pill btn-pill-dark text-base py-4"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#FAF8F5" d="M21.35 11.1h-9.17v2.98h5.27c-.23 1.48-1.72 4.35-5.27 4.35-3.17 0-5.76-2.63-5.76-5.86s2.59-5.86 5.76-5.86c1.81 0 3.02.77 3.71 1.43l2.53-2.44C16.87 4.25 14.78 3.3 12.18 3.3 6.73 3.3 2.3 7.73 2.3 13.18s4.43 9.88 9.88 9.88c5.7 0 9.48-4 9.48-9.64 0-.65-.07-1.14-.16-1.62l-.15-.7z"/>
            </svg>
            Continue with Google
          </button>

          <p className="text-xs text-[#A39B93] mt-6">
            By continuing you agree to our gentle terms — no cookies harder than shortbread.
          </p>
        </div>

        <Link to="/" className="text-sm text-[#7E756D] hover:text-[#2C2927] transition">
          ← back to the storefront
        </Link>
      </motion.div>

      {/* Right image */}
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="hidden md:block relative overflow-hidden"
      >
        <img src={authImg} alt="Elegant cake" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5]/30 to-transparent" />
        <div className="absolute bottom-10 left-10 right-10 text-[#2C2927]">
          <div className="overline mb-2 text-[#3A3532]">Quiet luxury</div>
          <div className="font-heading italic text-3xl">“Everything tastes softer here.”</div>
        </div>
      </motion.div>
    </div>
  );
}
