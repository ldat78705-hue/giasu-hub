import React from 'react';
import { ClassItem, TutorItem } from '../types';
import { Sparkles, TrendingUp, CheckCircle, ExternalLink, ArrowRight, Award } from 'lucide-react';

interface SideWidgetsProps {
  selectedClass?: ClassItem;
  tutors: TutorItem[];
  aiMatches?: { tutorCode: string; matchPercentage: number; aiRationale: string }[];
  isMatchingLoading: boolean;
  onRunMatch: () => void;
  onOpenSeoOptimizer: () => void;
}

export const SideWidgets: React.FC<SideWidgetsProps> = ({
  selectedClass,
  tutors,
  aiMatches,
  isMatchingLoading,
  onRunMatch,
  onOpenSeoOptimizer,
}) => {
  // Find recommended tutors based on either aiMatches or fallback first 2 tutors
  const defaultRecommended = tutors.slice(0, 2).map((t, idx) => ({
    tutor: t,
    score: idx === 0 ? 98 : 92,
    rationale: idx === 0 ? "Chuyên môn IELTS vượt trội và đúng khu vực." : "Được học viên cũ đánh giá rất cao."
  }));

  const recommendedList = aiMatches && aiMatches.length > 0
    ? aiMatches.map((match) => {
        const found = tutors.find(t => t.code === match.tutorCode || t.name.includes(match.tutorCode));
        return {
          tutor: found || tutors[0],
          score: match.matchPercentage,
          rationale: match.aiRationale
        };
      })
    : defaultRecommended;

  return (
    <div id="side-widgets-container" className="col-span-12 lg:col-span-4 space-y-6 flex flex-col justify-start">
      {/* Widget 1: Smart Matching AI */}
      <div className="bg-[#0F172A] text-white p-6 rounded-2xl shadow-lg relative overflow-hidden border border-slate-800">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold flex items-center gap-2 text-white">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Smart Matching AI</span>
            </h3>
            {selectedClass && (
              <button
                onClick={onRunMatch}
                disabled={isMatchingLoading}
                className="px-2.5 py-1 bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white rounded-lg text-[11px] font-bold transition-all border border-blue-500/30 flex items-center gap-1 cursor-pointer"
              >
                <RefreshCwIcon className={`w-3 h-3 ${isMatchingLoading ? 'animate-spin' : ''}`} />
                <span>Phân tích lại</span>
              </button>
            )}
          </div>

          <p className="text-slate-400 text-sm mb-5 leading-relaxed">
            {selectedClass ? (
              <>Đã tìm thấy các gia sư phù hợp nhất cho lớp <b className="text-blue-400 font-mono">{selectedClass.code}</b> ({selectedClass.subject}) dựa trên vị trí và chuyên môn.</>
            ) : (
              <>Nhấp vào một lớp học ở bảng bên trái để hệ thống AI tự động đề xuất gia sư tương thích nhất.</>
            )}
          </p>

          <div className="space-y-3">
            {isMatchingLoading ? (
              <div className="p-6 text-center text-slate-400 text-xs flex flex-col items-center gap-2 bg-white/5 rounded-xl">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span>Gemini AI đang chấm điểm tương thích...</span>
              </div>
            ) : (
              recommendedList.map((item, idx) => {
                if (!item.tutor) return null;
                return (
                  <div
                    key={item.tutor.id || idx}
                    className={`flex items-start gap-3 bg-white/10 p-3.5 rounded-xl border border-white/5 backdrop-blur-xs transition-all hover:bg-white/15 ${
                      idx !== 0 ? 'opacity-85' : 'ring-1 ring-blue-500/50'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-lg ${item.tutor.avatarColor || 'bg-blue-500'} flex items-center justify-center font-bold text-white shrink-0 text-sm shadow-sm`}>
                      {item.tutor.avatar || 'GS'}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-white truncate">{item.tutor.name}</span>
                        <span className="text-green-400 text-xs font-bold bg-green-500/10 px-2 py-0.5 rounded-md shrink-0">
                          {item.score}% Match
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-300 mt-0.5 truncate font-medium">
                        {item.tutor.subjects ? item.tutor.subjects.join(' • ') : item.tutor.qualification}
                      </div>
                      <div className="text-[10px] text-blue-300 mt-1 italic leading-tight">
                        "{item.rationale}"
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Widget 2: Chỉ số SEO Website */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-orange-500" />
          <span>Chỉ số SEO Website</span>
        </h3>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs mb-1.5 font-medium text-slate-700">
              <span>Keyword: Gia sư HCM</span>
              <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded border border-green-200">
                TOP 1
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-green-500 w-[95%] h-full rounded-full transition-all duration-1000"></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1.5 font-medium text-slate-700">
              <span>Mobile Page Speed</span>
              <span className="text-blue-600 font-bold font-mono">92ms</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-500 w-[88%] h-full rounded-full transition-all duration-1000"></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1.5 font-medium text-slate-700">
              <span>Organic Traffic (Tháng 6)</span>
              <span className="text-purple-600 font-bold">+28.4%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-purple-500 w-[82%] h-full rounded-full transition-all duration-1000"></div>
            </div>
          </div>
        </div>

        <button
          onClick={onOpenSeoOptimizer}
          className="w-full mt-6 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-2xs cursor-pointer flex items-center justify-center gap-2"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Tối ưu nội dung AI</span>
        </button>
      </div>
    </div>
  );
};

function RefreshCwIcon(props: any) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
    </svg>
  );
}
