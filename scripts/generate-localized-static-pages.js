#!/usr/bin/env node
'use strict';
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const site='https://www.qantaratools.com';
const locales=['de','fr','es','ru','tr','hi','zh-CN'];
const pages=['about-us.html','contact.html','faq.html','privacy.html','terms.html'];
const legalTranslations=require('./legal-page-translations.js');
const dict={
de:{
'Skip to main content':'Zum Hauptinhalt springen','Home':'Startseite','About Us':'Über uns','About':'Über uns','FAQ':'FAQ','Contact':'Kontakt','Privacy':'Datenschutz','Terms':'Nutzungsbedingungen',
'About QantaraTools':'Über QantaraTools','Useful tools.<br>Less busywork.':'Nützliche Tools.<br>Weniger Aufwand.','QantaraTools is a free collection of practical utilities for developers, creators, and anyone who wants to get everyday digital work done a little faster.':'QantaraTools ist eine kostenlose Sammlung praktischer Werkzeuge für Entwickler, Kreative und alle, die alltägliche digitale Aufgaben schneller erledigen möchten.',
'Our mission':'Unsere Mission','Make common tasks simple: clean up text and data, convert formats, inspect files, and solve small workflow problems without installing another app or creating an account.':'Wir machen alltägliche Aufgaben einfacher: Texte und Daten bereinigen, Formate konvertieren, Dateien prüfen und kleine Arbeitsabläufe lösen – ohne eine weitere App zu installieren oder ein Konto anzulegen.',
'Built for quick wins':'Für schnelle Ergebnisse entwickelt','Open a tool, do the task, and get back to your work. The toolkit is free to use and designed to stay clear, approachable, and useful across devices.':'Öffnen Sie ein Tool, erledigen Sie Ihre Aufgabe und machen Sie weiter. Die Werkzeugsammlung ist kostenlos und bewusst übersichtlich, zugänglich und auf verschiedenen Geräten nutzbar.',
'Privacy, plainly stated':'Datenschutz – klar erklärt','Many tools process text and files locally in your browser, so those inputs are not intentionally uploaded by those tools. Some features do contact external services: for example, community ratings are stored in Firebase, and analytics loads only if you consent. Check the ':'Viele Tools verarbeiten Texte und Dateien lokal in Ihrem Browser; diese Eingaben werden von diesen Tools nicht absichtlich hochgeladen. Einige Funktionen kontaktieren jedoch externe Dienste: Community-Bewertungen werden beispielsweise in Firebase gespeichert, und Analysefunktionen werden nur mit Ihrer Einwilligung geladen. Lesen Sie die ','Privacy Policy':'Datenschutzerklärung',' for the full details, especially before using sensitive data with a tool that calls an external service.':' für alle Einzelheiten, insbesondere bevor Sie sensible Daten mit einem Tool verwenden, das einen externen Dienst aufruft.',
'Have an idea or spotted a problem?':'Haben Sie eine Idee oder ein Problem entdeckt?','Send it our way and help make the toolkit better.':'Schreiben Sie uns und helfen Sie, die Werkzeugsammlung zu verbessern.','Contact Us':'Kontaktieren Sie uns','Need help with a tool, found a problem, or have a suggestion? We would be happy to hear from you.':'Benötigen Sie Hilfe zu einem Tool, haben Sie ein Problem entdeckt oder einen Vorschlag? Wir freuen uns auf Ihre Nachricht.',
'QantaraTools Support':'QantaraTools-Support','For support, bug reports, feedback, and general questions, email us at:':'Bei Supportanfragen, Fehlermeldungen, Feedback und allgemeinen Fragen schreiben Sie uns bitte an:','Please include the tool name and a short description of the issue. If relevant, include your browser, operating system, and approximate file size. Do not send passwords, private keys, or confidential information.':'Nennen Sie bitte den Namen des Tools und beschreiben Sie das Problem kurz. Falls relevant, geben Sie Ihren Browser, Ihr Betriebssystem und die ungefähre Dateigröße an. Senden Sie keine Passwörter, privaten Schlüssel oder vertraulichen Informationen.',
'Tool Suggestions':'Tool-Vorschläge','Have an idea for a useful new tool? Use the “Request a New Tool” option on the QantaraTools homepage or email your suggestion to the support address.':'Haben Sie eine Idee für ein nützliches neues Tool? Nutzen Sie auf der QantaraTools-Startseite die Option „Neues Tool vorschlagen“ oder senden Sie Ihren Vorschlag per E-Mail an den Support.',
'Before You Contact Us':'Bevor Sie uns kontaktieren','Refresh the page and try the tool again.':'Aktualisieren Sie die Seite und versuchen Sie es erneut.','Use a current browser.':'Verwenden Sie einen aktuellen Browser.','For file tools, try a smaller sample file.':'Versuchen Sie bei Dateitools eine kleinere Beispieldatei.','Tell us exactly which step failed and what you expected to happen.':'Teilen Sie uns genau mit, welcher Schritt fehlgeschlagen ist und was Sie erwartet haben.',
'Back to tools':'Zurück zu den Tools','All Tools · One Place':'Alle Tools · An einem Ort',
"Frequently Asked Questions":"Häufig gestellte Fragen",
"Practical answers to common questions about using QantaraTools, handling files, troubleshooting tools, and getting support.":"Praktische Antworten auf häufige Fragen zur Nutzung von QantaraTools, zu Dateien, zur Fehlerbehebung und zum Support.",
"Getting Started":"Erste Schritte",
"What is QantaraTools?":"Was ist QantaraTools?",
"QantaraTools is a collection of free browser-based utilities for work, development, text, images, PDF tasks, security, finance, and everyday productivity.":"QantaraTools ist eine Sammlung kostenloser browserbasierter Werkzeuge für Arbeit, Entwicklung, Texte, Bilder, PDF-Aufgaben, Sicherheit, Finanzen und den Alltag.",
"Do I need to install anything?":"Muss ich etwas installieren?",
"No. The website is designed to run directly in a modern web browser. Individual tools may use browser capabilities or locally loaded files.":"Nein. Die Website läuft direkt in einem modernen Browser. Einzelne Tools können Browserfunktionen oder lokal geladene Dateien verwenden.",
"Is QantaraTools free?":"Ist QantaraTools kostenlos?",
"Yes. The web toolkit is intended to be free to use. Some tools or features may have their own limits or requirements, which are described on the relevant tool screen.":"Ja. Die Web-Werkzeugsammlung soll kostenlos nutzbar sein. Einzelne Tools oder Funktionen können eigene Einschränkungen oder Voraussetzungen haben, die auf der jeweiligen Tool-Seite beschrieben werden.",
"Which browsers are supported?":"Welche Browser werden unterstützt?",
"Use a recent version of Chrome, Edge, Firefox, or another modern browser. Keeping the browser updated helps ensure the best compatibility.":"Verwenden Sie eine aktuelle Version von Chrome, Edge, Firefox oder einem anderen modernen Browser. Ein aktueller Browser verbessert die Kompatibilität.",
"Privacy & Files":"Datenschutz und Dateien",
"Are my files uploaded to QantaraTools?":"Werden meine Dateien zu QantaraTools hochgeladen?",
"Many tools are designed to process input locally in your browser. When a tool depends on an external service or live data source, the tool interface should indicate that behavior. Do not upload highly sensitive information unless you understand the tool’s processing method.":"Viele Tools verarbeiten Eingaben lokal in Ihrem Browser. Benötigt ein Tool einen externen Dienst oder Live-Daten, sollte die Oberfläche darauf hinweisen. Laden Sie keine besonders sensiblen Informationen hoch, wenn Sie die Verarbeitungsweise nicht kennen.",
"Where are generated files saved?":"Wo werden erstellte Dateien gespeichert?",
"Files generated by browser tools are normally downloaded through your browser and saved according to your browser download settings.":"Erstellte Dateien werden normalerweise über Ihren Browser heruntergeladen und entsprechend dessen Download-Einstellungen gespeichert.",
"Why does a tool ask for a file?":"Warum benötigt ein Tool eine Datei?",
"File-based tools need browser access to the file you select so they can read, transform, or generate an output. Selecting a file does not by itself mean it is uploaded to a server.":"Dateibasierte Tools benötigen Browserzugriff auf die ausgewählte Datei, um sie zu lesen, umzuwandeln oder eine Ausgabe zu erstellen. Die Auswahl bedeutet nicht automatisch, dass die Datei auf einen Server hochgeladen wird.",
"What should I do if a large file fails?":"Was tun, wenn eine große Datei nicht verarbeitet wird?",
"Try a smaller file, close unnecessary browser tabs, refresh the page, and retry. Browser memory limits can affect large images, PDFs, or complex conversions.":"Versuchen Sie eine kleinere Datei, schließen Sie nicht benötigte Tabs, laden Sie die Seite neu und versuchen Sie es erneut. Speichergrenzen des Browsers können große Bilder, PDFs oder komplexe Konvertierungen beeinträchtigen.",
"Common Tool Problems":"Häufige Tool-Probleme",
"A generated Word, Excel, or PDF file will not open. What should I do?":"Eine erstellte Word-, Excel- oder PDF-Datei lässt sich nicht öffnen. Was kann ich tun?",
"Download the file again, make sure the download completed, and open it with a current compatible application. If the issue continues, report the tool name, browser, operating system, and a brief description of the failure through Contact Us.":"Laden Sie die Datei erneut herunter, prüfen Sie den vollständigen Download und öffnen Sie sie mit einer aktuellen kompatiblen Anwendung. Falls das Problem bleibt, melden Sie über die Kontaktseite den Tool-Namen, Browser, das Betriebssystem und eine kurze Fehlerbeschreibung.",
"A PDF tool is slow or appears frozen.":"Ein PDF-Tool ist langsam oder scheint eingefroren zu sein.",
"Large PDFs can require significant browser memory and processing time. Wait briefly, then try a smaller document. If it consistently fails, report the PDF tool name and approximate file size.":"Große PDFs benötigen möglicherweise viel Browser-Speicher und Verarbeitungszeit. Warten Sie kurz und versuchen Sie ein kleineres Dokument. Wenn der Fehler wiederholt auftritt, melden Sie den Namen des PDF-Tools und die ungefähre Dateigröße.",
"An image tool gives a poor result.":"Ein Bild-Tool liefert ein schlechtes Ergebnis.",
"Try a common image format such as PNG, JPEG, or WebP, and avoid unusually large dimensions. Some metadata or advanced image features may not be preserved during conversion.":"Verwenden Sie ein gängiges Format wie PNG, JPEG oder WebP und vermeiden Sie ungewöhnlich große Abmessungen. Einige Metadaten oder erweiterten Bildeigenschaften bleiben bei der Konvertierung möglicherweise nicht erhalten.",
"A calculator gives a result I do not expect.":"Ein Rechner liefert ein unerwartetes Ergebnis.",
"Check the units, inputs, tax rate, currency, or other assumptions. Financial and tax tools are calculators for general informational use and should not replace professional advice.":"Prüfen Sie Einheiten, Eingaben, Steuersatz, Währung und andere Annahmen. Finanz- und Steuer-Tools dienen allgemeinen Informationszwecken und ersetzen keine professionelle Beratung.",
"A developer tool shows an error.":"Ein Entwickler-Tool zeigt einen Fehler an.",
"Check that the input is valid for the selected tool. For JSON, SQL, regular expressions, JWTs, or encoded data, verify the input format and try a smaller sample.":"Prüfen Sie, ob die Eingabe für das ausgewählte Tool gültig ist. Kontrollieren Sie bei JSON, SQL, regulären Ausdrücken, JWTs oder codierten Daten das Format und versuchen Sie ein kleineres Beispiel.",
"Privacy, Security & Accuracy":"Datenschutz, Sicherheit und Genauigkeit",
"Does QantaraTools guarantee that every tool is completely offline?":"Garantiert QantaraTools, dass alle Tools vollständig offline funktionieren?",
"No blanket guarantee should be assumed. Many utilities are client-side, but some features can use external resources or live data. The Privacy Policy and the individual tool behavior are the correct references.":"Eine pauschale Garantie gibt es nicht. Viele Tools laufen clientseitig, einige Funktionen können jedoch externe Ressourcen oder Live-Daten verwenden. Maßgeblich sind die Datenschutzerklärung und das tatsächliche Verhalten des jeweiligen Tools.",
"Can I use QantaraTools for confidential information?":"Kann ich QantaraTools für vertrauliche Informationen verwenden?",
"Use appropriate caution. Do not enter passwords, private keys, confidential business data, regulated information, or other sensitive material unless you have verified that the specific tool’s processing method is appropriate for it.":"Seien Sie vorsichtig. Geben Sie keine Passwörter, privaten Schlüssel, vertraulichen Geschäftsdaten oder sonstigen sensiblen Inhalte ein, bevor Sie geprüft haben, ob die Verarbeitungsweise des jeweiligen Tools dafür geeignet ist.",
"Are financial results guaranteed to be accurate?":"Ist die Genauigkeit finanzieller Ergebnisse garantiert?",
"No. Financial, currency, VAT, loan, discount, and markup tools provide calculations for general informational purposes. Rates and assumptions can change, and you should verify important figures independently.":"Nein. Finanz-, Währungs-, Mehrwertsteuer-, Kredit-, Rabatt- und Aufschlagsrechner dienen allgemeinen Informationszwecken. Kurse und Annahmen können sich ändern; wichtige Werte sollten Sie selbst überprüfen.",
"Reporting a Problem":"Ein Problem melden",
"What information should I include when reporting a problem?":"Welche Angaben sollte ich bei einer Fehlermeldung machen?",
"Include the tool name, what you were trying to do, what happened, your browser and operating system, and—when relevant—the approximate file type and size. Avoid sending passwords or confidential content.":"Nennen Sie das Tool, Ihr Vorhaben, das aufgetretene Verhalten, Browser und Betriebssystem sowie gegebenenfalls Dateityp und ungefähre Dateigröße. Senden Sie keine Passwörter oder vertraulichen Inhalte.",
"How do I contact QantaraTools?":"Wie kann ich QantaraTools kontaktieren?",
"Use the Contact Us page. The Contact Us page lists support@qantaratools.com. If you cannot reach us at that address, use the homepage tool-request option.":"Nutzen Sie die Kontaktseite. Dort ist support@qantaratools.com angegeben. Falls Sie uns dort nicht erreichen, verwenden Sie die Funktion zum Vorschlagen eines Tools auf der Startseite."
},
fr:{
'Skip to main content':'Aller au contenu principal','Home':'Accueil','About Us':'À propos','About':'À propos','FAQ':'FAQ','Contact':'Contact','Privacy':'Confidentialité','Terms':'Conditions',
'About QantaraTools':'À propos de QantaraTools','Useful tools.<br>Less busywork.':'Des outils utiles.<br>Moins de tâches fastidieuses.','QantaraTools is a free collection of practical utilities for developers, creators, and anyone who wants to get everyday digital work done a little faster.':'QantaraTools est une collection gratuite d’outils pratiques destinée aux développeurs, aux créateurs et à toutes les personnes qui souhaitent accomplir plus rapidement leurs tâches numériques quotidiennes.',
'Our mission':'Notre mission','Make common tasks simple: clean up text and data, convert formats, inspect files, and solve small workflow problems without installing another app or creating an account.':'Simplifier les tâches courantes : nettoyer du texte et des données, convertir des formats, examiner des fichiers et résoudre de petits problèmes de travail, sans installer une autre application ni créer de compte.',
'Built for quick wins':'Conçu pour gagner du temps','Open a tool, do the task, and get back to your work. The toolkit is free to use and designed to stay clear, approachable, and useful across devices.':'Ouvrez un outil, effectuez votre tâche, puis reprenez votre travail. Cette boîte à outils est gratuite, claire, facile à utiliser et adaptée à différents appareils.',
'Privacy, plainly stated':'La confidentialité en toute transparence','Many tools process text and files locally in your browser, so those inputs are not intentionally uploaded by those tools. Some features do contact external services: for example, community ratings are stored in Firebase, and analytics loads only if you consent. Check the ':'De nombreux outils traitent les textes et les fichiers localement dans votre navigateur ; ces données ne sont donc pas volontairement envoyées par ces outils. Certaines fonctionnalités contactent toutefois des services externes : par exemple, les évaluations de la communauté sont stockées dans Firebase et les statistiques ne sont chargées qu’avec votre consentement. Consultez la ','Privacy Policy':'Politique de confidentialité',' for the full details, especially before using sensitive data with a tool that calls an external service.':' pour en savoir plus, notamment avant d’utiliser des données sensibles avec un outil qui contacte un service externe.',
'Have an idea or spotted a problem?':'Une idée ou un problème à signaler ?','Send it our way and help make the toolkit better.':'Écrivez-nous et contribuez à améliorer cette boîte à outils.','Contact Us':'Nous contacter','Need help with a tool, found a problem, or have a suggestion? We would be happy to hear from you.':'Besoin d’aide avec un outil, vous avez rencontré un problème ou souhaitez faire une suggestion ? Nous serons ravis de vous lire.',
'QantaraTools Support':'Assistance QantaraTools','For support, bug reports, feedback, and general questions, email us at:':'Pour toute demande d’assistance, tout signalement de bug, retour ou question générale, écrivez-nous à :','Please include the tool name and a short description of the issue. If relevant, include your browser, operating system, and approximate file size. Do not send passwords, private keys, or confidential information.':'Veuillez indiquer le nom de l’outil et décrire brièvement le problème. Si nécessaire, précisez votre navigateur, votre système d’exploitation et la taille approximative du fichier. N’envoyez aucun mot de passe, clé privée ou renseignement confidentiel.',
'Tool Suggestions':'Suggestions d’outils','Have an idea for a useful new tool? Use the “Request a New Tool” option on the QantaraTools homepage or email your suggestion to the support address.':'Vous avez une idée d’outil utile ? Utilisez l’option « Proposer un nouvel outil » sur la page d’accueil de QantaraTools ou envoyez votre suggestion à l’adresse d’assistance.',
'Before You Contact Us':'Avant de nous contacter','Refresh the page and try the tool again.':'Actualisez la page et réessayez.','Use a current browser.':'Utilisez un navigateur à jour.','For file tools, try a smaller sample file.':'Pour les outils de fichiers, essayez un fichier d’exemple plus petit.','Tell us exactly which step failed and what you expected to happen.':'Indiquez précisément l’étape qui a échoué et le résultat attendu.',
'Back to tools':'Retour aux outils','All Tools · One Place':'Tous les outils · Un seul endroit',
"Frequently Asked Questions":"Foire aux questions",
"Practical answers to common questions about using QantaraTools, handling files, troubleshooting tools, and getting support.":"Des réponses pratiques aux questions fréquentes sur QantaraTools, les fichiers, le dépannage et l’assistance.",
"Getting Started":"Premiers pas",
"What is QantaraTools?":"Qu’est-ce que QantaraTools ?",
"QantaraTools is a collection of free browser-based utilities for work, development, text, images, PDF tasks, security, finance, and everyday productivity.":"QantaraTools est une collection d’outils gratuits dans le navigateur pour le travail, le développement, le texte, les images, les PDF, la sécurité, la finance et la productivité quotidienne.",
"Do I need to install anything?":"Dois-je installer quelque chose ?",
"No. The website is designed to run directly in a modern web browser. Individual tools may use browser capabilities or locally loaded files.":"Non. Le site fonctionne directement dans un navigateur moderne. Certains outils peuvent utiliser ses fonctionnalités ou des fichiers chargés localement.",
"Is QantaraTools free?":"QantaraTools est-il gratuit ?",
"Yes. The web toolkit is intended to be free to use. Some tools or features may have their own limits or requirements, which are described on the relevant tool screen.":"Oui. La boîte à outils en ligne a vocation à être gratuite. Certains outils ou certaines fonctionnalités peuvent avoir leurs propres limites ou conditions, indiquées sur l’écran correspondant.",
"Which browsers are supported?":"Quels navigateurs sont pris en charge ?",
"Use a recent version of Chrome, Edge, Firefox, or another modern browser. Keeping the browser updated helps ensure the best compatibility.":"Utilisez une version récente de Chrome, Edge, Firefox ou d’un autre navigateur moderne. Un navigateur à jour favorise une meilleure compatibilité.",
"Privacy & Files":"Confidentialité et fichiers",
"Are my files uploaded to QantaraTools?":"Mes fichiers sont-ils envoyés à QantaraTools ?",
"Many tools are designed to process input locally in your browser. When a tool depends on an external service or live data source, the tool interface should indicate that behavior. Do not upload highly sensitive information unless you understand the tool’s processing method.":"De nombreux outils traitent les données localement dans votre navigateur. Si un outil dépend d’un service externe ou de données en direct, son interface doit l’indiquer. N’envoyez pas d’informations très sensibles sans comprendre son mode de traitement.",
"Where are generated files saved?":"Où sont enregistrés les fichiers générés ?",
"Files generated by browser tools are normally downloaded through your browser and saved according to your browser download settings.":"Les fichiers créés par les outils du navigateur sont généralement téléchargés et enregistrés selon les paramètres de téléchargement de votre navigateur.",
"Why does a tool ask for a file?":"Pourquoi un outil demande-t-il un fichier ?",
"File-based tools need browser access to the file you select so they can read, transform, or generate an output. Selecting a file does not by itself mean it is uploaded to a server.":"Les outils utilisant des fichiers doivent accéder, dans le navigateur, au fichier sélectionné pour le lire, le transformer ou produire un résultat. Sélectionner un fichier ne signifie pas à lui seul qu’il est envoyé à un serveur.",
"What should I do if a large file fails?":"Que faire si un fichier volumineux échoue ?",
"Try a smaller file, close unnecessary browser tabs, refresh the page, and retry. Browser memory limits can affect large images, PDFs, or complex conversions.":"Essayez un fichier plus petit, fermez les onglets inutiles, actualisez la page et recommencez. Les limites de mémoire du navigateur peuvent affecter les grandes images, les PDF ou les conversions complexes.",
"Common Tool Problems":"Problèmes courants liés aux outils",
"A generated Word, Excel, or PDF file will not open. What should I do?":"Un fichier Word, Excel ou PDF généré ne s’ouvre pas. Que faire ?",
"Download the file again, make sure the download completed, and open it with a current compatible application. If the issue continues, report the tool name, browser, operating system, and a brief description of the failure through Contact Us.":"Téléchargez à nouveau le fichier, vérifiez la fin du téléchargement et ouvrez-le avec une application compatible à jour. Si le problème persiste, indiquez via la page Contact le nom de l’outil, votre navigateur, votre système d’exploitation et une brève description du problème.",
"A PDF tool is slow or appears frozen.":"Un outil PDF est lent ou semble bloqué.",
"Large PDFs can require significant browser memory and processing time. Wait briefly, then try a smaller document. If it consistently fails, report the PDF tool name and approximate file size.":"Les PDF volumineux peuvent nécessiter beaucoup de mémoire et de temps. Patientez un instant, puis essayez un document plus petit. Si l’échec se répète, indiquez le nom de l’outil PDF et la taille approximative du fichier.",
"An image tool gives a poor result.":"Un outil d’image produit un résultat médiocre.",
"Try a common image format such as PNG, JPEG, or WebP, and avoid unusually large dimensions. Some metadata or advanced image features may not be preserved during conversion.":"Essayez un format courant comme PNG, JPEG ou WebP et évitez les dimensions exceptionnellement grandes. Certaines métadonnées ou fonctions avancées peuvent ne pas être conservées lors de la conversion.",
"A calculator gives a result I do not expect.":"Un calculateur donne un résultat inattendu.",
"Check the units, inputs, tax rate, currency, or other assumptions. Financial and tax tools are calculators for general informational use and should not replace professional advice.":"Vérifiez les unités, les valeurs saisies, le taux de taxe, la devise et les autres hypothèses. Les outils financiers et fiscaux fournissent des calculs informatifs et ne remplacent pas un conseil professionnel.",
"A developer tool shows an error.":"Un outil de développement affiche une erreur.",
"Check that the input is valid for the selected tool. For JSON, SQL, regular expressions, JWTs, or encoded data, verify the input format and try a smaller sample.":"Vérifiez que la saisie est valide pour l’outil choisi. Pour le JSON, le SQL, les expressions régulières, les JWT ou les données encodées, contrôlez le format et essayez un exemple plus petit.",
"Privacy, Security & Accuracy":"Confidentialité, sécurité et exactitude",
"Does QantaraTools guarantee that every tool is completely offline?":"QantaraTools garantit-il que tous les outils fonctionnent entièrement hors ligne ?",
"No blanket guarantee should be assumed. Many utilities are client-side, but some features can use external resources or live data. The Privacy Policy and the individual tool behavior are the correct references.":"Aucune garantie générale ne doit être présumée. De nombreux outils fonctionnent côté client, mais certaines fonctionnalités peuvent utiliser des ressources externes ou des données en direct. La politique de confidentialité et le fonctionnement de chaque outil font référence.",
"Can I use QantaraTools for confidential information?":"Puis-je utiliser QantaraTools avec des informations confidentielles ?",
"Use appropriate caution. Do not enter passwords, private keys, confidential business data, regulated information, or other sensitive material unless you have verified that the specific tool’s processing method is appropriate for it.":"Faites preuve de prudence. Ne saisissez pas de mots de passe, de clés privées, de données commerciales confidentielles ou d’autres éléments sensibles sans avoir vérifié que le traitement de l’outil concerné est adapté.",
"Are financial results guaranteed to be accurate?":"L’exactitude des résultats financiers est-elle garantie ?",
"No. Financial, currency, VAT, loan, discount, and markup tools provide calculations for general informational purposes. Rates and assumptions can change, and you should verify important figures independently.":"Non. Les outils financiers, de devises, de TVA, de prêt, de remise et de marge fournissent des calculs à titre informatif. Les taux et hypothèses peuvent changer ; vérifiez vous-même les chiffres importants.",
"Reporting a Problem":"Signaler un problème",
"What information should I include when reporting a problem?":"Quelles informations fournir pour signaler un problème ?",
"Include the tool name, what you were trying to do, what happened, your browser and operating system, and—when relevant—the approximate file type and size. Avoid sending passwords or confidential content.":"Indiquez le nom de l’outil, votre objectif, ce qui s’est produit, votre navigateur et votre système ainsi que, le cas échéant, le type et la taille approximative du fichier. N’envoyez pas de mots de passe ni de contenu confidentiel.",
"How do I contact QantaraTools?":"Comment contacter QantaraTools ?",
"Use the Contact Us page. The Contact Us page lists support@qantaratools.com. If you cannot reach us at that address, use the homepage tool-request option.":"Utilisez la page Contact, qui indique l’adresse support@qantaratools.com. Si vous ne parvenez pas à nous joindre, utilisez l’option de demande d’outil sur la page d’accueil."
},
es:{
'Skip to main content':'Saltar al contenido principal','Home':'Inicio','About Us':'Quiénes somos','About':'Acerca de','FAQ':'Preguntas frecuentes','Contact':'Contacto','Privacy':'Privacidad','Terms':'Términos',
'About QantaraTools':'Acerca de QantaraTools','Useful tools.<br>Less busywork.':'Herramientas útiles.<br>Menos trabajo repetitivo.','QantaraTools is a free collection of practical utilities for developers, creators, and anyone who wants to get everyday digital work done a little faster.':'QantaraTools es una colección gratuita de utilidades prácticas para desarrolladores, creadores y cualquier persona que quiera realizar sus tareas digitales cotidianas con mayor rapidez.',
'Our mission':'Nuestra misión','Make common tasks simple: clean up text and data, convert formats, inspect files, and solve small workflow problems without installing another app or creating an account.':'Simplificar las tareas habituales: limpiar texto y datos, convertir formatos, revisar archivos y resolver pequeños problemas de trabajo sin instalar otra aplicación ni crear una cuenta.',
'Built for quick wins':'Diseñado para ahorrar tiempo','Open a tool, do the task, and get back to your work. The toolkit is free to use and designed to stay clear, approachable, and useful across devices.':'Abre una herramienta, realiza la tarea y vuelve a tu trabajo. El conjunto de herramientas es gratuito, claro, fácil de usar y práctico en distintos dispositivos.',
'Privacy, plainly stated':'Privacidad, explicada con claridad','Many tools process text and files locally in your browser, so those inputs are not intentionally uploaded by those tools. Some features do contact external services: for example, community ratings are stored in Firebase, and analytics loads only if you consent. Check the ':'Muchas herramientas procesan texto y archivos localmente en tu navegador, por lo que esas herramientas no suben intencionadamente esos datos. Algunas funciones sí se comunican con servicios externos: por ejemplo, las valoraciones de la comunidad se guardan en Firebase y las analíticas solo se cargan si das tu consentimiento. Consulta la ','Privacy Policy':'Política de privacidad',' for the full details, especially before using sensitive data with a tool that calls an external service.':' para conocer todos los detalles, especialmente antes de utilizar datos sensibles con una herramienta que se conecta a un servicio externo.',
'Have an idea or spotted a problem?':'¿Tienes una idea o has encontrado un problema?','Send it our way and help make the toolkit better.':'Escríbenos y ayúdanos a mejorar estas herramientas.','Contact Us':'Contactar','Need help with a tool, found a problem, or have a suggestion? We would be happy to hear from you.':'¿Necesitas ayuda con una herramienta, has encontrado un problema o tienes alguna sugerencia? Nos encantará recibir tu mensaje.',
'QantaraTools Support':'Soporte de QantaraTools','For support, bug reports, feedback, and general questions, email us at:':'Para recibir soporte, informar de errores, enviar comentarios o realizar consultas generales, escríbenos a:','Please include the tool name and a short description of the issue. If relevant, include your browser, operating system, and approximate file size. Do not send passwords, private keys, or confidential information.':'Incluye el nombre de la herramienta y una breve descripción del problema. Si corresponde, indica tu navegador, sistema operativo y el tamaño aproximado del archivo. No envíes contraseñas, claves privadas ni información confidencial.',
'Tool Suggestions':'Sugerencias de herramientas','Have an idea for a useful new tool? Use the “Request a New Tool” option on the QantaraTools homepage or email your suggestion to the support address.':'¿Tienes una idea para una herramienta útil? Utiliza la opción «Solicitar una herramienta nueva» en la página principal de QantaraTools o envía tu propuesta al correo de soporte.',
'Before You Contact Us':'Antes de contactar','Refresh the page and try the tool again.':'Actualiza la página e inténtalo de nuevo.','Use a current browser.':'Utiliza un navegador actualizado.','For file tools, try a smaller sample file.':'En las herramientas de archivos, prueba con un archivo de muestra más pequeño.','Tell us exactly which step failed and what you expected to happen.':'Indica exactamente qué paso falló y qué resultado esperabas.',
'Back to tools':'Volver a las herramientas','All Tools · One Place':'Todas las herramientas · En un solo lugar',
"Frequently Asked Questions":"Preguntas frecuentes",
"Practical answers to common questions about using QantaraTools, handling files, troubleshooting tools, and getting support.":"Respuestas prácticas a preguntas habituales sobre QantaraTools, la gestión de archivos, la solución de problemas y el soporte.",
"Getting Started":"Primeros pasos",
"What is QantaraTools?":"¿Qué es QantaraTools?",
"QantaraTools is a collection of free browser-based utilities for work, development, text, images, PDF tasks, security, finance, and everyday productivity.":"QantaraTools es una colección de utilidades gratuitas en el navegador para trabajo, desarrollo, texto, imágenes, tareas con PDF, seguridad, finanzas y productividad diaria.",
"Do I need to install anything?":"¿Tengo que instalar algo?",
"No. The website is designed to run directly in a modern web browser. Individual tools may use browser capabilities or locally loaded files.":"No. El sitio funciona directamente en un navegador moderno. Algunas herramientas pueden utilizar funciones del navegador o archivos cargados localmente.",
"Is QantaraTools free?":"¿QantaraTools es gratis?",
"Yes. The web toolkit is intended to be free to use. Some tools or features may have their own limits or requirements, which are described on the relevant tool screen.":"Sí. El conjunto de herramientas web está pensado para ser gratuito. Algunas herramientas o funciones pueden tener límites o requisitos propios, descritos en su pantalla correspondiente.",
"Which browsers are supported?":"¿Qué navegadores son compatibles?",
"Use a recent version of Chrome, Edge, Firefox, or another modern browser. Keeping the browser updated helps ensure the best compatibility.":"Utiliza una versión reciente de Chrome, Edge, Firefox u otro navegador moderno. Mantenerlo actualizado mejora la compatibilidad.",
"Privacy & Files":"Privacidad y archivos",
"Are my files uploaded to QantaraTools?":"¿Se suben mis archivos a QantaraTools?",
"Many tools are designed to process input locally in your browser. When a tool depends on an external service or live data source, the tool interface should indicate that behavior. Do not upload highly sensitive information unless you understand the tool’s processing method.":"Muchas herramientas procesan los datos localmente en tu navegador. Si una herramienta depende de un servicio externo o de datos en tiempo real, su interfaz debe indicarlo. No subas información muy sensible si no conoces su método de procesamiento.",
"Where are generated files saved?":"¿Dónde se guardan los archivos generados?",
"Files generated by browser tools are normally downloaded through your browser and saved according to your browser download settings.":"Los archivos generados normalmente se descargan mediante el navegador y se guardan según su configuración de descargas.",
"Why does a tool ask for a file?":"¿Por qué una herramienta solicita un archivo?",
"File-based tools need browser access to the file you select so they can read, transform, or generate an output. Selecting a file does not by itself mean it is uploaded to a server.":"Las herramientas basadas en archivos necesitan acceder desde el navegador al archivo seleccionado para leerlo, transformarlo o generar un resultado. Seleccionarlo no significa por sí solo que se suba a un servidor.",
"What should I do if a large file fails?":"¿Qué hago si falla un archivo grande?",
"Try a smaller file, close unnecessary browser tabs, refresh the page, and retry. Browser memory limits can affect large images, PDFs, or complex conversions.":"Prueba con un archivo más pequeño, cierra pestañas innecesarias, actualiza la página e inténtalo de nuevo. Los límites de memoria pueden afectar a imágenes grandes, PDF o conversiones complejas.",
"Common Tool Problems":"Problemas habituales de las herramientas",
"A generated Word, Excel, or PDF file will not open. What should I do?":"No se abre un archivo Word, Excel o PDF generado. ¿Qué hago?",
"Download the file again, make sure the download completed, and open it with a current compatible application. If the issue continues, report the tool name, browser, operating system, and a brief description of the failure through Contact Us.":"Descarga el archivo de nuevo, comprueba que la descarga haya terminado y ábrelo con una aplicación compatible y actualizada. Si el problema continúa, informa desde la página de contacto del nombre de la herramienta, el navegador, el sistema operativo y una breve descripción del fallo.",
"A PDF tool is slow or appears frozen.":"Una herramienta PDF va lenta o parece bloqueada.",
"Large PDFs can require significant browser memory and processing time. Wait briefly, then try a smaller document. If it consistently fails, report the PDF tool name and approximate file size.":"Los PDF grandes pueden necesitar bastante memoria y tiempo de procesamiento. Espera un momento y prueba con un documento más pequeño. Si falla repetidamente, informa del nombre de la herramienta y del tamaño aproximado.",
"An image tool gives a poor result.":"Una herramienta de imagen ofrece un resultado deficiente.",
"Try a common image format such as PNG, JPEG, or WebP, and avoid unusually large dimensions. Some metadata or advanced image features may not be preserved during conversion.":"Prueba con un formato habitual como PNG, JPEG o WebP y evita dimensiones demasiado grandes. Algunos metadatos o funciones avanzadas pueden no conservarse durante la conversión.",
"A calculator gives a result I do not expect.":"Una calculadora ofrece un resultado inesperado.",
"Check the units, inputs, tax rate, currency, or other assumptions. Financial and tax tools are calculators for general informational use and should not replace professional advice.":"Comprueba las unidades, los datos introducidos, el tipo impositivo, la moneda y otras suposiciones. Las herramientas financieras y fiscales ofrecen cálculos informativos y no sustituyen el asesoramiento profesional.",
"A developer tool shows an error.":"Una herramienta para desarrolladores muestra un error.",
"Check that the input is valid for the selected tool. For JSON, SQL, regular expressions, JWTs, or encoded data, verify the input format and try a smaller sample.":"Comprueba que la entrada sea válida para la herramienta seleccionada. Para JSON, SQL, expresiones regulares, JWT o datos codificados, verifica el formato y prueba con un ejemplo más pequeño.",
"Privacy, Security & Accuracy":"Privacidad, seguridad y precisión",
"Does QantaraTools guarantee that every tool is completely offline?":"¿QantaraTools garantiza que todas las herramientas funcionan completamente sin conexión?",
"No blanket guarantee should be assumed. Many utilities are client-side, but some features can use external resources or live data. The Privacy Policy and the individual tool behavior are the correct references.":"No debe suponerse una garantía general. Muchas utilidades funcionan en el navegador, pero algunas funciones pueden usar recursos externos o datos en tiempo real. La Política de privacidad y el comportamiento de cada herramienta son las referencias adecuadas.",
"Can I use QantaraTools for confidential information?":"¿Puedo utilizar QantaraTools con información confidencial?",
"Use appropriate caution. Do not enter passwords, private keys, confidential business data, regulated information, or other sensitive material unless you have verified that the specific tool’s processing method is appropriate for it.":"Actúa con precaución. No introduzcas contraseñas, claves privadas, datos empresariales confidenciales ni otros materiales sensibles sin comprobar que el método de procesamiento de esa herramienta sea adecuado.",
"Are financial results guaranteed to be accurate?":"¿Se garantiza la exactitud de los resultados financieros?",
"No. Financial, currency, VAT, loan, discount, and markup tools provide calculations for general informational purposes. Rates and assumptions can change, and you should verify important figures independently.":"No. Las herramientas financieras, de divisas, IVA, préstamos, descuentos y márgenes ofrecen cálculos informativos. Los tipos y las suposiciones pueden cambiar, por lo que debes verificar las cifras importantes por tu cuenta.",
"Reporting a Problem":"Informar de un problema",
"What information should I include when reporting a problem?":"¿Qué información debo incluir al informar de un problema?",
"Include the tool name, what you were trying to do, what happened, your browser and operating system, and—when relevant—the approximate file type and size. Avoid sending passwords or confidential content.":"Incluye el nombre de la herramienta, lo que intentabas hacer, lo ocurrido, tu navegador y sistema operativo y, cuando corresponda, el tipo y tamaño aproximado del archivo. No envíes contraseñas ni contenido confidencial.",
"How do I contact QantaraTools?":"¿Cómo puedo contactar con QantaraTools?",
"Use the Contact Us page. The Contact Us page lists support@qantaratools.com. If you cannot reach us at that address, use the homepage tool-request option.":"Utiliza la página de contacto, donde aparece support@qantaratools.com. Si no puedes contactar mediante esa dirección, utiliza la opción para solicitar herramientas de la página principal."
}};

