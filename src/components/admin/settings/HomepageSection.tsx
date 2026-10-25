import { TextField } from "@/components/admin/FormFields";
import ImageListEditor from "@/components/admin/ImageListEditor";
import FormSection from "./FormSection";
import MessageListEditor from "./MessageListEditor";
import type { SectionProps } from "./types";

export default function HomepageSection({ form, update }: SectionProps) {
  return (
    <FormSection title="Homepage">
      <div className="sm:col-span-2">
        <ImageListEditor
          images={form.heroImage ? [form.heroImage] : []}
          onAdd={(url) => update({ heroImage: url })}
          onRemove={() => update({ heroImage: "" })}
        />
        <p className="mt-1 text-xs text-gray-500">
          The main hotel photo at the top of the homepage. Uploading a new one replaces it.
        </p>
      </div>
      <TextField
        id="settings-heroImageAlt"
        label="Main photo description (for search engines and screen readers)"
        maxLength={160}
        placeholder="e.g. Front view of the hotel at sunset"
        className="sm:col-span-2"
        value={form.heroImageAlt}
        onChange={(e) => update({ heroImageAlt: e.target.value })}
      />
      <TextField
        id="settings-heroSubtitle"
        label="Text on the main photo"
        maxLength={160}
        className="sm:col-span-2"
        value={form.heroSubtitle}
        onChange={(e) => update({ heroSubtitle: e.target.value })}
      />
      <div className="sm:col-span-2">
        <MessageListEditor
          label="Banner message"
          hint="Short messages that rotate in the banner under the main photo."
          addLabel="Add banner message"
          messages={form.bannerMessages}
          onChange={(bannerMessages) => update({ bannerMessages })}
        />
      </div>
    </FormSection>
  );
}