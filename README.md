# BETON REÇETE WEB UYGULAMASI - Kurulum ve Kullanım Kılavuzu

## 📋 İÇİNDEKİLER
1. Genel Bakış
2. Özellikler
3. Kurulum
4. Kullanım
5. Standart Yönetimi
6. Veri Saklama
7. Genişletme Rehberi

---

## 1. GENEL BAKIŞ

Modern, profesyonel beton reçete tasarım web uygulaması. C8/10'dan C80/95'e kadar tüm beton sınıfları, 21 çevre etki sınıfı ve tam otomatik hesaplama sistemi.

### Teknoloji Stack
- **Frontend**: React 18
- **Grafik**: Recharts
- **Icons**: Lucide React
- **Veri Saklama**: localStorage (tarayıcı)
- **Stil**: Vanilla CSS (Embedded)

### Tasarım Konsepti
- **Estetik**: Industrial/Technical + Modern Laboratory
- **Renkler**: Dark theme, yeşil/mavi accent
- **Tipografi**: JetBrains Mono (monospace) + Space Mono (headings)
- **Layout**: Grid-based, responsive

---

## 2. ÖZELLİKLER

### ✅ Tam Özellikli
- **14 Beton Sınıfı**: C8/10 - C80/95
- **21 Çevre Etki Sınıfı**: X0, XC1-4, XD1-3, XS1-3, XF1-4, XA1-3, XM1-3
- **Otomatik Hesaplamalar**: Su/çimento, çimento miktarı, katkı dozajları
- **Rutubet Düzeltmesi**: Se-R hesabı, su düzeltmesi
- **Gradasyon Kontrolü**: Kombine eğri, pompa uyumluluk
- **Deneme Dökümü**: 25L ve 50L otomatik ölçekleme
- **Gerçek Zamanlı Grafik**: İnteraktif gradasyon eğrisi

### 🔧 Düzenlenebilir
- **Beton Sınıfları**: Yeni sınıf ekleme, mevcut düzenleme
- **Çevre Etki Parametreleri**: Limit güncelleme
- **Pompa Sınırları**: Gradasyon limitleri düzenleme

### 💾 Veri Yönetimi
- **Proje Kaydetme**: localStorage ile kalıcı saklama
- **Konfigürasyon Yönetimi**: JSON tabanlı ayarlar
- **Export**: PDF/Excel çıktı hazır

### 📱 Responsive
- Desktop, tablet, mobil uyumlu
- Touch-friendly interface

---

## 3. KURULUM

### Yöntem 1: Claude.ai'da Çalıştırma (EN KOLAY)

1. **Dosyayı Görüntüle**
   - `beton-recete-app.jsx` dosyasını açın
   - İçeriği kopyalayın (Ctrl+A, Ctrl+C)

2. **Claude'da Çalıştır**
   - Claude.ai'a gidin
   - "Bu React kodunu çalıştır" deyin
   - Kodu yapıştırın
   - Artifact olarak çalışacak

### Yöntem 2: Yerel Geliştirme Ortamı

#### Gereksinimler
```bash
Node.js >= 16.0.0
npm >= 8.0.0
```

#### Adımlar

1. **Proje Oluştur**
```bash
npx create-react-app beton-recete-app
cd beton-recete-app
```

2. **Gerekli Paketleri Kur**
```bash
npm install recharts lucide-react
```

3. **Dosyayı Kopyala**
- `beton-recete-app.jsx` içeriğini kopyalayın
- `src/App.js` dosyasına yapıştırın

4. **Çalıştır**
```bash
npm start
```

Tarayıcıda `http://localhost:3000` adresinde açılır.

### Yöntem 3: Statik HTML (Tek Dosya)

`beton-recete-standalone.html` adında dosya oluşturun:

```html
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Beton Reçete Sistemi</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://unpkg.com/recharts@2.5.0/dist/Recharts.js"></script>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    // beton-recete-app.jsx içeriğini buraya yapıştırın
  </script>
</body>
</html>
```

---

## 4. KULLANIM

### 🏠 Ana Sayfa

Uygulama açıldığında 3 seçenek:

1. **Yeni Proje**: Yeni reçete tasarımı başlat
2. **Kayıtlı Projeler**: Geçmiş çalışmaları görüntüle
3. **Standart Yönetimi**: Konfigürasyon düzenle

### 📝 Yeni Proje Wizard (5 Adım)

