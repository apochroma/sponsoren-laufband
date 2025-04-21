#!/bin/bash
cd "$(dirname "$0")"
echo "Generiere aktuelles manifest.json ..."
./manifest.sh
echo "Starte lokalen Webserver unter http://localhost:8000"

# Stelle sicher, dass du im richtigen Ordner bist
cd "$(dirname "$0")"

# Öffne die Seite automatisch im Browser (optional)
open http://localhost:8000/index.html &

# Starte Python Webserver (funktioniert ab Python 3.x)
python3 -m http.server 8000