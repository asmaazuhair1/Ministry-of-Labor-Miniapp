<script lang="ts">
    import AppIcon from "@/components/app-icon.svelte";
    import LatticePattern from "@/assets/patterns/lattice-pattern.svelte";
    import { downloadLaw } from "@/pages/laws/download";
    import { reducedMotion, rise, stagger } from "@/utils/motion";
    import type { LawDocument } from "@/types/content";

    /*
     * Laws & instructions as official documents: an arch seal carries the law
     * number and year (the thing people actually look for), the name reads on its
     * own without repeating them, and the download is one clear round action.
     */
    interface Props {
        laws: LawDocument[];
    }
    const { laws }: Props = $props();

    const NUMBER_RE = /\s*رقم\s*(\d+)\s*لسنة\s*(\d+)\s*/;

    function parse(law: LawDocument) {
        const match = law.title.match(NUMBER_RE);
        return {
            number: match?.[1],
            year: match?.[2],
            name: match ? law.title.replace(NUMBER_RE, " ").trim() : law.title,
        };
    }

    const shortDate = (iso: string) => {
        const d = new Date(iso);
        return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
    };
</script>

<ul class="flex flex-col gap-3">
    {#each laws as law, i (law.id)}
        {@const info = parse(law)}
        {@const isLaw = law.kind === "law"}
        <li in:rise|global={{ delay: reducedMotion() ? 0 : stagger(i) }}>
            <article class="relative flex items-center gap-4 rounded-card bg-surface-container p-3 pe-3 shadow-e1">
                <!-- Seal -->
                <span
                    class="relative grid w-[68px] h-[84px] shrink-0 place-content-center overflow-hidden shape-arch text-center {isLaw
                        ? 'bg-primary text-on-primary'
                        : 'bg-secondary-container text-secondary'}"
                    aria-hidden="true"
                >
                    <LatticePattern
                        tile={16}
                        class="absolute inset-0 w-full h-full {isLaw ? 'text-on-primary/10' : 'text-secondary/10'}"
                    />
                    <span
                        class="absolute inset-1 shape-arch border {isLaw
                            ? 'border-on-primary/25'
                            : 'border-secondary/25'}"
                    ></span>
                    {#if info.number}
                        <span class="relative mt-2 text-caption leading-none opacity-80">رقم</span>
                        <span class="relative text-title-1 leading-tight tabular-nums">{info.number}</span>
                        <span class="relative text-caption leading-none opacity-80 tabular-nums">{info.year}</span>
                    {:else}
                        <span class="relative mt-2"><AppIcon name={law.icon} size={28} weight="duotone" /></span>
                    {/if}
                </span>

                <!-- Name + meta -->
                <div class="min-w-0 flex-1 py-1">
                    <h3 class="text-label text-on-surface line-clamp-2">{info.name}</h3>
                    {#if info.number}
                        <span class="sr-only">رقم {info.number} لسنة {info.year}</span>
                    {/if}
                    <div class="mt-2 flex flex-wrap items-center gap-1.5">
                        <span
                            class="rounded-pill px-2 py-0.5 text-caption font-bold {isLaw
                                ? 'bg-primary-container text-primary'
                                : 'bg-secondary-container text-secondary'}"
                        >
                            {isLaw ? "قانون" : "تعليمات"}
                        </span>
                        <span
                            class="rounded-pill bg-surface-container-high px-2 py-0.5 text-caption text-on-surface-variant"
                            dir="ltr">PDF</span
                        >
                        <span class="text-caption text-on-surface-muted tabular-nums" dir="ltr"
                            >{shortDate(law.date)}</span
                        >
                    </div>
                </div>

                <!-- Download -->
                <button
                    type="button"
                    onclick={() => downloadLaw(law)}
                    aria-label="تحميل {law.title}"
                    class="pressable grid place-items-center w-12 h-12 shrink-0 rounded-full bg-primary-container text-primary active:bg-primary active:text-on-primary"
                >
                    <AppIcon name="download" size={22} weight="bold" />
                </button>
            </article>
        </li>
    {/each}
</ul>
