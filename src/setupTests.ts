import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/svelte";

// jsdom lacks Element.animate — stub it so components using animations mount.
if (typeof Element !== "undefined" && !Element.prototype.animate) {
    Element.prototype.animate = () =>
        ({
            cancel: () => {},
            finished: Promise.resolve(),
            play: () => {},
            pause: () => {},
        }) as unknown as Animation;
}

afterEach(() => {
    cleanup();
});
