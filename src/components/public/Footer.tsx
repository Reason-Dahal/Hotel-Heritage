import type { SiteSettingsDTO } from "@/types/settings";
import { telHref, whatsappHref } from "@/lib/contact";

const SOCIALS = [
  { key: "facebookUrl", label: "Facebook" },
  { key: "instagramUrl", label: "Instagram" },
  { key: "tiktokUrl", label: "TikTok" },
  { key: "youtubeUrl", label: "YouTube" },
] as const;

const linkClass =
  "underline-offset-4 hover:text-brand-800 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600";

export default function Footer({ settings }: { settings: SiteSettingsDTO }) {
  const {
    hotelName,
    tagline,
    description,
    address,
    phone,
    email,
    whatsappNumber,
  } = settings;
  const socials = SOCIALS.filter(({ key }) => settings[key]);
  const hasContact = address || phone || email || whatsappNumber;

  return (
    <footer id="contact" className="footer-surface mt-16 text-gray-700">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 pb-10 pt-14 md:grid-cols-3">
        <div>
          <p className="text-lg font-semibold text-brand-800">{hotelName}</p>
          {tagline && <p className="mt-1 text-sm">{tagline}</p>}
          {description && (
            <p className="mt-3 text-sm text-gray-600">{description}</p>
          )}
        </div>

        {hasContact && (
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-800">
              Contact
            </h2>
            <address className="mt-3 space-y-2 break-words text-sm not-italic">
              {address && <p>{address}</p>}
              {phone && (
                <p>
                  <a href={telHref(phone)} className={linkClass}>
                    {phone}
                  </a>
                </p>
              )}
              {email && (
                <p>
                  <a href={`mailto:${email}`} className={linkClass}>
                    {email}
                  </a>
                </p>
              )}
              {whatsappNumber && (
                <p>
                  <a
                    href={whatsappHref(whatsappNumber)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                  >
                    Chat on WhatsApp
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </p>
              )}
            </address>
          </div>
        )}

        {socials.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-800">
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
                    className="inline-block rounded border border-brand-700/40 px-3 py-1.5 text-sm text-brand-800 hover:border-brand-700 hover:bg-brand-700 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <p className="px-4 pb-6 text-center text-xs text-gray-600">
        &copy; {new Date().getFullYear()} {hotelName}. All rights reserved.
      </p>
    </footer>
  );
}