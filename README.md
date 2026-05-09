# Pusulabet — 2026 Dünya Kupası Geri Sayım

Telegram Mini App olarak çalışan premium geri sayım uygulaması.

## Hızlı Deploy (GitHub Pages)

```bash
# 1. Repoyu klonla
git clone https://github.com/pusucore/gerisayim.git
cd gerisayim

# 2. Yeni dosyaları kopyala (zip içindekiler)
# Tüm dosyaları repo klasörüne kopyala, üzerine yaz

# 3. Tek komutla deploy et
npm run deploy
```

`npm run deploy` komutu:
- `npm install` bağımlılıkları yükler
- `npm run build` ile dist/ oluşturur  
- `gh-pages` ile dist/ klasörünü gh-pages branch'ine push lar

## Manuel Adımlar (alternatif)

```bash
npm install
npm run build

# dist/ içeriğini gh-pages branch'ine at
git checkout gh-pages || git checkout --orphan gh-pages
cp -r dist/* .
git add .
git commit -m "Deploy"
git push origin gh-pages
```

## GitHub Pages Ayarı

Settings → Pages → Source:
- Branch: `gh-pages`
- Folder: `/ (root)`

## Telegram Bot Bağlantısı

BotFather'da:
```
/setmenubutton
URL: https://pusucore.github.io/gerisayim/
Text: 🏆 2026 Dünya Kupası
```
