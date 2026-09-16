import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as Check, r as Plus, t as X } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as format } from "../_libs/date-fns.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DDvaiE3X.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[background-color,color,opacity,transform,box-shadow] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-40 active:not-disabled:scale-[0.96] [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-fg hover:bg-primary/90",
			secondary: "bg-raised text-fg shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]",
			ghost: "text-muted hover:bg-raised hover:text-fg",
			danger: "bg-danger/15 text-danger hover:bg-danger/25"
		},
		size: {
			default: "h-11 rounded-md px-4 text-sm",
			sm: "h-9 rounded-sm px-3 text-sm",
			lg: "h-12 rounded-lg px-5 text-sm",
			icon: "size-11 rounded-md"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = (0, import_react.forwardRef)(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
var Input = (0, import_react.forwardRef)(({ className, type, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
	type,
	className: cn("flex h-11 w-full rounded-md bg-raised px-3 text-sm text-fg shadow-[var(--shadow-border)]", "placeholder:text-subtle", "transition-[box-shadow] duration-150 ease-out", "focus-visible:outline-none focus-visible:shadow-[var(--shadow-border-hover)] focus-visible:ring-2 focus-visible:ring-ring/60", "disabled:cursor-not-allowed disabled:opacity-50", className),
	ref,
	...props
}));
Input.displayName = "Input";
var seed = [
	{
		id: "t1",
		title: "Open the day with one clear intention",
		done: true
	},
	{
		id: "t2",
		title: "Write the first paragraph before noon",
		done: false
	},
	{
		id: "t3",
		title: "Walk around the block after lunch",
		done: false
	},
	{
		id: "t4",
		title: "Reply to the studio note",
		done: false
	}
];
function uid() {
	return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
var useDesk = create()(persist((set) => ({
	intention: "Make something quiet and finished.",
	note: "Keep the list short. One sitting, then a walk. If it is not on the desk, it is not today's work.",
	tasks: seed,
	setIntention: (intention) => set({ intention }),
	setNote: (note) => set({ note }),
	addTask: (title) => {
		const trimmed = title.trim();
		if (!trimmed) return;
		set((s) => ({ tasks: [{
			id: uid(),
			title: trimmed,
			done: false
		}, ...s.tasks] }));
	},
	toggleTask: (id) => set((s) => ({ tasks: s.tasks.map((t) => t.id === id ? {
		...t,
		done: !t.done
	} : t) })),
	removeTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),
	clearDone: () => set((s) => ({ tasks: s.tasks.filter((t) => !t.done) }))
}), { name: "linen-desk" }));
function greeting(date) {
	const h = date.getHours();
	if (h < 12) return "Good morning";
	if (h < 17) return "Good afternoon";
	return "Good evening";
}
function Desk() {
	const [draft, setDraft] = (0, import_react.useState)("");
	const intention = useDesk((s) => s.intention);
	const note = useDesk((s) => s.note);
	const tasks = useDesk((s) => s.tasks);
	const setIntention = useDesk((s) => s.setIntention);
	const setNote = useDesk((s) => s.setNote);
	const addTask = useDesk((s) => s.addTask);
	const toggleTask = useDesk((s) => s.toggleTask);
	const removeTask = useDesk((s) => s.removeTask);
	const clearDone = useDesk((s) => s.clearDone);
	const now = (0, import_react.useMemo)(() => /* @__PURE__ */ new Date(), []);
	const remaining = tasks.filter((t) => !t.done).length;
	const done = tasks.length - remaining;
	function onAdd(e) {
		e.preventDefault();
		const title = draft.trim();
		if (!title) return;
		addTask(title);
		setDraft("");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-dvh bg-bg text-fg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-5xl px-4 py-8 sm:px-8 sm:py-12",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "rise mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium tracking-wide text-muted uppercase",
							children: format(now, "EEEE d MMMM")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-5xl leading-none tracking-tight sm:text-6xl",
							children: "Linen"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-muted",
							children: [greeting(now), "."]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "max-w-xs text-sm text-muted",
						children: "A React daily desk. Intention, a short list, a note — kept on this device."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "rise rise-2 mb-6 rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] sm:p-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "grid gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-medium text-muted",
							children: "Today"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: intention,
							onChange: (e) => setIntention(e.target.value),
							placeholder: "What is the day for?",
							className: "font-display w-full bg-transparent text-2xl leading-snug text-fg outline-none placeholder:text-subtle sm:text-3xl"
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rise rise-3 rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] sm:p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-4 flex items-baseline justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-2xl leading-none",
									children: "List"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm tabular-nums text-muted",
									children: [
										remaining,
										" open",
										done ? ` · ${done} done` : ""
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: onAdd,
								className: "mb-4 flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: draft,
									onChange: (e) => setDraft(e.target.value),
									placeholder: "Add a line",
									"aria-label": "New task"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									size: "icon",
									"aria-label": "Add task",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {})
								})]
							}),
							tasks.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "py-8 text-center text-sm text-muted",
								children: "The list is clear. Add the next true thing."
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "divide-y divide-border",
								children: tasks.map((task) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center gap-2 py-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => toggleTask(task.id),
											"aria-label": task.done ? `Undo ${task.title}` : `Complete ${task.title}`,
											className: "flex size-11 shrink-0 items-center justify-center rounded-md transition-colors duration-150",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: cn("flex size-5 items-center justify-center rounded-xs border", task.done ? "border-fg bg-fg text-primary-fg" : "border-border-strong bg-raised"),
												children: task.done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
													className: "size-3",
													strokeWidth: 3
												}) : null
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: cn("min-w-0 flex-1 text-sm sm:text-base", task.done && "text-subtle line-through"),
											children: task.title
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => removeTask(task.id),
											"aria-label": `Remove ${task.title}`,
											className: "flex size-11 shrink-0 items-center justify-center rounded-md text-subtle transition-colors duration-150 hover:text-fg",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
										})
									]
								}, task.id))
							}),
							done > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "ghost",
									size: "sm",
									onClick: () => {
										clearDone();
										toast("Cleared finished lines");
									},
									children: "Clear finished"
								})
							}) : null
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rise rise-3 rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] sm:p-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mb-3 font-display text-2xl leading-none",
							children: "Note"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: note,
							onChange: (e) => setNote(e.target.value),
							placeholder: "Scratch pad",
							className: "min-h-64 w-full resize-none bg-transparent text-base leading-relaxed text-fg outline-none placeholder:text-subtle"
						})]
					})]
				})
			]
		})
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Desk, {});
}
//#endregion
export { Home as component };
