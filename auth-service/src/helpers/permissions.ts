export const ROLE_SCOPES: Record<string, string[]> = {
  user: ["auth:me", "users:read"],
  manager: ["auth:me", "users:read", "users:write"],
  admin: ["*"],
};

export function scopesForRole(role: string): string[] {
  return ROLE_SCOPES[role] || ROLE_SCOPES.user;
}

export function hasScopes(userScopes: string[] = [], all?: string[], any?: string[]): boolean {
  if (userScopes.includes("*")) return true;

  const scopesSet = new Set(userScopes);

  if (all && !all.every((scope) => scopesSet.has(scope))) return false;
  if (any && !any.some((scope) => scopesSet.has(scope))) return false;

  return true;
}
