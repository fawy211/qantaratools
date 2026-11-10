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
      speaker: 'Speaker', message: 'Message', text: 'Text',
      aiTitle: "Chat to Office File Converter",
      aiIntro: "Convert an AI conversation, text file, or Word document into a clean Word, Excel, or PDF file. Everything is processed on your device.",
      aiFileName: "File name",
      aiOpenFile: "Open a text or Word file",
      aiExample: "Load example",
      aiClear: "Clear",
      aiPlaceholder: "Paste your AI conversation or any text here…",
      aiCharacters: "characters",
      aiCharacter: "character",
      aiReady: "Ready",
      aiMessagesDetected: "messages detected",
      aiReadyConvert: "Ready to convert",
      aiWaiting: "Waiting for text",
      aiExampleLoaded: "Example loaded",
      aiWordLoaded: "Word document loaded locally",
      aiTextLoaded: "Text loaded locally",
      aiFileError: "Could not open the selected file",
      aiFileErrorDetail: "The selected file could not be opened locally.",
      aiPasteFirst: "Please paste or open some text first.",
      aiWordDownload: "Download Word file",
      aiExcelDownload: "Download Excel file",
      aiCreatePdf: "Create PDF file",
      aiWordCreated: "Word file created locally",
      aiExcelCreated: "Excel file created locally",
      aiPdfOpened: "PDF print view opened locally — choose Save as PDF",
      aiPopup: "Please allow pop-ups for the PDF preview.",
      aiHow: "How it works:",
      aiWordExplain: "Word keeps each speaker and message easy to read.",
      aiExcelExplain: "Excel creates a readable Speaker / Message table for conversations, with wrapped text, filters, and a frozen header. For CSV-style text, it keeps the rows and columns.",
      aiPdfExplain: "PDF opens a clean print view so you can choose Save as PDF.",
      aiPrivacy: "Your text is not uploaded.",
      aiSpeaker: "Speaker",
      aiMessage: "Message",
      aiText: "Text",
      aiCreatedLocally: "Created locally on your device",
      aiUser: "User",
      aiAssistant: "Assistant"
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
      speaker: 'المتحدث', message: 'الرسالة', text: 'النص',
      aiTitle: "تحويل المحادثات والمحتوى إلى ملفات Office",
      aiIntro: "حوّل محادثة ذكاء اصطناعي أو ملفًا نصيًا أو مستند Word إلى ملف Word أو Excel أو PDF منسق. تتم المعالجة بالكامل على جهازك.",
      aiFileName: "اسم الملف",
      aiOpenFile: "فتح ملف نصي أو Word",
      aiExample: "تحميل مثال",
      aiClear: "مسح",
      aiPlaceholder: "الصق محادثة الذكاء الاصطناعي أو أي نص هنا…",
      aiCharacters: "حرفًا",
      aiCharacter: "حرف",
      aiReady: "جاهز",
      aiMessagesDetected: "رسائل تم اكتشافها",
      aiReadyConvert: "جاهز للتحويل",
      aiWaiting: "في انتظار النص",
      aiExampleLoaded: "تم تحميل المثال",
      aiWordLoaded: "تم فتح مستند Word محليًا",
      aiTextLoaded: "تم فتح النص محليًا",
      aiFileError: "تعذر فتح الملف المحدد",
      aiFileErrorDetail: "تعذر فتح الملف المحدد على جهازك.",
      aiPasteFirst: "يرجى لصق نص أو فتح ملف أولًا.",
      aiWordDownload: "تنزيل ملف Word",
      aiExcelDownload: "تنزيل ملف Excel",
      aiCreatePdf: "إنشاء ملف PDF",
      aiWordCreated: "تم إنشاء ملف Word على جهازك",
      aiExcelCreated: "تم إنشاء ملف Excel على جهازك",
      aiPdfOpened: "تم فتح معاينة الطباعة محليًا — اختر حفظ بتنسيق PDF",
      aiPopup: "يرجى السماح بالنوافذ المنبثقة لمعاينة PDF.",
      aiHow: "طريقة العمل:",
      aiWordExplain: "يعرض Word أسماء المتحدثين والرسائل بشكل واضح.",
      aiExcelExplain: "ينشئ Excel جدولًا واضحًا بأعمدة المتحدث والرسالة، مع التفاف النص والتصفية وتثبيت صف العناوين. ويحافظ على صفوف وأعمدة النصوص بصيغة CSV.",
      aiPdfExplain: "يفتح PDF معاينة طباعة منسقة لتتمكن من اختيار الحفظ بصيغة PDF.",
      aiPrivacy: "لا يتم رفع نصك إلى الإنترنت.",
      aiSpeaker: "المتحدث",
      aiMessage: "الرسالة",
      aiText: "النص",
      aiCreatedLocally: "تم الإنشاء محليًا على جهازك",
      aiUser: "المستخدم",
      aiAssistant: "المساعد"
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
      speaker: 'Sprecher', message: 'Nachricht', text: 'Text',
      aiTitle: "Chat- und Text-zu-Office-Konverter",
      aiIntro: "Wandle einen KI-Chat, eine Textdatei oder ein Word-Dokument in eine übersichtliche Word-, Excel- oder PDF-Datei um. Die Verarbeitung erfolgt vollständig auf deinem Gerät.",
      aiFileName: "Dateiname",
      aiOpenFile: "Text- oder Word-Datei öffnen",
      aiExample: "Beispiel laden",
      aiClear: "Leeren",
      aiPlaceholder: "Füge hier deinen KI-Chat oder einen beliebigen Text ein…",
      aiCharacters: "Zeichen",
      aiCharacter: "Zeichen",
      aiReady: "Bereit",
      aiMessagesDetected: "Nachrichten erkannt",
      aiReadyConvert: "Bereit zum Umwandeln",
      aiWaiting: "Warte auf Text",
      aiExampleLoaded: "Beispiel geladen",
      aiWordLoaded: "Word-Dokument lokal geöffnet",
      aiTextLoaded: "Text lokal geöffnet",
      aiFileError: "Die ausgewählte Datei konnte nicht geöffnet werden",
      aiFileErrorDetail: "Die ausgewählte Datei konnte lokal nicht geöffnet werden.",
      aiPasteFirst: "Bitte füge zuerst Text ein oder öffne eine Datei.",
      aiWordDownload: "Word-Datei herunterladen",
      aiExcelDownload: "Excel-Datei herunterladen",
      aiCreatePdf: "PDF-Datei erstellen",
      aiWordCreated: "Word-Datei lokal erstellt",
      aiExcelCreated: "Excel-Datei lokal erstellt",
      aiPdfOpened: "PDF-Druckansicht lokal geöffnet – „Als PDF speichern“ wählen",
      aiPopup: "Bitte erlaube Pop-ups für die PDF-Vorschau.",
      aiHow: "So funktioniert es:",
      aiWordExplain: "Word stellt Sprecher und Nachrichten übersichtlich dar.",
      aiExcelExplain: "Excel erstellt für Chats eine übersichtliche Sprecher-/Nachrichten-Tabelle mit Textumbruch, Filtern und fixierter Kopfzeile. CSV-ähnliche Texte behalten ihre Zeilen und Spalten.",
      aiPdfExplain: "PDF öffnet eine übersichtliche Druckansicht, in der du „Als PDF speichern“ wählen kannst.",
      aiPrivacy: "Dein Text wird nicht hochgeladen.",
      aiSpeaker: "Sprecher",
      aiMessage: "Nachricht",
      aiText: "Text",
      aiCreatedLocally: "Lokal auf deinem Gerät erstellt",
      aiUser: "Nutzer",
      aiAssistant: "Assistent"
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
      speaker: 'Intervenant', message: 'Message', text: 'Texte',
      aiTitle: "Convertisseur de conversations et textes vers Office",
      aiIntro: "Convertissez une conversation avec une IA, un fichier texte ou un document Word en fichier Word, Excel ou PDF bien présenté. Tout est traité sur votre appareil.",
      aiFileName: "Nom du fichier",
      aiOpenFile: "Ouvrir un fichier texte ou Word",
      aiExample: "Charger un exemple",
      aiClear: "Effacer",
      aiPlaceholder: "Collez votre conversation avec une IA ou un texte ici…",
      aiCharacters: "caractères",
      aiCharacter: "caractère",
      aiReady: "Prêt",
      aiMessagesDetected: "messages détectés",
      aiReadyConvert: "Prêt à convertir",
      aiWaiting: "En attente de texte",
      aiExampleLoaded: "Exemple chargé",
      aiWordLoaded: "Document Word ouvert localement",
      aiTextLoaded: "Texte ouvert localement",
      aiFileError: "Impossible d’ouvrir le fichier sélectionné",
      aiFileErrorDetail: "Le fichier sélectionné n’a pas pu être ouvert localement.",
      aiPasteFirst: "Veuillez d’abord coller du texte ou ouvrir un fichier.",
      aiWordDownload: "Télécharger le fichier Word",
      aiExcelDownload: "Télécharger le fichier Excel",
      aiCreatePdf: "Créer un fichier PDF",
      aiWordCreated: "Fichier Word créé localement",
      aiExcelCreated: "Fichier Excel créé localement",
      aiPdfOpened: "Aperçu avant impression ouvert localement — choisissez Enregistrer au format PDF",
      aiPopup: "Veuillez autoriser les fenêtres pop-up pour l’aperçu PDF.",
      aiHow: "Fonctionnement :",
      aiWordExplain: "Word présente clairement chaque intervenant et son message.",
      aiExcelExplain: "Excel crée un tableau Intervenant / Message lisible pour les conversations, avec renvoi à la ligne, filtres et en-tête figé. Les textes de type CSV conservent leurs lignes et colonnes.",
      aiPdfExplain: "PDF ouvre un aperçu d’impression clair pour vous permettre de choisir Enregistrer au format PDF.",
      aiPrivacy: "Votre texte n’est pas envoyé en ligne.",
      aiSpeaker: "Intervenant",
      aiMessage: "Message",
      aiText: "Texte",
      aiCreatedLocally: "Créé localement sur votre appareil",
      aiUser: "Utilisateur",
      aiAssistant: "Assistant"
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
