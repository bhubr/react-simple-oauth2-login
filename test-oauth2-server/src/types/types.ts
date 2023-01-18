import { OAuthUser } from "@jmondi/oauth2-server";

export type AuthenticatedRequest = Request & { user: OAuthUser | null };
