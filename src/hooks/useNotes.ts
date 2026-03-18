import { useState } from "react";
import type { Note } from "../types/note";

const STORAGE_KEY = "sport-exam:notes";

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Note[]) : [];
    } catch {
      return [];
    }
  });

  const add = (note: Note) => {
    setNotes((prev) => {
      const filtered = prev.filter((n) => n.id !== note.id);
      const updated = [...filtered, note];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const remove = (id: string) => {
    setNotes((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const isBookmarked = (id: string) => notes.some((n) => n.id === id);

  return { notes, add, remove, isBookmarked };
}
