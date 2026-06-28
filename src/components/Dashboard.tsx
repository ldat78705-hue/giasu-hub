import React from 'react';
import { Users, BookOpen, GraduationCap, TrendingUp, DollarSign, Copy, Star, Trophy, Sparkles, RefreshCw, AlertTriangle, Bell, ArrowRight, ChevronRight } from 'lucide-react';
import { ClassItem, TutorItem, ClassMatch, ParentRegistration, AttendanceRecord, TutorReview, TransactionItem, ActiveTab } from '../types';

interface DashboardProps {
  classes: ClassItem[];
  tutors: TutorItem[];
  matches: ClassMatch[];
  registrations: ParentRegistration[];
  attendance: AttendanceRecord[];
  reviews: TutorReview[];
  transactions: TransactionItem[];
  totalRevenue: number;
  onNavigate: (tab: ActiveTab) => void;
  selectedClass?: ClassItem;
  aiMatches?: { tutorCode: string; matchPercentage: number; aiRationale: string }[];
  isMatchingLoading: boolean;
  onRunMatch: () => void;
  hasApiKey: boolean;
}

const fmt = (v: number) => new Intl.NumberFormat('vi-VN').format(v);

export const Dashboard: React.FC<DashboardProps> = ({
  classes, tutors, matches, registrations, attendance, reviews, transactions,
  totalRevenue, onNavigate, selectedClass, aiMatches, isMatchingLoading, onRunMatch, hasApiKey,
}) => {
  const pendingClasses = classes.filter(c => c.status === 'ĐANG TÌM' || c.status === 'KHẨN CẤP').length;
  const activeMatches = matches.filter(m => m.status === 'Đang dạy').length;
  const doneMatches = matches.filter(m => m.status === 'Hoàn thành').length;
  const matchRate = matches.length > 0 ? Math.round((doneMatches + activeMatches) / matches.length * 100) : 0;
  const pendingRegs = registrations.filter(r => r.status === 'Mới').length;
  const unverifiedTutors = tutors.filter(t => !t.verified).length;

  const weekAgo = Date.now() - 7 * 86400000;
  const weekRegs = registrations.filter(r => r.createdAt > weekAgo).length;
  const weekMatches = matches.filter(m => m.createdAt > weekAgo).length;

  // Urgent
  const overdueRegs = registrations.filter(r => r.status === 'Mới' && (Date.now() - r.createdAt) > 2 * 3600000).length;
  const unpaidFees = matches.filter(m => m.status === 'Đang dạy' && !m.feePaid && (Date.now() - m.startDate) > 7 * 86400000).length;
  const staleMatches = matches.filter(m => {
    if (m.status !== 'Đang dạy') return false;
    const ma = attendance.filter(a => a.matchId === m.id);
    const last = ma.length > 0 ? Math.max(...ma.map(a => a.createdAt)) : m.startDate;
    return (Date.now() - last) > 14 * 86400000;
  }).length;

  const alerts = [
    overdueRegs > 0 && { label: `${overdueRegs} đơn chưa gọi > 2 giờ`, tab: 'registrations' as ActiveTab, urgent: true },
    unpaidFees > 0 && { label: `${unpaidFees} lớp chưa thu phí > 7 ngày`, tab: 'matches' as ActiveTab, urgent: true },
    unverifiedTutors > 0 && { label: `${unverifiedTutors} gia sư chờ xác minh`, tab: 'tutors' as ActiveTab, urgent: false },
    staleMatches > 0 && { label: `${staleMatches} lớp có thể đã ngưng`, tab: 'matches' as ActiveTab, urgent: false },
  ].filter(Boolean) as { label: string; tab: ActiveTab; urgent: boolean }[];

  // 7 days
  const days = Array.from({ length: 7 }, (_, i) => {
    const s = Date.now() - (6 - i) * 86400000, e = s + 86400000;
    return {
      day: new Date(s).toLocaleDateString('vi-VN', { weekday: 'short' }).replace('Th ', 'T'),
      regs: registrations.filter(r => r.createdAt >= s && r.createdAt < e).length,
      matched: matches.filter(m => m.createdAt >= s && m.createdAt < e).length,
    };
  });
  const maxC = Math.max(...days.map(d => Math.max(d.regs, d.matched)), 1);

  // Top 5 classes
  const recentPending = classes.filter(c => c.status === 'ĐANG TÌM' || c.status === 'KHẨN CẤP')
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)).slice(0, 5);

  // Top tutors
  const ts: Record<string, { name: string; active: number; rating: number }> = {};
  matches.filter(m => m.status === 'Đang dạy').forEach(m => {
    if (!ts[m.tutorCode]) ts[m.tutorCode] = { name: m.tutorName, active: 0, rating: 0 };
    ts[m.tutorCode].active++;
  });
  Object.keys(ts).forEach(c => {
    const r = reviews.filter(rv => rv.tutorCode === c);
    ts[c].rating = r.length > 0 ? r.reduce((s, rv) => s + rv.rating, 0) / r.length : (tutors.find(t => t.code === c)?.rating || 0);
  });
  const topT = Object.entries(ts).sort((a, b) => (b[1].active * 3 + b[1].rating * 2) - (a[1].active * 3 + a[1].rating * 2)).slice(0, 4);

  // AI
  const aiRec = (aiMatches || []).map(m => {
    const t = tutors.find(t => t.code === m.tutorCode || t.name.includes(m.tutorCode));
    return t ? { tutor: t, score: m.matchPercentage, rationale: m.aiRationale } : null;
  }).filter(Boolean) as { tutor: TutorItem; score: number; rationale: string }[];

  const copyReport = () => {
    const r = `📊 BÁO CÁO TUẦN — Gia Sư Thành Đạt\n📅 ${new Date().toLocaleDateString('vi-VN')}\n\n📋 Đơn mới: ${weekRegs}\n🎓 Ghép: ${weekMatches}\n📚 Đang dạy: ${activeMatches}\n💰 Doanh thu: ${fmt(totalRevenue)}đ\n📈 Tỷ lệ: ${matchRate}%\n\n🔗 https://giasu-dusky.vercel.app/quan-tri`;
    navigator.clipboard.writeText(r);
    alert('Đã sao chép báo cáo!');
  };

  // --- STYLES ---
  const sectionTitle = "text-[13px] font-semibold text-slate-500 uppercase tracking-wide mb-3";
  const divider = "border-t border-slate-200";

  return (
    <div className="col-span-12 max-w-[1200px]">

      {/* ====== ALERTS ====== */}
      {alerts.length > 0 && (
        <div className="mb-6">
          {alerts.map((a, i) => (
            <button key={i} onClick={() => onNavigate(a.tab)}
              className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-[13px] cursor-pointer transition-colors hover:bg-slate-50 border-b border-slate-100 last:border-b-0 group"
              style={{ color: a.urgent ? '#dc2626' : '#64748b' }}>
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${a.urgent ? 'bg-red-500' : 'bg-slate-400'}`} />
              <span className="flex-1">{a.label}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 transition-colors" />
            </button>
          ))}
        </div>
      )}

      {/* ====== METRICS ====== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 mb-8">
        {[
          { label: 'Doanh thu', value: fmt(totalRevenue) + 'đ', sub: 'Phí kết nối', accent: false },
          { label: 'Đang dạy', value: String(activeMatches), sub: `${matchRate}% tỷ lệ ghép`, accent: true },
          { label: 'Chờ xử lý', value: String(pendingRegs), sub: 'Đơn phụ huynh mới', accent: false },
          { label: 'Cần gia sư', value: String(pendingClasses), sub: `/ ${classes.length} tổng lớp`, accent: false },
        ].map((m, i) => (
          <button key={i} onClick={() => onNavigate(i === 0 ? 'finance' : i === 1 ? 'matches' : i === 2 ? 'registrations' : 'classes')}
            className={`text-left p-5 cursor-pointer transition-colors hover:bg-slate-50 ${i < 3 ? 'border-r border-slate-200' : ''}`}>
            <div className="text-[12px] text-slate-400 font-medium mb-1">{m.label}</div>
            <div className={`text-[28px] font-semibold leading-tight tracking-tight ${m.accent ? 'text-emerald-600' : 'text-slate-900'}`} style={{ fontVariantNumeric: 'tabular-nums' }}>{m.value}</div>
            <div className="text-[12px] text-slate-400 mt-1">{m.sub}</div>
          </button>
        ))}
      </div>

      {/* ====== CHART + SUMMARY ====== */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 mb-8">
        {/* Chart */}
        <div className="lg:col-span-3 p-5 lg:border-r border-slate-200">
          <div className="flex items-center justify-between mb-5">
            <div className={sectionTitle} style={{ marginBottom: 0 }}>Hoạt động 7 ngày</div>
            <div className="flex items-center gap-4 text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5"><span className="w-5 h-1.5 bg-slate-800 rounded-sm" /> Ghép lớp</span>
              <span className="flex items-center gap-1.5"><span className="w-5 h-1.5 bg-slate-300 rounded-sm" /> Đơn đăng ký</span>
            </div>
          </div>
          <div className="flex items-end gap-2" style={{ height: 140 }}>
            {days.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="w-full flex gap-0.5" style={{ height: 112, alignItems: 'flex-end' }}>
                  <div className="flex-1 bg-slate-800 transition-all rounded-sm" style={{ height: `${Math.max((d.matched / maxC) * 100, d.matched > 0 ? 6 : 0)}%`, minHeight: d.matched > 0 ? 3 : 0 }} />
                  <div className="flex-1 bg-slate-300 transition-all rounded-sm" style={{ height: `${Math.max((d.regs / maxC) * 100, d.regs > 0 ? 6 : 0)}%`, minHeight: d.regs > 0 ? 3 : 0 }} />
                </div>
                <span className="text-[10px] text-slate-400">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly summary */}
        <div className="lg:col-span-2 p-5">
          <div className={sectionTitle}>Tuần này</div>
          <div className="space-y-3">
            {[
              { label: 'Đơn phụ huynh mới', value: String(weekRegs) },
              { label: 'Ghép thành công', value: String(weekMatches) },
              { label: 'Lớp đang dạy', value: String(activeMatches) },
              { label: 'Doanh thu', value: fmt(totalRevenue) + 'đ' },
            ].map((r, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-[13px] text-slate-500">{r.label}</span>
                <span className="text-[14px] font-semibold text-slate-900" style={{ fontVariantNumeric: 'tabular-nums' }}>{r.value}</span>
              </div>
            ))}
          </div>
          <button onClick={copyReport}
            className="mt-5 w-full py-2 text-[12px] font-medium text-slate-500 cursor-pointer transition-colors hover:text-slate-800 hover:bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center gap-2">
            <Copy className="w-3.5 h-3.5" /> Sao chép báo cáo
          </button>
        </div>
      </div>

      <div className={divider} />

      {/* ====== 3 LISTS ====== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 mt-6">

        {/* Lớp mới */}
        <div className="p-5 lg:border-r border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className={sectionTitle} style={{ marginBottom: 0 }}>Lớp mới cần gia sư</div>
            {pendingClasses > 0 && (
              <button onClick={() => onNavigate('classes')} className="text-[11px] font-medium text-blue-600 cursor-pointer hover:text-blue-700">
                Xem tất cả
              </button>
            )}
          </div>
          {recentPending.length === 0 ? (
            <p className="text-[13px] text-slate-400 py-4">Không có lớp nào</p>
          ) : (
            <div className="space-y-0.5">
              {recentPending.map(cls => (
                <div key={cls.id || cls.code} onClick={() => onNavigate('classes')}
                  className="flex items-center justify-between py-2.5 cursor-pointer transition-colors hover:bg-slate-50 -mx-2 px-2 rounded">
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-medium text-slate-800 truncate">{cls.subject}</div>
                    <div className="text-[12px] text-slate-400 truncate">{cls.location}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <span className="text-[13px] font-semibold text-slate-700" style={{ fontVariantNumeric: 'tabular-nums' }}>{fmt(cls.fee)}đ</span>
                    {cls.status === 'KHẨN CẤP' && <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tổng quan */}
        <div className="p-5 lg:border-r border-slate-200">
          <div className={sectionTitle}>Tổng quan</div>
          <div className="space-y-3">
            {[
              { label: 'Tổng gia sư', value: tutors.length },
              { label: 'Gia sư sẵn sàng', value: tutors.filter(t => t.status === 'online').length },
              { label: 'Tổng đăng ký', value: registrations.length },
              { label: 'Điểm đánh giá trung bình', value: tutors.length > 0 ? (tutors.reduce((s, t) => s + t.rating, 0) / tutors.length).toFixed(1) : '—' },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center py-1">
                <span className="text-[13px] text-slate-500">{item.label}</span>
                <span className="text-[14px] font-semibold text-slate-900" style={{ fontVariantNumeric: 'tabular-nums' }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top gia sư */}
        <div className="p-5">
          <div className={sectionTitle}>Gia sư nổi bật</div>
          {topT.length === 0 ? (
            <p className="text-[13px] text-slate-400 py-4">Chưa có dữ liệu</p>
          ) : (
            <div className="space-y-2.5">
              {topT.map(([code, data], i) => (
                <div key={code} className="flex items-center gap-3">
                  <span className="text-[12px] font-semibold text-slate-400 w-4 text-right shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium text-slate-800 truncate">{data.name}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      {data.rating > 0 && <span className="text-[11px] text-slate-500">{data.rating.toFixed(1)} ★</span>}
                      <span className="text-[11px] text-slate-400">{data.active} lớp</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ====== AI MATCH ====== */}
      {hasApiKey && (
        <>
          <div className={`${divider} mt-2`} />
          <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={sectionTitle} style={{ marginBottom: 0 }}>
                <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> AI Ghép nối</span>
              </div>
              {selectedClass && (
                <button onClick={onRunMatch} disabled={isMatchingLoading}
                  className="px-3 py-1.5 text-[12px] font-medium cursor-pointer transition-colors border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-1.5">
                  <RefreshCw className={`w-3 h-3 ${isMatchingLoading ? 'animate-spin' : ''}`} />
                  Phân tích
                </button>
              )}
            </div>
            {!selectedClass ? (
              <p className="text-[13px] text-slate-400">Chọn 1 lớp tại <span className="text-blue-600 font-medium cursor-pointer hover:underline" onClick={() => onNavigate('classes')}>Quản lý lớp</span> để AI đề xuất gia sư phù hợp.</p>
            ) : isMatchingLoading ? (
              <div className="flex items-center gap-2 py-3 text-[13px] text-slate-400">
                <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                Đang phân tích {selectedClass.code}...
              </div>
            ) : aiRec.length > 0 ? (
              <div className="space-y-2 mt-2">
                {aiRec.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 py-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-white text-[11px] shrink-0" style={{ background: item.tutor.avatarColor || '#64748b' }}>
                      {item.tutor.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-medium text-slate-800">{item.tutor.name}</div>
                      <div className="text-[11px] text-slate-400 truncate">{item.rationale}</div>
                    </div>
                    <span className="text-[12px] font-semibold text-emerald-600 shrink-0">{item.score}%</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[13px] text-slate-400">Đã chọn {selectedClass.code}. Nhấn Phân tích để AI tìm gia sư.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};
