import React from 'react';
import { ClassItem, TutorItem, ActiveTab } from '../types';
import { Star, MapPin, GraduationCap, BookOpen, ArrowRight, ShieldCheck, Clock, Award, CheckCircle2, Phone, UserPlus, Sparkles, ChevronRight, Calendar, Users } from 'lucide-react';

interface HomePublicProps {
  classes: ClassItem[];
  tutors: TutorItem[];
  onNavigate: (tab: ActiveTab) => void;
  onSelectClassForApply: (cls: ClassItem) => void;
  onSelectTutorForBook: (tutor: TutorItem) => void;
  onAiSearch: (query: string) => void;
  isSearching: boolean;
  zaloNumber?: string;
}

export const HomePublic: React.FC<HomePublicProps> = ({
  classes, tutors, onNavigate, onSelectClassForApply, onSelectTutorForBook, zaloNumber,
}) => {
  const pendingClasses = classes.filter(c => c.status === 'ĐANG TÌM' || c.status === 'KHẨN CẤP');
  const verifiedTutors = tutors.filter(t => t.verified && t.status === 'online');
  const fmt = (v: number) => new Intl.NumberFormat('vi-VN').format(v);

  return (
    <div className="space-y-0">

      {/* ===== HERO ===== */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-20 lg:py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 px-3.5 py-1.5 rounded-full text-[11px] font-bold mb-6">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span>Trung tâm gia sư uy tín tại Hà Nội</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-black leading-[1.12] mb-5">
                Tìm Gia Sư Giỏi<br />
                <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Cho Con Bạn</span>
              </h1>
              <p className="text-slate-300 text-sm sm:text-[15px] leading-relaxed mb-8 max-w-lg">
                Đội ngũ gia sư đã được xác minh hồ sơ. Dạy kèm tại nhà & online toàn Hà Nội. Cam kết tiến bộ hoặc đổi giáo viên miễn phí.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <button onClick={() => onNavigate('parent-register')}
                  className="px-7 py-3.5 bg-blue-500 hover:bg-blue-400 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/25 transition-all cursor-pointer flex items-center justify-center gap-2">
                  <UserPlus className="w-4 h-4" /><span>Tìm gia sư miễn phí</span>
                </button>
                {zaloNumber && (
                  <a href={`https://zalo.me/${zaloNumber}`} target="_blank" rel="noopener noreferrer"
                    className="px-7 py-3.5 bg-white/10 border border-white/20 hover:bg-white/15 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2">
                    <Phone className="w-4 h-4" /><span>Zalo tư vấn</span>
                  </a>
                )}
              </div>
            </div>
            {/* Right — Stats */}
            <div className="hidden lg:grid grid-cols-2 gap-4">
              {[
                { icon: <GraduationCap className="w-5 h-5" />, value: `${tutors.length}+`, label: 'Gia sư đã xác minh', color: 'from-blue-500/20 to-blue-600/10 border-blue-400/20' },
                { icon: <BookOpen className="w-5 h-5" />, value: `${pendingClasses.length}`, label: 'Lớp đang tuyển', color: 'from-emerald-500/20 to-emerald-600/10 border-emerald-400/20' },
                { icon: <MapPin className="w-5 h-5" />, value: 'Hà Nội', label: 'Tại nhà & Online', color: 'from-amber-500/20 to-amber-600/10 border-amber-400/20' },
                { icon: <ShieldCheck className="w-5 h-5" />, value: '100%', label: 'Hồ sơ xác minh', color: 'from-purple-500/20 to-purple-600/10 border-purple-400/20' },
              ].map((s, i) => (
                <div key={i} className={`bg-gradient-to-br ${s.color} border rounded-2xl p-5 backdrop-blur-sm`}>
                  <div className="text-white/60 mb-2">{s.icon}</div>
                  <div className="text-2xl font-black text-white mb-0.5">{s.value}</div>
                  <div className="text-xs text-slate-400">{s.label}</div>
                </div>
              ))}
            </div>
            {/* Mobile stats */}
            <div className="flex items-center gap-6 text-xs text-slate-400 lg:hidden">
              <div className="flex items-center gap-1.5"><GraduationCap className="w-4 h-4 text-blue-400" /><span><b className="text-white">{tutors.length}+</b> gia sư</span></div>
              <div className="flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-emerald-400" /><span><b className="text-white">{pendingClasses.length}</b> lớp tuyển</span></div>
              <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-amber-400" /><span>Hà Nội</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== QUY TRÌNH ===== */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
          <div className="text-center mb-10">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-1.5">Quy trình đơn giản</h2>
            <p className="text-sm text-slate-500">3 bước để con bạn có gia sư phù hợp</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[
              { n: '01', icon: <UserPlus className="w-5 h-5" />, color: 'bg-blue-500', title: 'Đăng ký nhu cầu', desc: 'Phụ huynh điền thông tin yêu cầu về môn học, lớp, lịch học, khu vực' },
              { n: '02', icon: <Sparkles className="w-5 h-5" />, color: 'bg-purple-500', title: 'Tư vấn & ghép GS', desc: 'Trung tâm tìm gia sư phù hợp nhất, tư vấn qua Zalo/điện thoại' },
              { n: '03', icon: <CheckCircle2 className="w-5 h-5" />, color: 'bg-emerald-500', title: 'Học thử & quyết định', desc: 'Học thử miễn phí 1-2 buổi, hài lòng mới cam kết lâu dài' },
            ].map((item, i) => (
              <div key={i} className="relative bg-slate-50 hover:bg-white rounded-2xl p-6 lg:p-8 border border-transparent hover:border-slate-200 hover:shadow-lg hover:shadow-slate-100 transition-all group">
                <div className={`w-11 h-11 ${item.color} rounded-xl flex items-center justify-center text-white mb-4 shadow-md group-hover:scale-105 transition-transform`}>
                  {item.icon}
                </div>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.15em]">Bước {item.n}</span>
                <h3 className="font-bold text-slate-800 text-base mt-1.5 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== VÌ SAO CHỌN ===== */}
      <section className="bg-slate-50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
          <div className="text-center mb-10">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-1.5">Vì sao chọn Gia Sư Thành Đạt?</h2>
            <p className="text-sm text-slate-500">Dịch vụ chất lượng, uy tín hàng đầu</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {[
              { icon: <ShieldCheck className="w-5 h-5" />, bg: 'bg-emerald-100 text-emerald-600', title: 'Xác minh hồ sơ', desc: 'CCCD & bằng cấp được kiểm tra kỹ lưỡng' },
              { icon: <Award className="w-5 h-5" />, bg: 'bg-blue-100 text-blue-600', title: 'Cam kết tiến bộ', desc: 'Không hài lòng — đổi GS miễn phí' },
              { icon: <Clock className="w-5 h-5" />, bg: 'bg-purple-100 text-purple-600', title: 'Phản hồi nhanh', desc: 'Ghép GS phù hợp trong vòng 24h' },
              { icon: <MapPin className="w-5 h-5" />, bg: 'bg-amber-100 text-amber-600', title: 'Toàn bộ Hà Nội', desc: 'Dạy tại nhà hoặc online linh hoạt' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 lg:p-6 hover:shadow-md hover:border-slate-300 transition-all">
                <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center mb-3`}>{item.icon}</div>
                <h3 className="font-bold text-slate-800 text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== GIA SƯ NỔI BẬT ===== */}
      {verifiedTutors.length > 0 && (
        <section className="bg-white border-b border-slate-100">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Gia sư nổi bật</h2>
                <p className="text-sm text-slate-500 mt-0.5">Đã xác minh hồ sơ bởi trung tâm</p>
              </div>
              <button onClick={() => onNavigate('find-tutors')}
                className="hidden sm:flex px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer items-center gap-1.5 transition-colors">
                Xem tất cả<ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
              {verifiedTutors.slice(0, 6).map((t) => (
                <div key={t.id || t.code}
                  className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50 transition-all cursor-pointer group"
                  onClick={() => { onSelectTutorForBook(t); onNavigate('find-tutors'); }}>
                  <div className="flex items-start gap-3.5">
                    <div className={`w-12 h-12 rounded-xl ${t.avatarColor || 'bg-blue-500'} flex items-center justify-center font-bold text-white text-base shadow-sm shrink-0 group-hover:scale-105 transition-transform`}>
                      {t.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="font-bold text-slate-800 text-sm truncate">{t.name}</h4>
                        <span className="verified-badge">✓</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-2.5">
                        <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                          <Star className="w-3 h-3 fill-current" />{t.rating}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="truncate">{t.experience || t.qualification}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-2.5">
                        {t.subjects.slice(0, 3).map((sub, i) => (
                          <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-[10px] font-semibold">{sub}</span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-600">{fmt(t.hourlyRate)}đ/buổi</span>
                        <span className="text-[10px] text-slate-400 group-hover:text-blue-500 transition-colors">Xem chi tiết →</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => onNavigate('find-tutors')}
              className="sm:hidden mt-4 w-full py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer flex items-center justify-center gap-1.5">
              Xem tất cả gia sư<ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>
      )}

      {/* ===== LỚP CẦN GIA SƯ ===== */}
      {pendingClasses.length > 0 && (
        <section className="bg-slate-50 border-b border-slate-100">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Lớp đang cần gia sư</h2>
                <p className="text-sm text-slate-500 mt-0.5">Gia sư nhận lớp ngay — thu nhập cao, lịch linh hoạt</p>
              </div>
              <button onClick={() => onNavigate('register-tutor')}
                className="hidden sm:flex px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer items-center gap-1.5 transition-colors">
                Ứng tuyển<ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingClasses.slice(0, 6).map((cls) => (
                <div key={cls.id || cls.code}
                  className="bg-white rounded-xl border border-slate-200 p-4 lg:p-5 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer group"
                  onClick={() => { onSelectClassForApply(cls); onNavigate('register-tutor'); }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      cls.status === 'KHẨN CẤP' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}>{cls.status}</span>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-[15px] mb-2">{cls.subject}</h4>
                  {cls.studentInfo && <p className="text-xs text-slate-500 mb-2 line-clamp-1">{cls.studentInfo}</p>}
                  <div className="flex items-center gap-3 text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{cls.location}</span>
                    <span className="ml-auto font-bold text-blue-600">{fmt(cls.fee)}đ/buổi</span>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => onNavigate('register-tutor')}
              className="sm:hidden mt-4 w-full py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer flex items-center justify-center gap-1.5">
              Xem & ứng tuyển lớp<ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>
      )}

      {/* ===== CTA ===== */}
      <section className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">Sẵn sàng tìm gia sư?</h2>
              <p className="text-blue-100 text-sm leading-relaxed max-w-md">
                Đăng ký hoàn toàn miễn phí. Trung tâm tư vấn và tìm gia sư phù hợp trong vòng 30 phút (giờ hành chính).
              </p>
            </div>
            <div className="flex flex-col sm:flex-row lg:justify-end gap-3">
              <button onClick={() => onNavigate('parent-register')}
                className="px-8 py-3.5 bg-white text-blue-700 font-bold text-sm rounded-xl shadow-lg cursor-pointer flex items-center justify-center gap-2 hover:shadow-xl hover:bg-blue-50 transition-all">
                <BookOpen className="w-4 h-4" /><span>Phụ huynh đăng ký</span>
              </button>
              <button onClick={() => onNavigate('register-tutor')}
                className="px-8 py-3.5 bg-white/15 border border-white/25 text-white font-bold text-sm rounded-xl cursor-pointer flex items-center justify-center gap-2 hover:bg-white/20 transition-colors">
                <GraduationCap className="w-4 h-4" /><span>Gia sư đăng ký</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