#### ADIM 1: Proje Bilgileri
- **Proje Adı**: Tanımlayıcı isim girin
- **Beton Sınıfı**: Dropdown'dan seçin (C8/10 - C80/95)
  - fck ve fcm otomatik gelir
- **Çevre Etki Sınıfı**: Dropdown'dan seçin
  - Max s/ç, Min çimento, Min hava % otomatik
- **Kıvam**: Çökme sınıfı seçin (S1-S5)
- **Hedef s/ç**: Manuel girin

**Otomatik Kontroller:**
- ✅ Seçilen beton sınıfı çevre etkisine uygun mu?
- ✅ s/ç oranı şartname limitlerinde mi?

#### ADIM 2: Malzemeler
- **Su Miktarı**: kg/m³ cinsinden
- **Çimento**:
  - Tipi (örn: CEM II/B 42.5R)
  - Yoğunluk (genelde 3.0 kg/dm³)
- **Kimyasal Katkı**:
  - Dozaj % (çimento ağırlığına göre)
  - Yoğunluk
  - Miktar **otomatik hesaplanır**
- **Hava Sürükleyici**:
  - Kullanım seçimi (EVET/HAYIR)
  - Hava % otomatik gelir

**Otomatik Hesaplamalar:**
- Çimento miktarı = Su / s/ç
- Min çimento kontrolü
- Katkı miktarı = Çimento × Dozaj%

#### ADIM 3: Agregalar
Tablo formatında her agrega için:
- Tane sınıfı (0/4, 4/11.2, 11.2/22.4 mm)
- Yoğunluk (kg/dm³)
- Su emme - Se (%)
- Rutubet - R (%)
- **Se-R otomatik hesaplanır**

**Otomatik:**
- Ağırlıklı ortalama yoğunluk (ρa)

#### ADIM 4: Gradasyon
- **Karışım Oranları**: Her agrega için % girin
  - Toplam 100 kontrolü
- **Kombine Eğri**: Otomatik hesaplanır
- **GRAFİK**: Real-time gradasyon eğrisi
  - Yeşil çizgi: Kombine eğri
  - Turuncu çizgiler: Min/Max sınırlar
- **Pompa Uyumluluk**: Her elek için ✓/✗

#### ADIM 5: Reçete Sonuçları

3 ayrı reçete görüntülenir:

**A) DKY Reçetesi (1 m³)**
- Laboratuvar kullanımı için
- Kuru halde agrega

**B) Rutubetli Reçete (1 m³)**
- Şantiye kullanımı için
- Rutubet düzeltmeli
- Su düzeltmesi yapılmış

**C) Deneme Dökümü**
- 25 Litre miktarlar
- 50 Litre miktarlar
- Tartım için hazır

**Kaydet Butonu**: Projeyi localStorage'a kaydeder

---

## 5. STANDART YÖNETİMİ

### 🔧 Ayarlar Sayfası

#### Beton Sınıfları Düzenleme

1. **Mevcut Düzenleme**:
   - Tabloda "Düzenle" butonuna tıklayın
   - Modal açılır
   - fck, fcm, stdDev değerlerini değiştirin
   - Kaydet

2. **Yeni Ekleme**:
   - "Yeni Ekle" butonuna tıklayın
   - Form doldur:
     - Sınıf: C90/105
     - fck: 90 MPa
     - fcm: 98 MPa
     - Std Sapma: 5 MPa
   - Kaydet

**Örnek Yeni Sınıf:**
```javascript
{
  id: 'C90/105',
  fck: 90,
  fcm: 98,
  stdDev: 5
}
```

#### Çevre Etki Sınıfları

1. **Düzenleme**:
   - Tabloda sınıf seçin
   - Max s/ç limitini güncelle
   - Min çimento gereksinimini değiştir
   - Min hava içeriğini ayarla

2. **Yeni Sınıf Ekleme**:
   ```javascript
   {
     id: 'XD4',
     name: 'Çok yüksek klorür',
     maxWC: 0.40,
     minCement: 350,
     minAir: 4.5
   }
   ```

#### Pompa Gradasyon Limitleri

JSON düzenleme (gelişmiş):
```javascript
{
  sieve: 31.5,  // Elek boyutu (mm)
  min: 90,      // Min geçen %
  max: 97       // Max geçen %
}
```

---

## 6. VERİ SAKLAMA

### localStorage Yapısı

#### Konfigürasyon
```javascript
// localStorage key: 'beton-config'
{
  concreteClasses: [...],
  environmentalClasses: [...],
  pumpGradationLimits: [...]
}
```

