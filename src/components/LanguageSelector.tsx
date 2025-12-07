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
    <div className="fixed top-4 right-4 z-50 flex gap-2">
      {languages.map((lang) => (
        <motion.button
          key={lang.code}
          onClick={() => handleLanguageChange(lang.code)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`
            w-10 h-10 rounded-full flex items-center justify-center text-xl
            transition-all duration-200 shadow-md
            ${currentLang === lang.code 
              ? 'ring-2 ring-primary ring-offset-2 bg-white' 
              : 'bg-white/80 hover:bg-white opacity-70 hover:opacity-100'
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
