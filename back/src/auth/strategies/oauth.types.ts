import type { AuthProvider } from "@/db/schema/users";

export interface OAuthProfile {
  provider: AuthProvider;
  providerId: string;
  email: string;
  name: string;
  avatarUrl?: string;
}
