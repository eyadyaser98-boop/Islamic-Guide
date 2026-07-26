import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI Client lazily
  let aiClient: GoogleGenAI | null = null;
  function getAIClient() {
    if (!aiClient && process.env.GEMINI_API_KEY) {
      aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    return aiClient;
  }

  // API Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "تطبيق المسلم", timestamp: new Date().toISOString() });
  });

  // Proxy Quran Surah Verses from public Quran API
  app.get("/api/quran/surah/:id", async (req, res) => {
    const surahId = req.params.id;
    try {
      // Fetch Arabic Uthmani text
      const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahId}/ar.alafasy`);
      if (response.ok) {
        const data = await response.json();
        return res.json(data);
      }
      res.status(500).json({ error: "فشل في جلب بيانات السورة" });
    } catch (err) {
      res.status(500).json({ error: "خطأ في الاتصال بالشبكة" });
    }
  });

  // AI Tafsir & Reflection Endpoint via Gemini API
  app.post("/api/gemini/tafsir", async (req, res) => {
    const { surahName, ayahNumber, ayahText, query } = req.body;

    try {
      const client = getAIClient();
      if (!client) {
        return res.status(503).json({
          response: "ميزة التفسير بالذكاء الاصطناعي تتطلب ضبط مفتاح GEMINI_API_KEY. يرجى تزويد المفتاح في إعدادات التطبيق."
        });
      }

      const prompt = query
        ? `أنت عالم مفسر ومعلم قرآنك كريم موثوق ومبسط. أجب عن التساؤل التالي بإيجاز وبطريقة إيمانية تربوية موثقة: ${query}`
        : `قدم تفسيراً ميسراً ومبسطاً مع خواطر وتأملات تربوية إيمانية واستخراج للفوائد والدروس المستفادة من هذه الآية الكريمة:
سورة ${surahName}، آية رقم (${ayahNumber}):
"${ayahText}"

يرجى التقسيم كالتالي:
1. المعنى والتفسير الميسر للآية.
2. اللطائف والدروس التربوية والإيمانية المستفادة.
3. كيفية العمل والالتزام بهذه الآية في الحياة اليومية.`;

      const response = await client.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
      });

      const text = response.text || "لم يتم استرجاع التفسير بشكل صحيح.";
      res.json({ result: text });
    } catch (err: unknown) {
      console.error("Gemini API Error:", err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      res.status(500).json({
        error: "حدث خطأ أثناء معالجة الطلب بالذكاء الاصطناعي",
        details: errorMessage
      });
    }
  });

  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
