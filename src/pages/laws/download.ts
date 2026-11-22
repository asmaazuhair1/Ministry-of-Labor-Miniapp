import { showAlert } from "@/store/alert-state";
import type { LawDocument } from "@/types/content";

/** Open the law's PDF, or explain that files are not bundled in demo mode. */
export function downloadLaw(law: LawDocument): void {
    if (law.fileUrl) {
        window.open(law.fileUrl, "_blank", "noopener");
        return;
    }
    showAlert({
        variant: "info",
        title: "الملف غير متوفر",
        message: "ملفات القوانين والتعليمات غير متوفرة في النسخة التجريبية.",
        confirmLabel: "حسناً",
    });
}
