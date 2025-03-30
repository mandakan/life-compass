#!/bin/bash
# Filnamn: run-aider.sh

LOCALES_DIR="public/locales"

# Ta emot en inputparameter som specifik locale (om någon anges)
SPECIFIC_LOCALE="$1"

for dir in "$LOCALES_DIR"/*; do
  lang=$(basename "$dir")
  
  # Hoppa över svenska ("sv") och tlh
  if [ "$lang" = "sv" ] || [ "$lang" = "tlh" ]; then
    continue
  fi
  
  # Om en specifik locale anges och den inte matchar, hoppa över
  if [ -n "$SPECIFIC_LOCALE" ] && [ "$SPECIFIC_LOCALE" != "$lang" ]; then
    continue
  fi
  
  FILE="$dir/translation.json"
  if [ -f "$FILE" ]; then
    echo "Processing $FILE for language $lang"
    aider --model o3-mini --no-auto-commits --message "Make sure translation.json corresponds to the locale of the folder it resides in and that all strings are in the correct language." "$FILE"
  else
    echo "No translation.json found in $dir"
  fi
done