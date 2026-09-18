import { motion, AnimatePresence } from "motion/react";
import { Button3D } from "@/components/ui/Button3D";
import { X } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuth: () => void;
}

export function AuthModal({ isOpen, onClose, onAuth }: AuthModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateX: -20, rotateY: 10 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotateX: -20, rotateY: 10 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ perspective: "1000px" }}
          >
            <motion.div
              className="relative w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-2xl"
              style={{ transformStyle: "preserve-3d" }}
              whileHover={{ rotateX: 2, rotateY: -2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={onClose}
                className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-3xl font-bold mb-2">Login Required</h2>
                <p className="text-muted-foreground mb-8">
                  You need to login or signup to enroll in this course. Click below to continue to the authentication page.
                </p>

                <div className="space-y-4">
                  <Link to="/auth" onClick={onClose}>
                    <Button3D className="w-full" type="button">
                      Continue to Login / Signup
                    </Button3D>
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
