import { getSiteSettings } from "@/lib/settings";
import SettingsForm from "@/components/admin/settings/SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();
  return <SettingsForm settings={settings} />;
}