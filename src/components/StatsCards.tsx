import React from 'react';
import { Users, BookOpen, GraduationCap, Percent } from 'lucide-react';

interface StatsCardsProps {
  totalClasses: number;
  pendingClasses: number;
  totalTutors: number;
  totalStudents: number;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ totalClasses, pendingClasses, totalTutors, totalStudents }) => {
  return (
    <div id="statistics-cards" className="col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Card 1 */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden group hover:border-blue-300 transition-all">
        <div className="flex items-center justify-between mb-2">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">Học viên & Phụ huynh</div>
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl font-bold text-slate-800">{totalStudents || 142}</div>
        <div className="text-green-600 text-xs mt-2 font-medium flex items-center gap-1">
          <span>+12% so với tháng trước</span>
        </div>
      </div>

      {/* Card 2 */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden group hover:border-blue-300 transition-all">
        <div className="flex items-center justify-between mb-2">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">Lớp chưa nhận</div>
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
            <BookOpen className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl font-bold text-slate-800">{pendingClasses || 24}</div>
        <div className="text-blue-600 text-xs mt-2 font-semibold underline cursor-pointer hover:text-blue-700">
          Phê duyệt nhanh AI
        </div>
      </div>

      {/* Card 3 */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden group hover:border-blue-300 transition-all">
        <div className="flex items-center justify-between mb-2">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">Gia sư trực tuyến</div>
          <div className="p-2 bg-purple-50 text-purple-600 rounded-xl group-hover:scale-110 transition-transform">
            <GraduationCap className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl font-bold text-slate-800">{totalTutors || 1058}</div>
        <div className="text-slate-400 text-xs mt-2">
          Đang hoạt động: <span className="text-slate-700 font-semibold">{Math.round((totalTutors || 1058) * 0.8)}</span>
        </div>
      </div>

      {/* Card 4 */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden group hover:border-blue-300 transition-all">
        <div className="flex items-center justify-between mb-2">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">Tỉ lệ Matching</div>
          <div className="p-2 bg-amber-50 text-amber-600 rounded-xl group-hover:scale-110 transition-transform">
            <Percent className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl font-bold text-slate-800">94.2%</div>
        <div className="text-orange-500 text-xs mt-2 font-medium">
          Cần cải thiện (Toán 12)
        </div>
      </div>
    </div>
  );
};
