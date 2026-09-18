import { motion } from "motion/react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button3D } from "@/components/ui/Button3D";
import { GoogleSignIn } from "@/components/auth/GoogleSignIn";
import { ArrowLeft, Mail, Lock, User, Sparkles } from "lucide-react";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [stars, setStars] = useState<any[]>([]);
  const [moonCraters, setMoonCraters] = useState<any[]>([]);

  // Generate random elements only on client side to avoid hydration mismatch
  useEffect(() => {
    setStars(
      Array.from({ length: 100 }, (_, i) => ({
        id: `signup-star-${i}`,
        top: Math.random() * 100,
        left: Math.random() * 100,
        opacity: Math.random() * 0.8,
        duration: 2 + Math.random() * 3
      }))
    );

    setMoonCraters(
      Array.from({ length: 5 }, (_, i) => ({
        id: `signup-crater-${i}`,
        width: 10 + Math.random() * 15,
        height: 10 + Math.random() * 15,
        top: 20 + Math.random() * 40,
        left: 20 + Math.random() * 40
      }))
    );
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    
    try {
      await signup(email, password, name);
      // After successful signup, redirect to courses (user is automatically logged in)
      navigate({ to: "/courses" });
    } catch (error: any) {
      setError(error.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Space Background */}
      <div className="absolute inset-0">
        {/* Deep space gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black" />
        
        {/* Stars */}
        <div className="absolute inset-0">
          {stars.length > 0 && stars.map((star) => (
            <div
              key={star.id}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                top: `${star.top}%`,
                left: `${star.left}%`,
                opacity: star.opacity,
                animation: `twinkle ${star.duration}s infinite`,
              }}
            />
          ))}
        </div>

        {/* Moon */}
        <motion.div
          className="absolute top-20 left-20 w-32 h-32 rounded-full"
          style={{
            background: "radial-gradient(circle at 30% 30%, #e8e8e8, #9ca3af)",
            boxShadow: "0 0 80px rgba(255, 255, 255, 0.15), 0 0 40px rgba(200, 200, 255, 0.1), inset -15px -15px 30px rgba(0, 0, 0, 0.4)",
          }}
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 120,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {/* Moon craters */}
          {moonCraters.length > 0 && moonCraters.map((crater) => (
            <div
              key={crater.id}
              className="absolute rounded-full bg-gray-600/40"
              style={{
                width: `${crater.width}px`,
                height: `${crater.height}px`,
                top: `${crater.top}%`,
                left: `${crater.left}%`,
              }}
            />
          ))}
        </motion.div>

        {/* Darker nebula effect */}
        <div
          className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, rgba(50, 50, 150, 0.2), transparent)",
            filter: "blur(120px)",
          }}
        />
      </div>

      {/* Mouse light effect - more subtle */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-10"
        animate={{
          background: `radial-gradient(500px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(100, 150, 255, 0.03), transparent)`,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
      />

      {/* Content */}
      <div className="relative z-20 flex items-center justify-center min-h-screen px-4 pt-20" onMouseMove={handleMouseMove}>
        <motion.div
          initial={{ opacity: 0, x: 100, rotateY: 20 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          exit={{ opacity: 0, x: 100, rotateY: 20 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
          style={{ perspective: "1000px" }}
          key="signup"
        >
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Courses
          </Link>

          <motion.div
            className="rounded-3xl border border-border bg-card/80 backdrop-blur-xl p-8 shadow-2xl"
            style={{ transformStyle: "preserve-3d" }}
            whileHover={{ rotateX: 2, rotateY: -2 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="h-6 w-6 text-cyan-400" />
                <h1 className="text-3xl font-bold">Join the Cosmos</h1>
              </div>
              <p className="text-muted-foreground mb-8">
                Create your account to begin your journey through knowledge
              </p>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm"
                >
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all backdrop-blur-sm"
                    placeholder="Enter your name"
                    required
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all backdrop-blur-sm"
                    placeholder="Enter your email"
                    required
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all backdrop-blur-sm"
                    placeholder="Create a password"
                    required
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all backdrop-blur-sm"
                    placeholder="Confirm your password"
                    required
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Button3D type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? "Creating Account..." : "Launch Journey"}
                  </Button3D>
                </motion.div>
              </form>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.75 }}
                className="relative my-6"
              >
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <GoogleSignIn 
                  text="signup_with"
                  onSuccess={() => {
                    console.log('Google sign-in success callback triggered in signup');
                    navigate({ to: "/courses" });
                  }} 
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="mt-8 text-center"
              >
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    to="/auth"
                    className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                  >
                    Login
                  </Link>
                </p>
                <p className="text-xs text-muted-foreground mt-3">
                  You'll be automatically logged in after signup
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
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
