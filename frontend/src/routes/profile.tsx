import { motion, AnimatePresence } from "motion/react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button3D } from "@/components/ui/Button3D";
import { ArrowLeft, User, Mail, Phone, Edit3, BookOpen, CheckCircle, Clock, Play, Sparkles, Camera, X } from "lucide-react";

const API_URL = import.meta.env['VITE_API_URL'] || 'http://localhost:5000';

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { user, updateProfile, uploadProfilePicture, removeProfilePicture, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || "");
  const [editedPhone, setEditedPhone] = useState(user?.phone || "");
  const [editedCollege, setEditedCollege] = useState(user?.college || "");
  const [editedYear, setEditedYear] = useState(user?.year || "");
  const [editedBranch, setEditedBranch] = useState(user?.branch || "");
  const [editedState, setEditedState] = useState(user?.state || "");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [stars, setStars] = useState<any[]>([]);

  // Generate stars only on client side to avoid hydration mismatch
  useEffect(() => {
    setStars(
      Array.from({ length: 100 }, (_, i) => ({
        id: `profile-star-${i}`,
        top: Math.random() * 100,
        left: Math.random() * 100,
        opacity: Math.random() * 0.8,
        duration: 2 + Math.random() * 3,
        size: Math.random() * 2 + 1
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

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate({ to: "/auth" });
    return null;
  }

  const handleSave = async () => {
    try {
      await updateProfile({
        name: editedName,
        phone: editedPhone,
        college: editedCollege,
        year: editedYear,
        branch: editedBranch,
        state: editedState,
      });
      setIsEditing(false);
    } catch (error: any) {
      console.error("Profile update error:", error);
      alert(error.message || "Failed to update profile");
    }
  };

  const handleCancel = () => {
    setEditedName(user?.name || "");
    setEditedPhone(user?.phone || "");
    setEditedCollege(user?.college || "");
    setEditedYear(user?.year || "");
    setEditedBranch(user?.branch || "");
    setEditedState(user?.state || "");
    setPreviewImage(null);
    setIsEditing(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Preview the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload the image
      handleImageUpload(file);
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      await uploadProfilePicture(file);
    } catch (error: any) {
      console.error("Image upload error:", error);
      alert(error.message || "Failed to upload profile picture");
      setPreviewImage(null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveProfilePicture = async () => {
    try {
      await removeProfilePicture();
      setPreviewImage(null);
    } catch (error: any) {
      console.error("Remove profile picture error:", error);
      alert(error.message || "Failed to remove profile picture");
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-white/80" />;
      case "in_progress":
        return <Play className="h-5 w-5 text-white/80" />;
      default:
        return <Clock className="h-5 w-5 text-white/50" />;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-black" onMouseMove={handleMouseMove}>
      {/* Space Background */}
      <div className="absolute inset-0">
        {/* Deep space gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black" />
        
        {/* Stars */}
        <div className="absolute inset-0">
          {stars.length > 0 && stars.map((star) => (
            <div
              key={star.id}
              className="absolute rounded-full bg-white"
              style={{
                top: `${star.top}%`,
                left: `${star.left}%`,
                opacity: star.opacity,
                width: `${star.size}px`,
                height: `${star.size}px`,
                animation: `twinkle ${star.duration}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Mouse light effect */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-10"
        animate={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(100, 150, 255, 0.05), transparent)`,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
      />

      {/* Content */}
      <div className="relative z-20 px-5 py-24 md:px-10 pt-32">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <button
              onClick={() => {
                try {
                  navigate({ to: "/courses" });
                } catch (error) {
                  console.error("Navigation error:", error);
                  window.location.href = "/courses";
                }
              }}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Courses
            </button>

            {/* Profile Header */}
            <motion.div
              className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 mb-8 relative overflow-hidden"
            >
              <div className="relative flex flex-col md:flex-row gap-8 items-center md:items-start">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-4xl backdrop-blur-sm border border-white/20 overflow-hidden">
                    {previewImage || user?.profilePicture ? (
                      <img 
                        src={previewImage || (user?.profilePicture ? (user.profilePicture.startsWith('http') ? user.profilePicture : `${API_URL}${user.profilePicture}`) : '')} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <span className={previewImage || user?.profilePicture ? 'hidden' : ''}>{user?.name.charAt(0).toUpperCase()}</span>
                  </div>

                  {/* Upload button */}
                  <button
                    onClick={triggerFileInput}
                    className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:scale-110 transition-transform backdrop-blur-sm border border-white/30"
                    disabled={uploading}
                  >
                    {uploading ? (
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <Camera className="h-5 w-5 text-white" />
                    )}
                  </button>

                  {/* Remove profile picture button */}
                  {(previewImage || user?.profilePicture) && (
                    <button
                      onClick={handleRemoveProfilePicture}
                      className="absolute top-0 right-0 w-8 h-8 rounded-full bg-red-500/80 flex items-center justify-center hover:scale-110 transition-transform backdrop-blur-sm border border-red-400/50"
                      title="Remove profile picture"
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>

                {/* User Info */}
                <div className="flex-1 text-center md:text-left">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex items-center gap-3 mb-2 justify-center md:justify-start">
                      <Sparkles className="h-6 w-6 text-white/60" />
                      <h1 className="text-4xl font-bold text-white">
                        {user?.name}
                      </h1>
                    </div>
                    
                    {isEditing ? (
                      <div className="space-y-4 mt-6">
                        <div>
                          <label className="block text-sm text-white/60 mb-2">Name</label>
                          <input
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-white/60 mb-2">Phone</label>
                          <input
                            type="tel"
                            value={editedPhone}
                            onChange={(e) => setEditedPhone(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-sm"
                            placeholder="Add phone number"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-white/60 mb-2">College</label>
                          <input
                            type="text"
                            value={editedCollege}
                            onChange={(e) => setEditedCollege(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-sm"
                            placeholder="Your college name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-white/60 mb-2">Year</label>
                          <input
                            type="text"
                            value={editedYear}
                            onChange={(e) => setEditedYear(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-sm"
                            placeholder="Your year (e.g., 3rd year)"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-white/60 mb-2">Branch</label>
                          <input
                            type="text"
                            value={editedBranch}
                            onChange={(e) => setEditedBranch(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-sm"
                            placeholder="Your branch (e.g., Computer Science)"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-white/60 mb-2">State</label>
                          <input
                            type="text"
                            value={editedState}
                            onChange={(e) => setEditedState(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-sm"
                            placeholder="Your state"
                          />
                        </div>
                        <div className="flex gap-3 justify-center md:justify-start">
                          <Button3D onClick={handleSave} size="sm">
                            Save Changes
                          </Button3D>
                          <button
                            onClick={handleCancel}
                            className="px-6 py-3 rounded-xl border border-white/20 text-white/80 hover:bg-white/10 transition-colors backdrop-blur-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-white/60 justify-center md:justify-start">
                          <Mail className="h-4 w-4" />
                          <span className="text-white/80">{user?.email}</span>
                        </div>
                        {user?.phone && (
                          <div className="flex items-center gap-2 text-white/60 justify-center md:justify-start">
                            <Phone className="h-4 w-4" />
                            <span className="text-white/80">{user.phone}</span>
                          </div>
                        )}
                        {user?.college && (
                          <div className="flex items-center gap-2 text-white/60 justify-center md:justify-start">
                            <User className="h-4 w-4" />
                            <span className="text-white/80">{user.college}</span>
                          </div>
                        )}
                        {user?.year && (
                          <div className="flex items-center gap-2 text-white/60 justify-center md:justify-start">
                            <span className="text-white/80">{user.year}</span>
                          </div>
                        )}
                        {user?.branch && (
                          <div className="flex items-center gap-2 text-white/60 justify-center md:justify-start">
                            <span className="text-white/80">{user.branch}</span>
                          </div>
                        )}
                        {user?.state && (
                          <div className="flex items-center gap-2 text-white/60 justify-center md:justify-start">
                            <span className="text-white/80">{user.state}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-6 py-3 rounded-xl border border-white/20 text-white/80 hover:bg-white/10 transition-colors backdrop-blur-sm flex items-center gap-2"
                  >
                    <Edit3 className="h-4 w-4" />
                    {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-6 py-3 rounded-xl border border-white/20 text-white/80 hover:bg-white/10 transition-colors backdrop-blur-sm"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Enrolled Courses Section */}
            <motion.div
              className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <BookOpen className="h-6 w-6 text-white/60" />
                <span className="text-white">
                  My Courses
                </span>
              </h2>

              <AnimatePresence>
                {user?.enrolledCourses && user.enrolledCourses.length > 0 ? (
                  <div className="space-y-4">
                    {user.enrolledCourses.map((course, index) => (
                      <motion.div
                        key={`${course.courseId}-${index}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all backdrop-blur-sm"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              {getStatusIcon(course.status)}
                              <h3 className="text-lg font-semibold text-white">
                                {course.courseName}
                              </h3>
                            </div>
                            <p className="text-sm text-white/60">
                              Enrolled: {new Date(course.enrolledDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-3xl font-bold text-white">
                              {course.progress}%
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-4">
                          <div className="h-3 bg-white/10 rounded-full overflow-hidden border border-white/10">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${course.progress}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className="h-full bg-white/80"
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <BookOpen className="h-20 w-20 text-white/30 mx-auto mb-6" />
                    <h3 className="text-2xl font-semibold text-white mb-3">No courses enrolled yet</h3>
                    <p className="text-white/60 mb-8 max-w-md mx-auto">
                      Start your learning journey by enrolling in a course
                    </p>
                    <Link to="/courses">
                      <Button3D>
                        <span className="flex items-center gap-2">
                          <Sparkles className="h-5 w-5" />
                          Browse Courses
                        </span>
                      </Button3D>
                    </Link>
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
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