const extraStaticTranslations={
ru:{
'Skip to main content':'Перейти к основному содержимому','Home':'Главная','About Us':'О нас','About':'О проекте','FAQ':'Частые вопросы','Contact':'Контакты','Privacy':'Конфиденциальность','Terms':'Условия',
'About QantaraTools':'О QantaraTools','Useful tools.<br>Less busywork.':'Полезные инструменты.<br>Меньше рутины.','Our mission':'Наша миссия','Built for quick wins':'Для быстрых результатов',
'Privacy, plainly stated':'О конфиденциальности — просто','Have an idea or spotted a problem?':'Есть идея или заметили проблему?','Send it our way and help make the toolkit better.':'Напишите нам и помогите улучшить набор инструментов.','Contact Us':'Связаться с нами',
'Need help with a tool, found a problem, or have a suggestion? We would be happy to hear from you.':'Нужна помощь с инструментом, нашли ошибку или хотите предложить идею? Будем рады вашему сообщению.',
'QantaraTools Support':'Поддержка QantaraTools','For support, bug reports, feedback, and general questions, email us at:':'По вопросам поддержки, сообщениям об ошибках, отзывам и общим вопросам пишите нам: ',
'Please include the tool name and a short description of the issue. If relevant, include your browser, operating system, and approximate file size. Do not send passwords, private keys, or confidential information.':'Укажите название инструмента и кратко опишите проблему. При необходимости сообщите браузер, операционную систему и примерный размер файла. Не отправляйте пароли, закрытые ключи или конфиденциальные сведения.',
'Tool Suggestions':'Предложения по инструментам','Have an idea for a useful new tool? Use the “Request a New Tool” option on the QantaraTools homepage or email your suggestion to the support address.':'Есть идея полезного инструмента? Воспользуйтесь пунктом «Предложить новый инструмент» на главной странице QantaraTools или отправьте предложение в службу поддержки.',
'Before You Contact Us':'Перед обращением в поддержку','Refresh the page and try the tool again.':'Обновите страницу и попробуйте снова.','Use a current browser.':'Используйте актуальную версию браузера.','For file tools, try a smaller sample file.':'Для инструментов работы с файлами попробуйте файл меньшего размера.','Tell us exactly which step failed and what you expected to happen.':'Точно укажите, на каком этапе возникла ошибка и какого результата вы ожидали.',
'Frequently Asked Questions':'Часто задаваемые вопросы','Practical answers to common questions about using QantaraTools, handling files, troubleshooting tools, and getting support.':'Ответы на распространённые вопросы об использовании QantaraTools, работе с файлами, устранении неполадок и поддержке.',
'Getting Started':'Начало работы','What is QantaraTools?':'Что такое QantaraTools?','Do I need to install anything?':'Нужно ли что-нибудь устанавливать?','Is QantaraTools free?':'QantaraTools бесплатен?','Which browsers are supported?':'Какие браузеры поддерживаются?','Privacy & Files':'Конфиденциальность и файлы','Are my files uploaded to QantaraTools?':'Загружаются ли мои файлы на QantaraTools?','Where are generated files saved?':'Где сохраняются созданные файлы?','Why does a tool ask for a file?':'Зачем инструменту нужен файл?','What should I do if a large file fails?':'Что делать, если большой файл не обрабатывается?','Common Tool Problems':'Распространённые проблемы с инструментами','How do I contact QantaraTools?':'Как связаться с QantaraTools?',
'Main navigation':'Главная навигация','Toggle theme':'Сменить тему','Back to tools':'Вернуться к инструментам','All Tools · One Place':'Все инструменты · В одном месте','Do not email passwords, private keys, or confidential files.':'Не отправляйте по электронной почте пароли, закрытые ключи и конфиденциальные файлы.',
'No blanket guarantee should be assumed. Many utilities are client-side, but some features can use external resources or live data. The Privacy Policy and the individual tool behavior are the correct references.':'Не следует считать это безусловной гарантией. Многие инструменты работают в браузере, но отдельные функции могут обращаться к внешним ресурсам или актуальным данным. Ориентируйтесь на Политику конфиденциальности и фактическое поведение конкретного инструмента.',
'Use the Contact Us page. The Contact Us page lists support@qantaratools.com. If you cannot reach us at that address, use the homepage tool-request option.':'Откройте страницу контактов: там указан адрес support@qantaratools.com. Если связаться по нему не удаётся, воспользуйтесь формой предложения инструмента на главной странице.',
'Learn about QantaraTools, a free collection of practical browser-based utilities built to make everyday work quicker and easier.':'Узнайте больше о QantaraTools — наборе практичных браузерных инструментов, помогающих быстрее выполнять повседневные задачи.',
'Contact QantaraTools support for help, bug reports, feedback, and tool suggestions.':'Свяжитесь со службой поддержки QantaraTools, чтобы получить помощь, сообщить об ошибке, оставить отзыв или предложить инструмент.',
'Frequently asked questions and troubleshooting help for QantaraTools.':'Ответы на частые вопросы и помощь в устранении неполадок QantaraTools.',
'QANTARATOOLS / PRIVACY':'QANTARATOOLS / КОНФИДЕНЦИАЛЬНОСТЬ','QANTARATOOLS / TERMS':'QANTARATOOLS / УСЛОВИЯ','Last updated: October 17, 2026':'Последнее обновление: 17 октября 2026 г.'
},
tr:{
'Skip to main content':'Ana içeriğe geç','Home':'Ana sayfa','About Us':'Hakkımızda','About':'Hakkında','FAQ':'SSS','Contact':'İletişim','Privacy':'Gizlilik','Terms':'Koşullar',
'About QantaraTools':'QantaraTools Hakkında','Useful tools.<br>Less busywork.':'Yararlı araçlar.<br>Daha az angarya.','Our mission':'Misyonumuz','Built for quick wins':'Hızlı sonuçlar için tasarlandı',
'Privacy, plainly stated':'Gizlilik, açık ve net','Have an idea or spotted a problem?':'Bir fikriniz mi var veya sorun mu fark ettiniz?','Send it our way and help make the toolkit better.':'Bize yazın ve araç setini geliştirmemize yardımcı olun.','Contact Us':'Bize ulaşın',
'Need help with a tool, found a problem, or have a suggestion? We would be happy to hear from you.':'Bir araçla ilgili yardıma mı ihtiyacınız var, sorun mu buldunuz veya öneriniz mi var? Mesajınızı memnuniyetle bekliyoruz.',
'QantaraTools Support':'QantaraTools Destek','For support, bug reports, feedback, and general questions, email us at:':'Destek, hata bildirimi, geri bildirim ve genel sorularınız için bize şu adresten e-posta gönderin: ',
'Please include the tool name and a short description of the issue. If relevant, include your browser, operating system, and approximate file size. Do not send passwords, private keys, or confidential information.':'Lütfen aracın adını ve sorunun kısa bir açıklamasını ekleyin. Gerekirse tarayıcınızı, işletim sisteminizi ve yaklaşık dosya boyutunu belirtin. Parola, özel anahtar veya gizli bilgi göndermeyin.',
'Tool Suggestions':'Araç Önerileri','Have an idea for a useful new tool? Use the “Request a New Tool” option on the QantaraTools homepage or email your suggestion to the support address.':'Yararlı bir araç fikriniz mi var? QantaraTools ana sayfasındaki “Yeni Araç Öner” seçeneğini kullanın veya önerinizi destek e-posta adresine gönderin.',
'Before You Contact Us':'Bize Ulaşmadan Önce','Refresh the page and try the tool again.':'Sayfayı yenileyip aracı tekrar deneyin.','Use a current browser.':'Güncel bir tarayıcı kullanın.','For file tools, try a smaller sample file.':'Dosya araçlarında daha küçük bir örnek dosya deneyin.','Tell us exactly which step failed and what you expected to happen.':'Hangi adımın başarısız olduğunu ve ne olmasını beklediğinizi açıkça belirtin.',
'Frequently Asked Questions':'Sıkça Sorulan Sorular','Practical answers to common questions about using QantaraTools, handling files, troubleshooting tools, and getting support.':'QantaraTools kullanımı, dosyalar, sorun giderme ve destek hakkında sık sorulan soruların yanıtları.',
'Getting Started':'Başlarken','What is QantaraTools?':'QantaraTools nedir?','Do I need to install anything?':'Herhangi bir şey yüklemem gerekiyor mu?','Is QantaraTools free?':'QantaraTools ücretsiz mi?','Which browsers are supported?':'Hangi tarayıcılar destekleniyor?','Privacy & Files':'Gizlilik ve Dosyalar','Are my files uploaded to QantaraTools?':'Dosyalarım QantaraTools’a yükleniyor mu?','Where are generated files saved?':'Oluşturulan dosyalar nereye kaydedilir?','Why does a tool ask for a file?':'Bir araç neden dosya istiyor?','What should I do if a large file fails?':'Büyük bir dosya işlenemezse ne yapmalıyım?','Common Tool Problems':'Yaygın Araç Sorunları','How do I contact QantaraTools?':'QantaraTools ile nasıl iletişim kurabilirim?',
'Main navigation':'Ana gezinme','Toggle theme':'Temayı değiştir','Back to tools':'Araçlara dön','All Tools · One Place':'Tüm Araçlar · Tek Yerde','Do not email passwords, private keys, or confidential files.':'E-posta ile parola, özel anahtar veya gizli dosya göndermeyin.',
'No blanket guarantee should be assumed. Many utilities are client-side, but some features can use external resources or live data. The Privacy Policy and the individual tool behavior are the correct references.':'Genel ve koşulsuz bir garanti varsayılmamalıdır. Birçok araç tarayıcıda çalışır; ancak bazı özellikler harici kaynakları veya canlı verileri kullanabilir. Gizlilik Politikası ve ilgili aracın gerçek çalışma biçimi esas alınmalıdır.',
'Use the Contact Us page. The Contact Us page lists support@qantaratools.com. If you cannot reach us at that address, use the homepage tool-request option.':'İletişim sayfasında support@qantaratools.com adresi yer alır. Bu adrese ulaşamazsanız ana sayfadaki araç önerisi seçeneğini kullanın.',
'Learn about QantaraTools, a free collection of practical browser-based utilities built to make everyday work quicker and easier.':'Günlük dijital işleri kolaylaştırmak için geliştirilmiş pratik tarayıcı araçları koleksiyonu QantaraTools hakkında bilgi edinin.',
'Contact QantaraTools support for help, bug reports, feedback, and tool suggestions.':'Yardım, hata bildirimi, geri bildirim ve araç önerileri için QantaraTools destek ekibiyle iletişime geçin.',
'Frequently asked questions and troubleshooting help for QantaraTools.':'QantaraTools hakkında sık sorulan sorular ve sorun giderme yardımı.',
'QANTARATOOLS / PRIVACY':'QANTARATOOLS / GİZLİLİK','QANTARATOOLS / TERMS':'QANTARATOOLS / KOŞULLAR','Last updated: October 17, 2026':'Son güncelleme: 17 Ekim 2026'
},
hi:{
'Skip to main content':'मुख्य सामग्री पर जाएँ','Home':'होम','About Us':'हमारे बारे में','About':'परिचय','FAQ':'अक्सर पूछे जाने वाले प्रश्न','Contact':'संपर्क','Privacy':'गोपनीयता','Terms':'नियम',
'About QantaraTools':'QantaraTools के बारे में','Useful tools.<br>Less busywork.':'उपयोगी टूल।<br>कम मेहनत।','Our mission':'हमारा उद्देश्य','Built for quick wins':'तेज़ और आसान काम के लिए',
'Privacy, plainly stated':'गोपनीयता, स्पष्ट शब्दों में','Have an idea or spotted a problem?':'कोई सुझाव है या समस्या मिली?','Send it our way and help make the toolkit better.':'हमें बताएँ और टूलकिट को बेहतर बनाने में मदद करें।','Contact Us':'हमसे संपर्क करें',
'Need help with a tool, found a problem, or have a suggestion? We would be happy to hear from you.':'किसी टूल में मदद चाहिए, कोई समस्या मिली या सुझाव देना चाहते हैं? हमें आपका संदेश पाकर खुशी होगी।',
'QantaraTools Support':'QantaraTools सहायता','For support, bug reports, feedback, and general questions, email us at:':'सहायता, बग रिपोर्ट, प्रतिक्रिया और सामान्य प्रश्नों के लिए हमें यहाँ ईमेल करें: ',
'Please include the tool name and a short description of the issue. If relevant, include your browser, operating system, and approximate file size. Do not send passwords, private keys, or confidential information.':'कृपया टूल का नाम और समस्या का संक्षिप्त विवरण दें। ज़रूरत हो तो ब्राउज़र, ऑपरेटिंग सिस्टम और फ़ाइल का अनुमानित आकार बताएँ। पासवर्ड, निजी कुंजी या गोपनीय जानकारी न भेजें।',
'Tool Suggestions':'टूल सुझाव','Have an idea for a useful new tool? Use the “Request a New Tool” option on the QantaraTools homepage or email your suggestion to the support address.':'किसी उपयोगी नए टूल का विचार है? QantaraTools होमपेज पर “नया टूल सुझाएँ” विकल्प चुनें या अपना सुझाव सहायता ईमेल पर भेजें।',
'Before You Contact Us':'संपर्क करने से पहले','Refresh the page and try the tool again.':'पेज रीफ़्रेश करके टूल फिर आज़माएँ।','Use a current browser.':'अपडेटेड ब्राउज़र का उपयोग करें।','For file tools, try a smaller sample file.':'फ़ाइल टूल के लिए छोटी नमूना फ़ाइल आज़माएँ।','Tell us exactly which step failed and what you expected to happen.':'बताएँ कि कौन-सा चरण विफल हुआ और आप क्या परिणाम चाहते थे।',
'Frequently Asked Questions':'अक्सर पूछे जाने वाले प्रश्न','Practical answers to common questions about using QantaraTools, handling files, troubleshooting tools, and getting support.':'QantaraTools के उपयोग, फ़ाइलों, समस्या समाधान और सहायता से जुड़े सामान्य प्रश्नों के व्यावहारिक उत्तर।',
'Getting Started':'शुरुआत करें','What is QantaraTools?':'QantaraTools क्या है?','Do I need to install anything?':'क्या मुझे कुछ इंस्टॉल करना होगा?','Is QantaraTools free?':'क्या QantaraTools मुफ़्त है?','Which browsers are supported?':'कौन-से ब्राउज़र समर्थित हैं?','Privacy & Files':'गोपनीयता और फ़ाइलें','Are my files uploaded to QantaraTools?':'क्या मेरी फ़ाइलें QantaraTools पर अपलोड होती हैं?','Where are generated files saved?':'बनाई गई फ़ाइलें कहाँ सहेजी जाती हैं?','Why does a tool ask for a file?':'टूल फ़ाइल क्यों माँगता है?','What should I do if a large file fails?':'बड़ी फ़ाइल विफल होने पर क्या करें?','Common Tool Problems':'आम टूल समस्याएँ','How do I contact QantaraTools?':'मैं QantaraTools से कैसे संपर्क करूँ?',
'Main navigation':'मुख्य नेविगेशन','Toggle theme':'थीम बदलें','Back to tools':'टूल पर वापस जाएँ','All Tools · One Place':'सभी टूल · एक ही जगह','Do not email passwords, private keys, or confidential files.':'ईमेल में पासवर्ड, निजी कुंजी या गोपनीय फ़ाइलें न भेजें।',
'No blanket guarantee should be assumed. Many utilities are client-side, but some features can use external resources or live data. The Privacy Policy and the individual tool behavior are the correct references.':'इसे सभी सुविधाओं के लिए सार्वभौमिक गारंटी न मानें। कई टूल ब्राउज़र में चलते हैं, लेकिन कुछ सुविधाएँ बाहरी संसाधनों या लाइव डेटा का उपयोग कर सकती हैं। सही जानकारी के लिए गोपनीयता नीति और संबंधित टूल का व्यवहार देखें।',
'Use the Contact Us page. The Contact Us page lists support@qantaratools.com. If you cannot reach us at that address, use the homepage tool-request option.':'संपर्क पेज पर support@qantaratools.com दिया गया है। यदि वहाँ संपर्क न हो पाए, तो होमपेज पर टूल अनुरोध विकल्प का उपयोग करें।',
'Learn about QantaraTools, a free collection of practical browser-based utilities built to make everyday work quicker and easier.':'QantaraTools के बारे में जानें—ब्राउज़र में चलने वाले व्यावहारिक टूल का संग्रह, जो रोज़मर्रा के डिजिटल काम तेज़ और आसान बनाता है।',
'Contact QantaraTools support for help, bug reports, feedback, and tool suggestions.':'सहायता, बग रिपोर्ट, प्रतिक्रिया और नए टूल के सुझावों के लिए QantaraTools सहायता टीम से संपर्क करें।',
'Frequently asked questions and troubleshooting help for QantaraTools.':'QantaraTools के सामान्य प्रश्नों के उत्तर और समस्या समाधान सहायता।',
'QANTARATOOLS / PRIVACY':'QANTARATOOLS / गोपनीयता','QANTARATOOLS / TERMS':'QANTARATOOLS / नियम','Last updated: October 17, 2026':'अंतिम अपडेट: 17 अक्टूबर 2026'
},
'zh-CN':{
'Skip to main content':'跳转到主要内容','Home':'首页','About Us':'关于我们','About':'关于','FAQ':'常见问题','Contact':'联系我们','Privacy':'隐私','Terms':'服务条款',
'About QantaraTools':'关于 QantaraTools','Useful tools.<br>Less busywork.':'实用工具。<br>减少重复劳动。','Our mission':'我们的使命','Built for quick wins':'让日常任务更高效',
'Privacy, plainly stated':'清晰说明隐私','Have an idea or spotted a problem?':'有新想法或发现问题？','Send it our way and help make the toolkit better.':'欢迎告诉我们，帮助改进工具集。','Contact Us':'联系我们',
'Need help with a tool, found a problem, or have a suggestion? We would be happy to hear from you.':'使用工具时需要帮助、发现问题或有改进建议？欢迎联系我们。',
'QantaraTools Support':'QantaraTools 支持','For support, bug reports, feedback, and general questions, email us at:':'如需支持、报告错误、提供反馈或咨询一般问题，请发送邮件至：',
'Please include the tool name and a short description of the issue. If relevant, include your browser, operating system, and approximate file size. Do not send passwords, private keys, or confidential information.':'请注明工具名称并简要描述问题。如有必要，请提供浏览器、操作系统和文件的大致大小。请勿发送密码、私钥或机密信息。',
'Tool Suggestions':'工具建议','Have an idea for a useful new tool? Use the “Request a New Tool” option on the QantaraTools homepage or email your suggestion to the support address.':'有实用工具的创意？请使用 QantaraTools 首页上的“建议新工具”选项，或发送邮件至支持邮箱。',
'Before You Contact Us':'联系我们之前','Refresh the page and try the tool again.':'刷新页面后重试该工具。','Use a current browser.':'请使用最新版本的浏览器。','For file tools, try a smaller sample file.':'使用文件工具时，请尝试较小的示例文件。','Tell us exactly which step failed and what you expected to happen.':'请准确说明哪个步骤出现问题，以及你预期的结果。',
'Frequently Asked Questions':'常见问题','Practical answers to common questions about using QantaraTools, handling files, troubleshooting tools, and getting support.':'关于使用 QantaraTools、处理文件、排查工具问题和获取支持的常见问题解答。',
'Getting Started':'快速入门','What is QantaraTools?':'什么是 QantaraTools？','Do I need to install anything?':'需要安装软件吗？','Is QantaraTools free?':'QantaraTools 免费吗？','Which browsers are supported?':'支持哪些浏览器？','Privacy & Files':'隐私与文件','Are my files uploaded to QantaraTools?':'我的文件会上传到 QantaraTools 吗？','Where are generated files saved?':'生成的文件保存在哪里？','Why does a tool ask for a file?':'为什么工具需要选择文件？','What should I do if a large file fails?':'大文件处理失败时该怎么办？','Common Tool Problems':'常见工具问题','How do I contact QantaraTools?':'如何联系 QantaraTools？',
'Main navigation':'主导航','Toggle theme':'切换主题','Back to tools':'返回工具','All Tools · One Place':'所有工具 · 一站式服务','Do not email passwords, private keys, or confidential files.':'请勿通过电子邮件发送密码、私钥或机密文件。',
'No blanket guarantee should be assumed. Many utilities are client-side, but some features can use external resources or live data. The Privacy Policy and the individual tool behavior are the correct references.':'请勿将此视为适用于所有功能的全面保证。许多工具在浏览器本地运行，但部分功能可能使用外部资源或实时数据。请以隐私政策和具体工具的实际行为为准。',
'Use the Contact Us page. The Contact Us page lists support@qantaratools.com. If you cannot reach us at that address, use the homepage tool-request option.':'请访问联系我们页面，其中列有 support@qantaratools.com。如果无法通过该邮箱联系，请使用首页上的工具建议选项。',
'Learn about QantaraTools, a free collection of practical browser-based utilities built to make everyday work quicker and easier.':'了解 QantaraTools：一组实用的浏览器工具，帮助你更快完成日常数字任务。',
'Contact QantaraTools support for help, bug reports, feedback, and tool suggestions.':'如需帮助、报告错误、提供反馈或建议新工具，请联系 QantaraTools 支持团队。',
'Frequently asked questions and troubleshooting help for QantaraTools.':'QantaraTools 常见问题与故障排查帮助。',
'QANTARATOOLS / PRIVACY':'QANTARATOOLS / 隐私政策','QANTARATOOLS / TERMS':'QANTARATOOLS / 服务条款','Last updated: October 17, 2026':'最后更新：2026年10月17日'
}
};
for(const [locale,map] of Object.entries(extraStaticTranslations)){
 dict[locale]=Object.assign({},legalTranslations[locale]||{},map);
}

