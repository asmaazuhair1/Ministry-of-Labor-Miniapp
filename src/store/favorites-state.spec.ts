import { describe, it, expect, beforeEach } from "vitest";
import { get } from "svelte/store";
import { favorites, toggleFavorite, clearFavorites } from "./favorites-state";

describe("favorites-state", () => {
    beforeEach(() => {
        clearFavorites();
    });

    it("starts empty", () => {
        expect(get(favorites).size).toBe(0);
    });

    it("adds a key on first toggle", () => {
        toggleFavorite("/services");
        expect(get(favorites).has("/services")).toBe(true);
    });

    it("removes a key on second toggle", () => {
        toggleFavorite("/services");
        toggleFavorite("/services");
        expect(get(favorites).has("/services")).toBe(false);
    });

    it("tracks keys independently", () => {
        toggleFavorite("/services");
        toggleFavorite("/requests");
        const set = get(favorites);
        expect(set.has("/services")).toBe(true);
        expect(set.has("/requests")).toBe(true);
        expect(set.size).toBe(2);
    });

    it("clearFavorites empties the set", () => {
        toggleFavorite("/a");
        toggleFavorite("/b");
        clearFavorites();
        expect(get(favorites).size).toBe(0);
    });
});
