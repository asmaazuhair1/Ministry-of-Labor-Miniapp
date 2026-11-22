import type { Announcement, FaqItem, LawDocument, NewsItem } from "@/types/content";

/** DEMO featured announcements for the Home slider. */
export const DEMO_ANNOUNCEMENTS: Announcement[] = [
    {
        id: "a1",
        category: "social-protection",
        title: "تحديث بيانات مستفيدي الحماية الاجتماعية",
        description: "ندعو المستفيدين إلى تحديث بياناتهم إلكترونياً لضمان استمرار الاستحقاق.",
        date: "2026-11-01T08:00:00",
        accent: "primary",
        image: "/images/announcements/ministry-building.webp",
        body: "تدعو وزارة العمل والشؤون الاجتماعية جميع المستفيدين من شبكة الحماية الاجتماعية إلى تحديث بياناتهم عبر التطبيق، لضمان استمرار صرف الإعانات دون انقطاع. يشمل التحديث بيانات السكن وعدد أفراد الأسرة ومصدر الدخل. (محتوى تجريبي لأغراض العرض.)",
        points: [
            "التحديث إلكتروني بالكامل ولا يتطلب مراجعة الدائرة.",
            "جهّز صورة البطاقة الوطنية وبطاقة السكن.",
            "تأخير التحديث قد يؤدي إلى إيقاف مؤقت للصرف.",
        ],
        cta: { label: "تصفّح خدمات هيئة الحماية الاجتماعية", path: "/services/category/social-protection" },
    },
    {
        id: "a2",
        category: "employment",
        title: "مبادرة التشغيل الوطني",
        description: "فرص عمل جديدة ضمن برامج التشغيل بالتعاون مع القطاع الخاص.",
        date: "2026-10-27T08:00:00",
        accent: "tertiary",
        image: "/images/announcements/ministry-building.webp",
        body: "أطلقت الوزارة مبادرة التشغيل الوطني بالتعاون مع شركات القطاع الخاص لتوفير فرص عمل للباحثين عن عمل المسجلين لديها، مع أولوية للخريجين الجدد وأصحاب المهن. (محتوى تجريبي لأغراض العرض.)",
        points: [
            "المبادرة مفتوحة لجميع المحافظات.",
            "التسجيل عبر خدمات العمل والتدريب المهني.",
            "تُعلن نتائج المطابقة عبر إشعارات التطبيق.",
        ],
        cta: { label: "تصفّح خدمات العمل والتدريب المهني", path: "/services/category/employment" },
    },
    {
        id: "a3",
        category: "training",
        title: "فتح باب التدريب المهني",
        description: "سجّل الآن في الدورات التدريبية المجانية لتطوير مهاراتك المهنية.",
        date: "2026-10-20T08:00:00",
        accent: "info",
        image: "/images/announcements/ministry-building.webp",
        body: "تعلن الوزارة عن فتح باب التسجيل في الدورات التدريبية المجانية بمراكز التدريب المهني، في مجالات الكهرباء والنجارة والخياطة وصيانة الأجهزة، مع شهادة إتمام معتمدة. (محتوى تجريبي لأغراض العرض.)",
        points: [
            "الدورات مجانية بالكامل.",
            "تُمنح شهادة إتمام معتمدة من الوزارة.",
            "المقاعد محدودة وتُخصص حسب أسبقية التسجيل.",
        ],
        cta: { label: "تصفّح خدمات العمل والتدريب المهني", path: "/services/category/employment" },
    },
    {
        id: "a4",
        category: "services",
        title: "خدمات ذوي الإعاقة إلكترونياً",
        description: "أصبح بإمكانك تقديم طلب بطاقة ذوي الإعاقة عبر التطبيق.",
        date: "2026-10-12T08:00:00",
        accent: "review",
        image: "/images/announcements/ministry-building.webp",
        body: "ضمن خطة التحول الرقمي، أصبح بإمكان ذوي الإعاقة وذويهم تقديم الطلبات ومتابعتها عبر التطبيق دون الحاجة إلى مراجعة الدوائر، مع إشعارات فورية عند كل مرحلة. (محتوى تجريبي لأغراض العرض.)",
        points: ["تقديم ومتابعة الطلبات من الجوال.", "إشعار فوري عند كل تحديث على الطلب."],
        cta: { label: "تصفّح كل الخدمات", path: "/services" },
    },
];

