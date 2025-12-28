# 🚀 HIZLI BAŞLANGIÇ

## En Hızlı Yöntem (Claude.ai)

1. **beton-recete-app.jsx** dosyasını açın
2. İçeriği kopyalayın (Ctrl+A → Ctrl+C)
3. Claude.ai'a gidin
4. "Bu React kodunu çalıştır" deyin
5. Kodu yapıştırın
6. ✨ Çalışıyor!

---

## Alternatif: Tek Dosya HTML

1. **beton-recete-standalone.html** dosyasını text editörle açın
2. **beton-recete-app.jsx** içeriğini kopyalayın
3. HTML'in 276. satırından sonra yapıştırın
4. İlk satırı değiştirin:
   ```javascript
   // Eski
   import React, { useState, useEffect, useMemo } from 'react';
   
   // Yeni
   const { useState, useEffect, useMemo } = React;
   ```
5. Kaydedin ve tarayıcıda açın
6. ✨ Çalışıyor!

---

## Geliştirici Kurulumu (Node.js)

### Gereksinimler
- Node.js >= 16.0.0
- npm >= 8.0.0

### Adımlar

```bash
# 1. React projesi oluştur
npx create-react-app beton-recete-app
cd beton-recete-app

# 2. Gerekli paketleri kur
npm install recharts lucide-react

# 3. App.js'i değiştir
# beton-recete-app.jsx içeriğini src/App.js'e kopyala

# 4. Çalıştır
npm start
```

Tarayıcıda http://localhost:3000 otomatik açılır.

---

## Production Build

```bash
# Build oluştur
npm run build

# Build klasörü hazır - deploy edilebilir
```

---

## Deploy Seçenekleri

### Vercel (Önerilen)
```bash
npm install -g vercel
vercel
```
Link: https://vercel.com

### Netlify
1. Build yap: `npm run build`
2. build/ klasörünü Netlify'a sürükle-bırak

Link: https://netlify.com

### GitHub Pages
```bash
# package.json'a ekle:
# "homepage": "https://kullaniciadi.github.io/beton-recete"

npm install gh-pages --save-dev
npm run deploy
```

---

## İlk Kullanım

1. **Ana Sayfa**: 3 seçenek görürsünüz
2. **Yeni Proje**: Wizard'ı başlatın
3. **5 Adım**: Her adımda form doldurun
4. **Sonuç**: Reçete ve grafikler otomatik
5. **Kaydet**: localStorage'a kaydedilir

---

## Özellikler

✅ **14 Beton Sınıfı** (C8/10 - C80/95)
✅ **21 Çevre Etki Sınıfı** (X0, XC, XD, XS, XF, XA, XM)
✅ **Otomatik Hesaplamalar**
✅ **Gradasyon Grafikleri**
✅ **Rutubet Düzeltmesi**
✅ **Deneme Dökümü** (25L / 50L)
✅ **Standart Yönetimi** (Düzenlenebilir)
✅ **localStorage Persistence**
✅ **Responsive Design**
✅ **Dark Theme**

---

## Sorun mu Var?

### localStorage Temizle
```javascript
// Tarayıcı Console'da (F12):
localStorage.clear();
location.reload();
```

### Hata Mesajları
F12 → Console → Hataları okuyun

### Destek
- README.md: Detaylı kılavuz
- GitHub Issues: Sorun bildirin

---

## İpuçları

💡 **Yedekleme**: Settings → Console'da veri export
💡 **Standart Ekleme**: Settings → Yeni Ekle
💡 **Hızlı Test**: Claude.ai en hızlısı
💡 **Production**: Vercel ücretsiz ve hızlı

---

**BAŞARILAR!** 🎉

5 dakikada çalışır durumda olmalısınız.
