import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2, Trash2, CheckCircle, Clock } from "lucide-react";

export default function AppointmentsTab() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "bookings"), orderBy("created_at", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAppointments(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, "bookings", id), { status });
    } catch (e) {
      alert("Error updating status");
    }
  };

  const deleteAppointment = async (id: string) => {
    if (confirm("Are you sure you want to delete this appointment?")) {
      try {
        await deleteDoc(doc(db, "bookings", id));
      } catch (e) {
        alert("Error deleting appointment");
      }
    }
  };

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-[#8c8f94]" /></div>;

  return (
    <div>
      <h1 className="text-[23px] font-normal text-[#1d2327] mb-4">Appointments</h1>
      
      <div className="bg-white border border-[#c3c4c7] shadow-sm rounded-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-[#c3c4c7] bg-[#f6f7f7]">
              <th className="py-2 px-4 font-semibold text-[#2c3338]">Client</th>
              <th className="py-2 px-4 font-semibold text-[#2c3338]">Service</th>
              <th className="py-2 px-4 font-semibold text-[#2c3338]">Date / Time</th>
              <th className="py-2 px-4 font-semibold text-[#2c3338]">Contact</th>
              <th className="py-2 px-4 font-semibold text-[#2c3338]">Status</th>
              <th className="py-2 px-4 font-semibold text-[#2c3338] text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length === 0 ? (
              <tr><td colSpan={6} className="p-4 text-center text-[#8c8f94]">No appointments found.</td></tr>
            ) : appointments.map((apt) => (
              <tr key={apt.id} className="border-b border-[#f0f0f1] hover:bg-[#f6f7f7]">
                <td className="py-3 px-4 font-medium text-[#2271b1]">{apt.client_name}</td>
                <td className="py-3 px-4">{apt.service}</td>
                <td className="py-3 px-4">{apt.booking_date} at {apt.booking_time}</td>
                <td className="py-3 px-4 text-[#8c8f94]">
                  {apt.client_email}<br/>{apt.client_phone}
                </td>
                <td className="py-3 px-4">
                  {apt.status === "pending" && <span className="inline-flex items-center gap-1 text-[#d63638]"><Clock className="w-3 h-3"/> Pending</span>}
                  {apt.status === "confirmed" && <span className="inline-flex items-center gap-1 text-[#00a32a]"><CheckCircle className="w-3 h-3"/> Confirmed</span>}
                </td>
                <td className="py-3 px-4 text-right space-x-2">
                  {apt.status === "pending" && (
                    <button onClick={() => updateStatus(apt.id, "confirmed")} className="text-[12px] text-[#2271b1] hover:underline">Confirm</button>
                  )}
                  {apt.status === "confirmed" && (
                    <button onClick={() => updateStatus(apt.id, "pending")} className="text-[12px] text-[#2271b1] hover:underline">Unconfirm</button>
                  )}
                  <span className="text-[#c3c4c7]">|</span>
                  <button onClick={() => deleteAppointment(apt.id)} className="text-[12px] text-[#d63638] hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
