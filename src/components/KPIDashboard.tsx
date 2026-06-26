import React, { useState } from 'react';
import { ClassMatch, TutorItem, ParentRegistration } from '../types';
import { calculateKPIs } from '../utils';
import { TrendingUp, TrendingDown, Users, Target, BarChart3, Activity } from 'lucide-react';

interface KPIDashboardProps {
  matches: ClassMatch[];
  registrations: ParentRegistration[];
  tutors: TutorItem[];
}

export const KPIDashboard: React.FC<KPIDashboardProps> = ({ matches, registrations, tutors }) => {
  const kpi = calculateKPIs(matches, registrations, tutors);
  const fmt = (v: number) => new Intl.NumberFormat('vi-VN').format(v);
  const maxRev = Math.max(...kpi.monthlyRevenue.map(m => m.revenue), 1);

  return (
    <div className="col-span-12 space-y-5">
      <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-blue-600" /> KPI & Thống kê
      </h2>

      {/* KPI Cards */}
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

      {/* Revenue Chart - #13 */}
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
    </div>
  );
};
