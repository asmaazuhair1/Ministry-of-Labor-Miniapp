import type { AppNotification } from "@/types/notifications";

/** DEMO notifications tied to the sample requests above. */
export const DEMO_NOTIFICATIONS: AppNotification[] = [
    {
        id: "n1",
        kind: "missing-documents",
        title: "مطلوب استكمال مستند",
        body: "طلب التسجيل في دورة التدريب المهني بحاجة إلى صورة شخصية حديثة.",
        date: "2026-11-01T09:10:00",
        read: false,
        requestId: "req-1006",
    },
    {
        id: "n2",
        kind: "payment-request",
        title: "بانتظار الدفع",
        body: "اكتمل تدقيق معاملة توثيق عقد العمل. يرجى إكمال الدفع.",
        date: "2026-10-29T08:05:00",
        read: false,
        requestId: "req-1002",
    },
    {
        id: "n3",
        kind: "status-change",
        title: "تحديث حالة الطلب",
        body: "دخلت معاملة بطاقة ذوي الإعاقة مرحلة تدقيق البيانات والمستندات.",
        date: "2026-10-27T09:05:00",
        read: false,
        requestId: "req-1003",
    },
    {
        id: "n4",
        kind: "approved",
        title: "تم إنجاز معاملتك",
        body: "تم تسجيلك بنجاح كباحث عن عمل.",
        date: "2026-10-18T08:31:00",
        read: true,
        requestId: "req-1004",
    },
    {
        id: "n5",
        kind: "rejected",
        title: "نتيجة التظلم",
        body: "تعذر قبول التظلم لعدم استيفاء الشروط.",
        date: "2026-10-20T10:05:00",
        read: true,
        requestId: "req-1005",
    },
    {
        id: "n6",
        kind: "announcement",
        title: "إعلان: فتح باب التدريب المهني",
        body: "تعلن الوزارة عن فتح التسجيل لدورات التدريب المهني للفصل الجديد.",
        date: "2026-10-15T07:00:00",
        read: true,
    },
];
