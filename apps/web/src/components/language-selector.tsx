"use client";

import { useState } from "react";

/**
 * Supported languages for multilingual fan assistance.
 *
 * FIFA World Cup 2026 venues serve fans from every continent.
 * This selector provides real-time language context for the AI
 * copilot and venue navigation systems to generate responses
 * and signage guidance in the fan's preferred language.
 */
const LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "ar", label: "العربية", flag: "🇸🇦", dir: "rtl" as const },
  { code: "pt", label: "Português", flag: "🇧🇷" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
] as const;

interface LanguageSelectorProps {
  /** Callback invoked when the user selects a language. */
  onLanguageChange?: (code: string) => void;
}

/**
 * Compact language selector for multilingual stadium assistance.
 *
 * Renders as an accessible `<select>` element with flag + label
 * options. The selected language code is emitted to parent components
 * and can be forwarded to the AI copilot for multilingual responses.
 *
 * Accessibility: uses a native `<select>` for full keyboard and
 * screen reader compatibility across all platforms.
 */
export function LanguageSelector({ onLanguageChange }: LanguageSelectorProps) {
  const [language, setLanguage] = useState("en");

  function handleChange(code: string) {
    setLanguage(code);
    onLanguageChange?.(code);
  }

  return (
    <div className="language-selector">
      <label htmlFor="lang-select" className="sr-only">
        Select language
      </label>
      <select
        id="lang-select"
        value={language}
        onChange={(e) => handleChange(e.target.value)}
        aria-label="Select venue language"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
}
