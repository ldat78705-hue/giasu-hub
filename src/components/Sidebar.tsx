import React from 'react';
import { ActiveTab } from '../types';
import { LayoutDashboard, BookOpen, Users, GraduationCap, DollarSign, Globe, ExternalLink, ClipboardList } from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  pendingClassesCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, pendingClassesCount }) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Bảng điều khiển', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'classes', label: 'Lớp học mới', icon: <BookOpen className="w-4 h-4" />, badge: pendingClassesCount },
    { id: 'tutors', label: 'Danh sách Gia sư', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'students', label: 'Quản lý Học sinh', icon: <Users className="w-4 h-4" /> },
    { id: 'finance', label: 'Tài chính & Biên lai', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'seo', label: 'Cấu hình SEO', icon: <Globe className="w-4 h-4" /> },
  ];

  return (
    <aside id="sidebar-navigation" className="w-64 bg-[#0F172A] text-slate-300 flex flex-col h-full shrink-0 select-none border-r border-slate-800">
      <div className="p-6 flex items-center gap-3 border-b border-slate-700/80">
        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/25 text-sm">
          GT
        </div>
        <div>
          <div className="text-lg font-bold tracking-tight text-white leading-none">Gia Sư Hub</div>
          <div className="text-[9px] font-bold text-blue-400 uppercase tracking-[0.1em] mt-0.5">Admin Panel</div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-4 pt-2 pb-3">
          Quản lý
        </div>
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <div
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-4 py-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-between gap-2 ${
                isActive
                  ? 'bg-blue-600/15 text-blue-400 font-semibold border border-blue-500/20 shadow-inner'
                  : 'hover:bg-slate-800/80 text-slate-300 font-medium hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-blue-400' : 'text-slate-500'}>{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                  isActive ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-200'
                }`}>
                  {item.badge}
                </span>
              )}
            </div>
          );
        })}
      </nav>

      <div className="p-4 space-y-3 border-t border-slate-700/80 bg-slate-900/40">
        {/* Back to Public Site Button */}
        <button
          onClick={() => setActiveTab('home')}
          className="w-full px-4 py-2.5 bg-slate-800/60 hover:bg-slate-700 border border-slate-700/50 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Về Trang công khai</span>
        </button>

        {/* System Status */}
        <div className="bg-slate-800/60 p-4 rounded-xl text-xs border border-slate-700/50 shadow-sm">
          <div className="flex justify-between mb-1.5 font-medium">
            <span className="text-slate-300">Hệ thống</span>
            <span className="text-green-400 font-bold">Online</span>
          </div>
          <div className="w-full bg-slate-700/80 h-1.5 rounded-full overflow-hidden">
            <div className="bg-green-400 w-full h-full animate-pulse"></div>
          </div>
          <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between">
            <span>Firebase Sync</span>
            <span className="text-emerald-400">● LIVE</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
