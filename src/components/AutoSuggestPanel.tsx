import React, { useState } from 'react';
import { ParentRegistration, TutorItem, ClassMatch, ActiveTab } from '../types';
import { Sparkles, UserCheck, MapPin, BookOpen, Phone, ArrowRight, CheckCircle2, Clock, Star, X } from 'lucide-react';

interface AutoSuggestPanelProps {
  registration: ParentRegistration;
  tutors: TutorItem[];
  matches: ClassMatch[];
  onClose: () => void;
  onQuickMatch?: (reg: ParentRegistration, tutor: TutorItem) => Promise<void>;
}

interface SuggestedTutor {
  tutor: TutorItem;
  score: number;
  reasons: string[];
}

export const AutoSuggestPanel: React.FC<AutoSuggestPanelProps> = ({ registration, tutors, matches, onClose, onQuickMatch }) => {
  const [copied, setCopied] = useState<string | null>(null);
  const [matching, setMatching] = useState<string | null>(null);

  // AI-like matching algorithm
  const suggestions: SuggestedTutor[] = tutors
    .filter(t => t.verified)
    .map(t => {
      let score = 0;
      const reasons: string[] = [];

      // Subject match
      const subjectMatch = registration.subjects.some(s =>
        t.subjects.some(ts => ts.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(ts.toLowerCase()))
      );
      if (subjectMatch) { score += 40; reasons.push('✅ Khớp môn học'); }

      // Area match
      if (registration.district && t.area) {
        if (t.area.toLowerCase().includes(registration.district.toLowerCase()) || 
            (t.teachingAreas && t.teachingAreas.some(a => a.toLowerCase().includes(registration.district.toLowerCase())))) {
          score += 25; reasons.push('📍 Cùng khu vực');
        }
      }

      // Mode match
      if (registration.mode === 'Online') {
        score += 10; reasons.push('💻 Dạy online');
      }

      // Not overloaded
      const activeClasses = matches.filter(m => m.tutorCode === t.code && m.status === 'Đang dạy').length;
      if (activeClasses < 3) { score += 15; reasons.push(`📚 ${activeClasses}/3 lớp`); }
      else { score -= 10; reasons.push(`⚠️ Đã có ${activeClasses} lớp`); }

      // Rating bonus
      if (t.rating >= 4) { score += 10; reasons.push(`⭐ ${t.rating}/5`); }

      // Grade match
      if (t.gradeLevels && t.gradeLevels.length > 0) {
        score += 5; reasons.push('📋 Khớp cấp học');
      }

      // Status
      if (t.status === 'online') { score += 5; reasons.push('🟢 Online'); }

      return { tutor: t, score, reasons };
    })
    .filter(s => s.score > 20)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const copyInfo = (t: SuggestedTutor) => {
    const text = `GS đề xuất cho PH ${registration.parentName}:\n- GS: ${t.tutor.name} (${t.tutor.code})\n- Môn: ${t.tutor.subjects.join(', ')}\n- SĐT GS: ${t.tutor.phone || 'N/A'}\n- Phù hợp: ${t.score}%\n- Lý do: ${t.reasons.join(', ')}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(t.tutor.code);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  return (
    <div className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 animate-scale-in max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" /> Đề xuất GS phù hợp
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                PH: <strong>{registration.parentName}</strong> · Môn: <strong>{registration.subjects.join(', ')}</strong> · KV: <strong>{registration.district || 'N/A'}</strong> · {registration.mode}
              </p>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer"><X className="w-5 h-5 text-slate-400" /></button>
          </div>
        </div>

        <div className="p-6 space-y-3">
          {suggestions.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">Chưa tìm được GS phù hợp. Thử tìm thủ công tại tab Gia sư.</div>
          ) : suggestions.map((s, i) => (
            <div key={s.tutor.id} className={`p-4 rounded-xl border-2 transition-all ${i === 0 ? 'border-purple-300 bg-purple-50/50' : 'border-slate-200 hover:border-purple-200'}`}>
              <div className="flex items-start gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: s.tutor.avatarColor }}>
                    {s.tutor.avatar}
                  </div>
                  {i === 0 && <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center text-[8px] font-bold text-white">👑</div>}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-slate-800">{s.tutor.name}</span>
                    <span className="text-[10px] text-slate-400">{s.tutor.code}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${s.score >= 60 ? 'bg-emerald-100 text-emerald-700' : s.score >= 40 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                      {s.score}% phù hợp
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">{s.tutor.subjects.join(', ')} · {s.tutor.area || 'N/A'}</div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {s.reasons.map((r, j) => (
                      <span key={j} className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[9px] text-slate-600">{r}</span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 shrink-0">
                  {onQuickMatch && (
                    <button onClick={async () => {
                      if (!window.confirm(`Ghép GS ${s.tutor.name} cho PH ${registration.parentName}?\nAuto tạo lớp + match + thông báo`)) return;
                      setMatching(s.tutor.code);
                      await onQuickMatch(registration, s.tutor);
                      setMatching(null);
                      onClose();
                    }}
                      disabled={matching !== null}
                      className="px-3 py-2 rounded-xl text-[11px] font-bold cursor-pointer flex items-center gap-1 bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50">
                      {matching === s.tutor.code ? '⏳ Đang ghép...' : <><ArrowRight className="w-3 h-3" /> Ghép ngay</>}
                    </button>
                  )}
                  <button onClick={() => copyInfo(s)}
                    className={`px-3 py-2 rounded-xl text-[11px] font-bold cursor-pointer flex items-center gap-1 ${
                      copied === s.tutor.code ? 'bg-emerald-100 text-emerald-700' : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}>
                    {copied === s.tutor.code ? <><CheckCircle2 className="w-3 h-3" /> Đã copy</> : <><Phone className="w-3 h-3" /> Copy</>}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
