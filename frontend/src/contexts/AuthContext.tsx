import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const API_URL = import.meta.env['VITE_API_URL'] || 'http://localhost:5000';

interface CourseProgress {
  courseId: string;
  courseName: string;
  enrolledDate: string;
  progress: number; // 0-100
  status: "in_progress" | "completed" | "not_started";
}

interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  profilePicture?: string;
  college?: string;
  year?: string;
  branch?: string;
  state?: string;
  enrolledCourses: CourseProgress[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  googleLogin: (credential: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  uploadProfilePicture: (file: File) => Promise<void>;
  removeProfilePicture: () => Promise<void>;
  enrollInCourse: (courseId: string, courseName: string) => void;
  updateCourseProgress: (courseId: string, progress: number) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth state on mount
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      const parsedUser = JSON.parse(storedUser);
      // Ensure status field is properly typed
      if (parsedUser.enrolledCourses) {
        parsedUser.enrolledCourses = parsedUser.enrolledCourses.map((course: any) => ({
          ...course,
          status: course.status as "in_progress" | "completed" | "not_started",
        }));
      }
      setUser(parsedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      const user: User = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        phone: data.user.phone,
        profilePicture: data.user.profilePicture,
        college: data.user.college,
        year: data.user.year,
        branch: data.user.branch,
        state: data.user.state,
        enrolledCourses: (data.user.enrolledCourses || []).map((course: any) => ({
          courseId: course.courseId,
          courseName: course.courseName,
          enrolledDate: course.enrolledDate,
          progress: course.progress,
          status: course.status as "in_progress" | "completed" | "not_started",
        })),
      };

      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", data.token);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      const user: User = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        phone: data.user.phone,
        profilePicture: data.user.profilePicture,
        college: data.user.college,
        year: data.user.year,
        branch: data.user.branch,
        state: data.user.state,
        enrolledCourses: (data.user.enrolledCourses || []).map((course: any) => ({
          courseId: course.courseId,
          courseName: course.courseName,
          enrolledDate: course.enrolledDate,
          progress: course.progress,
          status: course.status as "in_progress" | "completed" | "not_started",
        })),
      };

      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", data.token);
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = async (token: string, type: 'credential' | 'accessToken' = 'credential') => {
    setIsLoading(true);
    try {
      console.log('Sending Google token to backend...', { type });
      const payload = type === 'accessToken' || token.startsWith('ya29.') 
        ? { accessToken: token } 
        : { credential: token };

      const response = await fetch(`${API_URL}/api/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('Backend response status:', response.status);
      const data = await response.json();
      console.log('Backend response data:', data);

      if (!response.ok) {
        console.error('Backend error:', data);
        throw new Error(data.message || 'Google authentication failed');
      }

      const user: User = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        phone: data.user.phone,
        profilePicture: data.user.profilePicture,
        college: data.user.college,
        year: data.user.year,
        branch: data.user.branch,
        state: data.user.state,
        enrolledCourses: (data.user.enrolledCourses || []).map((course: any) => ({
          courseId: course.courseId,
          courseName: course.courseName,
          enrolledDate: course.enrolledDate,
          progress: course.progress,
          status: course.status as "in_progress" | "completed" | "not_started",
        })),
      };

      console.log('Setting user state:', user);
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", data.token);
      console.log('User successfully logged in with Google');
    } catch (error) {
      console.error("Google login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Profile update failed');
      }

      const updatedUser: User = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        phone: data.user.phone,
        profilePicture: data.user.profilePicture,
        college: data.user.college,
        year: data.user.year,
        branch: data.user.branch,
        state: data.user.state,
        enrolledCourses: (data.user.enrolledCourses || []).map((course: any) => ({
          courseId: course.courseId,
          courseName: course.courseName,
          enrolledDate: course.enrolledDate,
          progress: course.progress,
          status: course.status as "in_progress" | "completed" | "not_started",
        })),
      };

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Profile update error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const uploadProfilePicture = async (file: File) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append('profilePicture', file);

      const response = await fetch(`${API_URL}/api/auth/upload-profile-picture`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Profile picture upload failed');
      }

      const updatedUser: User = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        phone: data.user.phone,
        profilePicture: data.user.profilePicture,
        college: data.user.college,
        year: data.user.year,
        branch: data.user.branch,
        state: data.user.state,
        enrolledCourses: (data.user.enrolledCourses || []).map((course: any) => ({
          courseId: course.courseId,
          courseName: course.courseName,
          enrolledDate: course.enrolledDate,
          progress: course.progress,
          status: course.status as "in_progress" | "completed" | "not_started",
        })),
      };

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Profile picture upload error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removeProfilePicture = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/auth/profile-picture`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Profile picture removal failed');
      }

      const updatedUser: User = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        phone: data.user.phone,
        profilePicture: data.user.profilePicture,
        college: data.user.college,
        year: data.user.year,
        branch: data.user.branch,
        state: data.user.state,
        enrolledCourses: (data.user.enrolledCourses || []).map((course: any) => ({
          courseId: course.courseId,
          courseName: course.courseName,
          enrolledDate: course.enrolledDate,
          progress: course.progress,
          status: course.status as "in_progress" | "completed" | "not_started",
        })),
      };

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Profile picture removal error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const enrollInCourse = (courseId: string, courseName: string) => {
    if (user) {
      const existingCourse = user.enrolledCourses.find(c => c.courseId === courseId);
      if (!existingCourse) {
        const newCourse: CourseProgress = {
          courseId,
          courseName,
          enrolledDate: new Date().toISOString(),
          progress: 0,
          status: "not_started",
        };
        const updatedUser = {
          ...user,
          enrolledCourses: [...user.enrolledCourses, newCourse],
        };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    }
  };

  const updateCourseProgress = (courseId: string, progress: number) => {
    if (user) {
      const updatedCourses = user.enrolledCourses.map(course => {
        if (course.courseId === courseId) {
          const status: "completed" | "in_progress" | "not_started" = 
            progress === 100 ? "completed" : progress > 0 ? "in_progress" : "not_started";
          return {
            ...course,
            progress,
            status,
          };
        }
        return course;
      });
      
      const updatedUser = { ...user, enrolledCourses: updatedCourses };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        googleLogin,
        logout,
        updateUser,
        updateProfile,
        uploadProfilePicture,
        removeProfilePicture,
        enrollInCourse,
        updateCourseProgress,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