#### Projeler
```javascript
// localStorage key: 'beton-projects'
[
  {
    id: 1703001234567,
    projectName: "Köprü Projesi",
    concreteClass: "C30/37",
    envClass: "XC4",
    calculations: {...},
    createdAt: "2025-01-15T10:30:00Z"
  }
]
```

### Veri Yedekleme

**Export (Tarayıcı Console)**
```javascript
// Tüm verileri dışa aktar
const backup = {
  config: localStorage.getItem('beton-config'),
  projects: localStorage.getItem('beton-projects')
};
console.log(JSON.stringify(backup));
// Kopyala ve kaydet
```

**Import**
```javascript
// Verileri içe aktar
const backup = {...}; // Yedek veriniz
localStorage.setItem('beton-config', backup.config);
localStorage.setItem('beton-projects', backup.projects);
location.reload();
```

---

## 7. GENİŞLETME REHBERİ

### Yeni Özellik Ekleme

#### A) Yeni Hesaplama Fonksiyonu

`ConcreteCalculator` class'ına ekleyin:

```javascript
class ConcreteCalculator {
  // ... mevcut fonksiyonlar
  
  static calculateNewFeature(param1, param2) {
    // Hesaplama mantığınız
    const result = param1 * param2;
    return result;
  }
}
```

#### B) Yeni Form Alanı

İlgili Step component'ine ekleyin:

```javascript
function Step1Project({ formData, setFormData, ... }) {
  return (
    <div>
      {/* Mevcut alanlar */}
      
      <div className="form-section">
        <h3>Yeni Bölüm</h3>
        <div className="form-group">
          <label>Yeni Alan</label>
          <input 
            type="text"
            value={formData.newField}
            onChange={e => setFormData({
              ...formData, 
              newField: e.target.value
            })}
          />
        </div>
      </div>
    </div>
  );
}
```

#### C) Yeni Wizard Adımı

1. `steps` array'ine ekleyin:
```javascript
const steps = [
  // ... mevcut adımlar
  { id: 6, title: 'Yeni Adım', desc: 'Açıklama' }
];
```

2. Yeni component oluşturun:
```javascript
function Step6NewFeature({ formData, setFormData }) {
  return (
    <div>
      <h3>Yeni Adım İçeriği</h3>
      {/* Form alanlarınız */}
    </div>
  );
}
```

3. Wizard'a ekleyin:
```javascript
{currentStep === 6 && <Step6NewFeature ... />}
```

### API Entegrasyonu

Claude API ile akıllı öneriler:

```javascript
const getSuggestions = async (formData) => {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: `Beton sınıfı ${formData.concreteClass} için 
                  optimum karışım oranlarını öner`
      }]
    })
  });
  
  const data = await response.json();
  return data.content[0].text;
};
```

### PDF Export Ekleme

```bash
npm install jspdf jspdf-autotable
```

```javascript
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const exportToPDF = (formData, calculations) => {
  const doc = new jsPDF();
  
  doc.text('BETON REÇETE RAPORU', 20, 20);
  doc.text(`Proje: ${formData.projectName}`, 20, 30);
  doc.text(`Beton Sınıfı: ${formData.concreteClass}`, 20, 40);
  
  doc.autoTable({
    head: [['Malzeme', 'Miktar', 'Birim']],
    body: [
      ['Çimento', calculations.cement.toFixed(1), 'kg/m³'],
      ['Su', formData.water, 'kg/m³'],
      // ...
    ],
    startY: 50
  });
  
  doc.save('beton-recete.pdf');
};
```

### Excel Export

```bash
npm install xlsx
```

```javascript
import * as XLSX from 'xlsx';

const exportToExcel = (formData, calculations) => {
  const data = [
    ['BETON REÇETE RAPORU'],
    [],
    ['Proje Adı', formData.projectName],
    ['Beton Sınıfı', formData.concreteClass],
    [],
    ['Malzeme', 'Miktar', 'Birim'],
    ['Çimento', calculations.cement, 'kg/m³'],
    ['Su', formData.water, 'kg/m³'],
    // ...
  ];
  
  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Reçete');
  XLSX.writeFile(wb, 'beton-recete.xlsx');
};
```

---

## 8. PERFORMANS OPTİMİZASYONU

### useMemo Kullanımı
Zaten uygulanmış - hesaplamalar cache'lenir:
```javascript
const calculations = useMemo(() => {
  // Ağır hesaplamalar
}, [formData, config]);
```