/** DEMO news feed. */
export const DEMO_NEWS: NewsItem[] = [
    {
        id: "news-1",
        title: "الوزارة تطلق منصتها الرقمية لخدمة المواطنين",
        excerpt: "خطوة ضمن مشروع التحول الرقمي لتسهيل الوصول إلى الخدمات.",
        body: "في إطار جهود التحول الرقمي الحكومي، أطلقت وزارة العمل والشؤون الاجتماعية منصتها الرقمية التي تتيح للمواطنين الوصول إلى الخدمات وتقديم الطلبات ومتابعة المعاملات إلكترونياً دون الحاجة إلى مراجعة الدوائر. (محتوى تجريبي لأغراض العرض.)",
        date: "2026-11-03T10:00:00",
        accent: "primary",
        icon: "chart-line-up",
        image: "/images/news/ministry-sign.png",
    },
    {
        id: "news-2",
        title: "برامج دعم الأسر ضمن شبكة الحماية الاجتماعية",
        excerpt: "توسيع مظلة الحماية لتشمل مزيداً من الأسر المحتاجة.",
        body: "تعمل الوزارة على توسيع برامج الدعم الموجهة للأسر الأكثر حاجة ضمن شبكة الحماية الاجتماعية، بما يعزز مبدأ العدالة الاجتماعية. (محتوى تجريبي لأغراض العرض.)",
        date: "2026-10-29T09:30:00",
        accent: "secondary",
        icon: "hand-heart",
        image: "/images/news/ministry-building-day.webp",
    },
    {
        id: "news-3",
        title: "تعاون لتأهيل وتشغيل الشباب",
        excerpt: "شراكات جديدة لرفع مهارات الشباب وربطهم بسوق العمل.",
        body: "ضمن مبادرات تنمية القوى العاملة، تعقد الوزارة شراكات مع جهات تدريب وتشغيل لرفع مهارات الشباب وربطهم بفرص العمل المتاحة. (محتوى تجريبي لأغراض العرض.)",
        date: "2026-10-22T11:15:00",
        accent: "tertiary",
        icon: "handshake",
        image: "/images/news/ministry-entrance.png",
    },
];

/** DEMO frequently asked questions. */
export const DEMO_FAQS: FaqItem[] = [
    {
        id: "f1",
        question: "كيف أقدّم طلباً للحصول على خدمة؟",
        answer: "اختر الخدمة من قسم الخدمات، اطّلع على المتطلبات، ثم اضغط «تقديم الطلب» وأكمل النموذج.",
    },
    {
        id: "f2",
        question: "كيف أتابع حالة معاملتي؟",
        answer: "من قسم «طلباتي» يمكنك متابعة مراحل كل معاملة وحالتها الحالية وأي إجراء مطلوب.",
    },
    {
        id: "f3",
        question: "هل هذه بيانات رسمية؟",
        answer: "لا، جميع الخدمات والبيانات في هذه النسخة تجريبية ولأغراض العرض فقط وغير رسمية.",
    },
];

export const DEMO_CONTACT = {
    phone: "+964 000 000 0000",
    email: "info@example.iq",
    workingHours: "الأحد - الخميس، ٨:٠٠ ص - ٢:٠٠ م",
};

/** DEMO laws and instructions (titles only; files are not bundled in demo mode). */
export const DEMO_LAWS: LawDocument[] = [
    {
        id: "law-labour",
        kind: "law",
        title: "قانون العمل رقم 37 لسنة 2015",
        date: "2026-06-08",
        icon: "scales",
        fileUrl: null,
    },
    {
        id: "law-social-protection",
        kind: "law",
        title: "قانون الحماية الاجتماعية رقم 11 لسنة 2014",
        date: "2026-06-08",
        icon: "scales",
        fileUrl: null,
    },
    {
        id: "law-disability",
        kind: "law",
        title: "قانون رعاية ذوي الإعاقة والاحتياجات الخاصة رقم 38 لسنة 2013",
        date: "2026-06-08",
        icon: "scales",
        fileUrl: null,
    },
    {
        id: "law-workers-retirement",
        kind: "law",
        title: "قانون التقاعد والضمان الاجتماعي للعمال رقم 18 لسنة 2023",
        date: "2026-06-08",
        icon: "scales",
        fileUrl: null,
    },
    {
        id: "inst-project-registration",
        kind: "instruction",
        title: "تعليمات تسجيل المشاريع الصغيرة المدرة للدخل",
        date: "2026-06-08",
        icon: "file-text",
        fileUrl: null,
    },
    {
        id: "inst-vocational-training",
        kind: "instruction",
        title: "تعليمات القبول في مراكز التدريب المهني",
        date: "2026-06-08",
        icon: "file-text",
        fileUrl: null,
    },
];
