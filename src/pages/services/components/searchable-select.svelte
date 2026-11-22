<script lang="ts">
    import AppIcon from "@/components/app-icon.svelte";
    import { rise } from "@/utils/motion";

    interface Props {
        id: string;
        value: string;
        options: string[];
        placeholder?: string;
        invalid?: boolean;
        onChange: (value: string) => void;
    }

    const { id, value, options, placeholder = "ابحث او اختر...", invalid = false, onChange }: Props = $props();

    let open = $state(false);
    let query = $state("");

    const filtered = $derived(options.filter((o) => o.includes(query.trim())));

    function openList() {
        query = "";
        open = true;
    }

    function pick(option: string) {
        onChange(option);
        open = false;
    }

    function handleBlur() {
        // Delay so a tap on an option registers before the list closes.
        setTimeout(() => (open = false), 150);
    }
</script>

<div class="relative">
    <div
        class="flex items-center h-14 rounded-frame border px-4 transition-colors duration-[var(--duration-fast)] {invalid
            ? 'bg-danger-container/30 border-danger'
            : open
              ? 'bg-surface-container border-primary'
              : 'bg-surface-container-high border-transparent'}"
    >
        <input
            {id}
            type="text"
            autocomplete="off"
            value={open ? query : value}
            placeholder={value || placeholder}
            onfocus={openList}
            onblur={handleBlur}
            oninput={(e) => (query = e.currentTarget.value)}
            class="flex-1 min-w-0 bg-transparent text-body text-on-surface placeholder:text-on-surface-muted outline-none"
        />
        <AppIcon
            name="caret-down"
            size={18}
            class="shrink-0 text-on-surface-muted transition-transform duration-[var(--duration-fast)] {open
                ? 'rotate-180'
                : ''}"
        />
    </div>

    {#if open}
        <ul
            class="absolute z-20 mt-2 w-full max-h-64 overflow-y-auto rounded-frame bg-surface-container py-2 shadow-e3"
            transition:rise={{ y: -6 }}
        >
            {#each filtered as option (option)}
                <li>
                    <button
                        type="button"
                        onmousedown={(e) => e.preventDefault()}
                        onclick={() => pick(option)}
                        class="w-full min-h-11 px-4 py-2.5 text-start text-body transition active:bg-surface-container-high {option ===
                        value
                            ? 'font-bold text-primary'
                            : 'text-on-surface'}"
                    >
                        {option}
                    </button>
                </li>
            {:else}
                <li class="px-4 py-3 text-sm text-on-surface-muted">لا توجد نتائج</li>
            {/each}
        </ul>
    {/if}
</div>