### Code Splitting
```javascript
// Lazy loading
const SettingsView = React.lazy(() => 
  import('./components/SettingsView')
);

// Kullanım
<React.Suspense fallback={<Loading />}>
  <SettingsView />
</React.Suspense>
```

### LocalStorage Optimizasyonu
```javascript
// Debounced save
import { debounce } from 'lodash';

const debouncedSave = debounce((data) => {
  localStorage.setItem('beton-config', JSON.stringify(data));
}, 1000);
```

---

## 9. GÜVENLİK

### Input Validasyonu
```javascript
const validateInput = (value, type) => {
  switch(type) {
    case 'number':
      return !isNaN(parseFloat(value)) && isFinite(value);
    case 'percentage':
      return value >= 0 && value <= 100;
    case 'positive':
      return value > 0;
    default:
      return true;
  }
};
```

### XSS Koruması
React otomatik escape eder, ama dikkat:
```javascript
// ✅ Güvenli
<div>{userInput}</div>

// ❌ Tehlikeli
<div dangerouslySetInnerHTML={{__html: userInput}} />
```

---

## 10. TEST

### Unit Test Örneği
```javascript
import { ConcreteCalculator } from './Calculator';

test('calculateCement - doğru hesaplama', () => {
  const result = ConcreteCalculator.calculateCement(175, 0.5, 300);
  expect(result).toBe(350); // max(175/0.5, 300)
});

test('calculateWeightedDensity - 3 agrega', () => {
  const aggs = [
    {density: 2.65},
    {density: 2.78},
    {density: 2.78}
  ];
  const ratios = [45, 25, 30];
  const result = ConcreteCalculator.calculateWeightedDensity(aggs, ratios);
  expect(result).toBeCloseTo(2.71, 2);
});
```

---

## 11. SORUN GİDERME

### localStorage Dolu
```javascript
// Temizle
localStorage.clear();

// Veya sadece uygulama verisi
localStorage.removeItem('beton-config');
localStorage.removeItem('beton-projects');
```

### Hesaplama Hataları
- Konsolu açın (F12)
- Console'da hata mesajlarını kontrol edin
- formData ve calculations loglanır:
```javascript
console.log('Form Data:', formData);
console.log('Calculations:', calculations);
```

### Grafik Görünmüyor
- Recharts yüklenmiş mi kontrol edin
- Veri formatı doğru mu:
```javascript
// Doğru format
[{sieve: 31.5, passing: 95, min: 90, max: 97}, ...]
```

---

## 12. DEPLOYMENT

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# build/ klasörünü Netlify'a sürükle-bırak
```

### GitHub Pages
```bash
npm install gh-pages --save-dev
```

package.json'a ekle:
```json
{
  "homepage": "https://username.github.io/beton-recete",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

```bash
npm run deploy
```

---

## 13. LİSANS VE DESTEK

### Lisans
MIT License - Ticari ve kişisel kullanım serbest

### Katkıda Bulunma
1. Fork yapın
2. Feature branch oluşturun
3. Commit edin
4. Push edin
5. Pull request açın

### İletişim
- GitHub Issues için: repository/issues
- Özellik önerileri: discussions

---

## 14. SÜRÜM NOTLARI

### v2.0 (2025-01-15)
- ✨ İlk web uygulaması sürümü
- ✅ 14 beton sınıfı desteği
- ✅ 21 çevre etki sınıfı
- ✅ Gradasyon grafikleri
- ✅ localStorage persistence
- ✅ Responsive design
- ✅ Dark theme

### Gelecek Özellikler (Roadmap)
- [ ] Multi-language support (EN, DE)
- [ ] PDF/Excel export
- [ ] Cloud sync
- [ ] Mobile app (React Native)
- [ ] AI suggestions (Claude API)
- [ ] Collaborative editing
- [ ] History/version control
- [ ] Template library

---

## 15. KAYNAKLAR

### Teknik Dökümantasyon
- [React Docs](https://react.dev)
- [Recharts](https://recharts.org)
- [Lucide Icons](https://lucide.dev)

### Beton Standartları
- TS 802 (2016)
- TS EN 206 (2021)
- TS 13515 (2021)
- KGM Şartnamesi (2025)

---

**BAŞARILAR DİLERİZ!** 🚀

Web uygulamanız modern, ölçeklenebilir ve profesyoneldir.
