import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import NoticePopup from "@/components/public/NoticePopup";
import { getSiteSettings } from "@/lib/settings";
import { getActiveNotices } from "@/lib/content";

// Safety net: refresh at least hourly. Editing notices or settings refreshes it instantly.
export const revalidate = 3600;

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, notices] = await Promise.all([
    getSiteSettings(),
    getActiveNotices(),
  ]);

  return (
    <div className="public-theme flex flex-1 flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:shadow"
      >
        Skip to content
      </a>
      <Header
        hotelName={settings.hotelName}
        tickerMessages={settings.tickerMessages}
      />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer settings={settings} />
      <NoticePopup notices={notices} />
    </div>
  );
}