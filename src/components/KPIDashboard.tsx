import React, { useState } from 'react';
import { ClassMatch, TutorItem, ParentRegistration, TransactionItem, AttendanceRecord } from '../types';
import { calculateKPIs } from '../utils';
import { TrendingUp, TrendingDown, Users, Target, BarChart3, Activity, Download, FileText, Share2, Megaphone, MapPin, Filter } from 'lucide-react';

interface KPIDashboardProps {
  matches: ClassMatch[];
  registrations: ParentRegistration[];
  tutors: TutorItem[];
  transactions?: TransactionItem[];
  attendance?: AttendanceRecord[];
}

export const KPIDashboard: React.FC<KPIDashboardProps> = ({ matches, registrations, tutors, transactions = [], attendance = [] }) => {
  const [activeView, setActiveView] = useState<'kpi' | 'report' | 'sources' | 'referrals' | 'areas' | 'funnel'>('kpi');
  const kpi = calculateKPIs(matches, registrations, tutors);
  const fmt = (v: number) => new Intl.NumberFormat('vi-VN').format(v);
  const maxRev = Math.max(...kpi.monthlyRevenue.map(m => m.revenue), 1);

  // Feature 5: Lead Source Analytics
  const sourceCounts = registrations.reduce((acc, r) => {
    const src = r.source || 'Không rõ';
    acc[src] = (acc[src] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const sourceConverted = registrations.reduce((acc, r) => {
    const src = r.source || 'Không rõ';
    if (r.status === 'Đã xếp lớp') acc[src] = (acc[src] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const sourceEntries = (Object.entries(sourceCounts) as [string, number][]).sort((a, b) => b[1] - a[1]);
  const maxSource = Math.max(...(Object.values(sourceCounts) as number[]), 1);
  const sourceColors: Record<string, string> = { 'Zalo': '#0068ff', 'Facebook': '#1877f2', 'Google': '#ea4335', 'Giới thiệu': '#22c55e', 'Website': '#6366f1', 'Khác': '#94a3b8', 'Không rõ': '#cbd5e1' };

  // Feature 6: Referral tracking
  const referralRegs = registrations.filter(r => r.referralCode);
  const referralCodes = referralRegs.reduce((acc, r) => {
    const code = r.referralCode!;
    acc[code] = (acc[code] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Feature 2: Monthly report data
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  const thisMonthRegs = registrations.filter(r => { const d = new Date(r.createdAt); return d.getMonth() === thisMonth && d.getFullYear() === thisYear; });
  const thisMonthMatches = matches.filter(m => { const d = new Date(m.createdAt); return d.getMonth() === thisMonth && d.getFullYear() === thisYear; });
  const cancelledRegs = thisMonthRegs.filter(r => r.status === 'Hủy');
  const completedRegs = thisMonthRegs.filter(r => r.status === 'Đã xếp lớp');
  const thisMonthRevenue = transactions.filter(t => { const d = new Date(t.date); return d.getMonth() === thisMonth && d.getFullYear() === thisYear && t.type === 'Thu phí gia sư'; }).reduce((s, t) => s + t.amount, 0);
  const thisMonthSalary = transactions.filter(t => { const d = new Date(t.date); return d.getMonth() === thisMonth && d.getFullYear() === thisYear && t.type === 'Thanh toán lương'; }).reduce((s, t) => s + t.amount, 0);
  const topTutors = [...tutors].filter(t => t.verified).sort((a, b) => b.rating - a.rating).slice(0, 5);
  const subjectCounts = thisMonthRegs.reduce((acc, r) => { r.subjects.forEach(s => { acc[s] = (acc[s] || 0) + 1; }); return acc; }, {} as Record<string, number>);
  const topSubjects = (Object.entries(subjectCounts) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const exportMonthlyReport = () => {
    const monthName = `T${thisMonth + 1}/${thisYear}`;
    let csv = '\uFEFF'; // BOM
    csv += `BÁO CÁO THÁNG ${monthName}\n`;
    csv += `Ngày xuất: ${now.toLocaleDateString('vi-VN')}\n\n`;
    csv += `CHỈ SỐ,GIÁ TRỊ\n`;
    csv += `Đơn mới,${thisMonthRegs.length}\n`;
    csv += `Đã ghép lớp,${completedRegs.length}\n`;
    csv += `Hủy,${cancelledRegs.length}\n`;
    csv += `Tỷ lệ chuyển đổi,${thisMonthRegs.length > 0 ? Math.round(completedRegs.length / thisMonthRegs.length * 100) : 0}%\n`;
    csv += `Doanh thu,${fmt(thisMonthRevenue)}đ\n`;
    csv += `Chi lương GS,${fmt(thisMonthSalary)}đ\n`;
    csv += `Lãi ròng,${fmt(thisMonthRevenue - thisMonthSalary)}đ\n`;
    csv += `\nTOP MÔN HỌC\n`;
    topSubjects.forEach(([sub, count]) => { csv += `${sub},${count} đơn\n`; });
    csv += `\nTOP GIA SƯ\n`;
    topTutors.forEach(t => { csv += `${t.name},⭐${t.rating},${t.subjects.join(';')}\n`; });
    csv += `\nNGUỒN KHÁCH\n`;
    sourceEntries.forEach(([src, count]) => { csv += `${src},${count} đơn,${sourceConverted[src] || 0} ghép\n`; });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `bao-cao-${monthName.replace('/', '-')}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const views = [
    { id: 'kpi' as const, label: 'KPI', icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { id: 'report' as const, label: 'Báo cáo tháng', icon: <FileText className="w-3.5 h-3.5" /> },
    { id: 'sources' as const, label: 'Nguồn khách', icon: <Megaphone className="w-3.5 h-3.5" /> },
    { id: 'referrals' as const, label: 'Giới thiệu', icon: <Share2 className="w-3.5 h-3.5" /> },
    { id: 'areas' as const, label: 'Khu vực', icon: <MapPin className="w-3.5 h-3.5" /> },
    { id: 'funnel' as const, label: 'Phễu', icon: <Filter className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="col-span-12 space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" /> KPI & Thống kê
        </h2>
        <div className="flex gap-2 flex-wrap">
          {views.map(v => (
            <button key={v.id} onClick={() => setActiveView(v.id)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer border flex items-center gap-1.5 transition-all ${
                activeView === v.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200'
              }`}>{v.icon}{v.label}</button>
          ))}
        </div>
      </div>

      {/* ===== KPI VIEW ===== */}
      {activeView === 'kpi' && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-2"><Target className="w-4 h-4 text-blue-500" /><span className="text-[10px] font-bold uppercase text-slate-400">Tỷ lệ ghép</span></div>
              <div className="text-3xl font-bold text-blue-600">{kpi.matchRate}%</div>
              <p className="text-[10px] text-slate-500 mt-1">Đơn đăng ký → Xếp lớp</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-2"><Activity className="w-4 h-4 text-emerald-500" /><span className="text-[10px] font-bold uppercase text-slate-400">GS hoạt động</span></div>
              <div className="text-3xl font-bold text-emerald-600">{kpi.activeTutors}/{tutors.length}</div>
              <p className="text-[10px] text-slate-500 mt-1">{kpi.tutorActiveRate}% online & verified</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-2">
                {kpi.revenueGrowth >= 0 ? <TrendingUp className="w-4 h-4 text-emerald-500" /> : <TrendingDown className="w-4 h-4 text-red-500" />}
                <span className="text-[10px] font-bold uppercase text-slate-400">Doanh thu tháng</span>
              </div>
              <div className="text-2xl font-bold text-slate-800">{fmt(kpi.revenueThisMonth)}đ</div>
              <p className={`text-[10px] font-bold mt-1 ${kpi.revenueGrowth >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {kpi.revenueGrowth >= 0 ? '+' : ''}{kpi.revenueGrowth}% so với tháng trước
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-2"><Users className="w-4 h-4 text-purple-500" /><span className="text-[10px] font-bold uppercase text-slate-400">Ghép tháng này</span></div>
              <div className="text-3xl font-bold text-purple-600">{kpi.thisMonthMatches}</div>
              <p className="text-[10px] text-slate-500 mt-1">Tháng trước: {kpi.lastMonthMatches}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h3 className="font-bold text-sm text-slate-800 mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-500" /> Doanh thu 6 tháng gần nhất
            </h3>
            <div className="flex items-end gap-3 h-40">
              {kpi.monthlyRevenue.map((m, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[9px] font-bold text-slate-500">{m.revenue > 0 ? fmt(m.revenue / 1000) + 'k' : '0'}</span>
                  <div className="w-full rounded-t-lg transition-all" style={{
                    height: `${Math.max((m.revenue / maxRev) * 100, 4)}%`,
                    background: i === kpi.monthlyRevenue.length - 1
                      ? 'linear-gradient(180deg, #3b82f6, #1d4ed8)'
                      : 'linear-gradient(180deg, #e2e8f0, #cbd5e1)',
                    minHeight: 4,
                  }} />
                  <span className="text-[10px] font-bold text-slate-500">{m.month}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ===== MONTHLY REPORT VIEW ===== */}
      {activeView === 'report' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-800">📊 Báo cáo tháng {thisMonth + 1}/{thisYear}</h3>
            <button onClick={exportMonthlyReport}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-2">
              <Download className="w-3.5 h-3.5" /> Xuất CSV
            </button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Đơn mới', value: thisMonthRegs.length, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Đã ghép', value: completedRegs.length, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'Hủy', value: cancelledRegs.length, color: 'text-red-600', bg: 'bg-red-50' },
              { label: 'Chuyển đổi', value: `${thisMonthRegs.length > 0 ? Math.round(completedRegs.length / thisMonthRegs.length * 100) : 0}%`, color: 'text-purple-600', bg: 'bg-purple-50' },
            ].map((item, i) => (
              <div key={i} className={`${item.bg} rounded-2xl p-5 border border-slate-100`}>
                <div className="text-[10px] font-bold uppercase text-slate-400 mb-1">{item.label}</div>
                <div className={`text-2xl font-bold ${item.color}`}>{item.value}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h4 className="text-xs font-bold uppercase text-slate-400 mb-3">💰 Tài chính</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-600">Doanh thu</span><span className="font-bold text-emerald-600">{fmt(thisMonthRevenue)}đ</span></div>
                <div className="flex justify-between"><span className="text-slate-600">Chi lương GS</span><span className="font-bold text-red-600">-{fmt(thisMonthSalary)}đ</span></div>
                <div className="flex justify-between border-t pt-2"><span className="font-bold text-slate-800">Lãi ròng</span><span className="font-bold text-blue-600">{fmt(thisMonthRevenue - thisMonthSalary)}đ</span></div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h4 className="text-xs font-bold uppercase text-slate-400 mb-3">📚 Top môn đăng ký</h4>
              <div className="space-y-2">
                {topSubjects.length === 0 && <p className="text-xs text-slate-400">Chưa có dữ liệu</p>}
                {topSubjects.map(([sub, count], i) => (
                  <div key={sub} className="flex items-center justify-between">
                    <span className="text-xs text-slate-700 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[9px] font-bold">{i + 1}</span>
                      {sub}
                    </span>
                    <span className="text-xs font-bold text-slate-600">{count} đơn</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h4 className="text-xs font-bold uppercase text-slate-400 mb-3">🏆 Top gia sư</h4>
              <div className="space-y-2">
                {topTutors.map((t, i) => (
                  <div key={t.code} className="flex items-center justify-between">
                    <span className="text-xs text-slate-700 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-[9px] font-bold">{i + 1}</span>
                      {t.name}
                    </span>
                    <span className="text-xs font-bold text-amber-600">⭐{t.rating}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== LEAD SOURCE VIEW ===== */}
      {activeView === 'sources' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800">📈 Phân tích nguồn khách hàng</h3>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {sourceEntries.map(([src, count]) => {
              const converted = sourceConverted[src] || 0;
              const rate = count > 0 ? Math.round(converted / count * 100) : 0;
              return (
                <div key={src} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full" style={{ background: sourceColors[src] || '#94a3b8' }} />
                    <span className="text-sm font-bold text-slate-800">{src}</span>
                  </div>
                  <div className="flex items-end gap-3 mb-2">
                    <div className="text-2xl font-bold text-slate-800">{count}</div>
                    <div className="text-xs text-slate-500 pb-1">đơn đăng ký</div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
                    <div className="h-2 rounded-full transition-all" style={{ width: `${(count / maxSource) * 100}%`, background: sourceColors[src] || '#94a3b8' }} />
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-emerald-600 font-bold">{converted} đã ghép</span>
                    <span className="text-slate-500">Chuyển đổi: {rate}%</span>
                  </div>
                </div>
              );
            })}
            {sourceEntries.length === 0 && (
              <div className="col-span-3 bg-slate-50 rounded-2xl p-8 text-center">
                <Megaphone className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500">Chưa có dữ liệu nguồn. PH mới đăng ký sẽ chọn nguồn biết đến.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== REFERRAL VIEW ===== */}
      {activeView === 'referrals' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800">🏆 Chương trình giới thiệu</h3>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
              <div className="text-[10px] font-bold uppercase text-emerald-400 mb-1">Tổng giới thiệu</div>
              <div className="text-3xl font-bold text-emerald-600">{referralRegs.length}</div>
            </div>
            <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
              <div className="text-[10px] font-bold uppercase text-blue-400 mb-1">Mã GT duy nhất</div>
              <div className="text-3xl font-bold text-blue-600">{Object.keys(referralCodes).length}</div>
            </div>
            <div className="bg-purple-50 rounded-2xl p-5 border border-purple-100">
              <div className="text-[10px] font-bold uppercase text-purple-400 mb-1">Ghép thành công</div>
              <div className="text-3xl font-bold text-purple-600">{referralRegs.filter(r => r.status === 'Đã xếp lớp').length}</div>
            </div>
          </div>
          {Object.keys(referralCodes).length > 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h4 className="text-xs font-bold uppercase text-slate-400 mb-3">Bảng xếp hạng người giới thiệu</h4>
              <div className="space-y-2">
                {(Object.entries(referralCodes) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([code, count], i) => (
                  <div key={code} className="flex items-center justify-between bg-slate-50 rounded-xl p-3">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${i === 0 ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-600'}`}>{i + 1}</span>
                      Mã: {code}
                    </span>
                    <span className="text-xs font-bold text-emerald-600">{count} lượt GT</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-2xl p-8 text-center">
              <Share2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500">Chưa có PH nào sử dụng mã giới thiệu. Mã GT sẽ hiện khi PH nhập trong form đăng ký.</p>
            </div>
          )}
        </div>
      )}

      {/* ===== AREA ANALYTICS (F15) ===== */}
      {activeView === 'areas' && (() => {
        const tutorAreas = tutors.reduce((acc, t) => {
          const area = t.area || 'Chưa có';
          acc[area] = (acc[area] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        const regDistricts = registrations.reduce((acc, r) => {
          const d = r.district || 'Chưa có';
          acc[d] = (acc[d] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        const tutorEntries = (Object.entries(tutorAreas) as [string, number][]).sort((a, b) => b[1] - a[1]);
        const regEntries = (Object.entries(regDistricts) as [string, number][]).sort((a, b) => b[1] - a[1]);
        const maxTutor = Math.max(...(Object.values(tutorAreas) as number[]), 1);
        const maxReg = Math.max(...(Object.values(regDistricts) as number[]), 1);
        return (
          <div className="space-y-5">
            <h3 className="text-sm font-bold text-slate-800">🗺️ Phân bổ theo khu vực</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* GS by area */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5">
                <h4 className="text-xs font-bold uppercase text-slate-400 mb-3">Gia sư theo khu vực</h4>
                <div className="space-y-2">
                  {tutorEntries.slice(0, 10).map(([area, count]) => (
                    <div key={area} className="flex items-center gap-3">
                      <span className="text-xs text-slate-600 w-28 truncate font-medium">{area}</span>
                      <div className="flex-1 bg-slate-100 rounded-full h-5 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-end pr-2 transition-all"
                          style={{ width: `${Math.max((count / maxTutor) * 100, 8)}%` }}>
                          <span className="text-[9px] font-bold text-white">{count}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {tutorEntries.length === 0 && <p className="text-xs text-slate-400 text-center py-4">Chưa có dữ liệu</p>}
                </div>
              </div>
              {/* PH demand by district */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5">
                <h4 className="text-xs font-bold uppercase text-slate-400 mb-3">Nhu cầu PH theo quận</h4>
                <div className="space-y-2">
                  {regEntries.slice(0, 10).map(([dist, count]) => (
                    <div key={dist} className="flex items-center gap-3">
                      <span className="text-xs text-slate-600 w-28 truncate font-medium">{dist}</span>
                      <div className="flex-1 bg-slate-100 rounded-full h-5 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-end pr-2 transition-all"
                          style={{ width: `${Math.max((count / maxReg) * 100, 8)}%` }}>
                          <span className="text-[9px] font-bold text-white">{count}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {regEntries.length === 0 && <p className="text-xs text-slate-400 text-center py-4">Chưa có dữ liệu</p>}
                </div>
              </div>
            </div>
            {/* Gap analysis */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h4 className="text-xs font-bold uppercase text-slate-400 mb-3">⚠️ Phân tích thiếu hụt GS</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {regEntries.slice(0, 8).map(([dist, demand]) => {
                  const supply = tutorAreas[dist] || 0;
                  const gap = demand - supply;
                  return (
                    <div key={dist} className={`p-3 rounded-xl border ${gap > 0 ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
                      <div className="text-xs font-bold text-slate-700">{dist}</div>
                      <div className="flex justify-between mt-1 text-[10px]">
                        <span className="text-emerald-600">GS: {supply}</span>
                        <span className="text-blue-600">PH: {demand}</span>
                      </div>
                      {gap > 0 && <div className="text-[9px] font-bold text-red-600 mt-0.5">Thiếu {gap} GS!</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}
      {/* F43: Conversion Funnel */}
      {activeView === 'funnel' && (() => {
        const totalRegs = registrations.length;
        const contacted = registrations.filter(r => r.status === 'Đã liên hệ' || r.status === 'Đã xếp lớp').length;
        const matched = registrations.filter(r => r.status === 'Đã xếp lớp').length;
        const feePaid = matches.filter(m => m.feePaid).length;
        const cancelled = registrations.filter(r => r.status === 'Hủy').length;

        const funnelSteps = [
          { label: 'Đơn đăng ký', count: totalRegs, color: '#3b82f6', icon: '📋' },
          { label: 'Đã liên hệ', count: contacted, color: '#f59e0b', icon: '📞' },
          { label: 'Đã ghép lớp', count: matched, color: '#22c55e', icon: '✅' },
          { label: 'Đã thu phí KN', count: feePaid, color: '#8b5cf6', icon: '💰' },
        ];

        return (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-6">
              <Filter className="w-4 h-4 text-purple-600" /> Phễu chuyển đổi
            </h3>
            <div className="space-y-3">
              {funnelSteps.map((step, i) => {
                const pct = totalRegs > 0 ? Math.round(step.count / totalRegs * 100) : 0;
                const dropOff = i > 0 ? funnelSteps[i - 1].count - step.count : 0;
                const dropPct = i > 0 && funnelSteps[i - 1].count > 0 ? Math.round(dropOff / funnelSteps[i - 1].count * 100) : 0;
                return (
                  <div key={step.label}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-slate-700">{step.icon} {step.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold" style={{ color: step.color }}>{step.count}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: step.color + '15', color: step.color }}>{pct}%</span>
                        {i > 0 && dropOff > 0 && (
                          <span className="text-[9px] font-bold text-red-500">-{dropOff} ({dropPct}%)</span>
                        )}
                      </div>
                    </div>
                    <div className="h-6 bg-slate-100 rounded-lg overflow-hidden">
                      <div className="h-full rounded-lg transition-all duration-500" style={{ width: `${Math.max(pct, 2)}%`, background: step.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-emerald-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-emerald-600">{totalRegs > 0 ? Math.round(matched / totalRegs * 100) : 0}%</div>
                <div className="text-[10px] font-bold text-emerald-700 mt-1">Tỷ lệ ghép thành công</div>
              </div>
              <div className="bg-red-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{totalRegs > 0 ? Math.round(cancelled / totalRegs * 100) : 0}%</div>
                <div className="text-[10px] font-bold text-red-700 mt-1">Tỷ lệ hủy</div>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{matched > 0 ? Math.round(feePaid / matched * 100) : 0}%</div>
                <div className="text-[10px] font-bold text-purple-700 mt-1">Tỷ lệ thu phí</div>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{fmt(matches.filter(m => m.feePaid && m.feeAmount).reduce((s, m) => s + (m.feeAmount || 0), 0))}đ</div>
                <div className="text-[10px] font-bold text-blue-700 mt-1">Doanh thu KN đã thu</div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
