import {
    TextField,
    TextAreaField,
    SelectField,
  } from "@/components/admin/FormFields";
  import { CURRENCY_OPTIONS } from "@/types/settings";
  import FormSection from "./FormSection";
  import type { SectionProps } from "./types";
  
  export default function GeneralSection({ form, update }: SectionProps) {
    return (
      <FormSection
        title="General"
        description="The tagline appears in the browser tab title and the footer."
      >
        <TextField
          id="settings-hotelName"
          label="Hotel name"
          required
          maxLength={100}
          className="sm:col-span-2"
          value={form.hotelName}
          onChange={(e) => update({ hotelName: e.target.value })}
        />
        <TextField
          id="settings-tagline"
          label="Tagline"
          maxLength={160}
          className="sm:col-span-2"
          value={form.tagline}
          onChange={(e) => update({ tagline: e.target.value })}
        />
        <TextAreaField
          id="settings-description"
          label="Short description (shown to search engines)"
          rows={3}
          maxLength={500}
          className="sm:col-span-2"
          value={form.description}
          onChange={(e) => update({ description: e.target.value })}
        />
        <SelectField
          id="settings-currency"
          label="Currency for prices"
          options={CURRENCY_OPTIONS}
          value={form.currency}
          onChange={(e) => update({ currency: e.target.value })}
        />
      </FormSection>
    );
  }