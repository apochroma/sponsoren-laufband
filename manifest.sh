#!/bin/bash

output="manifest.json"

# Ordner unter media/
folders=("media/01_gold" "media/02_silber" "media/03_bronze")
categories=("gold" "silver" "bronze")

# JSON Start
echo "{" > "$output"

for i in "${!folders[@]}"; do
  folder="${folders[$i]}"
  category="${categories[$i]}"

  echo "  \"$category\": [" >> "$output"

  first=true
  for file in "$folder"/*.{png,jpg,jpeg}; do
    [ -e "$file" ] || continue
    filename=$(basename "$file")

    if [ "$first" = true ]; then
      echo "    \"$filename\"" >> "$output"
      first=false
    else
      echo "    ,\"$filename\"" >> "$output"
    fi
  done

  if [ "$i" -lt $((${#folders[@]} - 1)) ]; then
    echo "  ]," >> "$output"
  else
    echo "  ]" >> "$output"
  fi
done

echo "}" >> "$output"
echo "✅ manifest.json wurde erfolgreich erstellt."
