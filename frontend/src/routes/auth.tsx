import { motion, AnimatePresence } from "motion/react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { GoogleSignIn } from "@/components/auth/GoogleSignIn";
import { XCircle, X } from "lucide-react";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { login, signup, isLoading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  
  // Signup form state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [signupError, setSignupError] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [stars, setStars] = useState<any[]>([]);
  const [moonCraters, setMoonCraters] = useState<any[]>([]);
  const [smallMoonCraters, setSmallMoonCraters] = useState<any[]>([]);

  // Generate random elements only on client side to avoid hydration mismatch
  useEffect(() => {
    setStars(
      Array.from({ length: 150 }, (_, i) => ({
        id: `star-${Date.now()}-${i}`,
        top: Math.random() * 100,
        left: Math.random() * 100,
        opacity: Math.random() * 0.8,
        duration: 2 + Math.random() * 3
      }))
    );

    setMoonCraters(
      Array.from({ length: 5 }, (_, i) => ({
        id: `crater1-${Date.now()}-${i}`,
        width: 10 + Math.random() * 15,
        height: 10 + Math.random() * 15,
        top: 20 + Math.random() * 40,
        left: 20 + Math.random() * 40
      }))
    );

    setSmallMoonCraters(
      Array.from({ length: 3 }, (_, i) => ({
        id: `crater2-${Date.now()}-${i}`,
        width: 6 + Math.random() * 8,
        height: 6 + Math.random() * 8,
        top: 25 + Math.random() * 35,
        left: 25 + Math.random() * 35
      }))
    );
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      await login(loginEmail, loginPassword);
      navigate({ to: "/courses" });
    } catch (error: any) {
      setLoginError(error.message || "Invalid email or password");
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError("");
    if (signupPassword !== signupConfirmPassword) {
      setSignupError("Passwords do not match!");
      return;
    }
    try {
      await signup(signupEmail, signupPassword, signupName);
      navigate({ to: "/courses" });
    } catch (error: any) {
      setSignupError(error.message || "Signup failed. Please try again.");
    }
  };

  const toggleAuth = () => {
    setIsLogin(!isLogin);
    setLoginError("");
    setSignupError("");
  };

  return (
    <div className="min-h-screen flex overflow-hidden bg-black">
      {/* Left Section - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 pt-28 pb-12 relative z-10">
        {/* Form Container */}
        <div className="max-w-md mx-auto w-full">
          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-4xl font-bold text-white mb-2">Welcome!</h1>
                <p className="text-zinc-400 mb-8">Sign in to continue your journey</p>

                {/* Login Error Popup */}
                <AnimatePresence>
                  {loginError && (
                    <motion.div
                      initial={{ 
                        opacity: 0, 
                        scale: 0.5, 
                        rotateX: -90,
                        y: -50 
                      }}
                      animate={{ 
                        opacity: 1, 
                        scale: 1, 
                        rotateX: 0,
                        y: 0 
                      }}
                      exit={{ 
                        opacity: 0, 
                        scale: 0.5, 
                        rotateX: 90,
                        y: -50 
                      }}
                      transition={{ 
                        type: "spring", 
                        damping: 15, 
                        stiffness: 200 
                      }}
                      className="mb-6 relative"
                      style={{ perspective: "1000px" }}
                    >
                      <motion.div
                        className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm backdrop-blur-sm"
                        style={{ transformStyle: "preserve-3d" }}
                        whileHover={{ 
                          rotateX: 5,
                          rotateY: -5,
                          scale: 1.02,
                          boxShadow: "0 20px 40px rgba(239, 68, 68, 0.2)"
                        }}
                        animate={{
                          boxShadow: [
                            "0 0 20px rgba(239, 68, 68, 0.3)",
                            "0 0 40px rgba(239, 68, 68, 0.5)",
                            "0 0 20px rgba(239, 68, 68, 0.3)"
                          ]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <motion.div
                              animate={{ rotate: [0, -10, 10, -10, 0] }}
                              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                            >
                              <XCircle className="w-5 h-5" />
                            </motion.div>
                            <span className="font-semibold">Invalid Credentials</span>
                          </div>
                          <button
                            onClick={() => setLoginError("")}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="mt-1 text-red-300/80">{loginError}</p>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Social Login */}
                <div className="mb-6">
                  <GoogleSignIn
                    text="signin_with"
                    onSuccess={() => {
                      console.log('Google sign-in success callback triggered in auth login');
                      navigate({ to: "/courses" });
                    }}
                  />
                </div>

                {/* Divider */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 h-px bg-zinc-700"></div>
                  <span className="text-zinc-500 text-sm">or</span>
                  <div className="flex-1 h-px bg-zinc-700"></div>
                </div>

                {/* Email/Password Form */}
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Email</label>
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => {
                        setLoginEmail(e.target.value);
                        setLoginError("");
                      }}
                      className="w-full px-4 py-3 rounded-lg border border-zinc-700 bg-zinc-900/50 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
                      placeholder="Enter your email"
                      autoComplete="email"
                      required
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm text-zinc-400">Password</label>
                      <span className="text-sm text-zinc-400">Forgot password?</span>
                    </div>
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => {
                        setLoginPassword(e.target.value);
                        setLoginError("");
                      }}
                      className="w-full px-4 py-3 rounded-lg border border-zinc-700 bg-zinc-900/50 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-lg bg-white text-black font-semibold hover:bg-zinc-200 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? "Signing in..." : "Sign in"}
                  </button>
                </form>

                {/* Sign Up Link */}
                <p className="text-center text-zinc-400 mt-6">
                  Don't have an account?{" "}
                  <button
                    onClick={toggleAuth}
                    className="text-white hover:underline font-medium"
                  >
                    Sign up
                  </button>
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-4xl font-bold text-white mb-2">Create Account</h1>
                <p className="text-zinc-400 mb-8">Join us and start your journey</p>

                {/* Signup Error Popup */}
                <AnimatePresence>
                  {signupError && (
                    <motion.div
                      initial={{ 
                        opacity: 0, 
                        scale: 0.5, 
                        rotateX: -90,
                        y: -50 
                      }}
                      animate={{ 
                        opacity: 1, 
                        scale: 1, 
                        rotateX: 0,
                        y: 0 
                      }}
                      exit={{ 
                        opacity: 0, 
                        scale: 0.5, 
                        rotateX: 90,
                        y: -50 
                      }}
                      transition={{ 
                        type: "spring", 
                        damping: 15, 
                        stiffness: 200 
                      }}
                      className="mb-6 relative"
                      style={{ perspective: "1000px" }}
                    >
                      <motion.div
                        className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm backdrop-blur-sm"
                        style={{ transformStyle: "preserve-3d" }}
                        whileHover={{ 
                          rotateX: 5,
                          rotateY: -5,
                          scale: 1.02,
                          boxShadow: "0 20px 40px rgba(239, 68, 68, 0.2)"
                        }}
                        animate={{
                          boxShadow: [
                            "0 0 20px rgba(239, 68, 68, 0.3)",
                            "0 0 40px rgba(239, 68, 68, 0.5)",
                            "0 0 20px rgba(239, 68, 68, 0.3)"
                          ]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <motion.div
                              animate={{ rotate: [0, -10, 10, -10, 0] }}
                              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                            >
                              <XCircle className="w-5 h-5" />
                            </motion.div>
                            <span className="font-semibold">Signup Error</span>
                          </div>
                          <button
                            onClick={() => setSignupError("")}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="mt-1 text-red-300/80">{signupError}</p>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Social Login */}
                <div className="mb-6">
                  <GoogleSignIn
                    text="signup_with"
                    onSuccess={() => {
                      console.log('Google sign-in success callback triggered in auth signup');
                      navigate({ to: "/courses" });
                    }}
                  />
                </div>

                {/* Divider */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 h-px bg-zinc-700"></div>
                  <span className="text-zinc-500 text-sm">or</span>
                  <div className="flex-1 h-px bg-zinc-700"></div>
                </div>

                {/* Signup Form */}
                <form onSubmit={handleSignupSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Name</label>
                    <input
                      type="text"
                      value={signupName}
                      onChange={(e) => {
                        setSignupName(e.target.value);
                        setSignupError("");
                      }}
                      className="w-full px-4 py-3 rounded-lg border border-zinc-700 bg-zinc-900/50 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
                      placeholder="Enter your name"
                      autoComplete="name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Email</label>
                    <input
                      type="email"
                      value={signupEmail}
                      onChange={(e) => {
                        setSignupEmail(e.target.value);
                        setSignupError("");
                      }}
                      className="w-full px-4 py-3 rounded-lg border border-zinc-700 bg-zinc-900/50 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
                      placeholder="Enter your email"
                      autoComplete="email"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Password</label>
                    <input
                      type="password"
                      value={signupPassword}
                      onChange={(e) => {
                        setSignupPassword(e.target.value);
                        setSignupError("");
                      }}
                      className="w-full px-4 py-3 rounded-lg border border-zinc-700 bg-zinc-900/50 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
                      placeholder="Create a password"
                      autoComplete="new-password"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Confirm Password</label>
                    <input
                      type="password"
                      value={signupConfirmPassword}
                      onChange={(e) => {
                        setSignupConfirmPassword(e.target.value);
                        setSignupError("");
                      }}
                      className="w-full px-4 py-3 rounded-lg border border-zinc-700 bg-zinc-900/50 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
                      placeholder="Confirm your password"
                      autoComplete="new-password"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-lg bg-white text-black font-semibold hover:bg-zinc-200 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? "Creating account..." : "Sign up"}
                  </button>
                </form>

                {/* Login Link */}
                <p className="text-center text-zinc-400 mt-6">
                  Already have an account?{" "}
                  <button
                    onClick={toggleAuth}
                    className="text-white hover:underline font-medium"
                  >
                    Login
                  </button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right Section - Promotional */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center px-12 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-900" />
        <div className="absolute inset-0">
          {stars.length > 0 && stars.map((star) => (
            <div
              key={star.id}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                top: `${star.top}%`,
                left: `${star.left}%`,
                opacity: star.opacity * 0.5,
                animation: `twinkle ${star.duration}s infinite`,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            {/* 3D Cube Animation */}
            <div className="w-32 h-32 mx-auto mb-8 relative" style={{ perspective: "1000px" }}>
              <motion.div
                className="w-full h-full relative"
                animate={{ rotateY: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Cube faces */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 border-2 border-cyan-400/50 rounded-lg bg-cyan-400/10 backdrop-blur-sm" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center" style={{ transform: "translateZ(20px)" }}>
                  <div className="w-20 h-20 border-2 border-purple-400/50 rounded-lg bg-purple-400/10 backdrop-blur-sm" />
                </div>
              </motion.div>
              
              {/* Circular arrow */}
              <motion.div
                className="absolute inset-0"
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              >
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <path
                    d="M 50 10 A 40 40 0 1 1 10 50"
                    fill="none"
                    stroke="rgba(100, 200, 255, 0.3)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 10 50 L 15 45 L 15 55 Z"
                    fill="rgba(100, 200, 255, 0.3)"
                  />
                </svg>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              400K+ users. 50M+ AI generated graphics.
            </h2>
            <p className="text-zinc-400 mb-8">
              Join thousands of creators who are already using our platform to bring their ideas to life.
            </p>
            <button
              onClick={toggleAuth}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold hover:opacity-90 transition-opacity"
            >
              Join Now
            </button>
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}