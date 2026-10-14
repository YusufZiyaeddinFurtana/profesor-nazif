import { useState } from "react";
import { useLocale } from "../../../i18n/LocaleProvider";
export function PasswordField({
  value,
  onChange,
  confirmation = false,
  newPassword = false,
  disabled = false,
}: {
  value: string;
  onChange: (value: string) => void;
  confirmation?: boolean;
  newPassword?: boolean;
  disabled?: boolean;
}) {
  const { t } = useLocale();
  const [visible, setVisible] = useState(false);
  return (
    <label className="auth-field">
      {t(confirmation ? "authConfirmPassword" : "authPassword")}
      <span className="password-field">
        <input
          name={confirmation ? "confirmPassword" : "password"}
          type={visible ? "text" : "password"}
          autoComplete={newPassword ? "new-password" : "current-password"}
          required
          minLength={newPassword ? 8 : 1}
          maxLength={128}
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
        />
        <button
          type="button"
          className="password-visibility"
          aria-label={t(visible ? "authHidePassword" : "authShowPassword")}
          aria-pressed={visible}
          disabled={disabled}
          onClick={() => setVisible((v) => !v)}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            aria-hidden="true"
          >
            <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" />
            <circle cx="12" cy="12" r="3" />
            {visible && <path d="M3 3l18 18" />}
          </svg>
        </button>
      </span>
    </label>
  );
}
