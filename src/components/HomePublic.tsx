import React, { useState } from 'react';
import { ClassItem, TutorItem, ActiveTab } from '../types';
import { Star, MapPin, GraduationCap, BookOpen, ShieldCheck, Clock, Award, CheckCircle2, Phone, UserPlus, Sparkles, ChevronRight, Search, Users, Heart, ArrowRight, Calculator, Beaker, BookA, Monitor, PenTool, Globe2 } from 'lucide-react';

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
    <div>

      {/* ===== HERO ===== */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-100/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        </div>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12 sm:py-16 lg:py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center">
            {/* Left — 3 cols */}
            <div className="lg:col-span-3">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3.5 py-1.5 rounded-full text-[11px] font-bold mb-5 border border-blue-200/50">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
                TRUNG TÂM GIA SƯ UY TÍN HÀNG ĐẦU HÀ NỘI
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-black text-slate-900 leading-[1.12] mb-4">
                Đồng hành cùng con<br />
                vững bước <span className="text-blue-600">tương lai</span>
              </h1>
              <p className="text-slate-600 text-sm sm:text-[15px] leading-relaxed mb-7 max-w-lg">
                Chúng tôi cung cấp đội ngũ gia sư chất lượng, tận tâm và phương pháp giảng dạy hiệu quả, giúp học viên tiến bộ mỗi ngày.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                <button onClick={() => onNavigate('parent-register')}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/20 transition-all cursor-pointer flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />Tìm gia sư ngay
                </button>
                {zaloNumber && (
                  <a href={`https://zalo.me/${zaloNumber}`} target="_blank" rel="noopener noreferrer"
                    className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-xl border border-slate-200 transition-all flex items-center gap-2 shadow-sm">
                    <Phone className="w-4 h-4 text-blue-600" />Tư vấn miễn phí
                  </a>
                )}
                <button onClick={() => onNavigate('register-tutor')}
                  className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-xl border border-slate-200 transition-all cursor-pointer flex items-center gap-2 shadow-sm">
                  <GraduationCap className="w-4 h-4 text-blue-600" />Gia sư đăng ký ngay
                </button>
              </div>
              {/* Trust badges */}
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-500">
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-blue-600" />Gia sư chất lượng</span>
                <span className="flex items-center gap-1.5"><Heart className="w-3.5 h-3.5 text-blue-600" />Dạy kèm tận tâm</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />Chi phí hợp lý</span>
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-blue-600" />Hỗ trợ 24/7</span>
              </div>
            </div>
            {/* Right — 2 cols: Floating card "Bạn là gia sư?" */}
            <div className="lg:col-span-2 hidden lg:flex flex-col items-end gap-4">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 p-6 w-full max-w-xs">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-1">Bạn là gia sư?</h3>
                <p className="text-sm text-slate-500 mb-4 leading-relaxed">
                  Đăng ký để kết nối với học viên phù hợp và gia tăng thu nhập.
                </p>
                <button onClick={() => onNavigate('register-tutor')}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl cursor-pointer flex items-center justify-center gap-2 transition-colors">
                  Đăng ký ngay <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-lg shadow-slate-200/30 p-5 w-full max-w-xs">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <Phone className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 text-sm">Tư vấn nhanh</div>
                    <div className="text-xs text-slate-500">Liên hệ ngay qua Zalo</div>
                  </div>
                </div>
                {zaloNumber && (
                  <a href={`https://zalo.me/${zaloNumber}`} target="_blank" rel="noopener noreferrer"
                    className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-sm rounded-xl border border-emerald-200 cursor-pointer flex items-center justify-center gap-2 transition-colors">
                    Chat Zalo: {zaloNumber}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-6 sm:py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 lg:gap-8">
            {[
              { icon: <Users className="w-5 h-5 text-blue-600" />, value: `${Math.max(tutors.length, 50)}+`, label: 'Học viên đã & đang học' },
              { icon: <GraduationCap className="w-5 h-5 text-blue-600" />, value: `${tutors.length}+`, label: 'Gia sư chất lượng' },
              { icon: <CheckCircle2 className="w-5 h-5 text-blue-600" />, value: '98%', label: 'Học viên hài lòng' },
              { icon: <Star className="w-5 h-5 text-blue-600" />, value: '5+', label: 'Năm kinh nghiệm' },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">{s.icon}</div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-blue-600">{s.value}</div>
                  <div className="text-[11px] sm:text-xs text-slate-500 leading-tight">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== DANH MỤC DỊCH VỤ ===== */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
          <div className="text-center mb-10">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 uppercase tracking-wide mb-1.5">Danh mục dịch vụ</h2>
            <p className="text-sm text-slate-500">Gia sư dạy kèm tất cả các môn từ Tiểu học đến Đại học</p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
            {[
              { icon: <Calculator className="w-6 h-6" />, name: 'Toán', desc: 'Tiểu học - ĐH' },
              { icon: <Beaker className="w-6 h-6" />, name: 'Lý', desc: 'THCS - THPT' },
              { icon: <Sparkles className="w-6 h-6" />, name: 'Hóa', desc: 'THCS - THPT' },
              { icon: <BookA className="w-6 h-6" />, name: 'Văn', desc: 'Tiểu học - THPT' },
              { icon: <Globe2 className="w-6 h-6" />, name: 'Tiếng Anh', desc: 'Mọi trình độ' },
              { icon: <Monitor className="w-6 h-6" />, name: 'Tin học', desc: 'Mọi trình độ' },
              { icon: <PenTool className="w-6 h-6" />, name: 'IELTS', desc: 'Mọi trình độ' },
            ].map((item, i) => (
              <button key={i} onClick={() => onNavigate('find-tutors')}
                className="bg-slate-50 hover:bg-blue-50 hover:border-blue-200 border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col items-center gap-2 transition-all cursor-pointer group">
                <div className="w-11 h-11 bg-white group-hover:bg-blue-100 border border-slate-200 group-hover:border-blue-200 rounded-xl flex items-center justify-center text-slate-500 group-hover:text-blue-600 transition-all">
                  {item.icon}
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-slate-800">{item.name}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{item.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ===== QUY TRÌNH ===== */}
      <section className="bg-slate-50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
          <div className="text-center mb-10">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-1.5">Quy trình đơn giản</h2>
            <p className="text-sm text-slate-500">3 bước để con bạn có gia sư phù hợp</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[
              { n: '01', icon: <UserPlus className="w-5 h-5" />, color: 'bg-blue-600', title: 'Đăng ký nhu cầu', desc: 'Phụ huynh điền thông tin yêu cầu về môn học, lớp, lịch học, khu vực' },
              { n: '02', icon: <Search className="w-5 h-5" />, color: 'bg-purple-600', title: 'Tư vấn & ghép GS', desc: 'Trung tâm tìm gia sư phù hợp nhất, tư vấn qua Zalo/điện thoại' },
              { n: '03', icon: <CheckCircle2 className="w-5 h-5" />, color: 'bg-emerald-600', title: 'Học thử & quyết định', desc: 'Học thử miễn phí 1-2 buổi, hài lòng mới cam kết lâu dài' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 lg:p-8 border border-slate-200 hover:shadow-lg hover:shadow-slate-100 transition-all group">
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
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
          <div className="text-center mb-10">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-1.5">Vì sao chọn chúng tôi?</h2>
            <p className="text-sm text-slate-500">Dịch vụ chất lượng, uy tín hàng đầu</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {[
              { icon: <ShieldCheck className="w-6 h-6" />, bg: 'bg-blue-50 text-blue-600 border-blue-100', title: 'Gia sư chất lượng cao', desc: 'Đội ngũ gia sư giỏi chuyên môn, kinh nghiệm và tận tâm' },
              { icon: <Heart className="w-6 h-6" />, bg: 'bg-emerald-50 text-emerald-600 border-emerald-100', title: 'Dạy kèm tận tâm', desc: 'Phương pháp hiệu quả, kiên nhẫn với từng học viên' },
              { icon: <Award className="w-6 h-6" />, bg: 'bg-purple-50 text-purple-600 border-purple-100', title: 'Chi phí hợp lý', desc: 'Minh bạch, rõ ràng, không phát sinh thêm chi phí' },
              { icon: <Clock className="w-6 h-6" />, bg: 'bg-amber-50 text-amber-600 border-amber-100', title: 'Hỗ trợ 24/7', desc: 'Luôn đồng hành cùng bạn, hỗ trợ mọi lúc' },
            ].map((item, i) => (
              <div key={i} className={`rounded-2xl border p-5 lg:p-6 hover:shadow-md transition-all ${item.bg.split(' ')[2]}`}>
                <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center mb-4 border`}>{item.icon}</div>
                <h3 className="font-bold text-slate-800 text-sm mb-1.5">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== GIA SƯ NỔI BẬT ===== */}
      {verifiedTutors.length > 0 && (
        <section className="bg-slate-50 border-b border-slate-100">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Gia sư nổi bật</h2>
                <p className="text-sm text-slate-500 mt-0.5">Đã xác minh hồ sơ bởi trung tâm</p>
              </div>
              <button onClick={() => onNavigate('find-tutors')}
                className="hidden sm:flex px-4 py-2.5 bg-white hover:bg-blue-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer items-center gap-1.5 transition-colors shadow-sm">
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
                        {t.subjects.slice(0, 3).map((sub, si) => (
                          <span key={si} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-[10px] font-semibold">{sub}</span>
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
              className="sm:hidden mt-4 w-full py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer flex items-center justify-center gap-1.5">
              Xem tất cả gia sư<ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>
      )}

      {/* ===== LỚP CẦN GIA SƯ ===== */}
      {pendingClasses.length > 0 && (
        <section className="bg-white border-b border-slate-100">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Lớp đang cần gia sư</h2>
                <p className="text-sm text-slate-500 mt-0.5">Gia sư nhận lớp ngay — thu nhập cao, lịch linh hoạt</p>
              </div>
              <button onClick={() => onNavigate('register-tutor')}
                className="hidden sm:flex px-4 py-2.5 bg-white hover:bg-blue-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer items-center gap-1.5 transition-colors shadow-sm">
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
              className="sm:hidden mt-4 w-full py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer flex items-center justify-center gap-1.5">
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
                Đăng ký hoàn toàn miễn phí. Trung tâm tư vấn và tìm gia sư phù hợp trong vòng 30 phút.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row lg:justify-end gap-3">
              <button onClick={() => onNavigate('parent-register')}
                className="px-8 py-3.5 bg-white text-blue-700 font-bold text-sm rounded-xl shadow-lg cursor-pointer flex items-center justify-center gap-2 hover:shadow-xl hover:bg-blue-50 transition-all">
                <BookOpen className="w-4 h-4" />Phụ huynh đăng ký
              </button>
              <button onClick={() => onNavigate('register-tutor')}
                className="px-8 py-3.5 bg-white/15 border border-white/25 text-white font-bold text-sm rounded-xl cursor-pointer flex items-center justify-center gap-2 hover:bg-white/20 transition-colors">
                <GraduationCap className="w-4 h-4" />Gia sư đăng ký
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
