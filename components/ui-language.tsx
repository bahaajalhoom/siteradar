"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { arabic } from '@/lib/ui-dictionary';

type Language = 'en' | 'ar';
const storageKey = 'siteradar-ui-language';
const LanguageContext = createContext<{ language: Language; setLanguage: (language: Language) => void }>({
  language: 'en', setLanguage: () => {},
});

export function UiLanguageProvider({ children }: { children: ReactNode }) {
  const [language, updateLanguage] = useState<Language>('en');
  useEffect(() => {
    try { if (localStorage.getItem(storageKey) === 'ar') updateLanguage('ar'); } catch { /* Storage is optional. */ }
  }, []);
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);
  function setLanguage(value: Language) {
    updateLanguage(value);
    try { localStorage.setItem(storageKey, value); } catch { /* Storage is optional. */ }
  }
  return <LanguageContext.Provider value={{ language, setLanguage }}>{children}</LanguageContext.Provider>;
}

export function useUiLanguage() {
  const { language, setLanguage } = useContext(LanguageContext);
  return { language, setLanguage, t: (text: string) => language === 'ar' && Object.hasOwn(arabic, text) ? arabic[text] : text };
}

export function UiText({ text }: { text: string }) {
  return useUiLanguage().t(text);
}

export function LanguageSwitch() {
  const { language, setLanguage } = useUiLanguage();
  return <button type="button" className="language-switch" lang={language === 'ar' ? 'en' : 'ar'}
    aria-label={language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
    onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}>
    {language === 'ar' ? 'English' : 'العربية'}
  </button>;
}
