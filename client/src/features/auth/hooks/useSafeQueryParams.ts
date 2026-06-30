import { useEffect, useRef } from "react";
import { useLocation, useSearchParams } from "react-router-dom";

/**
 * Returns the canonical email/mode for the current auth flow page.
 *
 * sessionStorage is the SINGLE SOURCE OF TRUTH.
 * The URL is treated as a cosmetic mirror that is silently corrected only
 * when it actually differs from the sessionStorage values. This avoids
 * unnecessary history replacements that can disturb location.state.
 */
export function useSafeQueryParams(page: "otp" | "change-password") {
    const [, setSearchParams] = useSearchParams();
    const location = useLocation();

    // ── Synchronous read from the trusted source ─────────────────────────────
    const sessionEmail = sessionStorage.getItem(`auth_email_${page}`);
    const sessionMode = sessionStorage.getItem(`auth_mode_${page}`);

    // Stabilise location.state so the effect doesn't re-fire on every render
    // due to React Router creating a new object reference for state.
    const stableStateRef = useRef(location.state);

    // ── Silently restore the URL only when it actually differs ────────────────
    useEffect(() => {
        if (!sessionEmail) return; // No active session — guard handled by the page

        // Read current params from the live URL (avoids stale closure values)
        const currentParams = new URLSearchParams(window.location.search);
        const currentEmail = currentParams.get("email");
        const currentMode = currentParams.get("mode");

        const safeParams: Record<string, string> = { email: sessionEmail };
        if (page === "otp") {
            safeParams.mode = sessionMode ?? "signup";
        }

        const urlNeedsCorrection =
            currentEmail !== sessionEmail ||
            (page === "otp" && currentMode !== (sessionMode ?? "signup"));

        // Only replace the URL if it's actually wrong — preserves location.state
        if (urlNeedsCorrection) {
            setSearchParams(safeParams, { replace: true, state: stableStateRef.current });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run once on mount — we only need to fix the URL on initial load

    const safeMode =
        page === "otp"
            ? (sessionMode ?? "signup")
            : "";

    return {
        /** Canonical email from sessionStorage. Null when no active flow exists. */
        email: sessionEmail,
        /** Canonical mode from sessionStorage (OTP page only). */
        mode: safeMode,
    };
}

