import { TextAreaField } from "@/components/admin/FormFields";
import FormSection from "./FormSection";
import type { SectionProps } from "./types";

export default function LocationSection({ form, update }: SectionProps) {
  return (
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
        onChange={(e) => update({ mapEmbedUrl: e.target.value })}
      />
    </FormSection>
  );
}