import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2, Save } from "lucide-react";

export default function SettingsTab() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  
  const [settings, setSettings] = useState({
    email: "salonarias22@gmail.com",
    phone: "514-000-0000",
    address: "246 Boulevard Cartier O, Laval",
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    tiktok: "https://tiktok.com",
    hours_weekdays: "Mardi au vendredi 10h-18h",
    hours_weekend: "Samedi 9h-17h, Dimanche 10h-15h"
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        const docRef = doc(db, "settings", "global");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSettings(docSnap.data() as any);
        }
      } catch (e) {
        console.error("Error loading settings", e);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      await setDoc(doc(db, "settings", "global"), settings);
      setMessage("Settings saved successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (e) {
      console.error("Error saving", e);
      setMessage("Error saving settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-[#8c8f94]" /></div>;

  return (
    <div className="max-w-2xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-[23px] font-normal text-[#1d2327]">Global Settings</h1>
      </div>
      
      {message && (
        <div className={`mb-4 p-3 border-l-4 ${message.includes('Error') ? 'border-[#d63638] bg-red-50' : 'border-[#00a32a] bg-green-50'}`}>
          <p className="text-[13px]">{message}</p>
        </div>
      )}

      <div className="bg-white border border-[#c3c4c7] shadow-sm rounded-sm p-6 space-y-4">
        
        <h2 className="text-[16px] font-semibold border-b pb-2 mb-4">Contact Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-medium mb-1">Email</label>
            <input type="email" name="email" value={settings.email} onChange={handleChange} className="w-full px-3 py-1.5 border border-[#8c8f94] rounded-sm text-[14px]" />
          </div>
          <div>
            <label className="block text-[13px] font-medium mb-1">Phone Number</label>
            <input type="text" name="phone" value={settings.phone} onChange={handleChange} className="w-full px-3 py-1.5 border border-[#8c8f94] rounded-sm text-[14px]" />
          </div>
        </div>
        
        <div>
          <label className="block text-[13px] font-medium mb-1">Physical Address</label>
          <input type="text" name="address" value={settings.address} onChange={handleChange} className="w-full px-3 py-1.5 border border-[#8c8f94] rounded-sm text-[14px]" />
        </div>

        <h2 className="text-[16px] font-semibold border-b pb-2 mt-6 mb-4">Business Hours</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-medium mb-1">Weekdays</label>
            <input type="text" name="hours_weekdays" value={settings.hours_weekdays} onChange={handleChange} className="w-full px-3 py-1.5 border border-[#8c8f94] rounded-sm text-[14px]" />
          </div>
          <div>
            <label className="block text-[13px] font-medium mb-1">Weekend</label>
            <input type="text" name="hours_weekend" value={settings.hours_weekend} onChange={handleChange} className="w-full px-3 py-1.5 border border-[#8c8f94] rounded-sm text-[14px]" />
          </div>
        </div>

        <h2 className="text-[16px] font-semibold border-b pb-2 mt-6 mb-4">Social Media Links</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-[13px] font-medium mb-1">Facebook URL</label>
            <input type="url" name="facebook" value={settings.facebook} onChange={handleChange} className="w-full px-3 py-1.5 border border-[#8c8f94] rounded-sm text-[14px]" />
          </div>
          <div>
            <label className="block text-[13px] font-medium mb-1">Instagram URL</label>
            <input type="url" name="instagram" value={settings.instagram} onChange={handleChange} className="w-full px-3 py-1.5 border border-[#8c8f94] rounded-sm text-[14px]" />
          </div>
          <div>
            <label className="block text-[13px] font-medium mb-1">TikTok URL</label>
            <input type="url" name="tiktok" value={settings.tiktok} onChange={handleChange} className="w-full px-3 py-1.5 border border-[#8c8f94] rounded-sm text-[14px]" />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button 
            onClick={handleSave} 
            disabled={saving}
            className="bg-[#2271b1] hover:bg-[#135e96] text-white px-4 py-2 text-[13px] rounded-sm font-semibold flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Settings
          </button>
        </div>

      </div>
    </div>
  );
}
