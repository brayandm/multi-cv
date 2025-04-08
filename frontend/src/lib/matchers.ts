export function routePatternsToRegex(routes: string[]): RegExp[] {
  return routes.map((route) => {
    if (route.endsWith("/*")) {
      const base = route.slice(0, -2).replace(/\//g, "\\/");
      return new RegExp(`^${base}(\\/.*)?$`);
    } else {
      const exact = route.replace(/\//g, "\\/");
      return new RegExp(`^${exact}$`);
    }
  });
}
