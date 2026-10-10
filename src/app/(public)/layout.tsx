import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import { getSiteSettings } from "@/lib/settings";

// Safety net: refresh at least hourly. Saving settings refreshes it instantly.
export const revalidate = 3600;

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:shadow"
      >
        Skip to content
      </a>
      <Header hotelName={settings.hotelName} tagline={settings.tagline} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer settings={settings} />
    </>
  );
}