import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, addDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2 } from "lucide-react";

export default function ServicesTab() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "services"), orderBy("sort_order", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCategories(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const addCategory = async () => {
    const name = prompt("Enter new category name (e.g. Coupes, Coloration):");
    if (name) {
      try {
        await addDoc(collection(db, "services"), {
          name,
          active: true,
          sort_order: categories.length + 1,
          items: []
        });
      } catch (e) {
        alert("Error creating category");
      }
    }
  };

  const deleteCategory = async (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteDoc(doc(db, "services", id));
      } catch (e) {
        alert("Error deleting category");
      }
    }
  };

  const toggleActive = async (id: string, current: boolean) => {
    try {
      await updateDoc(doc(db, "services", id), { active: !current });
    } catch (e) {
      alert("Error updating status");
    }
  };

  const updateItems = async (id: string, currentItems: string[]) => {
    const itemsStr = prompt("Enter services separated by commas:", currentItems.join(", "));
    if (itemsStr !== null) {
      const newItems = itemsStr.split(",").map(i => i.trim()).filter(i => i !== "");
      try {
        await updateDoc(doc(db, "services", id), { items: newItems });
      } catch (e) {
        alert("Error updating services");
      }
    }
  };

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-[#8c8f94]" /></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-[23px] font-normal text-[#1d2327]">Services Management</h1>
        <button onClick={addCategory} className="bg-[#2271b1] hover:bg-[#135e96] text-white px-3 py-1 text-[13px] rounded-sm">Add Category</button>
      </div>
      
      <div className="bg-white border border-[#c3c4c7] shadow-sm rounded-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-[#c3c4c7] bg-[#f6f7f7]">
              <th className="py-2 px-4 font-semibold text-[#2c3338]">Category Name</th>
              <th className="py-2 px-4 font-semibold text-[#2c3338]">Services (Items)</th>
              <th className="py-2 px-4 font-semibold text-[#2c3338]">Status</th>
              <th className="py-2 px-4 font-semibold text-[#2c3338] text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr><td colSpan={4} className="p-4 text-center text-[#8c8f94]">No services found.</td></tr>
            ) : categories.map((cat) => (
              <tr key={cat.id} className="border-b border-[#f0f0f1] hover:bg-[#f6f7f7]">
                <td className="py-3 px-4 font-medium text-[#1d2327]">{cat.name}</td>
                <td className="py-3 px-4 max-w-[300px]">
                  <div className="flex flex-wrap gap-1">
                    {(cat.items || []).map((item: string, idx: number) => (
                      <span key={idx} className="bg-[#f0f0f1] text-[#3c434a] px-2 py-0.5 rounded text-[11px] border border-[#c3c4c7]">
                        {item}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${cat.active ? 'bg-green-100 text-[#00a32a]' : 'bg-red-100 text-[#d63638]'}`}>
                    {cat.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-3 px-4 text-right space-x-2">
                  <button onClick={() => updateItems(cat.id, cat.items || [])} className="text-[12px] text-[#2271b1] hover:underline">Edit Items</button>
                  <span className="text-[#c3c4c7]">|</span>
                  <button onClick={() => toggleActive(cat.id, cat.active)} className="text-[12px] text-[#2271b1] hover:underline">Toggle Active</button>
                  <span className="text-[#c3c4c7]">|</span>
                  <button onClick={() => deleteCategory(cat.id)} className="text-[12px] text-[#d63638] hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
