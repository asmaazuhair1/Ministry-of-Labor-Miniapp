import { demoRequest } from "@/services/demo-transport";
import { DEMO_USER } from "@/config/demo/user.demo";
import type { UserProfile } from "@/types/profile";

/* Account data layer (DEMO-backed via demoRequest). */

export function getProfile() {
    return demoRequest<UserProfile>(DEMO_USER);
}

export function updateProfile(profile: UserProfile) {
    return demoRequest<UserProfile>(profile);
}
