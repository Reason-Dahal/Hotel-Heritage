"use client";

import { useState, type ComponentProps } from "react";
import { useAdminCrud } from "@/hooks/useAdminCrud";
import { TextField, TextAreaField, SelectField } from "@/components/admin/FormFields";
import ImageListEditor from "@/components/admin/ImageListEditor";
import { extractMapSrc } from "@/lib/mapEmbed";
import { SiteSettingsDTO,CURRENCY_OPTIONS } from "@/types/settings";
import FormSection from "./FormSection";
import BannerMessagesEditor from "./BannerMessagesEditor";

type TextKey = Exclude<keyof SiteSettingsDTO, "bannerMessages">;

export default function SettingsForm({ settings }: { settings: SiteSettingsDTO }) {
  const { saving, error, save } = useAdminCrud("/api/settings", { singleton: true });
  const [form, setForm] = useState<SiteSettingsDTO>(settings);
  const [saved, setSaved] = useState(false);

  const setField = (key: TextKey, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // Builds a labelled text input wired to one settings field
  const text = (
    key: TextKey,
    label: string,
    extra: Partial<ComponentProps<typeof TextField>> = {}
  ) => (
    <TextField
      id={`settings-${key}`}
      label={label}
      value={form[key]}
      onChange={(e) => setField(key, e.target.value)}
      {...extra}
    />
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(false);
    const payload = {
      ...form,
      mapEmbedUrl: extractMapSrc(form.mapEmbedUrl),
      bannerMessages: form.bannerMessages.map((m) => m.trim()).filter(Boolean),
    };
    if (await save(null, payload)) setSaved(true);
  };

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

      <FormSection title="General">
        {text("hotelName", "Hotel name", {
          required: true,
          maxLength: 100,
          className: "sm:col-span-2",
        })}
        {text("tagline", "Tagline", { maxLength: 160, className: "sm:col-span-2" })}
        <TextAreaField
          id="settings-description"
          label="Short description (shown to search engines)"
          rows={3}
          maxLength={500}
          className="sm:col-span-2"
          value={form.description}
          onChange={(e) => setField("description", e.target.value)}
        />
                <SelectField
          id="settings-currency"
          label="Currency for prices"
          options={CURRENCY_OPTIONS}
          value={form.currency}
          onChange={(e) => setField("currency", e.target.value)}
        />
      </FormSection>

      <FormSection title="Contact details">
        {text("address", "Address", { className: "sm:col-span-2" })}
        {text("phone", "Phone", { type: "tel" })}
        {text("email", "Email", { type: "email" })}
      </FormSection>

      <FormSection title="Social links" description="Leave a field empty to hide that icon.">
        {text("facebookUrl", "Facebook", { type: "url", placeholder: "https://facebook.com/..." })}
        {text("instagramUrl", "Instagram", { type: "url", placeholder: "https://instagram.com/..." })}
        {text("tiktokUrl", "TikTok", { type: "url", placeholder: "https://tiktok.com/@..." })}
        {text("youtubeUrl", "YouTube", { type: "url", placeholder: "https://youtube.com/..." })}
        {text("whatsappUrl", "WhatsApp", { type: "url", placeholder: "https://wa.me/..." })}
      </FormSection>

      <FormSection
        title="Location"
        description="In Google Maps: search your hotel, click Share, choose 'Embed a map', copy the HTML, and paste it here."
      >
        <TextAreaField
          id="settings-mapEmbedUrl"
          label="Google Maps embed code"
          rows={3}
          className="sm:col-span-2"
          value={form.mapEmbedUrl}
          onChange={(e) => setField("mapEmbedUrl", e.target.value)}
        />
      </FormSection>

      <FormSection title="Homepage">
        <div className="sm:col-span-2">
          <ImageListEditor
            images={form.heroImage ? [form.heroImage] : []}
            onAdd={(url) => setForm((prev) => ({ ...prev, heroImage: url }))}
            onRemove={() => setForm((prev) => ({ ...prev, heroImage: "" }))}
          />
          <p className="mt-1 text-xs text-gray-500">
            The main hotel photo at the top of the homepage. Uploading a new one replaces it.
          </p>
        </div>
        <div className="sm:col-span-2">
          <BannerMessagesEditor
            messages={form.bannerMessages}
            onChange={(bannerMessages) =>
              setForm((prev) => ({ ...prev, bannerMessages }))
            }
          />
        </div>
      </FormSection>

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