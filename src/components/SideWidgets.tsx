import React from 'react';
import { ClassItem, TutorItem, ClassMatch } from '../types';
import { Sparkles, RefreshCw, Star, Trophy } from 'lucide-react';

interface SideWidgetsProps {
  selectedClass?: ClassItem;
  tutors: TutorItem[];
  aiMatches?: { tutorCode: string; matchPercentage: number; aiRationale: string }[];
  isMatchingLoading: boolean;
  onRunMatch: () => void;
  hasApiKey: boolean;
  matches?: ClassMatch[];
}

export const SideWidgets: React.FC<SideWidgetsProps> = ({
  selectedClass, tutors, aiMatches, isMatchingLoading, onRunMatch, hasApiKey, matches = [],
}) => {
  const recommendedList = aiMatches && aiMatches.length > 0
    ? aiMatches.map((match) => {
        const found = tutors.find(t => t.code === match.tutorCode || t.name.includes(match.tutorCode));
        return { tutor: found, score: match.matchPercentage, rationale: match.aiRationale };
      }).filter(item => item.tutor)
    : [];

  return (
    <div id="side-widgets-container" className="col-span-12 lg:col-span-4 space-y-6 flex flex-col justify-start">
      {/* Smart Matching AI */}
      <div className="bg-[#0F172A] text-white p-6 rounded-2xl shadow-lg relative overflow-hidden border border-slate-800">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold flex items-center gap-2 text-white">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>AI Ghép nối</span>
            </h3>
            {selectedClass && hasApiKey && (
              <button onClick={onRunMatch} disabled={isMatchingLoading}
                className="px-2.5 py-1 bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white rounded-lg text-[11px] font-bold transition-all border border-blue-500/30 flex items-center gap-1 cursor-pointer">
                <RefreshCw className={`w-3 h-3 ${isMatchingLoading ? 'animate-spin' : ''}`} />
                <span>Phân tích</span>
              </button>
            )}
          </div>

          <p className="text-slate-400 text-sm mb-5 leading-relaxed">
            {!hasApiKey ? (
              <>Vui lòng cấu hình <b className="text-amber-400">Gemini API Key</b> trong mục Cài đặt để sử dụng AI ghép nối.</>
            ) : selectedClass ? (
              <>Phân tích lớp <b className="text-blue-400 font-mono">{selectedClass.code}</b> ({selectedClass.subject}) để tìm gia sư phù hợp nhất.</>
            ) : (
              <>Chọn một lớp học ở bảng bên trái để AI đề xuất gia sư tương thích.</>
            )}
          </p>

          <div className="space-y-3">
            {isMatchingLoading ? (
              <div className="p-6 text-center text-slate-400 text-xs flex flex-col items-center gap-2 bg-white/5 rounded-xl">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span>AI đang phân tích...</span>
              </div>
            ) : recommendedList.length > 0 ? (
              recommendedList.map((item, idx) => (
                <div key={idx} className={`flex items-start gap-3 bg-white/10 p-3.5 rounded-xl border border-white/5 ${idx === 0 ? 'ring-1 ring-blue-500/50' : 'opacity-85'}`}>
                  <div className={`w-9 h-9 rounded-lg ${item.tutor!.avatarColor || 'bg-blue-500'} flex items-center justify-center font-bold text-white shrink-0 text-sm shadow-sm`}>
                    {item.tutor!.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-white truncate">{item.tutor!.name}</span>
                      <span className="text-green-400 text-xs font-bold bg-green-500/10 px-2 py-0.5 rounded-md shrink-0">
                        {item.score}%
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-300 mt-0.5 truncate">{item.tutor!.subjects.join(' • ')}</div>
                    <div className="text-[10px] text-blue-300 mt-1 italic leading-tight">"{item.rationale}"</div>
                  </div>
                </div>
              ))
            ) : selectedClass && hasApiKey ? (
              <div className="bg-white/5 rounded-xl p-4 text-center text-xs text-slate-400">
                Nhấn <b>Phân tích</b> để AI tìm gia sư phù hợp
              </div>
            ) : tutors.length === 0 ? (
              <div className="bg-white/5 rounded-xl p-4 text-center text-xs text-slate-400">
                Chưa có gia sư nào trong hệ thống
              </div>
            ) : null}
          </div>
        </div>
        <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Quick Summary */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-500" />
          <span>Tổng quan nhanh</span>
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Tổng gia sư</span>
            <span className="font-bold text-slate-800">{tutors.length}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Đang sẵn sàng</span>
            <span className="font-bold text-emerald-600">{tutors.filter(t => t.status === 'online').length}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Đánh giá TB</span>
            <span className="font-bold text-amber-600">
              {tutors.length > 0 ? (tutors.reduce((s, t) => s + t.rating, 0) / tutors.length).toFixed(1) : '—'}
            </span>
          </div>
        </div>
      </div>

      {/* Top GS hoạt động */}
      {matches.length > 0 && (() => {
        const tutorMatchCount: Record<string, { name: string; count: number; active: number }> = {};
        matches.forEach(m => {
          if (!tutorMatchCount[m.tutorCode]) tutorMatchCount[m.tutorCode] = { name: m.tutorName, count: 0, active: 0 };
          tutorMatchCount[m.tutorCode].count++;
          if (m.status === 'Đang dạy') tutorMatchCount[m.tutorCode].active++;
        });
        const top5 = Object.entries(tutorMatchCount)
          .sort(([,a], [,b]) => b.count - a.count)
          .slice(0, 5);
        if (top5.length === 0) return null;
        return (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-sm text-slate-800">Top GS hoạt động</h3>
            </div>
            <div className="space-y-2">
              {top5.map(([code, data], i) => (
                <div key={code} className="flex items-center gap-3">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    i === 0 ? 'bg-amber-100 text-amber-700' : i === 1 ? 'bg-slate-200 text-slate-700' : i === 2 ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-500'
                  }`}>{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">{data.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{code}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-blue-600">{data.count} lớp</p>
                    {data.active > 0 && <p className="text-[10px] text-emerald-600">{data.active} đang dạy</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
};
