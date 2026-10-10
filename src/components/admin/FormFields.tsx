import type { InputHTMLAttributes, TextareaHTMLAttributes , SelectHTMLAttributes} from "react";

const labelClass = "mb-1 block text-sm font-medium text-gray-700";
const inputClass = "w-full rounded border border-gray-300 p-2";

type TextFieldProps = { label: string; id: string } & InputHTMLAttributes<HTMLInputElement>;

export function TextField({ label, id, className = "", ...props }: TextFieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className={labelClass}>{label}</label>
      <input id={id} className={inputClass} {...props} />
    </div>
  );
}

type TextAreaFieldProps = { label: string; id: string } & TextareaHTMLAttributes<HTMLTextAreaElement>;

export function TextAreaField({ label, id, className = "", ...props }: TextAreaFieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className={labelClass}>{label}</label>
      <textarea id={id} className={inputClass} {...props} />
    </div>
  );
}

type CheckboxFieldProps = {
  label: string;
  id: string;
  hint?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export function CheckboxField({
  label,
  id,
  hint,
  className = "",
  ...props
}: CheckboxFieldProps) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="flex items-center gap-2 text-sm font-medium text-gray-700"
      >
        <input id={id} type="checkbox" className="h-4 w-4" {...props} />
        {label}
      </label>
      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
    </div>
  );
}

type SelectFieldProps = {
  label: string;
  id: string;
  options: { value: string; label: string }[];
} & SelectHTMLAttributes<HTMLSelectElement>;

export function SelectField({ label, id, options, className = "", ...props }: SelectFieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className={labelClass}>{label}</label>
      <select id={id} className={inputClass} {...props}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}