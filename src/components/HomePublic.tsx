import React, { useState } from 'react';
import { ClassItem, TutorItem, ActiveTab } from '../types';
import { Search, Sparkles, ShieldCheck, Star, ArrowRight, BookOpen, GraduationCap, CheckCircle2, MapPin, Clock } from 'lucide-react';

interface HomePublicProps {
  classes: ClassItem[];
  tutors: TutorItem[];
  onNavigate: (tab: ActiveTab) => void;
  onSelectClassForApply?: (cls: ClassItem) => void;
  onSelectTutorForBook?: (tutor: TutorItem) => void;
  onAiSearch: (query: string) => void;
  isSearching: boolean;
}

export const HomePublic: React.FC<HomePublicProps> = ({
  classes,
  tutors,
  onNavigate,
  onSelectClassForApply,
  onSelectTutorForBook,
  onAiSearch,
  isSearching,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onAiSearch(searchQuery.trim());
    }
  };

  const urgentClasses = classes.filter(c => c.status === 'ĐANG TÌM' || c.status === 'KHẨN CẤP').slice(0, 4);
  const featuredTutors = tutors.slice(0, 4);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + 'đ';
  };

  return (
    <div className="col-span-12 space-y-12 pb-16 animate-in fade-in duration-300">
      {/* Hero Banner */}
      <div className="bg-[#0F172A] text-white rounded-3xl p-8 md:p-14 relative overflow-hidden shadow-xl border border-slate-800">
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ghép nối thông minh AI 2026 • Uy tín tuyệt đối</span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Tìm Gia Sư Dạy Kèm Tại Nhà & Online <span className="text-blue-400">Chuẩn Kiến Thức</span>
          </h1>
          
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
            Kết nối ngay với hơn 1,000+ giáo viên và sinh viên giỏi từ ĐH Bách Khoa, Sư Phạm, Ngoại Thương. Cam kết tiến bộ rõ rệt chỉ sau 10 buổi học.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="pt-2 flex flex-col sm:flex-row gap-3 max-w-xl">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm môn học, lớp, hoặc quận huyện (VD: Toán lớp 9 Quận 7)..."
                className="w-full pl-12 pr-4 py-3 bg-white text-slate-800 rounded-xl outline-none placeholder:text-slate-400 text-sm shadow-lg font-medium"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <Sparkles className={`w-4 h-4 ${isSearching ? 'animate-spin' : ''}`} />
              <span>{isSearching ? 'AI đang tìm...' : 'Tìm kiếm'}</span>
            </button>
          </form>

          {/* Quick Stats */}
          <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800 max-w-lg text-slate-300">
            <div>
              <div className="text-2xl font-bold text-white">1,050+</div>
              <div className="text-xs text-slate-400 mt-0.5">Gia sư đã xác thực</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-400">98.5%</div>
              <div className="text-xs text-slate-400 mt-0.5">Học viên hài lòng</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">0đ</div>
              <div className="text-xs text-slate-400 mt-0.5">Phí tư vấn PHHS</div>
            </div>
          </div>
        </div>

        {/* Decorative Background Glow */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Role Navigation Call to Action */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">Dành cho Phụ Huynh & Học Sinh</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Bạn đang cần tìm gia sư kèm riêng cho con? Khám phá hồ sơ chi tiết của các gia sư giỏi hoặc đăng yêu cầu tìm gia sư miễn phí trong 30 giây.
            </p>
          </div>
          <button
            onClick={() => onNavigate('find-tutors')}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-600/20"
          >
            <span>Chọn Gia Sư Giỏi Ngay</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs hover:border-purple-300 transition-all flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">Dành cho Giáo Viên & Gia Sư</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Bạn muốn nhận lớp dạy kèm uy tín với chi phí hợp lý? Đăng ký hồ sơ gia sư trực tuyến để tiếp cận hàng trăm lớp học mới mỗi ngày.
            </p>
          </div>
          <button
            onClick={() => onNavigate('register-tutor')}
            className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <span>Đăng Ký Nhận Lớp Dạy</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Urgent Classes Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Lớp Học Mới Cần Gia Sư Ngay</h2>
            <p className="text-slate-500 text-sm mt-1">Danh sách lớp dạy kèm vừa được phụ huynh đăng ký theo thời gian thực</p>
          </div>
          <button
            onClick={() => onNavigate('register-tutor')}
            className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
          >
            <span>Xem tất cả lớp</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {urgentClasses.map((cls) => (
            <div key={cls.id || cls.code} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                    {cls.code}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    cls.status === 'KHẨN CẤP' ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {cls.status}
                  </span>
                </div>
                <h4 className="font-bold text-slate-800 text-base line-clamp-2">{cls.subject}</h4>
                <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                  <span className="truncate">{cls.location}</span>
                </div>
                {cls.schedule && (
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    <span className="truncate">{cls.schedule}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Học phí</span>
                  <span className="text-sm font-bold text-blue-600">{formatCurrency(cls.fee)}/buổi</span>
                </div>
                <button
                  onClick={() => {
                    if (onSelectClassForApply) onSelectClassForApply(cls);
                    onNavigate('register-tutor');
                  }}
                  className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Nhận lớp
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Tutors Section */}
      <div className="space-y-6 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Gia Sư Tiêu Biểu</h2>
            <p className="text-slate-500 text-sm mt-1">Đội ngũ gia sư xuất sắc được phụ huynh đánh giá 5 sao</p>
          </div>
          <button
            onClick={() => onNavigate('find-tutors')}
            className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
          >
            <span>Tìm danh sách gia sư</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredTutors.map((t) => (
            <div key={t.id || t.code} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between space-y-4">
              <div className="flex items-center gap-3.5">
                <div className={`w-12 h-12 rounded-xl ${t.avatarColor || 'bg-blue-500'} flex items-center justify-center font-bold text-white text-base shadow-sm shrink-0`}>
                  {t.avatar || 'GS'}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-slate-800 truncate text-sm">{t.name}</h4>
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{t.rating}</span>
                    <span className="text-slate-400 font-normal">• {t.experience}</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-600 font-medium line-clamp-1">{t.qualification}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {t.subjects.slice(0, 2).map((sub, i) => (
                    <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-medium">
                      {sub}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-sm font-bold text-blue-600">{formatCurrency(t.hourlyRate)}/h</span>
                <button
                  onClick={() => {
                    if (onSelectTutorForBook) onSelectTutorForBook(t);
                    onNavigate('find-tutors');
                  }}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Thuê gia sư
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trust & Quality Grid */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 md:p-12">
        <h2 className="text-xl font-bold text-slate-800 text-center mb-8">Cam Kết Từ Trung Tâm Gia Sư Hub</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          <div className="space-y-2 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-1">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-800">Xác Thực Hồ Sơ 100%</h4>
            <p className="text-slate-600 text-xs leading-relaxed">
              Tất cả gia sư đều phải nộp CCCD, thẻ sinh viên hoặc bằng tốt nghiệp đại học để trung tâm kiểm duyệt kỹ lưỡng.
            </p>
          </div>

          <div className="space-y-2 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-1">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-800">Học Thử Miễn Phí 2 Buổi</h4>
            <p className="text-slate-600 text-xs leading-relaxed">
              Phụ huynh và học sinh được quyền đổi gia sư miễn phí bất cứ lúc nào nếu cảm thấy phương pháp giảng dạy không phù hợp.
            </p>
          </div>

          <div className="space-y-2 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-1">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-800">Thuật Toán AI Matching</h4>
            <p className="text-slate-600 text-xs leading-relaxed">
              Sử dụng trí tuệ nhân tạo Gemini để phân tích chính xác yêu cầu chuyên môn, tính cách học sinh và khoảng cách di chuyển.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
