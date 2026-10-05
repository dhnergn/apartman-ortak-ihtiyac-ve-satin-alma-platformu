import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Google Gen AI client with recommended user-agent header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Apartman Ortak Satın Alma Platformu API' });
});

// AI Need Parser endpoint: Parses unstructured Turkish text into structured need draft
app.post('/api/ai/parse-need', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Geçerli bir ihtiyaç açıklaması giriniz.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      // Fallback deterministic rule-based parser if API key is not yet configured
      const lower = prompt.toLowerCase();
      let category = 'Ortak İhtiyaç';
      let type = 'COMMON_PROPERTY';
      let targetParticipants = 10;
      let estimatedBudget = 5000;

      if (lower.includes('kombi') || lower.includes('klima') || lower.includes('petek')) {
        category = 'Kombi ve Isıtma Bakımı';
        type = 'PERSONAL_BULK_PURCHASE';
        targetParticipants = 8;
        estimatedBudget = 12000;
      } else if (lower.includes('filtre') || lower.includes('su arıtma') || lower.includes('filtresi')) {
        category = 'Su Arıtma Filtresi';
        type = 'PERSONAL_BULK_PURCHASE';
        targetParticipants = 15;
        estimatedBudget = 6000;
      } else if (lower.includes('temizlik') || lower.includes('merdiven') || lower.includes('ortak alan')) {
        category = 'Ortak Alan Temizliği';
        type = 'SERVICE_CONTRACT';
        targetParticipants = 20;
        estimatedBudget = 8000;
      } else if (lower.includes('kamera') || lower.includes('güvenlik') || lower.includes('interkom') || lower.includes('kapı')) {
        category = 'Güvenlik Kamera Sistemi';
        type = 'SECURITY_PROJECT';
        targetParticipants = 24;
        estimatedBudget = 45000;
      } else if (lower.includes('asansör')) {
        category = 'Asansör Bakım & Revizyon';
        type = 'COMMON_PROPERTY';
        targetParticipants = 16;
        estimatedBudget = 25000;
      }

      return res.json({
        title: prompt.slice(0, 60),
        category,
        type,
        description: prompt,
        targetParticipants,
        estimatedBudget,
        suggestedItems: [{ title: category, quantity: targetParticipants }],
        source: 'rule-engine',
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Sen apartman ve konut toplulukları için ortak ihtiyaç analiz asistanısın. Kullanıcının doğal Türkçe metnini incele ve aşağıdaki alanlara dönüştür.
Kullanıcı metni: "${prompt}"

Kurallar:
- type şu 4 değerden biri olmalıdır: "PERSONAL_BULK_PURCHASE" (bireysel dairelerin ortaklaşa alacağı ürün/hizmet; örn: su filtre, kombi bakımı), "COMMON_PROPERTY" (bina ortak malı; örn: asansör tamiri, çatı), "SERVICE_CONTRACT" (düzenli periyodik hizmet; örn: haftalık temizlik, bahçe), "SECURITY_PROJECT" (kamera, interkom, yangın tüpü vb.).
- title: 6-10 kelimelik profesyonel başlık.
- category: Standart Türkçe kategori ismi (örn: "Kombi & Klima Bakımı", "Su Arıtma Sistemleri", "Bina Güvenlik Sistemleri", "Ortak Alan Temizliği", "Asansör Bakımı", "Yangın Güvenlik Ekipmanları").
- targetParticipants: Metinde bahsedilen tahmini daire sayısı veya makul bir daire sayısı (tamsayı, minimum 1).
- estimatedBudget: Toplam tahmini Türk Lirası bütçesi (sayı veya 0).
- description: İhtiyacın temiz, resmi özeti.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            category: { type: Type.STRING },
            type: {
              type: Type.STRING,
              enum: ['PERSONAL_BULK_PURCHASE', 'COMMON_PROPERTY', 'SERVICE_CONTRACT', 'SECURITY_PROJECT'],
            },
            description: { type: Type.STRING },
            targetParticipants: { type: Type.INTEGER },
            estimatedBudget: { type: Type.NUMBER },
          },
          required: ['title', 'category', 'type', 'description', 'targetParticipants'],
        },
      },
    });

    const parsedData = JSON.parse(response.text || '{}');
    return res.json({
      ...parsedData,
      source: 'gemini-3.8-flash',
    });
  } catch (error: any) {
    console.error('AI Parse error:', error);
    res.status(500).json({ error: 'İhtiyaç analiz edilirken bir hata oluştu: ' + error.message });
  }
});

// Configure Vite integration for dev server
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production serve dist static files
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Apartman Platformu server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
