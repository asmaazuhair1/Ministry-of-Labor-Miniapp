import type { UserProfile } from "@/types/profile";

/** DEMO signed-in citizen profile. */
export const DEMO_USER: UserProfile = {
    fullName: "محمد علي حسن الجبوري",
    firstName: "محمد",
    nationalId: "199012345678",
    avatarColor: "primary",
    verified: true,
    beneficiaryStatus: "مستفيد من شبكة الحماية الاجتماعية",
    sections: [
        {
            key: "personal",
            title: "المعلومات الشخصية",
            icon: "identification-card",
            fields: [
                { label: "الاسم الرباعي واللقب", value: "محمد علي حسن الجبوري" },
                { label: "رقم الهوية الوطنية", value: "199012345678" },
                { label: "تاريخ الميلاد", value: "1990-05-14" },
                { label: "الجنس", value: "ذكر" },
                { label: "الحالة الاجتماعية", value: "متزوج" },
            ],
        },
        {
            key: "contact",
            title: "معلومات الاتصال",
            icon: "phone",
            fields: [
                { label: "رقم الهاتف", value: "07701234567" },
                { label: "البريد الإلكتروني", value: "m.aljabouri@example.iq" },
            ],
        },
        {
            key: "residence",
            title: "بيانات السكن",
            icon: "map-pin",
            fields: [
                { label: "المحافظة", value: "بغداد" },
                { label: "القضاء / الناحية", value: "الكرخ" },
                { label: "أقرب نقطة دالة", value: "قرب حي الجامعة" },
            ],
        },
        {
            key: "account",
            title: "معلومات الحساب",
            icon: "user-circle",
            fields: [
                { label: "حالة التوثيق", value: "موثّق" },
                { label: "تاريخ التسجيل", value: "2026-09-01" },
                { label: "لغة التطبيق", value: "العربية" },
            ],
        },
    ],
};
