import { useState, useEffect } from "react";
import { collection, query, onSnapshot, doc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2 } from "lucide-react";

export default function PagesTab() {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editTitle, setEditTitle] = useState("");

  useEffect(() => {
    const q = query(collection(db, "pages"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPages(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const startEdit = (page: any) => {
    setEditingId(page.id);
    setEditTitle(page.title || "");
    setEditContent(page.content || "");
  };

  const savePage = async () => {
    if (!editingId) return;
    try {
      await updateDoc(doc(db, "pages", editingId), {
        title: editTitle,
        content: editContent,
        updated_at: new Date()
      });
      setEditingId(null);
    } catch (e) {
      alert("Error saving page");
    }
  };

  const createDefaultPage = async (id: string, title: string) => {
    try {
      await setDoc(doc(db, "pages", id), {
        title,
        content: "Content goes here...",
        created_at: new Date(),
        updated_at: new Date()
      });
    } catch (e) {
      alert("Error creating page");
    }
  };

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-[#8c8f94]" /></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-[23px] font-normal text-[#1d2327]">Pages Content Manager</h1>
        <div className="space-x-2">
          {!pages.find(p => p.id === "home") && <button onClick={() => createDefaultPage("home", "Home Page")} className="bg-[#2271b1] text-white px-3 py-1 text-[13px] rounded-sm">Init Home Page</button>}
          {!pages.find(p => p.id === "about") && <button onClick={() => createDefaultPage("about", "About Us")} className="bg-[#2271b1] text-white px-3 py-1 text-[13px] rounded-sm">Init About Page</button>}
        </div>
      </div>
      
      {editingId ? (
        <div className="bg-white border border-[#c3c4c7] shadow-sm p-6 mb-6">
          <h2 className="text-[18px] mb-4">Editing: {editingId}</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-[13px] font-semibold mb-1">Title</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-[#8c8f94] rounded-sm"
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[13px] font-semibold mb-1">Content (HTML/Text)</label>
              <textarea 
                className="w-full px-3 py-2 border border-[#8c8f94] rounded-sm h-[300px] font-mono text-[13px]"
                value={editContent}
                onChange={e => setEditContent(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button onClick={savePage} className="bg-[#2271b1] hover:bg-[#135e96] text-white px-4 py-2 text-[13px] rounded-sm font-semibold">Save Page</button>
              <button onClick={() => setEditingId(null)} className="border border-[#c3c4c7] px-4 py-2 text-[13px] rounded-sm text-[#2271b1]">Cancel</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-[#c3c4c7] shadow-sm rounded-sm overflow-hidden">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="border-b border-[#c3c4c7] bg-[#f6f7f7]">
                <th className="py-2 px-4 font-semibold text-[#2c3338]">Page ID</th>
                <th className="py-2 px-4 font-semibold text-[#2c3338]">Title</th>
                <th className="py-2 px-4 font-semibold text-[#2c3338]">Last Updated</th>
                <th className="py-2 px-4 font-semibold text-[#2c3338] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pages.length === 0 ? (
                <tr><td colSpan={4} className="p-4 text-center text-[#8c8f94]">No pages found. Click Init buttons above to create them.</td></tr>
              ) : pages.map((page) => (
                <tr key={page.id} className="border-b border-[#f0f0f1] hover:bg-[#f6f7f7]">
                  <td className="py-3 px-4 font-medium text-[#1d2327]">{page.id}</td>
                  <td className="py-3 px-4 text-[#2271b1]">{page.title}</td>
                  <td className="py-3 px-4 text-[#8c8f94]">
                    {page.updated_at ? new Date(page.updated_at.seconds * 1000).toLocaleString() : 'Never'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button onClick={() => startEdit(page)} className="text-[12px] text-[#2271b1] hover:underline">Edit Content</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
