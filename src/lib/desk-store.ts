import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Task = {
  id: string;
  title: string;
  done: boolean;
};

type DeskState = {
  intention: string;
  note: string;
  tasks: Task[];
  setIntention: (value: string) => void;
  setNote: (value: string) => void;
  addTask: (title: string) => void;
  toggleTask: (id: string) => void;
  removeTask: (id: string) => void;
  clearDone: () => void;
};

const seed: Task[] = [
  { id: "t1", title: "Open the day with one clear intention", done: true },
  { id: "t2", title: "Write the first paragraph before noon", done: false },
  { id: "t3", title: "Walk around the block after lunch", done: false },
  { id: "t4", title: "Reply to the studio note", done: false },
];

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export const useDesk = create<DeskState>()(
  persist(
    (set) => ({
      intention: "Make something quiet and finished.",
      note: "Keep the list short. One sitting, then a walk. If it is not on the desk, it is not today's work.",
      tasks: seed,
      setIntention: (intention) => set({ intention }),
      setNote: (note) => set({ note }),
      addTask: (title) => {
        const trimmed = title.trim();
        if (!trimmed) return;
        set((s) => ({
          tasks: [{ id: uid(), title: trimmed, done: false }, ...s.tasks],
        }));
      },
      toggleTask: (id) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === id ? { ...t, done: !t.done } : t,
          ),
        })),
      removeTask: (id) =>
        set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),
      clearDone: () =>
        set((s) => ({ tasks: s.tasks.filter((t) => !t.done) })),
    }),
    { name: "linen-desk" },
  ),
);
