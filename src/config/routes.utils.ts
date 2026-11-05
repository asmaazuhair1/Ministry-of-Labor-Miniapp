import type { Component } from "svelte";
import { routes, type LayoutConfig, type RouteConfig } from "./routes.config";

const DEFAULT_LAYOUT: LayoutConfig = {
    showLayout: true,
    showBottomNav: false,
    showBackButton: true,
    showLogo: false,
    showBell: false,
    pageTitle: "",
};

/** Build the route map consumed by svelte-spa-router (order preserved via Map). */
export function buildRouteMap(): Map<string, Component> {
    const map = new Map<string, Component>();
    for (const route of routes) {
        map.set(route.path, route.component);
    }
    return map;
}

function patternToRegex(path: string): RegExp {
    if (path === "*") return /.*/;
    const source = path
        .replace(/\/+$/, "")
        .split("/")
        .map((segment) => (segment.startsWith(":") ? "[^/]+" : escapeRegex(segment)))
        .join("/");
    return new RegExp(`^${source || "/"}/?$`);
}

function escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function getRouteConfig(location: string): RouteConfig | undefined {
    const clean = (location || "/").split("?")[0];
    return routes.find((route) => route.path !== "*" && patternToRegex(route.path).test(clean));
}

/** Resolve the shell layout for the current location. */
export function getLayoutForRoute(location: string): LayoutConfig {
    return getRouteConfig(location)?.layout ?? DEFAULT_LAYOUT;
}
