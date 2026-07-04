import { useState, useEffect } from "react";
import { collection, query, onSnapshot, doc, deleteDoc, addDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2, Star, Trash2 } from "lucide-react";

export default function TestimonialsTab() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "testimonials"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReviews(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const addReview = async () => {
    const author = prompt("Enter customer name:");
    if (!author) return;
    const text = prompt("Enter review text:");
    if (!text) return;
    const ratingStr = prompt("Enter rating (1-5):", "5");
    const rating = Math.min(5, Math.max(1, parseInt(ratingStr || "5", 10)));

    try {
      await addDoc(collection(db, "testimonials"), {
        author,
        text,
        rating,
        date: new Date()
      });
    } catch (e) {
      alert("Error adding review");
    }
  };

  const deleteReview = async (id: string) => {
    if (confirm("Are you sure you want to delete this review?")) {
      try {
        await deleteDoc(doc(db, "testimonials", id));
      } catch (e) {
        alert("Error deleting");
      }
    }
  };

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-[#8c8f94]" /></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-[23px] font-normal text-[#1d2327]">Testimonials Manager</h1>
        <button onClick={addReview} className="bg-[#2271b1] hover:bg-[#135e96] text-white px-3 py-1 text-[13px] rounded-sm">Add Review</button>
      </div>
      
      <div className="bg-white border border-[#c3c4c7] shadow-sm rounded-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-[#c3c4c7] bg-[#f6f7f7]">
              <th className="py-2 px-4 font-semibold text-[#2c3338]">Customer</th>
              <th className="py-2 px-4 font-semibold text-[#2c3338]">Review Text</th>
              <th className="py-2 px-4 font-semibold text-[#2c3338]">Rating</th>
              <th className="py-2 px-4 font-semibold text-[#2c3338] text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.length === 0 ? (
              <tr><td colSpan={4} className="p-4 text-center text-[#8c8f94]">No testimonials found.</td></tr>
            ) : reviews.map((rev) => (
              <tr key={rev.id} className="border-b border-[#f0f0f1] hover:bg-[#f6f7f7]">
                <td className="py-3 px-4 font-medium text-[#1d2327]">{rev.author}</td>
                <td className="py-3 px-4 max-w-md italic text-[#3c434a]">"{rev.text}"</td>
                <td className="py-3 px-4 text-[#ffb900] flex items-center">
                  {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-current" />
                  ))}
                </td>
                <td className="py-3 px-4 text-right">
                  <button onClick={() => deleteReview(rev.id)} className="text-[12px] text-[#d63638] hover:underline flex items-center justify-end gap-1 ml-auto">
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
