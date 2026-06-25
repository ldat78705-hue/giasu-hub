import React, { useState } from 'react';
import { ClassItem, TutorItem, ActiveTab } from '../types';
import { Search, Star, MapPin, GraduationCap, BookOpen, ArrowRight, Users, ShieldCheck, Clock, CheckCircle2, Sparkles, Phone, Award } from 'lucide-react';

interface HomePublicProps {
  classes: ClassItem[];
  tutors: TutorItem[];
  onNavigate: (tab: ActiveTab) => void;
  onSelectClassForApply: (cls: ClassItem) => void;
  onSelectTutorForBook: (tutor: TutorItem) => void;
  onAiSearch: (query: string) => void;
  isSearching: boolean;
}

export const HomePublic: React.FC<HomePublicProps> = ({
  classes, tutors, onNavigate, onSelectClassForApply, onSelectTutorForBook, onAiSearch, isSearching,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const pendingClasses = classes.filter(c => c.status === 'ĐANG TÌM' || c.status === 'KHẨN CẤP');
  const onlineTutors = tutors.filter(t => t.status === 'online');
  const formatCurrency = (val: number) => new Intl.NumberFormat('vi-VN').format(val);

  const handleSearch = () => {
    if (searchQuery.trim()) onAiSearch(searchQuery.trim());
  };

  return (
    <div className="col-span-12 space-y-10 pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-3xl overflow-hidden p-8 sm:p-12 lg:p-16 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-indigo-500 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-1.5 rounded-full text-xs font-bold mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            <span>Trung tâm gia sư uy tín tại Hà Nội</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-4">
            Gia Sư <span className="text-blue-400">Thành Đạt</span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8 max-w-lg">
            Kết nối phụ huynh với đội ngũ gia sư giỏi tại Hà Nội. Dạy kèm tại nhà & online tất cả các môn.
          </p>

          {/* Search Bar */}
          <div className="flex items-center bg-white/10 border border-white/20 rounded-2xl p-1.5 backdrop-blur-sm max-w-lg">
            <div className="flex-1 flex items-center gap-2 px-4">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Tìm gia sư Toán, Lý, Hóa, Anh..."
                className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-slate-400 py-2"
              />
            </div>
            <button onClick={handleSearch}
              disabled={isSearching}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-colors cursor-pointer flex items-center gap-2 shrink-0">
              {isSearching ? 'Đang tìm...' : 'Tìm gia sư'}
            </button>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap items-center gap-6 mt-8 text-sm">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-blue-400" />
              <span><b className="text-white">{tutors.length}</b> gia sư</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span><b className="text-white">{pendingClasses.length}</b> lớp đang tìm GS</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              <span>Hoạt động tại <b className="text-white">Hà Nội</b></span>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section>
        <h2 className="text-xl font-bold text-slate-800 mb-6">Vì sao chọn Gia Sư Thành Đạt?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: <ShieldCheck className="w-5 h-5" />, color: 'text-emerald-600 bg-emerald-50', title: 'Gia sư đã xác thực', desc: 'Kiểm tra bằng cấp & kinh nghiệm' },
            { icon: <Award className="w-5 h-5" />, color: 'text-blue-600 bg-blue-50', title: 'Cam kết chất lượng', desc: 'Đổi gia sư miễn phí nếu không hài lòng' },
            { icon: <Clock className="w-5 h-5" />, color: 'text-purple-600 bg-purple-50', title: 'Phản hồi nhanh', desc: 'Xếp gia sư trong 24-48 giờ' },
            { icon: <MapPin className="w-5 h-5" />, color: 'text-amber-600 bg-amber-50', title: 'Phủ khắp Hà Nội', desc: 'Tất cả quận huyện & online' },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-blue-300 transition-all shadow-xs">
              <div className={`p-2.5 rounded-xl w-fit ${item.color} mb-3`}>{item.icon}</div>
              <h3 className="font-bold text-slate-800 text-sm mb-1">{item.title}</h3>
              <p className="text-xs text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Available Classes */}
      {pendingClasses.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Lớp đang cần gia sư</h2>
              <p className="text-xs text-slate-500 mt-1">Các lớp cần tìm gia sư - Gia sư có thể đăng ký nhận lớp</p>
            </div>
            <button onClick={() => onNavigate('register-tutor')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5">
              <span>Xem tất cả</span><ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingClasses.slice(0, 6).map((cls) => (
              <div key={cls.id || cls.code}
                className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-blue-300 transition-all shadow-xs cursor-pointer group"
                onClick={() => { onSelectClassForApply(cls); onNavigate('register-tutor'); }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{cls.code}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    cls.status === 'KHẨN CẤP' ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-amber-100 text-amber-700'
                  }`}>{cls.status}</span>
                </div>
                <h3 className="font-bold text-slate-800 group-hover:text-blue-700 transition-colors">{cls.subject}</h3>
                <p className="text-xs text-slate-500 mt-1">{cls.studentInfo}</p>
                <div className="flex items-center gap-3 mt-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{cls.location}</span>
                  <span className="font-bold text-blue-600">{formatCurrency(cls.fee)}đ/buổi</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Featured Tutors */}
      {onlineTutors.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Gia sư nổi bật</h2>
              <p className="text-xs text-slate-500 mt-1">Đội ngũ gia sư đã được xác thực</p>
            </div>
            <button onClick={() => onNavigate('find-tutors')}
              className="px-4 py-2 bg-white border border-slate-200 hover:border-blue-300 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5">
              <span>Xem tất cả</span><ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {onlineTutors.slice(0, 6).map((t) => (
              <div key={t.id || t.code}
                className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-blue-300 transition-all shadow-xs cursor-pointer"
                onClick={() => { onSelectTutorForBook(t); onNavigate('find-tutors'); }}>
                <div className="flex items-start gap-3">
                  <div className={`w-11 h-11 rounded-xl ${t.avatarColor || 'bg-blue-500'} flex items-center justify-center font-bold text-white text-sm shadow-sm shrink-0`}>
                    {t.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-800 truncate">{t.name}</h4>
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold mt-0.5">
                      <Star className="w-3 h-3 fill-current" /><span>{t.rating}</span>
                      <span className="text-slate-400 font-normal ml-1">• {t.experience}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mt-3">
                  {t.subjects.slice(0, 3).map((sub, i) => (
                    <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-[10px] font-semibold">{sub}</span>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">{t.qualification}</span>
                  <span className="font-bold text-blue-600">{formatCurrency(t.hourlyRate)}đ/h</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {pendingClasses.length === 0 && onlineTutors.length === 0 && (
        <section className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-xs">
          <BookOpen className="w-12 h-12 mx-auto mb-4 text-slate-300" />
          <h3 className="text-lg font-bold text-slate-700 mb-2">Hệ thống đang khởi tạo</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
            Gia Sư Thành Đạt đang trong quá trình xây dựng đội ngũ. Hãy đăng ký làm gia sư hoặc gửi yêu cầu tìm gia sư.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button onClick={() => onNavigate('find-tutors')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-colors cursor-pointer flex items-center gap-2">
              <BookOpen className="w-4 h-4" /><span>Tìm gia sư</span>
            </button>
            <button onClick={() => onNavigate('register-tutor')}
              className="px-6 py-3 bg-white border border-slate-200 hover:border-blue-300 text-slate-700 font-bold text-sm rounded-xl transition-colors cursor-pointer flex items-center gap-2">
              <GraduationCap className="w-4 h-4" /><span>Đăng ký dạy</span>
            </button>
          </div>
        </section>
      )}
    </div>
  );
};
