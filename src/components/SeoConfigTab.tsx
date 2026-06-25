import React, { useState } from 'react';
import { Sparkles, Globe, Search, CheckCircle, ShieldCheck, Zap } from 'lucide-react';

interface SeoConfigTabProps {
  onRunAiSeo: (topic: string) => Promise<{ metaTitle: string; metaDescription: string; topKeywords: string[]; contentOutline: string[] }>;
}

export const SeoConfigTab: React.FC<SeoConfigTabProps> = ({ onRunAiSeo }) => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [seoResult, setSeoResult] = useState<{ metaTitle: string; metaDescription: string; topKeywords: string[]; contentOutline: string[] } | null>({
    metaTitle: "Gia Sư Thành Đạt - Trung Tâm Gia Sư Uy Tín Hàng Đầu Hà Nội",
    metaDescription: "Tìm gia sư chất lượng cao dạy kèm tại nhà Toán, Lý, Hóa, IELTS. Đội ngũ gia sư Bách Khoa, Sư Phạm chuẩn kiến thức. Cam kết tiến bộ sau 10 buổi.",
    topKeywords: ["gia sư hà nội", "trung tâm gia sư uy tín", "tìm gia sư tại nhà", "gia sư toán lớp 12", "gia sư ielts", "gia sư online"],
    contentOutline: ["Kinh nghiệm chọn gia sư chất lượng tại nhà", "Bảng giá học phí gia sư chuẩn nhất 2026", "Quy trình xác thực văn bằng gia sư 3 bước"]
  });

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await onRunAiSeo(topic);
      setSeoResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left AI Generator */}
      <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>AI Tối ưu SEO Website (Real-time)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">Tạo tự động Meta tags và cấu trúc từ khóa Google Search bằng Gemini 2.5</p>
        </div>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Chủ đề trang / Chiến dịch SEO</label>
            <input
              type="text"
              required
              placeholder="VD: Luyện thi IELTS cấp tốc tại Quận 7"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Gemini AI đang tạo cấu trúc SEO...' : 'Kích hoạt AI Phân tích'}</span>
          </button>
        </form>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
          <div className="font-bold text-slate-700 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Sitemap.xml & Structured Data</span>
          </div>
          <p className="text-slate-500 leading-relaxed">
            Hệ thống Gia Sư Thành Đạt tự động xuất bản schema <code className="bg-slate-200 px-1 rounded">EducationalOrganization</code> giúp Google Index lớp học tức thì.
          </p>
        </div>
      </div>

      {/* Right Google SERP Preview */}
      <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
        <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-600" />
          <span>Mô phỏng kết quả tìm kiếm Google (SERP Preview)</span>
        </h3>

        {seoResult && (
          <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-xs text-slate-600 font-sans">
              <span className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-[10px] font-bold">G</span>
              <span className="truncate">giasu-thanhdat.vercel.app › tim-gia-su-ha-noi</span>
            </div>
            <h4 className="text-blue-800 hover:underline cursor-pointer text-lg font-medium font-sans leading-snug">
              {seoResult.metaTitle}
            </h4>
            <p className="text-slate-600 text-sm font-sans line-clamp-3 leading-relaxed">
              {seoResult.metaDescription}
            </p>
          </div>
        )}

        {seoResult && (
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Top Keywords gợi ý</h4>
              <div className="flex flex-wrap gap-2">
                {seoResult.topKeywords.map((kw, idx) => (
                  <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold border border-blue-100 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-500" />
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Luận điểm bài viết chuẩn SEO AI</h4>
              <ul className="space-y-2 text-sm text-slate-700">
                {seoResult.contentOutline.map((outline, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span>{outline}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
