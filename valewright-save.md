# valewright-save – Gedächtnis für Valewright

> **Für Claude:** Diese Datei ist das dauerhafte Gedächtnis zum Spiel Valewright. Lies sie zu Beginn jeder Arbeit am Spiel
> (`git clone https://github.com/sakomobil-beep/zentrale` → `valewright-save.md`) und **ergänze sie nach jeder Änderung**
> (Abschnitt 6 „Verlauf“ + betroffene Abschnitte). Die Zentrale-Seite „🎮 Spielentwicklung“ verlinkt sie.
>
> Achtung: Das Repo `zentrale` ist öffentlich – hier nur Spiel-Wissen, keine Passwörter, keine privaten Daten.

**Stand: 27.11.2026, 20:05 Uhr · Alpha 0.0.0.4.5**

---

## 1. Eckdaten

| | |
|---|---|
| Spiel | **Valewright – Baue. Wirtschafte. Herrsche.** (früher „Odenwald-Siedler“) |
| Studio | **Odenforge** – Ein-Mann-Entwicklung von Kingman (Homepage in Ich-Form) |
| Genre | Aufbauspiel nach Vorbild Die Siedler 3: freies Laufen ohne Straßen, Warenketten wie Anno, Gebiete, KI-Gegner |
| Stil | Fachwerkhäuser aus dem Odenwald (im Spiel keine echten Ortsnamen) |
| Engine | **Godot 4.7.2** (wird weiterentwickelt) – Repo `sakomobil-beep/valewright`, Web-Build sakomobil-beep.github.io/valewright |
| Alte Browser-Version | three.js, eingefroren – Repo `sakomobil-beep/odenwaldsiedler` |
| Webseiten | valewright.de (Coming Soon, Repo `valewright-web`) · odenforge.de (Studio, Repo `odenforge-web`) |
| Windows | Installer (NSIS) als ZIP an Kingman, **kein** GitHub-Release (wird blockiert) |
| Veröffentlichung | itch.io-Konto „odenforge“ – Steam vielleicht später |
| Vorschaubilder/Videos | Google Drive, Ordner **„Siedlerspiel“** |
| Protokoll | Zentrale → „🎮 Spielentwicklung“ (jede Änderung mit Datum, Uhrzeit, Version) |

## 2. Feste Regeln (von Kingman)

- **Vorher fragen**, bevor etwas Neues angefangen wird. Erst Info/Vorschlag, dann auf „Ja/los“ warten.
- **Antworten auf Deutsch**, Kingman mit „Kingman“ ansprechen.
- **Jede Änderung:** fortlaufende Version „Alpha 0.0.0.x.y“ + STAMP (`scripts/build_info.gd`), Eintrag in der Zentrale (`<li>` nach dem letzten Eintrag, `id="sgStand"` und Seitenleiste „Zentrale-Stand“ aktualisieren), Vorschaubilder in Drive „Siedlerspiel“.
- **Eigene Ideen statt Kopie:** Siedler ist Vorbild, aber Konzepte, Namen und Grafik sind eigen (z. B. Träger-Konzept „Zunft & Nachbarschaft“).
- **Zusehen bei der Produktion ist ein Hauptpunkt** – Abläufe detailliert und flüssig animieren.
- **Keine Tageszeit, keine Nacht** (auch keine Nachtgeräusche). Jahreszeiten-Farben vielleicht später.
- **Keine Straßen.** Niemand läuft durch Häuser. Dächer dürfen Arbeitsplätze nicht verdecken.
- **Alles hat einen Zusammenhang** – keine Deko ohne Bezug. Boote nur bei Fischern.
- **Zweisprachig** (DE/EN). **Keine Emoji-Platzhalter** für Waren/Gebäude (eigene Bilder).
- **Rechtsklick schließt** Fenster/Menüs; Mausrad über Fenstern zoomt nicht die Karte.
- **Nur freie Inhalte:** Musik CC0 oder selbst erzeugt, alles in `CREDITS.md` und im „Über“-Fenster.
- **Erze nur im Gebirge**, Erweiterung mit Wachtürmen.
- Update-Prüfung beim Start: **vorerst nicht gewünscht**.

