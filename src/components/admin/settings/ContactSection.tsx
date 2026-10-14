import { TextField } from "@/components/admin/FormFields";
import FormSection from "./FormSection";
import type { SectionProps } from "./types";

export default function ContactSection({ form, update }: SectionProps) {
  return (
    <FormSection
      title="Contact details"
      description="WhatsApp: include the country code, for example 977 for Nepal. The number powers the 'Book now' buttons on rooms."
    >
      <TextField
        id="settings-address"
        label="Address"
        className="sm:col-span-2"
        value={form.address}
        onChange={(e) => update({ address: e.target.value })}
      />
      <TextField
        id="settings-phone"
        label="Phone"
        type="tel"
        value={form.phone}
        onChange={(e) => update({ phone: e.target.value })}
      />
      <TextField
        id="settings-email"
        label="Email"
        type="email"
        value={form.email}
        onChange={(e) => update({ email: e.target.value })}
      />
      <TextField
        id="settings-whatsappNumber"
        label="WhatsApp number"
        type="tel"
        placeholder="e.g. 9779812345678"
        value={form.whatsappNumber}
        onChange={(e) => update({ whatsappNumber: e.target.value })}
      />
    </FormSection>
  );
}