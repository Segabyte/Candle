/**
 * Auth module — guest-first by design. Candle never requires an account.
 *
 * This is the future home of real sign-in. Each provider implements
 * AuthProvider; for MVP they are stubs that explain sync is coming.
 * When cloud sync ships, `signIn` will run the provider's OAuth flow in a
 * secure BrowserWindow and exchange tokens with the Candle sync backend.
 */
import type { UserProfile } from "@shared/types";
import { bridge } from "./bridge";

export type ProviderId = "google" | "facebook" | "email" | "microsoft" | "apple";

export type AuthProvider = {
  id: ProviderId;
  label: string;
  available: boolean;
};

export const PROVIDERS: AuthProvider[] = [
  { id: "google", label: "Continue with Google", available: false },
  { id: "facebook", label: "Continue with Facebook", available: false },
  { id: "email", label: "Sign in with email", available: false },
  { id: "microsoft", label: "Continue with Microsoft", available: false },
  { id: "apple", label: "Continue with Apple", available: false },
];

export const authService = {
  getProfile(): Promise<UserProfile> {
    return bridge.profile.get();
  },

  /** Stub: real OAuth arrives with cloud sync. */
  async signIn(_provider: ProviderId): Promise<{ ok: false; message: string }> {
    return {
      ok: false,
      message:
        "Accounts and cloud sync are coming soon. Everything you do today is saved privately on this device.",
    };
  },
};
