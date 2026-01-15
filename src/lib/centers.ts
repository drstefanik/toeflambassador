import { slugify } from "./slugify";

export function resolveCenterSlug(fields: any) {
  const raw =
    fields?.Slug ||
    fields?.slug ||
    fields?.City ||
    fields?.city ||
    fields?.Name ||
    fields?.name ||
    "";

  return slugify(String(raw));
}
