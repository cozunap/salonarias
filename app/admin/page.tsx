"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged, 
  signOut, 
  User 
} from "firebase/auth";
import { db, auth } from "@/lib/firebase";
import Image from "next/image";
import Link from "next/link";
import { Loader2, Database, LogOut, CheckCircle, XCircle, LayoutDashboard, User as UserIcon, Calendar, Scissors, FileText } from "lucide-react";
import DashboardTab from "./components/DashboardTab";
import AppointmentsTab from "./components/AppointmentsTab";
import ServicesTab from "./components/ServicesTab";
import PagesTab from "./components/PagesTab";
import SettingsTab from "./components/SettingsTab";
import HeroTab from "./components/HeroTab";
import GalleryTab from "./components/GalleryTab";
import TestimonialsTab from "./components/TestimonialsTab";
import { Settings, Image as ImageIcon, Star } from "lucide-react";

type AuthView = "login" | "register" | "forgot";

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // Auth Form State
  const [view, setView] = useState<AuthView>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Dashboard State
  const [data, setData] = useState<any[]>([]);
  const [status, setStatus] = useState("Loading data...");
  const [isStatusError, setIsStatusError] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthChecking(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    async function loadData() {
      try {
        setStatus("Verifying write access...");
        setIsStatusError(false);
        const testDocRef = doc(db, "system", "status");
        await setDoc(testDocRef, { initialized: true, timestamp: new Date() });

        setStatus("Fetching data...");
        const querySnapshot = await getDocs(collection(db, "system"));
        const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setData(docs);
        setStatus("Connected successfully! Admin access verified.");
      } catch (err: any) {
        console.error("Firebase connection error:", err);
        setStatus(`Permission Denied: Ensure Firestore rules allow your UID. (${err.message})`);
        setIsStatusError(true);
      }
    }

    loadData();
  }, [user]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      if (view === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else if (view === "register") {
        await createUserWithEmailAndPassword(auth, email, password);
      } else if (view === "forgot") {
        await sendPasswordResetEmail(auth, email);
        setMessage("Check your email for the confirmation link.");
        setView("login");
      }
    } catch (err: any) {
      let errorMessage = err.message;
      if (err.code === "auth/invalid-credential") errorMessage = "ERROR: Invalid email or password.";
      if (err.code === "auth/email-already-in-use") errorMessage = "ERROR: Email is already registered.";
      if (err.code === "auth/weak-password") errorMessage = "ERROR: Password should be at least 6 characters.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setData([]);
    setStatus("Loading data...");
    setView("login");
    setEmail("");
    setPassword("");
  };

  if (isAuthChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f1f1f1]">
        <Loader2 className="w-8 h-8 text-[#3e302b] animate-spin" />
      </div>
    );
  }

  // ---- AUTHENTICATION VIEWS (WordPress Style) ----
  if (!user) {
    return (
      <div className="min-h-[100vh] flex flex-col items-center justify-center bg-[#f1f1f1] text-[#3c434a] font-sans py-8">
        
        {/* Logo */}
        <div className="mb-6 mx-auto">
          <Image 
            src="/assets/salonbeautecarmen-1.svg" 
            alt="Salon Arias" 
            width={120} 
            height={120}
            className="w-24 h-auto mx-auto"
            priority
          />
        </div>

        {/* Message / Error Boxes */}
        <div className="w-full max-w-[320px]">
          {error && (
            <div className="bg-white border-l-4 border-[#d63638] shadow-sm p-3 mb-4 text-[13px]">
              <p>{error}</p>
            </div>
          )}
          {message && (
            <div className="bg-white border-l-4 border-[#00a32a] shadow-sm p-3 mb-4 text-[13px]">
              <p>{message}</p>
            </div>
          )}
        </div>

        {/* Login Box */}
        <div className="w-full max-w-[320px] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-[#c3c4c7]">
          <form onSubmit={handleAuth} className="space-y-4">
            
            {/* Email Field */}
            <div>
              <label className="block text-[14px] text-[#3c434a] mb-2 cursor-pointer">
                Username or Email Address
              </label>
              <input
                type="email"
                required
                className="w-full px-3 py-1.5 text-[20px] bg-[#f9f9f9] border border-[#8c8f94] rounded-sm focus:border-[#3e302b] focus:ring-1 focus:ring-[#3e302b] outline-none transition-shadow"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Field (only for login/register) */}
            {view !== "forgot" && (
              <div>
                <label className="block text-[14px] text-[#3c434a] mb-2 cursor-pointer">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    className="w-full px-3 py-1.5 text-[20px] bg-[#f9f9f9] border border-[#8c8f94] rounded-sm focus:border-[#3e302b] focus:ring-1 focus:ring-[#3e302b] outline-none transition-shadow"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Form Footer Actions */}
            <div className="flex items-center justify-between mt-4">
              {view === "login" ? (
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 border-[#8c8f94] rounded-sm text-[#3e302b] focus:ring-[#3e302b]" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="text-[13px] text-[#3c434a]">Remember Me</span>
                </label>
              ) : (
                <div /> // Spacer
              )}
              
              <button
                type="submit"
                disabled={isLoading}
                className="bg-[#3e302b] hover:bg-[#5e4138] text-white text-[13px] font-semibold px-4 py-1.5 rounded-sm shadow-[0_1px_0_#241c1a] transition-colors disabled:opacity-70 flex items-center justify-center min-w-[70px]"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    {view === "login" && "Log In"}
                    {view === "register" && "Register"}
                    {view === "forgot" && "Get New Password"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Links under box */}
        <div className="w-full max-w-[320px] mt-4 flex flex-col gap-2 text-[13px]">
          <div className="flex gap-2">
            {view === "login" ? (
              <>
                <button onClick={() => setView("register")} className="text-[#3e302b] hover:text-[#5e4138] hover:underline">Register</button>
                <span className="text-[#8c8f94]">|</span>
                <button onClick={() => setView("forgot")} className="text-[#3e302b] hover:text-[#5e4138] hover:underline">Lost your password?</button>
              </>
            ) : (
              <button onClick={() => setView("login")} className="text-[#3e302b] hover:text-[#5e4138] hover:underline">Log In</button>
            )}
          </div>
          
          <div className="mt-2">
            <Link href="/" className="text-[#3e302b] hover:text-[#5e4138] hover:underline">
              &larr; Go to Salon Arias
            </Link>
          </div>
        </div>

      </div>
    );
  }

  // ---- LOGGED IN DASHBOARD ----
  return (
    <div className="min-h-screen bg-[#f1f1f1] text-[#3c434a] flex font-sans">
      {/* WordPress style Sidebar */}
      <div className="w-48 bg-[#241c1a] text-[#f0f0f1] hidden md:flex flex-col">
        <div className="p-4 bg-[#3e302b] flex items-center gap-2">
          <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center overflow-hidden">
            <Image src="/assets/salonbeautecarmenwhite.svg" alt="Icon" width={16} height={16} className="w-4 h-4 opacity-80" />
          </div>
          <span className="font-semibold text-sm">Salon Arias Admin</span>
        </div>
        
        <nav className="flex-1 py-4 flex flex-col space-y-1">
          <button 
            onClick={() => setActiveTab("dashboard")} 
            className={`flex items-center gap-2 px-4 py-2 font-medium text-[13px] text-left transition-colors ${activeTab === 'dashboard' ? 'bg-[#5e4138] text-white' : 'text-[#f0f0f1] hover:bg-[#3e302b]'}`}
          >
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab("appointments")} 
            className={`flex items-center gap-2 px-4 py-2 font-medium text-[13px] text-left transition-colors ${activeTab === 'appointments' ? 'bg-[#5e4138] text-white' : 'text-[#f0f0f1] hover:bg-[#3e302b]'}`}
          >
            <Calendar className="w-4 h-4" /> Appointments
          </button>
          <button 
            onClick={() => setActiveTab("services")} 
            className={`flex items-center gap-2 px-4 py-2 font-medium text-[13px] text-left transition-colors ${activeTab === 'services' ? 'bg-[#5e4138] text-white' : 'text-[#f0f0f1] hover:bg-[#3e302b]'}`}
          >
            <Scissors className="w-4 h-4" /> Services
          </button>
          <button 
            onClick={() => setActiveTab("pages")} 
            className={`flex items-center gap-2 px-4 py-2 font-medium text-[13px] text-left transition-colors ${activeTab === 'pages' ? 'bg-[#5e4138] text-white' : 'text-[#f0f0f1] hover:bg-[#3e302b]'}`}
          >
            <FileText className="w-4 h-4" /> Pages
          </button>
          <button 
            onClick={() => setActiveTab("hero")} 
            className={`flex items-center gap-2 px-4 py-2 font-medium text-[13px] text-left transition-colors ${activeTab === 'hero' ? 'bg-[#5e4138] text-white' : 'text-[#f0f0f1] hover:bg-[#3e302b]'}`}
          >
            <ImageIcon className="w-4 h-4" /> Hero Slider
          </button>
          <button 
            onClick={() => setActiveTab("gallery")} 
            className={`flex items-center gap-2 px-4 py-2 font-medium text-[13px] text-left transition-colors ${activeTab === 'gallery' ? 'bg-[#5e4138] text-white' : 'text-[#f0f0f1] hover:bg-[#3e302b]'}`}
          >
            <ImageIcon className="w-4 h-4" /> Gallery
          </button>
          <button 
            onClick={() => setActiveTab("testimonials")} 
            className={`flex items-center gap-2 px-4 py-2 font-medium text-[13px] text-left transition-colors ${activeTab === 'testimonials' ? 'bg-[#5e4138] text-white' : 'text-[#f0f0f1] hover:bg-[#3e302b]'}`}
          >
            <Star className="w-4 h-4" /> Testimonials
          </button>
          <button 
            onClick={() => setActiveTab("settings")} 
            className={`flex items-center gap-2 px-4 py-2 font-medium text-[13px] text-left transition-colors ${activeTab === 'settings' ? 'bg-[#5e4138] text-white' : 'text-[#f0f0f1] hover:bg-[#3e302b]'}`}
          >
            <Settings className="w-4 h-4" /> Global Settings
          </button>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <div className="h-8 bg-[#241c1a] text-[#f0f0f1] flex items-center justify-between px-4 text-[13px]">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 hover:text-white transition-colors">
              <span className="opacity-80">⌂</span> Salon Arias
            </Link>
          </div>
          <div className="flex items-center gap-4 group cursor-pointer relative">
            <span className="hover:text-white">Howdy, {user.email}</span>
            <div className="w-6 h-6 bg-slate-600 rounded-full overflow-hidden border border-white/20">
              <UserIcon className="w-full h-full text-white/50" />
            </div>
            
            {/* Dropdown hover */}
            <div className="absolute right-0 top-8 bg-[#241c1a] border border-[#5e4138] hidden group-hover:block w-48 shadow-lg z-50">
              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-[#5e4138] hover:text-white transition-colors text-sm flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Log Out
              </button>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-4 md:p-8 overflow-auto">
          {activeTab === "dashboard" && <DashboardTab status={status} isStatusError={isStatusError} data={data} />}
          {activeTab === "appointments" && <AppointmentsTab />}
          {activeTab === "services" && <ServicesTab />}
          {activeTab === "pages" && <PagesTab />}
          {activeTab === "settings" && <SettingsTab />}
          {activeTab === "hero" && <HeroTab />}
          {activeTab === "gallery" && <GalleryTab />}
          {activeTab === "testimonials" && <TestimonialsTab />}
        </div>
      </div>
    </div>
  );
}
