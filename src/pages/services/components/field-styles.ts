/** Shared input styling for the service form (tokens only). */
export function fieldClass(invalid: boolean, extra = ""): string {
    return [
        "w-full h-14 rounded-frame border px-4 text-body text-on-surface placeholder:text-on-surface-muted outline-none",
        "transition-colors duration-[var(--duration-fast)]",
        invalid
            ? "bg-danger-container/30 border-danger"
            : "bg-surface-container-high border-transparent focus:bg-surface-container focus:border-primary",
        extra,
    ].join(" ");
}