## 3. Was im Spiel steckt (Stand 0.0.0.4.5)

**Oberfläche:** Holzrahmen-Stil, moderne Hausmenüs (Wohnhaus, Werkstätten, Militär, Handwerkskammer, Haupthaus mit Reitern Lager/Wache/Mauer), Statistik/Bilanz/Militär/Produktionsketten, Grafik-Einstellungen mit Voreinstellungen (Schatten, Kantenglättung, FSR, Baumweite, Dunst), Intro mit Odenforge-Logo, Tutorial (12 Schritte, „Schließen und weiterspielen“), Kampagne Kapitel 1, Erfolge (18), Statistik der Probleme.

**Welt & Grafik:** Gebirgszüge mit Stein/Kohle/Eisen/Gold, Startgebiet 43,2 m, Wasser-Shader, Gras mit Wind/Klee/Farn (zeitlich verteilt gestreut), HD-Bäume (6 Arten, LOD), Katzen jagen Mäuse, Haus-Aufstieg mit Gerüst-Animation, Mühlenflügel drehen.

**Wirtschaft:** Rezepte in `economy.gd` (`REC`), Lager-Obergrenze 60 (Holz/Bretter/Stein 250), Werkzeuge (Werkzeug-Warnung unter 5), Felsen im Startgebiet: ca. 50 % mehr und doppelt ergiebig, Bäckerei backt 2 Brote je Durchgang.

**Werkstätten** (`scripts/workshops.gd`): 24 Gebäude mit animierter Station am Haus und Ablauf in Schritten, synchron zum Arbeiter, Ware wandert in der Hand, aktueller Schritt im Gebäudefenster. Eigene Animationen außerdem: Sägewerk (3D-Stamm, Säge), Mühle, Zechen (`mines3d.gd`), Tierzucht (`farms.gd`), Bauernhof-Felder. Brunnen hat noch keinen eigenen Ablauf.

**Träger – eigenes Konzept „Zunft & Nachbarschaft“:**
- **10 Zunftträger wohnen im Haupthaus** (zählen nicht als Einwohner); weitere über die Handwerkskammer aus den Einwohnern.
- **Planung:** alle freien Träger gemeinsam alle 0,4 s; Auftrag an den nächsten Träger; Dringliches zuerst (stillstehende Werkstatt, volllaufender Ausgang, Haus ohne Ware); keine Doppelwege; nach dem Abliefern kein Leerweg zum Lager; **2 Stück je Gang** (Karren 4, Meister 3).
- **Nachbarschaftshilfe:** jedes Wohnhaus 1 fester Helfer, ab Stufe 2 ein zweiter (der zweite ist Bewohner, zählt mit und wird bei Arbeitermangel zuerst abgerufen – „Variante C“). Helfer tragen nur im Umkreis 25 m, Kiepe neben der Haustür.
- **Umschlagplatz** (Baumenü Siedlung, 4 Bretter + 2 Stämme, 12 Waren): Wege > 35 m werden geteilt, wenn ein Platz auf der Strecke liegt.
- **Untätige Träger** gehen nach ca. 4 s ins nächste Lager hinein (Helfer ins eigene Haus) und warten drinnen unsichtbar (`w.inside`); beim nächsten Auftrag kommen sie an der Tür heraus.
- **Trägerzunft:** Lehrling → Geselle (40 Waren, blaue Schärpe, +12 % Tempo) → Meister (120 Waren, goldene Schärpe + Hut, +22 %, 3 Stück). Erfahrung wird gespeichert.

**Militär:** 2 Wächter am Haupthaus ab Start, postiert links und rechts vom Eingang (2,4 m seitlich, kehren auf den Posten zurück) (Einberufen/Entlassen, Ränge zählen), Angriffswarnung, **Wehrmauer** (Holzpalisade +35 %/+2 Plätze, Steinmauer +80 %/+4), Wachtürme zeigen „Besetzt“.

