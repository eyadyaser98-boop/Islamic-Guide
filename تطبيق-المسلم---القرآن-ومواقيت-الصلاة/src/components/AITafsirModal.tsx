import React, { useState, useEffect } from 'react';
import { Sparkles, X, BookOpen, Send, Loader2, MessageSquare, AlertCircle } from 'lucide-react';

interface AITafsirModalProps {
  isOpen: boolean;
  onClose: () => void;
  surahName?: string;
  ayahNum?: number;
  ayahText?: string;
}

export const AITafsirModal: React.FC<AITafsirModalProps> = ({
  isOpen,
  onClose,
  surahName,
  ayahNum,
  ayahText,
}) => {
  const [customQuery, setCustomQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && surahName && ayahText) {
      fetchTafsir();
    }
  }, [isOpen, surahName, ayahText]);

  const fetchTafsir = async (queryText?: string) => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch('/api/gemini/tafsir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          surahName,
          ayahNumber: ayahNum,
          ayahText,
          query: queryText,
        }),
      });

      const data = await res.json();
      if (res.ok && data.result) {
        setResponse(data.result);
      } else {
        setError(data.error || 'حدث خطأ أثناء جلب التفسير.');
      }
    } catch (err) {
      setError('تعذر الاتصال بخدمة الذكاء الاصطناعي للتفسير.');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuery.trim()) return;
    fetchTafsir(customQuery);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-900 to-teal-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold font-cairo text-base">
                مساعد التفسير والتأمل بالذكاء الاصطناعي
              </h3>
              <p className="text-xs text-emerald-100/80">
                تأملات وتفاسير ميسرة موثوقة بالذكاء الاصطناعي
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* Target Ayah Box if provided */}
          {surahName && ayahText && (
            <div className="p-4 bg-emerald-50 dark:bg-slate-800 rounded-2xl border border-emerald-100 dark:border-slate-700 space-y-2">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 block">
                سورة {surahName} - آية ({ayahNum}):
              </span>
              <p className="font-quran text-xl text-slate-900 dark:text-slate-100 leading-relaxed">
                "{ayahText}"
              </p>
            </div>
          )}

          {/* Response Container */}
          {loading ? (
            <div className="py-12 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
              <p className="text-sm font-bold text-slate-600 dark:text-slate-300 font-tajawal">
                جاري استخراج التفسير الميسر والخواطر الإيمانية...
              </p>
            </div>
          ) : error ? (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-2xl text-rose-800 dark:text-rose-200 text-xs sm:text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">ملاحظة حول الخدمة:</p>
                <p className="mt-0.5">{error}</p>
              </div>
            </div>
          ) : response ? (
            <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-sm sm:text-base font-tajawal leading-relaxed whitespace-pre-line">
              {response}
            </div>
          ) : null}

          {/* Custom Ask AI Form */}
          <form onSubmit={handleCustomSubmit} className="pt-2">
            <div className="relative">
              <input
                type="text"
                placeholder="اسأل سؤالاً أعمق حول هذه الآية أو أي موضوع في القرآن الكريم..."
                value={customQuery}
                onChange={(e) => setCustomQuery(e.target.value)}
                className="w-full pr-4 pl-12 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                disabled={loading || !customQuery.trim()}
                className="absolute left-2 top-2 p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 transition-colors"
              >
                <Send className="w-4 h-4 dir-rtl" />
              </button>
            </div>
          </form>

        </div>

      </div>
    </div>
  );
};
