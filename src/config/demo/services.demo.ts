import type { FormField, SchemaSection, ServiceDetail, ServiceSummary, ServiceWorkflowStage } from "@/types/services";

/*
 * DEMO services catalogue. Each service defines its OWN required fields, documents,
 * eligibility, declarations, workflow, and (where applicable) a demo fee. None of
 * this content is official; fees are illustrative placeholders, never approved amounts.
 */

const GOVERNORATES = [
    "بغداد",
    "البصرة",
    "نينوى",
    "أربيل",
    "النجف",
    "كربلاء",
    "ذي قار",
    "الأنبار",
    "ديالى",
    "بابل",
    "واسط",
    "ميسان",
    "المثنى",
    "القادسية",
    "صلاح الدين",
    "كركوك",
    "دهوك",
    "السليمانية",
].map((g) => ({ value: g, label: g }));

const fNationalId: FormField = {
    name: "nationalId",
    label: "رقم الهوية الوطنية الموحدة",
    type: "national-id",
    placeholder: "١٢ رقماً",
    required: true,
    validation: ["nationalId"],
    hint: "يُقبل الإدخال بالأرقام العربية أو الإنجليزية.",
};

const fFullName: FormField = {
    name: "fullName",
    label: "الاسم الرباعي واللقب",
    type: "text",
    placeholder: "مثال: محمد علي حسن الجبوري",
    required: true,
    validation: ["required", "arabicName"],
};

const fPhone: FormField = {
    name: "phone",
    label: "رقم الهاتف",
    type: "phone",
    placeholder: "07XXXXXXXXX",
    required: true,
    validation: ["phone"],
};

const fGovernorate: FormField = {
    name: "governorate",
    label: "المحافظة",
    type: "select",
    required: true,
    options: GOVERNORATES,
    validation: ["required"],
};

const personalSection: SchemaSection = {
    title: "المعلومات الشخصية",
    fields: [fFullName, fNationalId, fPhone, fGovernorate],
};

const WF_PAYMENT: ServiceWorkflowStage[] = [
    { key: "audit", title: "التدقيق" },
    { key: "payment", title: "الدفع" },
    { key: "data-review", title: "تدقيق البيانات والمستندات" },
    { key: "result", title: "النتيجة النهائية" },
];

const WF_NO_PAYMENT: ServiceWorkflowStage[] = [
    { key: "audit", title: "التدقيق" },
    { key: "data-review", title: "تدقيق البيانات والمستندات" },
    { key: "result", title: "النتيجة النهائية" },
];

const WF_SIMPLE: ServiceWorkflowStage[] = [
    { key: "audit", title: "المراجعة" },
    { key: "result", title: "النتيجة" },
];

export const SERVICE_DETAILS: ServiceDetail[] = [
    {
        id: "emp-project-registration",
        categoryId: "employment",
        title: "إصدار وثائق تسجيل مشروع",
        description: "تعطى هذه الخدمة للراغبين على التقديم واستلام اجازة رسمية بمزاولة المهنة",
        icon: "file-text",
        availability: "available",
        popularity: 98,
        requiredDocuments: ["صورة الهوية الوطنية الموحدة للمتقدم.", "بطاقة السكن أو ما يعادلها.", "وصف مختصر للمشروع."],
        eligibility: ["أن يكون المتقدم عراقي الجنسية ومقيماً داخل العراق.", "ألا يكون المتقدم موظفاً في القطاع العام."],
        declarations: [
            "أقر بأن جميع البيانات والمستندات المقدمة صحيحة وتحت مسؤوليتي القانونية.",
            "أتعهد بإبلاغ الوزارة بأي تغيير يطرأ على بيانات المشروع.",
        ],
        fee: null,
        processingTime: "تقديري: من ١٠ إلى ٢٠ يوم عمل",
        workflow: WF_NO_PAYMENT,
        schema: [
            personalSection,
            {
                title: "بيانات المشروع",
                fields: [
                    {
                        name: "projectName",
                        label: "اسم المشروع",
                        type: "text",
                        required: true,
                        validation: ["required"],
                    },
                    {
                        name: "projectDescription",
                        label: "وصف المشروع",
                        type: "textarea",
                        required: true,
                        validation: ["required"],
                        constraints: { minLength: 20 },
                    },
                ],
            },
            {
                title: "المستندات",
                fields: [
                    {
                        name: "idCopy",
                        label: "صورة الهوية الوطنية",
                        type: "file",
                        required: true,
                        validation: ["required"],
                    },
                ],
            },
        ],
    },
    {
        id: "sp-annual-statement",
        categoryId: "social-protection",
        title: "البيان السنوي",
        description: "خدمة اثبات الحياة تهدف الى تمكين المستفيدين من تأكيد استمرار استحقاقهم سنوياً.",
        icon: "users-three",
        availability: "available",
        popularity: 90,
        requiredDocuments: ["صورة الهوية الوطنية.", "رقم ملف الحماية الاجتماعية."],
        eligibility: ["أن يكون المتقدم مستفيداً حالياً من راتب الحماية الاجتماعية."],
        declarations: [
            "أقر بأن بيانات البيان السنوي مطابقة لوضعي الحالي.",
            "أتعهد بتحمّل المسؤولية القانونية في حال ثبوت خلاف ذلك.",
        ],
        fee: null,
        processingTime: "تقديري: من ٣ إلى ٧ أيام عمل",
        workflow: WF_SIMPLE,
        schema: [
            personalSection,
            {
                title: "بيانات الملف",
                fields: [
                    {
                        name: "fileNumber",
                        label: "رقم ملف الحماية",
                        type: "text",
                        required: true,
                        validation: ["required"],
                    },
                ],
            },
        ],
    },
    {
        id: "emp-loans",
        categoryId: "employment",
        title: "خدمة القروض",
        description: "خدمة القروض",
        icon: "hand-coins",
        availability: "unavailable",
        popularity: 80,
        requiredDocuments: ["صورة الهوية الوطنية.", "وثائق تسجيل المشروع."],
        eligibility: ["أن يمتلك المتقدم مشروعاً مسجلاً لدى الوزارة."],
        declarations: ["أقر بأن جميع البيانات المقدمة صحيحة.", "أتعهد بسداد أقساط القرض في مواعيدها."],
        fee: null,
        processingTime: "تقديري: من ١٥ إلى ٣٠ يوم عمل",
        workflow: WF_NO_PAYMENT,
        schema: [
            personalSection,
            {
                title: "بيانات القرض",
                fields: [
                    {
                        name: "amount",
                        label: "مبلغ القرض المطلوب (دينار)",
                        type: "number",
                        required: true,
                        validation: ["required", "positiveNumber"],
                    },
                ],
            },
        ],
    },
];

export const SERVICE_SUMMARIES: ServiceSummary[] = SERVICE_DETAILS.map((s) => ({
    id: s.id,
    categoryId: s.categoryId,
    title: s.title,
    description: s.description,
    icon: s.icon,
    availability: s.availability,
    popularity: s.popularity,
}));