**Klang:** Musik CC0 (RandomMind: The Old Tower Inn, The Bard's Tale, Minstrel Dance, King's Feast, Lament for a Warrior's Soul; Cethiel: Lament of the War) als Loops – Menü/Aufbau/Kampf. Umgebungs- und Arbeitsgeräusche selbst erzeugt (`tools/compose_ambient.py`). Drei Regler.

**Sicherheit:** Autosave alle 5 Min. in 3 Ständen im Wechsel, sicheres Schreiben über Temp-Datei, Speichern beim Schließen.

## 4. Offene Punkte

1. Große Testpartie bis Stufe 3 mit allen Träger-Neuerungen (Käse/Kleidung bisher nie erreicht; Getreide knapp bei Mühle+Brauerei+Schweinezucht+Kuhstall).
2. Brot: ggf. 3 je Durchgang oder Hinweis „Mehl da, Brot fehlt“ – nach Testpartie entscheiden.
3. Jahreszeiten-Farben; Brunnen-Kurbel animieren; optional Name auf odenforge.de.
4. Rechenaufwand der Trägerplanung (+10–15 %) beobachten.
5. Bei Kingman: Werkstätten unter Windows ansehen, Kiepe-Position prüfen, itch.io-E-Mail bestätigen.

## 5. Technik-Notizen für Claude

- **Pfade:** Godot-Repo `/home/claude/valewright`, Zentrale `/home/claude/zentrale`, Godot-Binary `/home/claude/tools/Godot_v4.7.2-stable_linux.x86_64` (sonst neu laden; Export-Vorlagen in `~/.local/share/godot/export_templates/4.7.2.stable`).
- **Commits:** `git -c user.name="Claude" -c user.email="noreply@anthropic.com" commit` mit Trailern `Co-Authored-By: Claude …` und `Claude-Session: …`; vorher `git fetch/pull`; Push `git -c push.negotiate=true push -q origin HEAD:main`.
- **Windows-Build:** `--headless --import`, dann `--headless --export-release "Windows Desktop" build/windows/Valewright.exe`, Version in `build/windows/installer.nsi` per sed, `makensis -V1`, ZIP nach `/home/claude/`, per SendUserFile.
- **Texte:** `translations/texts.tsv` – genau 3 Spalten, `\n` wörtlich. Neue Emojis → `sh tools/make_emoji_font.sh`.
- **GDScript:** kein `:=` bei Werten ohne festen Typ (Array-Elemente, `.any()`, Dictionary-Werte). Shader-Kommentare nur `//`. Gebäude-Dictionaries **nie als Dictionary-Schlüssel** (Rekursion) – Instanz-ID nehmen.
- **Werkstätten:** `Workshops.STEPS` {id, p, l, a, t, hw}, Bau `_b_<typ>`, Animation `_a_<typ>(b, P, schritt, f, dt, t, working)`; `settlers._seq_next` setzt `b.ws_i/ws_el/ws_d`; Hof-Ausstattung rechts vom Haus wird ausgeblendet (außer `KEEP`).
- **Träger:** `settlers._carrier_jobs` (Zuteilung), `_carrier_job_list` (Aufträge), `_start_carry` (Ablauf), `_helper_spawn`/`release_helper` (Nachbarschaft), `Umschlag.pick` (scripts/umschlag.gd), `_gain_xp/_set_rank` (Zunft), `economy.take_person()` (ruft zweite Helfer ab), `economy.HQ_CARRIERS`, `carriers_n` = zusätzliche Träger.
- **Gras:** `grass.gd` streut in Häppchen (`_scatter_step`, max. 4 ms/Bild) – früher Ursache der Ruckler bis 1,5 s.
- **Tests:** headless `--fixed-fps 20 -s skript.gd`; Bilder mit `xvfb-run … --rendering-driver opengl3`; während Wartezeiten `root.get_viewport().disable_3d = true`. Test-Bot `_sim.gd` (nicht im Repo, nach `/home/claude/sim/`): baut nach Bedarf, erweitert mit Türmen, stockt Träger auf, setzt Umschlagplätze, loggt alle 3 Spielminuten (Einwohner, Lager, Status, Ruckler).
- **Drive-Upload:** Datei unter `/home/claude`, `sha256sum` als Referenz; große Videos vorher verkleinern (≈2 MB ok, 17 MB nicht).

## 6. Verlauf (kurz)

- **23.11.2026 – Start als Browser-Spiel „Odenwald-Siedler“ (three.js):** Demo mit Holzfäller, Sägewerk, Steinmetz, Bauernhof (sät sichtbar), Mühle, Brunnen, Bäckerei; Bauen in zwei Schritten (Platz wählen → bestätigen); Baumenü in Kategorien; Berge mit Stein/Eisenerz/Kohle, Zechen brauchen Brot bzw. Fisch; Eisenschmelze → Werkzeugschmied; Siedler brauchen Werkzeug; Gebiete mit Fähnchen, Waffenschnitzer (Kampfstöcke), Wächter und Wachtürme; Seen, Fluss mit Fischen, Fischer, Brücke, echte Wegfindung; sanfte Ufer; Schweinezucht + Metzger.
- **23./24.11.2026 – Ausbau Browser-Version:** Speichern/Laden, Statistik, Vorrang, Abreißen, Gold + Münzprägerei, zweites Lager (später: nur ein Lagerhaus im Baumenü), Träger; Straßen ausprobiert und verworfen; Grafik (Umgebungsverdeckung, Bloom, Schatten, Gras/Blumen, detaillierte Bäume, Berufskleidung), Arbeit im Freien, Geräusche; Fachwerkstil gemischt (Voll-, Giebel-, Putzfassaden); Name **Valewright** und Studio **Odenforge** gewählt; KI-Gegner wählbar (Friedlich/mit Kampf, Leicht/Mittel/Schwer), Nebel des Krieges; Kampagne „Die Chronik von Valewright – Buch I: Das Erbe des Tals“ (Kapitel 1 friedlich, Kapitel 2 mit Gegner, Finale Kapitel 4); Spielziele wählbar (Endlos/Sieg, nach Sieg weiterspielen); Godot-Leistungstest 195 FPS → Umzug nach Godot 4.7.2 begonnen (Repo `valewright`).
- **25.11.2026:** Domains valewright.de/odenforge.de (netcup) auf GitHub Pages, itch.io-Konto „odenforge“; ab jetzt nur noch Godot. Wohnhäuser steigen nie ab, Abreißen gibt 50 % zurück, Handwerkskammer (Ausbildung 5 Min., 1 Werkzeug), Einwohner-System, Ausbau mit Bonus kostet Münzen.
- **25.11.2026:** Godot an Browser-Version angeglichen, Holzrahmen-UI, Domains umgestellt, Zentrale-Seite angelegt.
- **26.11.2026:** Testpartien mit Bot, Gebirgszüge; Tutorial, Sägewerk-3D, Zechen, Tierzucht neu, Statistik, moderne Menüs, Produktionsketten, Wasser, Emoji-Schrift, Mühle, Haus-Gerüst, Katzen, Haupthaus-Wache, Karren-Parkplatz, Angriffswarnung, Grafik Stufe 1+2, Windows-Installer, Grafik-Einstellungen, Intro, odenforge.de in Ich-Form, Musik (erst selbst komponiert, dann CC0), Credits, Absturzschutz, Wehrmauer (bis 0.0.0.3.8).
- **27.11.2026 nachts (0.0.0.3.9):** Umgebungsgeräusche, Erfolge, 24 animierte Werkstätten + Video.
- **27.11.2026 (0.0.0.4.0):** 10 Träger im Haupthaus, Werkzeug-Warnung, Turm „Besetzt“, mehr Felsen, Gras-Ruckler behoben.
- **0.0.0.4.1:** klügere Träger (gemeinsame Planung, 2 Stück je Gang).
- **0.0.0.4.2/4.3:** Nachbarschaftshilfe, Variante C.
- **0.0.0.4.4:** Umschlagplatz.
- **0.0.0.4.5:** Trägerzunft (Lehrling/Geselle/Meister).

## 7. Weitere Spiele im Claude-Projekt „Spiele für Luca“

- **Grundsatz für neue Spiele:** HTML + Phaser, Level und Grafik getrennt vom Code (späterer Umzug nach Godot/APK möglich); Comic-Stil (dunkle Umrisse, weiche Lichter, Sprite-Sheets); Vorschauen in Drive „Spiele für Luca – Vorschauen“. Ausnahme: Valewright läuft in Godot.
- **Rette die Geschenke!** (Weihnachts-Jump'n'Run für Luca): 5 Welten, optionale Rechentore, Adventskalender am 23.11.2026 wieder entfernt – normal durchspielbar. Live: sakomobil-beep.github.io/lern-apps/rette-die-geschenke/ (Repo `lern-apps`).
- **Baum-Detektiv** (Lern-App, Laub- und Nadelbäume für die Sachkundearbeit am 27.11.2026) auf sakomobil-beep.github.io/lern-apps.
- **Auto-Tycoon** (für Kingman, Version 1 als Claude-Artefakt): Autos entwickeln, in der Fabrik bauen, über Läden in einer Stadt verkaufen; Anno-artig, isometrisch, Echtzeit mit Pause; Wünsche: komplexere Entwicklung mit Autobildern, größere lebendige Stadt, Grafik-Ausbau Stufe 1+2 (Gebäude, Gelände/Wasser/Straßen), 1 Spieltag = 1 Minute, langsamere Autos/Fußgänger. Ruht derzeit.
- **0.0.0.4.6:** untätige Träger gehen ins Haus, Wachen links/rechts vom Eingang. Gedächtnisdatei valewright-save angelegt.

- 27.11.2026, 21:15 · Alpha 0.0.0.4.14: Neue Mühle (scripts/mill.gd) und neues Sägewerk ohne Dach über der Säge (scripts/sawmill.gd), Abläufe in workshops.gd.
- 27.11.2026, 22:10 · Alpha 0.0.0.4.14: Neuer Bauablauf (scripts/construction.gd): Phasen 0–30 % Fundament, 30–65 % Gerüst/Fachwerk/Wände, 65–85 % Dachstuhl (Arbeiter klettert, Schritte "climb"/"walk_up" in settlers.gd), 85–100 % Dach. Modell wird per Clip-Höhe eingeblendet (Traufe = unterste große PrismMesh). Pro Arbeitsgang max. 12 % Fortschritt. Nur an der Bäckerei getestet; offen: andere Gebäude prüfen, Bauzeit beobachten.
- 27.11.2026, 22:45 · Alpha 0.0.0.4.14: Kingman mochte den Clip-Bauablauf nicht → Variante A: Bauteile (MeshInstances, sortiert nach Höhe) erscheinen einzeln mit Hüpfer (construction.gd: site_bits, _pop). Behebt auch: Sägewerk/Mühle (material_override) standen sofort da. Fachwerk-Gerippe und Dachstuhl-Sparren sind ausgeblendet.
- 27.11.2026, 22:40 · Alpha 0.0.0.4.14: Sägewerk-Stapel von (2.55,1.15) nach vorne rechts (2.1,2.55) verlegt, Schritt "stack" angepasst.
- 27.11.2026, 22:50 · Alpha 0.0.0.4.14: Fundament nach Haus-Grundfläche (Wandteile am Boden, site um Mittelpunkt verschoben); Sägewerk-Stapel zeigt nur b.out.bretter. Kingman mag den Bauablauf noch nicht – Idee eigenes Baustellen-Haus aus vielen Einzelteilen angeboten.
- 27.11.2026, 23:00 · Alpha 0.0.0.4.14: Kingman will KEIN Steinfundament – site_found immer unsichtbar, Bauteile erscheinen ab 2 %.
- 27.11.2026, 23:40 · Alpha 0.0.0.4.14: Sägewerk-Stapel = genau b.out.bretter Bretter (1 Modell je Brett, 0,9 m). Kingman: abgelegte Ware muss exakt zur Animation passen.
- 27.11.2026, 23:50 · Alpha 0.0.0.4.14: Baustelle = Absteckung + X, kein Einebnen/Gerüst/Leiter; Haus hohl per Clip-Shader (cull_disabled, Rückseiten 0,45 dunkler) von unten nach oben. Mühle: Vordach weg, Säcke vorne (1.7,2.25) = b.out.mehl.
