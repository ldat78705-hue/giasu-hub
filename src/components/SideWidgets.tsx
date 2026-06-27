import React from 'react';
import { ClassItem, TutorItem, ClassMatch, TutorReview, AttendanceRecord } from '../types';
import { Sparkles, RefreshCw, Star, Trophy, ChevronRight } from 'lucide-react';

interface SideWidgetsProps {
  selectedClass?: ClassItem;
  tutors: TutorItem[];
  aiMatches?: { tutorCode: string; matchPercentage: number; aiRationale: string }[];
  isMatchingLoading: boolean;
  onRunMatch: () => void;
  hasApiKey: boolean;
  matches?: ClassMatch[];
  reviews?: TutorReview[];
  attendance?: AttendanceRecord[];
}

export const SideWidgets: React.FC<SideWidgetsProps> = ({
  selectedClass, tutors, aiMatches, isMatchingLoading, onRunMatch, hasApiKey, matches = [], reviews = [], attendance = [],
}) => {
  const recommendedList = aiMatches && aiMatches.length > 0
    ? aiMatches.map((match) => {
        const found = tutors.find(t => t.code === match.tutorCode || t.name.includes(match.tutorCode));
        return { tutor: found, score: match.matchPercentage, rationale: match.aiRationale };
      }).filter(item => item.tutor)
    : [];

  // Top GS Leaderboard
  const tutorStats: Record<string, { name: string; matchCount: number; activeCount: number; rating: number; attendanceRate: number }> = {};
  matches.forEach(m => {
    if (!tutorStats[m.tutorCode]) tutorStats[m.tutorCode] = { name: m.tutorName, matchCount: 0, activeCount: 0, rating: 0, attendanceRate: 0 };
    tutorStats[m.tutorCode].matchCount++;
    if (m.status === 'Đang dạy') tutorStats[m.tutorCode].activeCount++;
  });
  Object.keys(tutorStats).forEach(code => {
    const tutorReviews = reviews.filter(r => r.tutorCode === code);
    tutorStats[code].rating = tutorReviews.length > 0
      ? tutorReviews.reduce((s, r) => s + r.rating, 0) / tutorReviews.length
      : (tutors.find(t => t.code === code)?.rating || 0);
    const tutorAtt = attendance.filter(a => a.tutorCode === code);
    const taught = tutorAtt.filter(a => a.status === 'Đã dạy').length;
    tutorStats[code].attendanceRate = tutorAtt.length > 0 ? Math.round((taught / tutorAtt.length) * 100) : 0;
  });
  const topGS = Object.entries(tutorStats)
    .map(([code, d]) => ({ code, ...d, score: Math.round(d.matchCount * 4 + d.rating * 6 + d.attendanceRate * 0.3) }))
    .sort((a, b) => b.score - a.score).slice(0, 5);
  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div id="side-widgets-container" className="col-span-12 lg:col-span-4 space-y-4 flex flex-col justify-start">
      {/* AI Match Panel */}
      <div className="bg-slate-900 text-white rounded-2xl overflow-hidden shadow-lg border border-slate-800">
        <div className="p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              AI Ghép nối
            </h3>
            {selectedClass && hasApiKey && (
              <button onClick={onRunMatch} disabled={isMatchingLoading}
                className="px-2.5 py-1 bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white rounded-lg text-[10px] font-bold transition-all border border-blue-500/30 flex items-center gap-1 cursor-pointer">
                <RefreshCw className={`w-3 h-3 ${isMatchingLoading ? 'animate-spin' : ''}`} />
                Phân tích
              </button>
            )}
          </div>

          <p className="text-slate-400 text-xs mb-4 leading-relaxed">
            {!hasApiKey ? (
              <>Cấu hình <b className="text-amber-400">Gemini API Key</b> trong Cài đặt để sử dụng.</>
            ) : selectedClass ? (
              <>Phân tích lớp <b className="text-blue-400 font-mono">{selectedClass.code}</b> — {selectedClass.subject}</>
            ) : (
              <>Chọn 1 lớp ở bảng bên trái để AI đề xuất gia sư.</>
            )}
          </p>

          {isMatchingLoading ? (
            <div className="p-4 text-center text-slate-400 text-xs flex flex-col items-center gap-2 bg-white/5 rounded-xl">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              AI đang phân tích...
            </div>
          ) : recommendedList.length > 0 ? (
            <div className="space-y-2">
              {recommendedList.map((item, idx) => (
                <div key={idx} className={`flex items-center gap-3 p-3 rounded-xl ${idx === 0 ? 'bg-blue-500/15 border border-blue-500/20' : 'bg-white/5'}`}>
                  <div className={`w-8 h-8 rounded-lg ${item.tutor!.avatarColor || 'bg-blue-500'} flex items-center justify-center font-bold text-white text-xs shrink-0`}>
                    {item.tutor!.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white truncate">{item.tutor!.name}</span>
                      <span className="text-green-400 text-[10px] font-bold bg-green-500/15 px-1.5 py-0.5 rounded shrink-0">{item.score}%</span>
                    </div>
                    <div className="text-[10px] text-blue-300 mt-0.5 truncate italic">"{item.rationale}"</div>
                  </div>
                </div>
              ))}
            </div>
          ) : selectedClass && hasApiKey ? (
            <div className="bg-white/5 rounded-xl p-3 text-center text-xs text-slate-400">
              Nhấn <b>Phân tích</b> để AI tìm GS phù hợp
            </div>
          ) : null}
        </div>
      </div>

      {/* Quick Summary */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <h3 className="font-bold text-xs text-slate-800 mb-3 flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 text-amber-500" /> Tổng quan gia sư
        </h3>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-slate-50 rounded-xl p-2.5">
            <div className="text-lg font-extrabold text-slate-800">{tutors.length}</div>
            <div className="text-[9px] text-slate-400 font-medium mt-0.5">Tổng GS</div>
          </div>
          <div className="bg-emerald-50 rounded-xl p-2.5">
            <div className="text-lg font-extrabold text-emerald-600">{tutors.filter(t => t.status === 'online').length}</div>
            <div className="text-[9px] text-emerald-600 font-medium mt-0.5">Sẵn sàng</div>
          </div>
          <div className="bg-amber-50 rounded-xl p-2.5">
            <div className="text-lg font-extrabold text-amber-600">
              {tutors.length > 0 ? (tutors.reduce((s, t) => s + t.rating, 0) / tutors.length).toFixed(1) : '—'}
            </div>
            <div className="text-[9px] text-amber-600 font-medium mt-0.5">Đánh giá TB</div>
          </div>
        </div>
      </div>

      {/* Top GS Leaderboard */}
      {topGS.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4">
          <div className="flex items-center gap-1.5 mb-3">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <h3 className="font-bold text-xs text-slate-800">Top gia sư</h3>
          </div>
          <div className="space-y-1.5">
            {topGS.map((gs, i) => (
              <div key={gs.code} className={`flex items-center gap-2.5 p-2 rounded-xl ${i === 0 ? 'bg-amber-50' : 'hover:bg-slate-50'} transition-colors`}>
                <span className="text-sm w-5 text-center shrink-0">{medals[i] || <span className="text-[10px] font-bold text-slate-400">{i + 1}</span>}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">{gs.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {gs.rating > 0 && <span className="text-[9px] text-amber-600 flex items-center gap-0.5"><Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />{gs.rating.toFixed(1)}</span>}
                    <span className="text-[9px] text-blue-600 font-medium">{gs.activeCount} lớp</span>
                    {gs.attendanceRate > 0 && <span className="text-[9px] text-emerald-600">{gs.attendanceRate}%</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
