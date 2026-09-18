import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

interface AuthLoadingProps {
  isNewUser: boolean;
  userName: string;
  onComplete: () => void;
}

const newUsersMessages = [
  "Welcome to the journey of innovation! 🚀",
  "Your adventure begins under the moonlight ✨",
  "Dream big, achieve bigger with GETSETAI 🌙",
  "The future belongs to those who believe in dreams 💫",
  "Your potential is limitless, like the night sky 🌟",
  "Every expert was once a beginner. Start strong! 💪",
  "The moon reminds us: even in darkness, you can shine 🌕",
  "Innovation starts with a single step. Take yours now! 🚀",
  "Your journey to greatness starts tonight under the stars 🌟",
  "The moon sees your potential. It's time to show the world ✨"
];

const returningUsersMessages = [
  "Welcome back! Ready to continue your journey? 🌙",
  "The moon shines brighter when you return ✨",
  "Your momentum is unstoppable. Keep pushing forward! 💪",
  "Great to see you again! Let's achieve more today 🚀",
  "The night sky awaits your next brilliant idea 💫",
  "Welcome back! Your dedication is inspiring 🌟",
  "The journey continues. Reach for the stars! 🌕",
  "You're back! Let's make today extraordinary 🚀",
  "The stars aligned for your return. Let's create magic ✨",
  "Your consistency under the moonlight is building success 🌙"
];

export function AuthLoading({ isNewUser, userName, onComplete }: AuthLoadingProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [moonPhase, setMoonPhase] = useState(0);
  const [stars, setStars] = useState<any[]>([]);
  const [shootingStars, setShootingStars] = useState<any[]>([]);

  const messages = isNewUser ? newUsersMessages : returningUsersMessages;

  useEffect(() => {
    // Generate stars with unique keys
    setStars(
      Array.from({ length: 200 }, (_, i) => ({
        id: `star-${i}-${Date.now()}`,
        top: Math.random() * 100,
        left: Math.random() * 100,
        opacity: Math.random() * 0.8 + 0.2,
        size: Math.random() * 2 + 1,
        duration: 2 + Math.random() * 3,
        delay: Math.random() * 2
      }))
    );

    // Generate shooting stars periodically
    const shootingStarInterval = setInterval(() => {
      setShootingStars(prev => {
        const newStar = {
          id: `shooting-${Date.now()}-${Math.random()}`,
          top: Math.random() * 50,
          left: Math.random() * 50,
          angle: Math.random() * 45 + 45
        };
        return [...prev, newStar];
      });

      // Remove shooting stars after animation
      setTimeout(() => {
        setShootingStars(prev => prev.slice(1));
      }, 1500);
    }, 2000);

    // Cycle through messages
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex(prev => (prev + 1) % messages.length);
    }, 1500);

    // Moon phase animation
    const moonInterval = setInterval(() => {
      setMoonPhase(prev => (prev + 0.5) % 360);
    }, 50);

    // Auto-complete after 6 seconds (4 messages * 1.5s each)
    const completeTimeout = setTimeout(() => {
      onComplete();
    }, 6000);

    return () => {
      clearInterval(shootingStarInterval);
      clearInterval(messageInterval);
      clearInterval(moonInterval);
      clearTimeout(completeTimeout);
    };
  }, [messages, onComplete]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black overflow-hidden relative">
      {/* Background stars */}
      <div className="absolute inset-0">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              top: `${star.top}%`,
              left: `${star.left}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
            }}
            animate={{
              opacity: [star.opacity * 0.5, star.opacity, star.opacity * 0.5],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              delay: star.delay,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Shooting stars */}
      <AnimatePresence>
        {shootingStars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              top: `${star.top}%`,
              left: `${star.left}%`,
            }}
            initial={{ opacity: 0, x: 0, y: 0 }}
            animate={{ 
              opacity: [0, 1, 0],
              x: [0, 100, 200],
              y: [0, 100, 200]
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>

      {/* Main content */}
      <div className="relative z-10 text-center px-8">
        {/* 3D Moon */}
        <div className="mb-12 relative" style={{ perspective: "1000px" }}>
          <motion.div
            className="w-48 h-48 mx-auto relative"
            style={{ transformStyle: "preserve-3d" }}
            animate={{ rotateY: moonPhase }}
          >
            {/* Moon body */}
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-br from-zinc-200 via-zinc-300 to-zinc-400"
              style={{ transform: "translateZ(0px)" }}
              animate={{
                boxShadow: [
                  "0 0 60px rgba(200, 200, 255, 0.3)",
                  "0 0 100px rgba(200, 200, 255, 0.5)",
                  "0 0 60px rgba(200, 200, 255, 0.3)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Moon craters */}
              {Array.from({ length: 8 }, (_, i) => (
                <motion.div
                  key={`crater-${i}-${Date.now()}`}
                  className="absolute rounded-full bg-zinc-400/50"
                  style={{
                    width: 10 + Math.random() * 20,
                    height: 10 + Math.random() * 20,
                    top: 20 + Math.random() * 60,
                    left: 20 + Math.random() * 60,
                    transform: `translateZ(${Math.random() * 10 - 5}px)`
                  }}
                />
              ))}
            </motion.div>

            {/* Moon glow effect */}
            <motion.div
              className="absolute inset-0 rounded-full bg-blue-400/20 blur-3xl"
              style={{ transform: "translateZ(-20px)" }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>

          {/* Orbiting particles */}
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          >
            {Array.from({ length: 6 }, (_, i) => (
              <motion.div
                key={`particle-${i}-${Date.now()}`}
                className="absolute w-2 h-2 bg-cyan-400/60 rounded-full"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: `rotate(${i * 60}deg) translateX(120px)`,
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.div>
        </div>

        {/* Welcome message */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMessageIndex}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {isNewUser ? `Welcome, ${userName}!` : `Welcome back, ${userName}!`}
            </h2>
            <motion.p
              className="text-xl md:text-2xl text-zinc-300"
              animate={{
                textShadow: [
                  "0 0 20px rgba(100, 200, 255, 0.3)",
                  "0 0 40px rgba(100, 200, 255, 0.5)",
                  "0 0 20px rgba(100, 200, 255, 0.3)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              {messages[currentMessageIndex]}
            </motion.p>
          </motion.div>
        </AnimatePresence>

        {/* Loading indicator */}
        <div className="flex justify-center gap-2">
          {Array.from({ length: 3 }, (_, i) => (
            <motion.div
              key={`dot-${i}-${Date.now()}`}
              className="w-3 h-3 bg-cyan-400 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        {/* Progress bar */}
        <motion.div
          className="mt-8 h-1 bg-zinc-800 rounded-full overflow-hidden max-w-md mx-auto"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 6, ease: "easeInOut" }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-400 to-purple-500"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{ backgroundSize: "200% 200%" }}
          />
        </motion.div>
      </div>

      {/* Ambient fog effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 via-transparent to-purple-900/20 pointer-events-none" />
    </div>
  );
}