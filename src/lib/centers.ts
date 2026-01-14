import { slugify } from "./slugify";

export function resolveCenterSlug(fields: any) {
  const raw =
    fields?.Slug ||
    fields?.slug ||
    fields?.City ||
    fields?.["Città"] ||
    fields?.Citta ||
    fields?.city ||
    fields?.Name ||
    fields?.Nome ||
    "";
  return slugify(String(raw));
}
