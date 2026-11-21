# Baut die Live-Vorschau „Startseite im Himmel-Stil“ aus der echten wetter-badkoenig.de-Startseite.
# Aufruf: python3 bauen.py <pfad zu wetterstation/index.html>
import sys, pathlib
src = pathlib.Path(sys.argv[1]).read_text(encoding='utf-8')
hier = pathlib.Path(__file__).parent
kopf = (hier / 'himmel-kopf.html').read_text(encoding='utf-8')
fuss = (hier / 'himmel-fuss.html').read_text(encoding='utf-8')
assert src.count('<head>') == 1 and src.count('</body>') == 1
src = src.replace('<head>', '<head>\n<base href="https://wetter-badkoenig.de/">\n<meta name="robots" content="noindex">', 1)
src = src.replace('</head>', kopf + '\n</head>', 1)
src = src.replace('</body>', fuss + '\n</body>', 1)
(hier / 'index.html').write_text(src, encoding='utf-8')
print('ok', len(src))
