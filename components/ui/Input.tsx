"use client";

import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="form-field">
      {label && <label htmlFor={inputId} className="form-label">{label}</label>}
      <input
        id={inputId}
        className={cn("form-input", error && "form-input-error", className)}
        {...props}
      />
      {error && <span className="form-error">{error}</span>}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className, id, ...props }: TextareaProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="form-field">
      {label && <label htmlFor={inputId} className="form-label">{label}</label>}
      <textarea
        id={inputId}
        className={cn("form-input form-textarea", error && "form-input-error", className)}
        {...props}
      />
      {error && <span className="form-error">{error}</span>}
    </div>
  );
}
