import { writable } from "svelte/store";
import { appConfig } from "@/config/app.config";

export interface AppSettings {
    ministryName: string;
    ministryShortName: string;
    isDemo: boolean;
}

export const appSettings = writable<AppSettings>({
    ministryName: appConfig.metadata.ministryName,
    ministryShortName: appConfig.metadata.ministryShortName,
    isDemo: appConfig.features.demoMode,
});
