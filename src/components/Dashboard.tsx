import React from 'react';
import { Users, BookOpen, GraduationCap, TrendingUp, DollarSign, Copy, Star, Trophy, Sparkles, RefreshCw, AlertTriangle, Bell, ArrowRight, ChevronRight, Target, UserPlus } from 'lucide-react';
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

// Reusable card shell
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white border border-slate-200/80 rounded-xl p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] ${className}`}>
    {children}
  </div>
);

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="text-[13px] font-semibold text-slate-500 uppercase tracking-wide">{children}</h3>
);

export const Dashboard: React.FC<DashboardProps> = ({
  classes, tutors, matches, registrations, attendance, reviews, transactions,
  totalRevenue, onNavigate, selectedClass, aiMatches, isMatchingLoading, onRunMatch, hasApiKey,
}) => {
  // ===== ALL BUSINESS LOGIC UNTOUCHED =====
  const pendingClasses = classes.filter(c => c.status === 'ĐANG TÌM' || c.status === 'KHẨN CẤP').length;
  const activeMatches = matches.filter(m => m.status === 'Đang dạy').length;
  const doneMatches = matches.filter(m => m.status === 'Hoàn thành').length;
  const matchRate = matches.length > 0 ? Math.round((doneMatches + activeMatches) / matches.length * 100) : 0;
  const pendingRegs = registrations.filter(r => r.status === 'Mới').length;
  const unverifiedTutors = tutors.filter(t => !t.verified).length;

  const weekAgo = Date.now() - 7 * 86400000;
  const weekRegs = registrations.filter(r => r.createdAt > weekAgo).length;
  const weekMatches = matches.filter(m => m.createdAt > weekAgo).length;

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

  const days = Array.from({ length: 7 }, (_, i) => {
    const s = Date.now() - (6 - i) * 86400000, e = s + 86400000;
    return {
      day: new Date(s).toLocaleDateString('vi-VN', { weekday: 'short' }).replace('Th ', 'T'),
      regs: registrations.filter(r => r.createdAt >= s && r.createdAt < e).length,
      matched: matches.filter(m => m.createdAt >= s && m.createdAt < e).length,
    };
  });
  const maxC = Math.max(...days.map(d => Math.max(d.regs, d.matched)), 1);

  const recentPending = classes.filter(c => c.status === 'ĐANG TÌM' || c.status === 'KHẨN CẤP')
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)).slice(0, 5);

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

  const aiRec = (aiMatches || []).map(m => {
    const t = tutors.find(t => t.code === m.tutorCode || t.name.includes(m.tutorCode));
    return t ? { tutor: t, score: m.matchPercentage, rationale: m.aiRationale } : null;
  }).filter(Boolean) as { tutor: TutorItem; score: number; rationale: string }[];

  const copyReport = () => {
    const r = `📊 BÁO CÁO TUẦN — Gia Sư Thành Đạt\n📅 ${new Date().toLocaleDateString('vi-VN')}\n\n📋 Đơn mới: ${weekRegs}\n🎓 Ghép: ${weekMatches}\n📚 Đang dạy: ${activeMatches}\n💰 Doanh thu: ${fmt(totalRevenue)}đ\n📈 Tỷ lệ: ${matchRate}%\n\n🔗 https://giasu-dusky.vercel.app/quan-tri`;
    navigator.clipboard.writeText(r);
    alert('Đã sao chép báo cáo!');
  };

  // ===== METRIC CONFIG =====
  const metrics = [
    { label: 'Doanh thu', value: fmt(totalRevenue) + 'đ', sub: 'Phí kết nối', icon: <DollarSign className="w-5 h-5" />, iconBg: 'bg-emerald-50 text-emerald-600', tab: 'finance' as ActiveTab },
    { label: 'Đang dạy', value: String(activeMatches), sub: `${matchRate}% tỷ lệ ghép`, icon: <Target className="w-5 h-5" />, iconBg: 'bg-blue-50 text-blue-600', tab: 'matches' as ActiveTab },
    { label: 'Chờ xử lý', value: String(pendingRegs), sub: 'Đơn phụ huynh mới', icon: <UserPlus className="w-5 h-5" />, iconBg: 'bg-amber-50 text-amber-600', tab: 'registrations' as ActiveTab },
    { label: 'Cần gia sư', value: String(pendingClasses), sub: `/ ${classes.length} tổng lớp`, icon: <BookOpen className="w-5 h-5" />, iconBg: 'bg-rose-50 text-rose-600', tab: 'classes' as ActiveTab },
  ];

  // ===== RENDER =====
  return (
    <div className="col-span-12 space-y-5">

      {/* ===== ALERTS CARD ===== */}
      {alerts.length > 0 && (
        <Card className="!p-0 divide-y divide-slate-100">
          {alerts.map((a, i) => (
            <button key={i} onClick={() => onNavigate(a.tab)}
              className="flex items-center gap-3 w-full text-left px-5 py-3.5 text-[13px] cursor-pointer transition-colors hover:bg-slate-50/75 group">
              <span className={`w-2 h-2 rounded-full shrink-0 ${a.urgent ? 'bg-red-500' : 'bg-slate-300'}`} />
              <span className={`flex-1 min-w-0 truncate ${a.urgent ? 'text-red-600 font-medium' : 'text-slate-600'}`}>{a.label}</span>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors shrink-0" />
            </button>
          ))}
        </Card>
      )}

      {/* ===== TOP METRICS GRID ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <Card key={i} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate(m.tab)}>
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${m.iconBg} flex items-center justify-center`}>
                {m.icon}
              </div>
            </div>
            <div className="text-[24px] font-semibold text-slate-900 leading-none" style={{ fontVariantNumeric: 'tabular-nums' }}>{m.value}</div>
            <div className="text-[12px] text-slate-400 mt-1.5 font-medium">{m.label}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">{m.sub}</div>
          </Card>
        ))}
      </div>

      {/* ===== CHART + WEEKLY ROW ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* 7-Day Chart */}
        <Card className="lg:col-span-3">
          <div className="flex items-center justify-between mb-5">
            <SectionLabel>Hoạt động 7 ngày</SectionLabel>
            <div className="flex items-center gap-4 text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5"><span className="w-3 h-2 bg-indigo-500 rounded-sm" /> Ghép lớp</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-2 bg-slate-200 rounded-sm" /> Đơn đăng ký</span>
            </div>
          </div>
          <div className="flex items-end gap-2.5" style={{ height: 140 }}>
            {days.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="w-full flex gap-[3px]" style={{ height: 112, alignItems: 'flex-end' }}>
                  <div className="flex-1 bg-indigo-500 transition-all rounded-t-sm hover:bg-indigo-600" style={{ height: `${Math.max((d.matched / maxC) * 100, d.matched > 0 ? 6 : 0)}%`, minHeight: d.matched > 0 ? 3 : 0 }} />
                  <div className="flex-1 bg-slate-200 transition-all rounded-t-sm hover:bg-slate-300" style={{ height: `${Math.max((d.regs / maxC) * 100, d.regs > 0 ? 6 : 0)}%`, minHeight: d.regs > 0 ? 3 : 0 }} />
                </div>
                <span className="text-[10px] text-slate-400 font-medium">{d.day}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Weekly Summary */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <SectionLabel>Tuần này</SectionLabel>
            <button onClick={copyReport}
              className="text-[11px] font-medium text-indigo-600 cursor-pointer hover:text-indigo-700 flex items-center gap-1 transition-colors">
              <Copy className="w-3 h-3" /> Sao chép
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {[
              { label: 'Đơn phụ huynh mới', value: String(weekRegs) },
              { label: 'Ghép thành công', value: String(weekMatches) },
              { label: 'Lớp đang dạy', value: String(activeMatches) },
              { label: 'Doanh thu', value: fmt(totalRevenue) + 'đ' },
            ].map((r, i) => (
              <div key={i} className="flex justify-between items-center py-3">
                <span className="text-[13px] text-slate-500">{r.label}</span>
                <span className="text-[14px] font-semibold text-slate-900" style={{ fontVariantNumeric: 'tabular-nums' }}>{r.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ===== BOTTOM 3-COL: Classes + Overview + Top Tutors ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Recent pending classes */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <SectionLabel>Lớp mới cần gia sư</SectionLabel>
            {pendingClasses > 0 && (
              <button onClick={() => onNavigate('classes')} className="text-[11px] font-medium text-indigo-600 cursor-pointer hover:text-indigo-700 transition-colors">
                Xem tất cả
              </button>
            )}
          </div>
          {recentPending.length === 0 ? (
            <p className="text-[13px] text-slate-400 py-6 text-center">Không có lớp nào</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentPending.map(cls => (
                <div key={cls.id || cls.code} onClick={() => onNavigate('classes')}
                  className="flex items-center justify-between py-3.5 cursor-pointer transition-colors hover:bg-slate-50/75 -mx-5 px-5 first:pt-0 last:pb-0">
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-medium text-slate-800 truncate">{cls.subject}</div>
                    <div className="text-[12px] text-slate-400 truncate mt-0.5">{cls.location}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-4">
                    <span className="text-[13px] font-semibold text-slate-700" style={{ fontVariantNumeric: 'tabular-nums' }}>{fmt(cls.fee)}đ</span>
                    {cls.status === 'KHẨN CẤP' && <span className="w-2 h-2 bg-red-500 rounded-full shrink-0" />}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* System overview */}
        <Card>
          <div className="mb-4"><SectionLabel>Tổng quan</SectionLabel></div>
          <div className="divide-y divide-slate-100">
            {[
              { label: 'Tổng gia sư', value: tutors.length, icon: <GraduationCap className="w-4 h-4" />, iconBg: 'bg-purple-50 text-purple-500' },
              { label: 'Gia sư sẵn sàng', value: tutors.filter(t => t.status === 'online').length, icon: <Users className="w-4 h-4" />, iconBg: 'bg-emerald-50 text-emerald-500' },
              { label: 'Tổng đăng ký', value: registrations.length, icon: <UserPlus className="w-4 h-4" />, iconBg: 'bg-blue-50 text-blue-500' },
              { label: 'Điểm đánh giá trung bình', value: tutors.length > 0 ? (tutors.reduce((s, t) => s + t.rating, 0) / tutors.length).toFixed(1) : '—', icon: <Star className="w-4 h-4" />, iconBg: 'bg-amber-50 text-amber-500' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-3.5 first:pt-0 last:pb-0">
                <div className={`w-8 h-8 rounded-lg ${item.iconBg} flex items-center justify-center shrink-0`}>{item.icon}</div>
                <span className="text-[13px] text-slate-500 flex-1 min-w-0 truncate">{item.label}</span>
                <span className="text-[14px] font-semibold text-slate-900 shrink-0" style={{ fontVariantNumeric: 'tabular-nums' }}>{item.value}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Top tutors */}
        <Card>
          <div className="mb-4"><SectionLabel>Gia sư nổi bật</SectionLabel></div>
          {topT.length === 0 ? (
            <p className="text-[13px] text-slate-400 py-6 text-center">Chưa có dữ liệu</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {topT.map(([code, data], i) => (
                <div key={code} className="flex items-center gap-3 py-3.5 first:pt-0 last:pb-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[12px] font-bold shrink-0 ${
                    i === 0 ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'
                  }`}>{i + 1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium text-slate-800 truncate">{data.name}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      {data.rating > 0 && <span className="text-[11px] text-amber-600 font-medium">{data.rating.toFixed(1)} ★</span>}
                      <span className="text-[11px] text-slate-400">{data.active} lớp</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* ===== AI MATCH CARD ===== */}
      {hasApiKey && (
        <Card>
          <div className="flex items-center justify-between mb-3">
            <SectionLabel>
              <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-indigo-500" /> AI Ghép nối</span>
            </SectionLabel>
            {selectedClass && (
              <button onClick={onRunMatch} disabled={isMatchingLoading}
                className="px-3.5 py-1.5 text-[12px] font-medium cursor-pointer transition-all bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-1.5 shadow-sm">
                <RefreshCw className={`w-3 h-3 ${isMatchingLoading ? 'animate-spin' : ''}`} />
                Phân tích
              </button>
            )}
          </div>
          {!selectedClass ? (
            <p className="text-[13px] text-slate-400">Chọn 1 lớp tại <span className="text-indigo-600 font-medium cursor-pointer hover:underline" onClick={() => onNavigate('classes')}>Quản lý lớp</span> để AI đề xuất gia sư phù hợp.</p>
          ) : isMatchingLoading ? (
            <div className="flex items-center gap-2.5 py-4 text-[13px] text-slate-400">
              <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              Đang phân tích {selectedClass.code}...
            </div>
          ) : aiRec.length > 0 ? (
            <div className="divide-y divide-slate-100 mt-1">
              {aiRec.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 py-3.5 first:pt-1 last:pb-0">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center font-semibold text-white text-[11px] shrink-0" style={{ background: item.tutor.avatarColor || '#6366f1' }}>
                    {item.tutor.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium text-slate-800 truncate">{item.tutor.name}</div>
                    <div className="text-[11px] text-slate-400 truncate mt-0.5">{item.rationale}</div>
                  </div>
                  <span className="text-[12px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md shrink-0">{item.score}%</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[13px] text-slate-400">Đã chọn {selectedClass.code}. Nhấn Phân tích để AI tìm gia sư.</p>
          )}
        </Card>
      )}
    </div>
  );
};
