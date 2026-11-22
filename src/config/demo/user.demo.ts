import type { UserProfile } from "@/types/profile";

/** DEMO signed-in citizen profile. */
export const DEMO_USER: UserProfile = {
    fullName: "أسماء زهير",
    firstName: "أسماء زهير",
    nationalId: "199012345678",
    phone: "0776654129",
    avatarColor: "primary",
    verified: true,
    beneficiaryStatus: "مستفيدة من شبكة الحماية الاجتماعية",
    sections: [
        {
            key: "personal",
            title: "المعلومات الشخصية",
            icon: "identification-card",
            fields: [
                { label: "الاسم الرباعي واللقب", value: "أسماء زهير" },
                { label: "رقم الهوية الوطنية", value: "199012345678" },
                { label: "تاريخ الميلاد", value: "1990-05-14" },
                { label: "الجنس", value: "أنثى" },
                { label: "الحالة الاجتماعية", value: "متزوجة" },
            ],
        },
        {
            key: "contact",
            title: "معلومات الاتصال",
            icon: "phone",
            fields: [
                { label: "رقم الهاتف", value: "0776654129" },
                { label: "البريد الإلكتروني", value: "asmaa.zuhair@example.iq" },
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