function replaceText(html,map){
 const keys=Object.keys(map).sort((a,b)=>b.length-a.length);
 if(!keys.length) return html;
 const special='\\^$.*+?()[]{}|';
 const escaped=keys.map(key=>Array.from(key,ch=>special.includes(ch)?'\\'+ch:ch).join(''));
 const matcher=new RegExp(escaped.join('|'),'g');
 return html.replace(matcher,match=>map[match]);
}
for(const locale of locales){
 const staticPageChrome={
  de:{
   'Skip to main content':'Zum Hauptinhalt springen','Main navigation':'Hauptnavigation','Home':'Startseite','About':'Über uns','FAQ':'FAQ','Contact':'Kontakt','Privacy':'Datenschutz','Terms':'Nutzungsbedingungen','Toggle theme':'Design umschalten',
   'Contact Us':'Kontaktieren Sie uns','Need help with a tool, found a problem, or have a suggestion? We would be happy to hear from you.':'Benötigen Sie Hilfe zu einem Tool, haben Sie ein Problem entdeckt oder einen Vorschlag? Wir freuen uns auf Ihre Nachricht.',
   'Do not email passwords, private keys, or confidential files.':'Senden Sie keine Passwörter, privaten Schlüssel oder vertraulichen Dateien per E-Mail.',

   'QantaraTools Support':'QantaraTools-Support','For support, bug reports, feedback, and general questions, email us at:':'Bei Supportanfragen, Fehlermeldungen, Feedback und allgemeinen Fragen schreiben Sie uns eine E-Mail an:',
   'Please include the tool name and a short description of the issue. If relevant, include your browser, operating system, and approximate file size. Do not send passwords, private keys, or confidential information.':'Nennen Sie bitte das Tool und beschreiben Sie das Problem kurz. Geben Sie gegebenenfalls Browser, Betriebssystem und ungefähre Dateigröße an. Senden Sie keine Passwörter, privaten Schlüssel oder vertraulichen Informationen.',
   'Tool Suggestions':'Tool-Vorschläge','Have an idea for a useful new tool? Use the “Request a New Tool” option on the QantaraTools homepage or email your suggestion to the support address.':'Haben Sie eine Idee für ein nützliches neues Tool? Nutzen Sie auf der QantaraTools-Startseite die Option „Neues Tool vorschlagen“ oder senden Sie Ihren Vorschlag per E-Mail an den Support.',
   'Before You Contact Us':'Bevor Sie uns kontaktieren','Refresh the page and try the tool again.':'Laden Sie die Seite neu und versuchen Sie es erneut.','Use a current browser.':'Verwenden Sie einen aktuellen Browser.','For file tools, try a smaller sample file.':'Versuchen Sie bei Dateitools eine kleinere Beispieldatei.','Tell us exactly which step failed and what you expected to happen.':'Teilen Sie uns genau mit, welcher Schritt fehlgeschlagen ist und was Sie erwartet haben.'
  },
  fr:{
   'Skip to main content':'Aller au contenu principal','Main navigation':'Navigation principale','Home':'Accueil','About':'À propos','FAQ':'FAQ','Contact':'Contact','Privacy':'Confidentialité','Terms':'Conditions','Toggle theme':'Changer de thème',
   'Contact Us':'Nous contacter','Need help with a tool, found a problem, or have a suggestion? We would be happy to hear from you.':'Besoin d’aide avec un outil, vous avez rencontré un problème ou souhaitez faire une suggestion ? Nous serons ravis de vous lire.',
   'Do not email passwords, private keys, or confidential files.':'N’envoyez pas de mots de passe, de clés privées ni de fichiers confidentiels par e-mail.',

   'QantaraTools Support':'Assistance QantaraTools','For support, bug reports, feedback, and general questions, email us at:':'Pour toute demande d’assistance, tout signalement de bug, commentaire ou question générale, écrivez-nous à :',
   'Please include the tool name and a short description of the issue. If relevant, include your browser, operating system, and approximate file size. Do not send passwords, private keys, or confidential information.':'Veuillez indiquer le nom de l’outil et décrire brièvement le problème. Si nécessaire, précisez votre navigateur, votre système d’exploitation et la taille approximative du fichier. N’envoyez aucun mot de passe, clé privée ou renseignement confidentiel.',
   'Tool Suggestions':'Suggestions d’outils','Have an idea for a useful new tool? Use the “Request a New Tool” option on the QantaraTools homepage or email your suggestion to the support address.':'Une idée d’outil utile ? Utilisez l’option « Proposer un nouvel outil » sur la page d’accueil de QantaraTools ou envoyez votre suggestion à l’adresse d’assistance.',
   'Before You Contact Us':'Avant de nous contacter','Refresh the page and try the tool again.':'Actualisez la page et réessayez.','Use a current browser.':'Utilisez un navigateur à jour.','For file tools, try a smaller sample file.':'Pour les outils de fichiers, essayez un fichier d’exemple plus petit.','Tell us exactly which step failed and what you expected to happen.':'Indiquez précisément l’étape qui a échoué et le résultat attendu.'
  },
  es:{
   'Skip to main content':'Saltar al contenido principal','Main navigation':'Navegación principal','Home':'Inicio','About':'Acerca de','FAQ':'Preguntas frecuentes','Contact':'Contacto','Privacy':'Privacidad','Terms':'Términos','Toggle theme':'Cambiar tema',
   'Contact Us':'Contacto','Need help with a tool, found a problem, or have a suggestion? We would be happy to hear from you.':'¿Necesitas ayuda con una herramienta, has encontrado un problema o tienes alguna sugerencia? Nos encantará recibir tu mensaje.',
   'Do not email passwords, private keys, or confidential files.':'No envíes contraseñas, claves privadas ni archivos confidenciales por correo electrónico.',

   'QantaraTools Support':'Soporte de QantaraTools','For support, bug reports, feedback, and general questions, email us at:':'Para recibir soporte, informar de errores, enviar comentarios o realizar consultas generales, escríbenos a:',
   'Please include the tool name and a short description of the issue. If relevant, include your browser, operating system, and approximate file size. Do not send passwords, private keys, or confidential information.':'Incluye el nombre de la herramienta y una breve descripción del problema. Si corresponde, indica tu navegador, sistema operativo y el tamaño aproximado del archivo. No envíes contraseñas, claves privadas ni información confidencial.',
   'Tool Suggestions':'Sugerencias de herramientas','Have an idea for a useful new tool? Use the “Request a New Tool” option on the QantaraTools homepage or email your suggestion to the support address.':'¿Tienes una idea para una herramienta útil? Utiliza la opción «Solicitar una nueva herramienta» en la página principal de QantaraTools o envía tu sugerencia al correo de soporte.',
   'Before You Contact Us':'Antes de contactarnos','Refresh the page and try the tool again.':'Actualiza la página e inténtalo de nuevo.','Use a current browser.':'Utiliza un navegador actualizado.','For file tools, try a smaller sample file.':'Para las herramientas de archivos, prueba con un archivo de muestra más pequeño.','Tell us exactly which step failed and what you expected to happen.':'Indica exactamente qué paso falló y qué resultado esperabas.'
  }
 };
 Object.assign(dict[locale],staticPageChrome[locale] || {});
 Object.assign(dict[locale], legalTranslations[locale] || {});
 const legalChrome={
  de:{
   'QANTARATOOLS / PRIVACY':'QANTARATOOLS / DATENSCHUTZ','QANTARATOOLS / TERMS':'QANTARATOOLS / NUTZUNGSBEDINGUNGEN','Last updated: October 17, 2026':'Zuletzt aktualisiert: 17. Oktober 2026',
   'Main navigation':'Hauptnavigation','Toggle theme':'Design umschalten',
   'Learn about QantaraTools, a free collection of practical browser-based utilities built to make everyday work quicker and easier.':'Erfahren Sie mehr über QantaraTools, eine kostenlose Sammlung praktischer Browser-Tools, die alltägliche Aufgaben erleichtern.',
   'Contact QantaraTools support for help, bug reports, feedback, and tool suggestions.':'Kontaktieren Sie den QantaraTools-Support bei Fragen, Fehlermeldungen, Feedback und Tool-Vorschlägen.',
   'Frequently asked questions and troubleshooting help for QantaraTools.':'Häufige Fragen und Hilfe zur Fehlerbehebung bei QantaraTools.'
  },
  fr:{
   'QANTARATOOLS / PRIVACY':'QANTARATOOLS / CONFIDENTIALITÉ','QANTARATOOLS / TERMS':'QANTARATOOLS / CONDITIONS','Last updated: October 17, 2026':'Dernière mise à jour : 17 octobre 2026',
   'Main navigation':'Navigation principale','Toggle theme':'Changer de thème',
   'Learn about QantaraTools, a free collection of practical browser-based utilities built to make everyday work quicker and easier.':'Découvrez QantaraTools, une collection gratuite d’outils pratiques dans le navigateur pour simplifier les tâches quotidiennes.',
   'Contact QantaraTools support for help, bug reports, feedback, and tool suggestions.':'Contactez l’assistance QantaraTools pour obtenir de l’aide, signaler un bug, donner votre avis ou suggérer un outil.',
   'Frequently asked questions and troubleshooting help for QantaraTools.':'Questions fréquentes et aide au dépannage pour QantaraTools.'
  },
  es:{
   'QANTARATOOLS / PRIVACY':'QANTARATOOLS / PRIVACIDAD','QANTARATOOLS / TERMS':'QANTARATOOLS / CONDICIONES','Last updated: October 17, 2026':'Última actualización: 17 de octubre de 2026',
   'Main navigation':'Navegación principal','Toggle theme':'Cambiar tema',
   'Learn about QantaraTools, a free collection of practical browser-based utilities built to make everyday work quicker and easier.':'Conoce QantaraTools, una colección gratuita de herramientas prácticas en el navegador para agilizar las tareas digitales cotidianas.',
   'Contact QantaraTools support for help, bug reports, feedback, and tool suggestions.':'Contacta con el soporte de QantaraTools para solicitar ayuda, informar de errores, enviar comentarios o sugerir herramientas.',
   'Frequently asked questions and troubleshooting help for QantaraTools.':'Preguntas frecuentes y ayuda para solucionar problemas en QantaraTools.'
  }
 };
 Object.assign(dict[locale],legalChrome[locale] || {});
 const dir=path.join(root,locale);fs.mkdirSync(dir,{recursive:true});
 for(const page of pages){
  let html=fs.readFileSync(path.join(root,page),'utf8');
  html=replaceText(html,dict[locale]);
  // Localize metadata and remaining accessibility chrome after text substitutions.
  const pageChrome={
   de:{'aria-label="Main navigation"':'aria-label="Hauptnavigation"','aria-label="QantaraTools home"':'aria-label="QantaraTools-Startseite"','content="Frequently asked questions and troubleshooting help for QantaraTools."':'content="Häufige Fragen und Hilfe zur Fehlerbehebung bei QantaraTools."'},
   fr:{'aria-label="Main navigation"':'aria-label="Navigation principale"','aria-label="QantaraTools home"':'aria-label="Accueil QantaraTools"','content="Frequently asked questions and troubleshooting help for QantaraTools."':'content="Questions fréquentes et aide au dépannage pour QantaraTools."'},
   es:{'aria-label="Main navigation"':'aria-label="Navegación principal"','aria-label="QantaraTools home"':'aria-label="Inicio de QantaraTools"','content="Frequently asked questions and troubleshooting help for QantaraTools."':'content="Preguntas frecuentes y ayuda para solucionar problemas en QantaraTools."'}
  };
  for(const [from,to] of Object.entries(pageChrome[locale] || {})) html=html.split(from).join(to);
  const faqCorrections={
   de:{
    'No blanket guarantee should be assumed. Many utilities are client-side, but some features can use external resources or live data. The Privacy Policy and the individual tool behavior are the correct references.':'Es gibt keine pauschale Garantie. Viele Tools laufen lokal im Browser, einige Funktionen können jedoch externe Dienste oder Live-Daten nutzen. Maßgeblich sind die Datenschutzerklärung und das tatsächliche Verhalten des jeweiligen Tools.',
    'Use the Contact Us page. The Contact Us page lists support@qantaratools.com. If you cannot reach us at that address, use the homepage tool-request option.':'Nutzen Sie die Kontaktseite. Dort finden Sie support@qantaratools.com. Falls Sie uns unter dieser Adresse nicht erreichen, verwenden Sie die Möglichkeit, auf der Startseite ein Tool vorzuschlagen.'
   },
   fr:{
    'No blanket guarantee should be assumed. Many utilities are client-side, but some features can use external resources or live data. The Privacy Policy and the individual tool behavior are the correct references.':'Aucune garantie générale ne doit être supposée. De nombreux outils fonctionnent dans le navigateur, mais certaines fonctions peuvent utiliser des services externes ou des données en direct. Consultez la politique de confidentialité et le fonctionnement de chaque outil.',
    'Use the Contact Us page. The Contact Us page lists support@qantaratools.com. If you cannot reach us at that address, use the homepage tool-request option.':'Consultez la page de contact, qui indique l’adresse support@qantaratools.com. Si vous ne parvenez pas à nous joindre à cette adresse, utilisez l’option de suggestion d’outil sur la page d’accueil.'
   },
   es:{
    'No blanket guarantee should be assumed. Many utilities are client-side, but some features can use external resources or live data. The Privacy Policy and the individual tool behavior are the correct references.':'No debe suponerse una garantía general. Muchas herramientas funcionan en el navegador, pero algunas funciones pueden utilizar servicios externos o datos en directo. Consulta la política de privacidad y el funcionamiento de cada herramienta.',
    'Use the Contact Us page. The Contact Us page lists support@qantaratools.com. If you cannot reach us at that address, use the homepage tool-request option.':'Consulta la página de contacto, donde figura support@qantaratools.com. Si no puedes comunicarte con nosotros mediante esa dirección, utiliza la opción para solicitar herramientas de la página principal.'
   }
  };
  for(const [from,to] of Object.entries(faqCorrections[locale] || {})) html=html.split(from).join(to);
  html=html.replace(/<html lang="en" dir="ltr">/,'<html lang="'+locale+'" dir="ltr">');
  const routeSlug=({'about-us.html':'about-us','contact.html':'contact','faq.html':'faq','privacy.html':'privacy','terms.html':'terms'})[page];
  // Replace canonical URLs whether the source uses www or the bare domain.
  html=html.replace(/<link rel="canonical" href="https?:\/\/(?:www\.)?qantaratools\.com\/[^"]*">/,'<link rel="canonical" href="'+site+'/'+locale+'/'+routeSlug+'/">');
  const pageTitles={
   de:{'about-us.html':'Über QantaraTools','contact.html':'Kontakt | QantaraTools','faq.html':'Häufig gestellte Fragen | QantaraTools','privacy.html':'Datenschutzerklärung | QantaraTools','terms.html':'Nutzungsbedingungen | QantaraTools'},
   fr:{'about-us.html':'À propos de QantaraTools','contact.html':'Contact | QantaraTools','faq.html':'Foire aux questions | QantaraTools','privacy.html':'Politique de confidentialité | QantaraTools','terms.html':'Conditions d’utilisation | QantaraTools'},
   es:{'about-us.html':'Acerca de QantaraTools','contact.html':'Contacto | QantaraTools','faq.html':'Preguntas frecuentes | QantaraTools','privacy.html':'Política de privacidad | QantaraTools','terms.html':'Términos del servicio | QantaraTools'},
   ru:{'about-us.html':'О QantaraTools | QantaraTools','contact.html':'Контакты | QantaraTools','faq.html':'Часто задаваемые вопросы | QantaraTools','privacy.html':'Политика конфиденциальности | QantaraTools','terms.html':'Условия использования | QantaraTools'},
   tr:{'about-us.html':'QantaraTools Hakkında | QantaraTools','contact.html':'İletişim | QantaraTools','faq.html':'Sıkça Sorulan Sorular | QantaraTools','privacy.html':'Gizlilik Politikası | QantaraTools','terms.html':'Hizmet Şartları | QantaraTools'},
   hi:{'about-us.html':'QantaraTools के बारे में | QantaraTools','contact.html':'संपर्क | QantaraTools','faq.html':'अक्सर पूछे जाने वाले प्रश्न | QantaraTools','privacy.html':'गोपनीयता नीति | QantaraTools','terms.html':'सेवा की शर्तें | QantaraTools'},
   'zh-CN':{'about-us.html':'关于 QantaraTools | QantaraTools','contact.html':'联系我们 | QantaraTools','faq.html':'常见问题 | QantaraTools','privacy.html':'隐私政策 | QantaraTools','terms.html':'服务条款 | QantaraTools'}
  };
  html=html.replace(/<title>[^<]*<\/title>/,'<title>'+pageTitles[locale][page]+'</title>');
  html=html.replace(/href="index\.html"/g,'href="/'+locale+'/"');
  for(const p of pages.concat(['faq.html','privacy.html','terms.html','contact.html'])){
   const slug=({'about-us.html':'about-us','contact.html':'contact','faq.html':'faq','privacy.html':'privacy','terms.html':'terms'})[p];
   const target='/'+locale+'/'+slug+'/';
   html=html.replace(new RegExp('href="'+p.replace('.','\\.')+'"','g'),'href="'+target+'"');
  }
  html=html.replace(/(?:src|href)="assets\//g,'$&'.replace('assets/','/assets/'));
  html=html.replace(/src="assets\//g,'src="/assets/').replace(/href="assets\//g,'href="/assets/');
  html=html.replace(/src="\/assets\/js\/language-switcher\.js"/g,'src="/assets/js/language-switcher.js"');
  const slug=routeSlug;
  const alternates=['en','de','fr','es','ru','tr','hi','zh-CN'].map(l=>'<link rel="alternate" hreflang="'+l+'" href="'+site+'/'+(l==='en'?page:l+'/'+slug+'/')+'">').join('\n');
  alternates+'<link rel="alternate" hreflang="ar" href="'+site+'/'+page+'?locale=ar">';
  html=html.replace('</head>',alternates+'\n<link rel="alternate" hreflang="ar" href="'+site+'/'+page+'?locale=ar">\n<link rel="alternate" hreflang="x-default" href="'+site+'/'+page+'">\n</head>');
  const outputDir=path.join(dir,slug);fs.mkdirSync(outputDir,{recursive:true});
  fs.writeFileSync(path.join(outputDir,'index.html'),html);
 }
}
const sitemapPath=path.join(root,'sitemap.xml');
if(fs.existsSync(sitemapPath)){
 let sitemap=fs.readFileSync(sitemapPath,'utf8');
 const urls=[];
 for(const locale of locales){
  for(const slug of ['about-us','contact','faq','privacy','terms']){
   const url=site+'/'+locale+'/'+slug+'/';
   if(!sitemap.includes('<loc>'+url+'</loc>')) urls.push('  <url><loc>'+url+'</loc></url>');
  }
 }
 if(urls.length) sitemap=sitemap.replace('</urlset>',urls.join('\n')+'\n</urlset>');
 fs.writeFileSync(sitemapPath,sitemap);
}

process.stdout.write('Generated localized About, Contact, FAQ, Privacy, and Terms pages for de, fr, es, ru, tr, hi, zh-CN.\\n');
