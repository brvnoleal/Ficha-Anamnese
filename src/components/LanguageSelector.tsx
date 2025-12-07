import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const languages = [
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' }
];

export const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language?.split('-')[0] || 'pt';

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex gap-1.5">
      {languages.map((lang) => (
        <motion.button
          key={lang.code}
          onClick={() => handleLanguageChange(lang.code)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`
            w-5 h-5 rounded-full flex items-center justify-center text-xs
            transition-all duration-200 shadow-sm
            ${currentLang === lang.code 
              ? 'opacity-100 ring-1 ring-primary ring-offset-1 bg-white' 
              : 'opacity-40 bg-white/80 hover:opacity-70'
            }
          `}
          title={lang.name}
          aria-label={`Mudar para ${lang.name}`}
        >
          {lang.flag}
        </motion.button>
      ))}
    </div>
  );
};
