import { useState, useEffect } from "react";
import { collection, query, onSnapshot, doc, deleteDoc, addDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { Loader2, Image as ImageIcon, Trash2, Upload } from "lucide-react";

export default function HeroTab() {
  const [slides, setSlides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "hero_slides"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSlides(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const storageRef = ref(storage, `hero_slides/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      await addDoc(collection(db, "hero_slides"), {
        imageUrl: url,
        title: "Nouvelle Diapositive",
        subtitle: "Sous-titre optionnel",
        sort_order: slides.length + 1
      });
    } catch (err: any) {
      console.error(err);
      alert("Error uploading image. Is Firebase Storage enabled? " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const deleteSlide = async (id: string) => {
    if (confirm("Delete this slide?")) {
      try {
        await deleteDoc(doc(db, "hero_slides", id));
      } catch (e) {
        alert("Error deleting");
      }
    }
  };

  const updateText = async (id: string, field: string, currentValue: string) => {
    const newValue = prompt(`Enter new ${field}:`, currentValue);
    if (newValue !== null) {
      try {
        await updateDoc(doc(db, "hero_slides", id), { [field]: newValue });
      } catch (e) {
        alert("Error updating");
      }
    }
  };

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-[#8c8f94]" /></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-[23px] font-normal text-[#1d2327]">Hero Slider Management</h1>
        <label className="bg-[#2271b1] hover:bg-[#135e96] text-white px-3 py-1.5 text-[13px] rounded-sm cursor-pointer flex items-center gap-2">
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          Upload New Slide
          <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
        </label>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {slides.length === 0 ? (
          <p className="text-[#8c8f94] text-[13px] italic p-4 bg-white border border-[#c3c4c7] col-span-2">No slides found. Upload an image to start.</p>
        ) : slides.sort((a,b) => (a.sort_order || 0) - (b.sort_order || 0)).map((slide) => (
          <div key={slide.id} className="bg-white border border-[#c3c4c7] shadow-sm rounded-sm overflow-hidden flex flex-col">
            <div 
              className="h-48 bg-cover bg-center border-b border-[#c3c4c7]"
              style={{ backgroundImage: `url(${slide.imageUrl})` }}
            />
            <div className="p-4 flex-1 flex flex-col">
              <div className="mb-4">
                <p className="text-[11px] font-semibold text-[#8c8f94] uppercase mb-1">Title</p>
                <div className="flex justify-between items-start group">
                  <p className="text-[14px] font-medium">{slide.title}</p>
                  <button onClick={() => updateText(slide.id, "title", slide.title)} className="text-[11px] text-[#2271b1] opacity-0 group-hover:opacity-100 transition-opacity">Edit</button>
                </div>
              </div>
              <div className="mb-4 flex-1">
                <p className="text-[11px] font-semibold text-[#8c8f94] uppercase mb-1">Subtitle</p>
                <div className="flex justify-between items-start group">
                  <p className="text-[13px] text-[#3c434a]">{slide.subtitle}</p>
                  <button onClick={() => updateText(slide.id, "subtitle", slide.subtitle)} className="text-[11px] text-[#2271b1] opacity-0 group-hover:opacity-100 transition-opacity">Edit</button>
                </div>
              </div>
              <div className="pt-3 border-t border-[#f0f0f1] flex justify-end">
                <button onClick={() => deleteSlide(slide.id)} className="text-[12px] text-[#d63638] hover:underline flex items-center gap-1">
                  <Trash2 className="w-3 h-3" /> Delete Slide
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
