"use client";

const MAX_MESSAGES = 10;

interface Props {
  messages: string[];
  onChange: (messages: string[]) => void;
}

export default function BannerMessagesEditor({ messages, onChange }: Props) {
  const update = (index: number, value: string) =>
    onChange(messages.map((m, i) => (i === index ? value : m)));

  return (
    <div>
      <p className="mb-1 block text-sm font-medium text-gray-700">
        Banner messages
      </p>
      <p className="mb-2 text-xs text-gray-500">
        Short messages that rotate in the banner under the hero image.
      </p>

      <ul className="space-y-2">
        {messages.map((message, i) => (
          <li key={i} className="flex gap-2">
            <input
              aria-label={`Banner message ${i + 1}`}
              maxLength={200}
              value={message}
              onChange={(e) => update(i, e.target.value)}
              className="w-full rounded border border-gray-300 p-2"
            />
            <button
              type="button"
              onClick={() => onChange(messages.filter((_, idx) => idx !== i))}
              className="text-sm text-red-600 hover:underline"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      {messages.length < MAX_MESSAGES && (
        <button
          type="button"
          onClick={() => onChange([...messages, ""])}
          className="mt-2 text-sm text-blue-600 hover:underline"
        >
          Add message
        </button>
      )}
    </div>
  );
}