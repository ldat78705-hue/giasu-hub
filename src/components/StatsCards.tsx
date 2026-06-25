import React from 'react';
import { Users, BookOpen, GraduationCap, ClipboardCheck } from 'lucide-react';

interface StatsCardsProps {
  totalClasses: number;
  pendingClasses: number;
  totalTutors: number;
  totalStudents: number;
  pendingApplications: number;
  totalRevenue: number;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  totalClasses,
  pendingClasses,
  totalTutors,
  totalStudents,
  pendingApplications,
  totalRevenue,
}) => {
  const formatCurrency = (val: number) => new Intl.NumberFormat('vi-VN').format(val);

  return (
    <div id="statistics-cards" className="col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Card 1: Học viên */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden group hover:border-emerald-300 transition-all">
        <div className="flex items-center justify-between mb-2">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">Học viên</div>
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl font-bold text-slate-800">{totalStudents}</div>
        <div className="text-slate-400 text-xs mt-2 font-medium">
          Đang theo dõi trong hệ thống
        </div>
      </div>

      {/* Card 2: Lớp cần GS */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden group hover:border-amber-300 transition-all">
        <div className="flex items-center justify-between mb-2">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">Lớp cần gia sư</div>
          <div className="p-2 bg-amber-50 text-amber-600 rounded-xl group-hover:scale-110 transition-transform">
            <BookOpen className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl font-bold text-slate-800">{pendingClasses}</div>
        <div className="text-slate-400 text-xs mt-2 font-medium">
          Tổng {totalClasses} lớp trong hệ thống
        </div>
      </div>

      {/* Card 3: Gia sư */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden group hover:border-purple-300 transition-all">
        <div className="flex items-center justify-between mb-2">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">Gia sư</div>
          <div className="p-2 bg-purple-50 text-purple-600 rounded-xl group-hover:scale-110 transition-transform">
            <GraduationCap className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl font-bold text-slate-800">{totalTutors}</div>
        <div className="text-slate-400 text-xs mt-2 font-medium">
          Đã đăng ký trong hệ thống
        </div>
      </div>

      {/* Card 4: Đơn chờ duyệt */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden group hover:border-blue-300 transition-all">
        <div className="flex items-center justify-between mb-2">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">Đơn chờ duyệt</div>
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
            <ClipboardCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl font-bold text-slate-800">{pendingApplications}</div>
        <div className="text-slate-400 text-xs mt-2 font-medium">
          {totalRevenue > 0 ? `Doanh thu: ${formatCurrency(totalRevenue)}đ` : 'Ứng tuyển & yêu cầu thuê'}
        </div>
      </div>
    </div>
  );
};
