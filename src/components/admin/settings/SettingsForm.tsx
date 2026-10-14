"use client";

import { useState } from "react";
import { useAdminCrud } from "@/hooks/useAdminCrud";
import { extractMapSrc } from "@/lib/mapEmbed";
import type { SiteSettingsDTO } from "@/types/settings";
import GeneralSection from "./GeneralSection";
import ContactSection from "./ContactSection";
import SocialSection from "./SocialSection";
import LocationSection from "./LocationSection";
import TickerSection from "./TickerSection";
import HomepageSection from "./HomepageSection";

const cleanList = (list: string[]) => list.map((m) => m.trim()).filter(Boolean);

export default function SettingsForm({ settings }: { settings: SiteSettingsDTO }) {
  const { saving, error, save } = useAdminCrud("/api/settings", { singleton: true });
  const [form, setForm] = useState<SiteSettingsDTO>(settings);
  const [saved, setSaved] = useState(false);

  const update = (patch: Partial<SiteSettingsDTO>) =>
    setForm((prev) => ({ ...prev, ...patch }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(false);
    const payload: SiteSettingsDTO = {
      ...form,
      mapEmbedUrl: extractMapSrc(form.mapEmbedUrl),
      bannerMessages: cleanList(form.bannerMessages),
      tickerMessages: cleanList(form.tickerMessages),
    };
    if (await save(null, payload)) setSaved(true);
  };

  const sectionProps = { form, update };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Site settings</h1>
        <p className="mt-1 text-gray-600">
          These details appear in your website&apos;s header, footer, and homepage.
        </p>
      </div>

      {error && (
        <p role="alert" className="rounded bg-red-100 p-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {saved && (
        <p role="status" className="rounded bg-green-100 p-3 text-sm text-green-700">
          Settings saved.
        </p>
      )}

      <GeneralSection {...sectionProps} />
      <TickerSection {...sectionProps} />
      <HomepageSection {...sectionProps} />
      <ContactSection {...sectionProps} />
      <SocialSection {...sectionProps} />
      <LocationSection {...sectionProps} />

      <button
        type="submit"
        disabled={saving}
        className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save settings"}
      </button>
    </form>
  );
}