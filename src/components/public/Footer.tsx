import type { SiteSettingsDTO } from "@/types/settings";

const SOCIALS = [
  { key: "facebookUrl", label: "Facebook" },
  { key: "instagramUrl", label: "Instagram" },
  { key: "tiktokUrl", label: "TikTok" },
  { key: "youtubeUrl", label: "YouTube" },
  { key: "whatsappUrl", label: "WhatsApp" },
] as const;

// Keep digits and a leading + only, so the tel: link always works
const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

export default function Footer({ settings }: { settings: SiteSettingsDTO }) {
  const { hotelName, tagline, description, address, phone, email } = settings;
  const socials = SOCIALS.filter(({ key }) => settings[key]);
  const hasContact = address || phone || email;

  return (
    <footer id="contact" className="mt-16 bg-ink-900 text-gray-300">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <p className="text-lg font-semibold text-white">{hotelName}</p>
          {tagline && <p className="mt-1 text-sm">{tagline}</p>}
          {description && (
            <p className="mt-3 text-sm text-gray-400">{description}</p>
          )}
        </div>

        {hasContact && (
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
              Contact
            </h2>
            <address className="mt-3 space-y-2 text-sm not-italic">
              {address && <p>{address}</p>}
              {phone && (
                <p>
                  <a href={telHref(phone)} className="hover:text-white">
                    {phone}
                  </a>
                </p>
              )}
              {email && (
                <p>
                  <a href={`mailto:${email}`} className="hover:text-white">
                    {email}
                  </a>
                </p>
              )}
            </address>
          </div>
        )}

        {socials.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
              Follow us
            </h2>
            <ul className="mt-3 flex flex-wrap gap-3">
              {socials.map(({ key, label }) => (
                <li key={key}>
                  <a
                    href={settings[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${hotelName} on ${label}`}
                    className="inline-block rounded border border-gray-600 px-3 py-1.5 text-sm hover:border-white hover:text-white"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} {hotelName}. All rights reserved.
      </div>
    </footer>
  );
}