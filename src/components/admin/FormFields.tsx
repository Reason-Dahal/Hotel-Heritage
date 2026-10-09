import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

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