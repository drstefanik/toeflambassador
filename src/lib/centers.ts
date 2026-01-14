import { slugify } from "./slugify";

export function resolveCenterSlug(fields: any) {
  const raw =
    fields?.Slug ||
    fields?.City ||
    fields?.Name ||
    "";
  return slugify(String(raw));
}
