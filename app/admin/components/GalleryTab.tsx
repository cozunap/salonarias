import { useState, useEffect } from "react";
import { collection, query, onSnapshot, doc, deleteDoc, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { Loader2, Trash2, Upload } from "lucide-react";

export default function GalleryTab() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "gallery"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setImages(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const storageRef = ref(storage, `gallery/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      await addDoc(collection(db, "gallery"), {
        imageUrl: url,
        uploadedAt: new Date()
      });
    } catch (err: any) {
      console.error(err);
      alert("Error uploading image. Is Firebase Storage enabled? " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (id: string) => {
    if (confirm("Delete this image from the gallery?")) {
      try {
        await deleteDoc(doc(db, "gallery", id));
      } catch (e) {
        alert("Error deleting");
      }
    }
  };

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-[#8c8f94]" /></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-[23px] font-normal text-[#1d2327]">Gallery Management</h1>
        <label className="bg-[#2271b1] hover:bg-[#135e96] text-white px-3 py-1.5 text-[13px] rounded-sm cursor-pointer flex items-center gap-2">
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          Upload to Gallery
          <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
        </label>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.length === 0 ? (
          <p className="text-[#8c8f94] text-[13px] italic p-4 bg-white border border-[#c3c4c7] col-span-4">No images found. Upload one to start.</p>
        ) : images.sort((a,b) => (b.uploadedAt?.seconds || 0) - (a.uploadedAt?.seconds || 0)).map((img) => (
          <div key={img.id} className="bg-white border border-[#c3c4c7] shadow-sm rounded-sm overflow-hidden group relative">
            <div 
              className="h-40 bg-cover bg-center"
              style={{ backgroundImage: `url(${img.imageUrl})` }}
            />
            <button 
              onClick={() => deleteImage(img.id)} 
              className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-sm shadow-sm text-[#d63638] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
