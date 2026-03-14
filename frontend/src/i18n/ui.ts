export const languages = {
  ar: "العربية",
  en: "English",
  es: "Español",
  tr: "Türkçe",
};

export const localeFlags = [
  { code: "ar", flag: "🇸🇦" },
  { code: "es", flag: "🇪🇸" },
  { code: "en", flag: "🇺🇸" },
  { code: "tr", flag: "🇹🇷" },
] as const;

export const defaultLang = "es";

export const ui = {
  en: {
    "language-picker.label": "Select language",
    "header.donate-now": "Donate",
    "footer.contact": "Contact",
    "footer.quick-links": "Quick Links",
    "footer.newsletter": "Newsletter",
    "footer.newsletter-description":
      "Subscribe to our newsletter to get the latest updates.",
    "footer.email-placeholder": "Enter your email",
    "footer.subscribe": "Subscribe",
    "theme-switcher.light-label": "Use system theme",
    "theme-switcher.system-label": "Switch to dark theme",
    "theme-switcher.dark-label": "Switch to light theme",
  },
  es: {
    "language-picker.label": "Seleccionar idioma",
    "header.donate-now": "Donar",
    "footer.contact": "Contacto",
    "footer.quick-links": "Enlaces rápidos",
    "footer.newsletter": "Boletín",
    "footer.newsletter-description":
      "Suscríbete a nuestro boletín para recibir las últimas actualizaciones.",
    "footer.email-placeholder": "Ingresa tu correo",
    "footer.subscribe": "Suscribirse",
    "theme-switcher.light-label": "Usar tema del sistema",
    "theme-switcher.system-label": "Cambiar a tema oscuro",
    "theme-switcher.dark-label": "Cambiar a tema claro",
  },
  tr: {
    "language-picker.label": "Dil seç",
    "header.donate-now": "Bağış yap",
    "footer.contact": "İletişim",
    "footer.quick-links": "Hızlı Bağlantılar",
    "footer.newsletter": "Bülten",
    "footer.newsletter-description":
      "En son güncellemeleri almak için bültenimize abone olun.",
    "footer.email-placeholder": "E-postanızı girin",
    "footer.subscribe": "Abone ol",
    "theme-switcher.light-label": "Sistem temasını kullan",
    "theme-switcher.system-label": "Koyu temaya geç",
    "theme-switcher.dark-label": "Açık temaya geç",
  },
  ar: {
    "language-picker.label": "اختر اللغة",
    "header.donate-now": "تبرع",
    "footer.contact": "اتصل بنا",
    "footer.quick-links": "روابط سريعة",
    "footer.newsletter": "النشرة البريدية",
    "footer.newsletter-description":
      "اشترك في نشرتنا البريدية للحصول على آخر التحديثات.",
    "footer.email-placeholder": "أدخل بريدك الإلكتروني",
    "footer.subscribe": "اشترك",
    "theme-switcher.light-label": "استخدم سمة النظام",
    "theme-switcher.system-label": "بدّل إلى الوضع الداكن",
    "theme-switcher.dark-label": "بدّل إلى الوضع الفاتح",
  },
} as const;
