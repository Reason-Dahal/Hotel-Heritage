import { TextField } from "@/components/admin/FormFields";
import FormSection from "./FormSection";
import type { SectionProps } from "./types";

export default function SocialSection({ form, update }: SectionProps) {
  return (
    <FormSection
      title="Social links"
      description="Leave a field empty to hide that link."
    >
      <TextField
        id="settings-facebookUrl"
        label="Facebook"
        type="url"
        placeholder="https://facebook.com/..."
        value={form.facebookUrl}
        onChange={(e) => update({ facebookUrl: e.target.value })}
      />
      <TextField
        id="settings-instagramUrl"
        label="Instagram"
        type="url"
        placeholder="https://instagram.com/..."
        value={form.instagramUrl}
        onChange={(e) => update({ instagramUrl: e.target.value })}
      />
      <TextField
        id="settings-tiktokUrl"
        label="TikTok"
        type="url"
        placeholder="https://tiktok.com/@..."
        value={form.tiktokUrl}
        onChange={(e) => update({ tiktokUrl: e.target.value })}
      />
      <TextField
        id="settings-youtubeUrl"
        label="YouTube"
        type="url"
        placeholder="https://youtube.com/..."
        value={form.youtubeUrl}
        onChange={(e) => update({ youtubeUrl: e.target.value })}
      />
    </FormSection>
  );
}