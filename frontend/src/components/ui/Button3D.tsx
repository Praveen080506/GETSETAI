import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface Button3DProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  type?: "button" | "submit" | "reset";
}

export function Button3D({ children, onClick, className, disabled = false, size = "md", type = "button" }: Button3DProps) {
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative font-bold transition-all",
        "bg-paper text-ink",
        "rounded-full shadow-lg",
        "hover:shadow-2xl",
        "active:scale-95",
        "border border-white/20",
        disabled ? "opacity-50 cursor-not-allowed" : "",
        sizeClasses[size],
        className
      )}
      whileHover={{ 
        scale: 1.02,
        rotateX: 2,
        rotateY: -2,
        boxShadow: "0 10px 30px rgba(255, 255, 255, 0.15)"
      }}
      whileTap={{ 
        scale: 0.98,
        rotateX: -2,
        rotateY: 2
      }}
      initial={{ rotateX: 0, rotateY: 0 }}
      style={{ transformStyle: "preserve-3d" }}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
      <motion.div
        className="absolute inset-0 rounded-full bg-white opacity-0"
        whileHover={{ 
          opacity: 0.3,
          transition: { duration: 0.3 }
        }}
        style={{ filter: "blur(12px)" }}
      />
    </motion.button>
  );
}
