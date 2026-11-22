/*
 * DEMO application form shared by every service. Specialties and fees are
 * illustrative placeholders, not official ministry values.
 */

export interface ChoiceOption {
    value: string;
    label: string;
    /** Extra fee (IQD) added to the total when this option is selected. */
    fee?: number;
}

/** Base fee shown in the details card before any optional fees. */
export const BASE_FEE = 97000;

export const SPECIALTIES: string[] = [
    "ورشة حدادة",
    "ورشة نجارة",
    "ورشة تصليح سيارات",
    "ورشة خياطة",
    "صيانة أجهزة كهربائية",
    "صيانة أجهزة موبايل",
    "تأسيسات كهربائية",
    "تأسيسات صحية",
    "مخبز ومعجنات",
    "صالون حلاقة",
    "صالون تجميل",
    "مطبعة",
    "محل ألمنيوم",
    "تصليح تبريد وتكييف",
];

export const PRIOR_PLEDGE_OPTIONS: ChoiceOption[] = [
    { value: "yes", label: "نعم يوجد تعهد قانوني سابق" },
    { value: "no", label: "لا يوجد تعهد قانوني سابق", fee: 8000 },
];

export const EDUCATION_OPTIONS: ChoiceOption[] = [
    { value: "engineering", label: "شهادة هندسة من ضمن الاختصاص" },
    { value: "other", label: "شهادة اخرى", fee: 10000 },
];

export const WORKERS_OPTION: ChoiceOption = { value: "has-workers", label: "يوجد عمال", fee: 2000 };

export const LEGAL_PLEDGE_TEXT =
    "أتعهد بعدم استخدام المحل أو أدوات العمل الخاصة به في أي نشاط خارج نطاق القانون وأهداف المهنة من قبلي أو من قبل أي جهة أخرى وبخلافه أتحمل كافة التبعات القانونية.";

export const MAX_UPLOAD_MB = 10;

/** Default map centre: Baghdad. */
export const DEFAULT_MAP_CENTER = { lat: 33.3152, lng: 44.3661 };
