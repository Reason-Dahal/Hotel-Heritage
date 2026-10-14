import FormSection from "./FormSection";
import MessageListEditor from "./MessageListEditor";
import type { SectionProps } from "./types";

export default function TickerSection({ form, update }: SectionProps) {
  return (
    <FormSection
      title="Header ticker"
      description="Moving messages shown under the hotel name on every page. Leave empty to hide the ticker."
    >
      <div className="sm:col-span-2">
        <MessageListEditor
          label="Ticker message"
          addLabel="Add ticker message"
          messages={form.tickerMessages}
          onChange={(tickerMessages) => update({ tickerMessages })}
        />
      </div>
    </FormSection>
  );
}