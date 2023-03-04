# Sectorfile Updater
Dieses kleine Tool soll GNG Sector Müll beheben. Leider beschäftigt sich jeder, jeden beschissenen AIRAC Cycle Monat damit, seine Daten neuaufzusetzten und wieder alle Daten einzutragen. So nicht, dachte sich eines Tages PaBr und Herr Schalli war sofort dabei. Sie sagten: "Wir machen diesen Fuck nicht mehr mit" und entwickelten in ewigen Nächsten diese Problemlösung.

## Programmschritte:

* Select ES Folder
* Version herausfinden / eingeben
* Updates prüfen (file from Server mit Update Möglichkeiten) bspw (vonVersion-nachVersion):
  * 2207-2201
  * 2207-2202
  * 2207-2203
  * 2207-2204
  * 2207-2205
  * 2207-2206
* Update herunterladen und enpacken
  * Hierbei werden neue und modifizierte Dateien verändert. (Erkannt wird das vorab mit einem Server script, welches die Fullpackes vergleicht und mittels git vergleicht. Einschränkung hier --diff-filter=ACRTUXBD)
  * Inline, wie bei Git ist hier nicht möglich, da nicht git vorrausgesetzt werden kann auf dem Zielcomputer
* _Optional_: Alte Dateien können gelöscht werden. Hauptsächlich betrifft das Sectorfiles sowie alte config Dateien von Plugins

## Technische Herausfoderungen:
* Electron APP (Multiplatform Support (theorie, da ES nur auf Windows läuft))
* Namenskonvention in html, css & js:
  * Camelcase (https://en.wikipedia.org/wiki/Camel_case)
* Bash Scripting

## ToDo:
* Folder Selector
* Version Selector
* Input User Variable Save to txt/json/yaml file
* UI
* unzip
* delete old non used files Option

## Done:
* Download
* Progressbar Download

## Quellen:
* Midjourney AI: https://www.midjourney.com/
* OpenAI: ChatGPT: https://chat.openai.com/
* GitHub Copilot: https://github.com/features/copilot