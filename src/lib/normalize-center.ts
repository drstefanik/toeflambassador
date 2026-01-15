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
  heroImageUrl?: string | null;
  mapEnabled?: boolean;
  callSectionEnabled?: boolean;
  callSectionTitle?: string;
  callSectionSubtitle?: string;
  callSectionPhoneLabel?: string;
  callSectionPhoneNumber?: string;
  writeSectionEnabled?: boolean;
  writeSectionTitle?: string;
  writeSectionSubtitle?: string;
  contactFormEmail?: string;
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
    heroImageUrl: f.HeroImageUrl ? String(f.HeroImageUrl) : null,
    mapEnabled: f.MapEnabled != null ? Boolean(f.MapEnabled) : undefined,
    callSectionEnabled:
      f.CallSectionEnabled != null ? Boolean(f.CallSectionEnabled) : undefined,
    callSectionTitle: f.CallSectionTitle
      ? String(f.CallSectionTitle)
      : undefined,
    callSectionSubtitle: f.CallSectionSubtitle
      ? String(f.CallSectionSubtitle)
      : undefined,
    callSectionPhoneLabel: f.CallSectionPhoneLabel
      ? String(f.CallSectionPhoneLabel)
      : undefined,
    callSectionPhoneNumber: f.CallSectionPhoneNumber
      ? String(f.CallSectionPhoneNumber)
      : undefined,
    writeSectionEnabled:
      f.WriteSectionEnabled != null ? Boolean(f.WriteSectionEnabled) : undefined,
    writeSectionTitle: f.WriteSectionTitle
      ? String(f.WriteSectionTitle)
      : undefined,
    writeSectionSubtitle: f.WriteSectionSubtitle
      ? String(f.WriteSectionSubtitle)
      : undefined,
    contactFormEmail: f.ContactFormEmail
      ? String(f.ContactFormEmail)
      : undefined,
  };
}
