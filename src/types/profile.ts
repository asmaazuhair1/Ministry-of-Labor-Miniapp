import type { AccentKey } from "@/utils/accent.util";

export interface ProfileField {
    label: string;
    value: string;
}

export interface ProfileSection {
    key: string;
    title: string;
    icon: string;
    fields: ProfileField[];
}

export interface UserProfile {
    fullName: string;
    firstName: string;
    nationalId: string;
    avatarColor: AccentKey;
    verified: boolean;
    beneficiaryStatus: string;
    sections: ProfileSection[];
}
