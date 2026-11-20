#!/bin/sh
# Збирає статичний сайт для Netlify: prototype/oplaty.html -> dist/index.html (повний HTML-документ).
set -e
rm -rf dist && mkdir -p dist
{
  printf '<!doctype html>\n<html lang="uk">\n<head>\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
  cat prototype/oplaty.html
  printf '\n</html>\n'
} > dist/index.html
cp dist/index.html dist/oplaty.html
echo "dist/index.html готовий"
