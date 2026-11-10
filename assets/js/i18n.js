/* QantaraTools localization foundation.
 * The language selector stays unpublished until every page and tool is translated and reviewed.
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'qantaratools_language_v1';
  const LOCALES = {
    en: { intl: 'en-US', dir: 'ltr', name: 'English' },
    ar: { intl: 'ar-EG', dir: 'rtl', name: 'العربية' },
    de: { intl: 'de-DE', dir: 'ltr', name: 'Deutsch' },
    fr: { intl: 'fr-FR', dir: 'ltr', name: 'Français' },
    es: { intl: 'es-ES', dir: 'ltr', name: 'Español' }
  };

  const MESSAGES = {
    en: {
      loading: 'Loading tool…', loadError: 'Could not load this tool',
      technicalDetails: 'Open the browser console (F12) if you need the technical details.',
      notRegistered: 'This tool is not available yet.', recentEmpty: 'Your recently used tools will appear here.',
      favoriteEmpty: 'Star a tool to keep it here.', clear: 'Clear', calculate: 'Calculate',
      download: 'Download', process: 'Process', chooseFile: 'Choose a file',
      enterValidAmount: 'Please enter a valid amount.', copy: 'Copy', copied: 'Copied',
      ready: 'Ready', error: 'Something went wrong. Please try again.',
      words: 'Words', characters: 'Characters', sentences: 'Sentences', paragraphs: 'Paragraphs',
      readingTime: 'Reading time', seconds: 'sec', minutes: 'min',
      speaker: 'Speaker', message: 'Message', text: 'Text'
    },
    ar: {
      loading: 'جارٍ تحميل الأداة…', loadError: 'تعذر تحميل هذه الأداة',
      technicalDetails: 'افتح وحدة تحكم المتصفح (F12) إذا احتجت إلى التفاصيل التقنية.',
      notRegistered: 'هذه الأداة غير متاحة حاليًا.', recentEmpty: 'ستظهر هنا الأدوات التي استخدمتها مؤخرًا.',
      favoriteEmpty: 'أضف نجمة إلى الأداة للاحتفاظ بها هنا.', clear: 'مسح', calculate: 'احسب',
      download: 'تنزيل', process: 'معالجة', chooseFile: 'اختر ملفًا',
      enterValidAmount: 'يرجى إدخال مبلغ صحيح.', copy: 'نسخ', copied: 'تم النسخ',
      ready: 'جاهز', error: 'حدث خطأ. يرجى المحاولة مرة أخرى.',
      words: 'الكلمات', characters: 'الأحرف', sentences: 'الجمل', paragraphs: 'الفقرات',
      readingTime: 'وقت القراءة', seconds: 'ثانية', minutes: 'دقيقة',
      speaker: 'المتحدث', message: 'الرسالة', text: 'النص'
    },
    de: {
      loading: 'Tool wird geladen…', loadError: 'Dieses Tool konnte nicht geladen werden',
      technicalDetails: 'Öffnen Sie bei Bedarf die Browserkonsole (F12), um technische Details zu sehen.',
      notRegistered: 'Dieses Tool ist derzeit nicht verfügbar.', recentEmpty: 'Hier erscheinen Ihre zuletzt verwendeten Tools.',
      favoriteEmpty: 'Markieren Sie ein Tool mit einem Stern, um es hier zu speichern.', clear: 'Leeren', calculate: 'Berechnen',
      download: 'Herunterladen', process: 'Verarbeiten', chooseFile: 'Datei auswählen',
      enterValidAmount: 'Bitte geben Sie einen gültigen Betrag ein.', copy: 'Kopieren', copied: 'Kopiert',
      ready: 'Bereit', error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
      words: 'Wörter', characters: 'Zeichen', sentences: 'Sätze', paragraphs: 'Absätze',
      readingTime: 'Lesezeit', seconds: 'Sek.', minutes: 'Min.',
      speaker: 'Sprecher', message: 'Nachricht', text: 'Text'
    },
    fr: {
      loading: 'Chargement de l’outil…', loadError: 'Impossible de charger cet outil',
      technicalDetails: 'Ouvrez la console du navigateur (F12) pour afficher les détails techniques.',
      notRegistered: 'Cet outil n’est pas disponible pour le moment.', recentEmpty: 'Vos outils récemment utilisés apparaîtront ici.',
      favoriteEmpty: 'Ajoutez une étoile à un outil pour le retrouver ici.', clear: 'Effacer', calculate: 'Calculer',
      download: 'Télécharger', process: 'Traiter', chooseFile: 'Choisir un fichier',
      enterValidAmount: 'Veuillez saisir un montant valide.', copy: 'Copier', copied: 'Copié',
      ready: 'Prêt', error: 'Une erreur s’est produite. Veuillez réessayer.',
      words: 'Mots', characters: 'Caractères', sentences: 'Phrases', paragraphs: 'Paragraphes',
      readingTime: 'Temps de lecture', seconds: 's', minutes: 'min',
      speaker: 'Intervenant', message: 'Message', text: 'Texte'
    },
    es: {
      loading: 'Cargando herramienta…', loadError: 'No se pudo cargar esta herramienta',
      technicalDetails: 'Abre la consola del navegador (F12) si necesitas consultar los detalles técnicos.',
      notRegistered: 'Esta herramienta no está disponible por ahora.', recentEmpty: 'Aquí aparecerán las herramientas que has usado recientemente.',
      favoriteEmpty: 'Añade una estrella a una herramienta para guardarla aquí.', clear: 'Borrar', calculate: 'Calcular',
      download: 'Descargar', process: 'Procesar', chooseFile: 'Elegir archivo',
      enterValidAmount: 'Introduce una cantidad válida.', copy: 'Copiar', copied: 'Copiado',
      ready: 'Listo', error: 'Se ha producido un error. Inténtalo de nuevo.',
      words: 'Palabras', characters: 'Caracteres', sentences: 'Oraciones', paragraphs: 'Párrafos',
      readingTime: 'Tiempo de lectura', seconds: 's', minutes: 'min',
      speaker: 'Interlocutor', message: 'Mensaje', text: 'Texto'
    }
  };

  function localeFromPath() {
    const first = location.pathname.split('/').filter(Boolean)[0];
    return Object.prototype.hasOwnProperty.call(LOCALES, first) ? first : null;
  }

  function storedLocale() {
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      return Object.prototype.hasOwnProperty.call(LOCALES, value) ? value : 'en';
    } catch (_) { return 'en'; }
  }

  let current = localeFromPath() || storedLocale();

  function applyDocumentLocale() {
    document.documentElement.lang = current;
    document.documentElement.dir = LOCALES[current].dir;
    document.documentElement.dataset.locale = current;
  }

  function setLocale(locale) {
    if (!Object.prototype.hasOwnProperty.call(LOCALES, locale)) return false;
    current = locale;
    try { localStorage.setItem(STORAGE_KEY, locale); } catch (_) {}
    applyDocumentLocale();
    return true;
  }

  function t(key, fallback) {
    return (MESSAGES[current] && MESSAGES[current][key]) ||
      MESSAGES.en[key] || fallback || key;
  }

  function formatNumber(value, options) {
    return new Intl.NumberFormat(LOCALES[current].intl, options).format(value);
  }

  function formatDate(value, options) {
    return new Intl.DateTimeFormat(LOCALES[current].intl, options).format(value instanceof Date ? value : new Date(value));
  }

  function formatCurrency(value, currency, options) {
    return new Intl.NumberFormat(LOCALES[current].intl, {
      style: 'currency', currency: currency || 'USD', ...options
    }).format(value);
  }

  applyDocumentLocale();

  window.QTI18n = Object.freeze({
    locales: LOCALES,
    get locale() { return current; },
    get direction() { return LOCALES[current].dir; },
    t, setLocale, formatNumber, formatDate, formatCurrency
  });
})();
