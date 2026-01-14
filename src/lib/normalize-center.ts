export type Center = {
  id: string;
  slug: string;
  name: string;
  city: string;
  address: string;
  phone?: string;
  email?: string;
  latitude?: number;
  longitude?: number;
};

export function normalizeCenter(record: any): Center {
  const f = record?.fields ?? record ?? {};

  return {
    id: record?.id ?? f?.id ?? "",
    slug: String(f.Slug ?? f.slug ?? ""),
    name: String(f.Name ?? ""),
    city: String(f.City ?? ""),
    address: String(f.Address ?? ""),
    phone: f.Phone ? String(f.Phone) : undefined,
    email: f.Email ? String(f.Email) : undefined,
    latitude: f.Latitude != null ? Number(f.Latitude) : undefined,
    longitude: f.Longitude != null ? Number(f.Longitude) : undefined,
  };
}
