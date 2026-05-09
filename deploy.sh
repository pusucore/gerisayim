#!/bin/bash
# ============================================
# Pusulabet Geri Sayım — GitHub Pages Deploy
# ============================================
# Kullanım: bash deploy.sh

set -e

echo "📦 Bağımlılıklar yükleniyor..."
npm install

echo "🔨 Production build alınıyor..."
npm run build

echo "🚀 GitHub Pages'e deploy ediliyor..."
npx gh-pages -d dist --message "Deploy: $(date +'%Y-%m-%d %H:%M')"

echo ""
echo "✅ Deploy tamamlandı!"
echo "🌐 Site: https://pusucore.github.io/gerisayim/"
