import { useEffect } from "react";

/**
 * Warns the user (via the browser's native confirmation dialog) before leaving
 * the page — closing the tab, reloading, or navigating to another URL — while
 * `dirty` is true. Covers accidental data loss from unsaved edits in the admin.
 *
 * Note: this fires on full-page unloads, not Next.js client-side <Link>
 * navigations, which browsers don't expose a `beforeunload` for.
 */
export function useUnsavedChanges(dirty: boolean) {
  useEffect(() => {
    if (!dirty) return;

    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);
}
