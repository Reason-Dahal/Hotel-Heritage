import type { SiteSettingsDTO } from "@/types/settings";

export interface SectionProps {
  form: SiteSettingsDTO;
  update: (patch: Partial<SiteSettingsDTO>) => void;
}