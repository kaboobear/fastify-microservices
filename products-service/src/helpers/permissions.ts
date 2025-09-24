export function hasScopes(userScopes: string[] = [], all?: string[], any?: string[]): boolean {
  if (userScopes.includes("*")) return true;

  const scopesSet = new Set(userScopes);

  if (all && !all.every((scope) => scopesSet.has(scope))) return false;
  if (any && !any.some((scope) => scopesSet.has(scope))) return false;

  return true;
}
