import { Check, Plus, X } from "lucide-react";
import { type FormEvent, useMemo, useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useDesk } from "@/lib/desk-store";

function greeting(date: Date) {
  const h = date.getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function Desk() {
  const [draft, setDraft] = useState("");
  const intention = useDesk((s) => s.intention);
  const note = useDesk((s) => s.note);
  const tasks = useDesk((s) => s.tasks);
  const setIntention = useDesk((s) => s.setIntention);
  const setNote = useDesk((s) => s.setNote);
  const addTask = useDesk((s) => s.addTask);
  const toggleTask = useDesk((s) => s.toggleTask);
  const removeTask = useDesk((s) => s.removeTask);
  const clearDone = useDesk((s) => s.clearDone);

  const now = useMemo(() => new Date(), []);
  const remaining = tasks.filter((t) => !t.done).length;
  const done = tasks.length - remaining;

  function onAdd(e: FormEvent) {
    e.preventDefault();
    const title = draft.trim();
    if (!title) return;
    addTask(title);
    setDraft("");
  }

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8 sm:py-12">
        <header className="rise mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium tracking-wide text-muted uppercase">
              {format(now, "EEEE d MMMM")}
            </p>
            <h1 className="font-display text-5xl leading-none tracking-tight sm:text-6xl">
              Linen
            </h1>
            <p className="mt-2 text-muted">{greeting(now)}.</p>
          </div>
          <p className="max-w-xs text-sm text-muted">
            A React daily desk. Intention, a short list, a note — kept on this
            device.
          </p>
        </header>

        <section className="rise rise-2 mb-6 rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] sm:p-6">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-muted">Today</span>
            <input
              value={intention}
              onChange={(e) => setIntention(e.target.value)}
              placeholder="What is the day for?"
              className="font-display w-full bg-transparent text-2xl leading-snug text-fg outline-none placeholder:text-subtle sm:text-3xl"
            />
          </label>
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)]">
          <section className="rise rise-3 rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] sm:p-6">
            <div className="mb-4 flex items-baseline justify-between gap-3">
              <h2 className="font-display text-2xl leading-none">List</h2>
              <p className="text-sm tabular-nums text-muted">
                {remaining} open
                {done ? ` · ${done} done` : ""}
              </p>
            </div>

            <form onSubmit={onAdd} className="mb-4 flex gap-2">
              <Input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Add a line"
                aria-label="New task"
              />
              <Button type="submit" size="icon" aria-label="Add task">
                <Plus />
              </Button>
            </form>

            {tasks.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted">
                The list is clear. Add the next true thing.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {tasks.map((task) => (
                  <li key={task.id} className="flex items-center gap-2 py-2">
                    <button
                      type="button"
                      onClick={() => toggleTask(task.id)}
                      aria-label={
                        task.done ? `Undo ${task.title}` : `Complete ${task.title}`
                      }
                      className="flex size-11 shrink-0 items-center justify-center rounded-md transition-colors duration-150"
                    >
                      <span
                        className={cn(
                          "flex size-5 items-center justify-center rounded-xs border",
                          task.done
                            ? "border-fg bg-fg text-primary-fg"
                            : "border-border-strong bg-raised",
                        )}
                      >
                        {task.done ? (
                          <Check className="size-3" strokeWidth={3} />
                        ) : null}
                      </span>
                    </button>
                    <span
                      className={cn(
                        "min-w-0 flex-1 text-sm sm:text-base",
                        task.done && "text-subtle line-through",
                      )}
                    >
                      {task.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeTask(task.id)}
                      aria-label={`Remove ${task.title}`}
                      className="flex size-11 shrink-0 items-center justify-center rounded-md text-subtle transition-colors duration-150 hover:text-fg"
                    >
                      <X className="size-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {done > 0 ? (
              <div className="mt-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    clearDone();
                    toast("Cleared finished lines");
                  }}
                >
                  Clear finished
                </Button>
              </div>
            ) : null}
          </section>

          <section className="rise rise-3 rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] sm:p-6">
            <h2 className="mb-3 font-display text-2xl leading-none">Note</h2>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Scratch pad"
              className="min-h-64 w-full resize-none bg-transparent text-base leading-relaxed text-fg outline-none placeholder:text-subtle"
            />
          </section>
        </div>
      </div>
    </div>
  );
}
