import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function useSettings() {
  const [settings, setSettings] = useState<any>({
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
    const docRef = doc(db, "settings", "global");
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setSettings(docSnap.data());
      }
    });
    return () => unsubscribe();
  }, []);

  return settings;
}
