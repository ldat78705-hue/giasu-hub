import React, { useState } from 'react';
import { ClassItem, TutorItem, ActiveTab } from '../types';
import { Star, MapPin, GraduationCap, BookOpen, ArrowRight, ShieldCheck, Clock, Award, CheckCircle2, Phone, UserPlus, Sparkles, ChevronRight } from 'lucide-react';

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

      {/* ===== HERO - Clean, focused ===== */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-12 sm:py-16 lg:py-20">
          <div className="max-w-lg">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 px-3 py-1.5 rounded-full text-[11px] font-bold mb-5">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span>Trung tâm gia sư uy tín tại Hà Nội</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.1] mb-4">
              Tìm Gia Sư Giỏi<br />
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Cho Con Bạn</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 max-w-md">
              Đội ngũ gia sư đã xác minh. Dạy kèm tại nhà & online. Cam kết tiến bộ hoặc đổi giáo viên miễn phí.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <button onClick={() => onNavigate('parent-register')}
                className="px-7 py-3.5 bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm rounded-2xl shadow-lg shadow-blue-500/30 transition-all cursor-pointer flex items-center justify-center gap-2">
                <UserPlus className="w-4 h-4" /><span>Tìm gia sư miễn phí</span>
              </button>
              {zaloNumber && (
                <a href={`https://zalo.me/${zaloNumber}`} target="_blank" rel="noopener noreferrer"
                  className="px-7 py-3.5 bg-white/10 border border-white/20 hover:bg-white/15 text-white font-bold text-sm rounded-2xl transition-all flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4" /><span>Zalo tư vấn</span>
                </a>
              )}
            </div>

            <div className="flex items-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-blue-400" />
                <span><b className="text-white">{tutors.length}+</b> gia sư</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span><b className="text-white">{pendingClasses.length}</b> lớp đang tuyển</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>Hà Nội</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== QUY TRÌNH 3 BƯỚC ===== */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2 text-center">Quy trình 3 bước</h2>
          <p className="text-sm text-slate-500 text-center mb-8">Đơn giản, nhanh chóng, miễn phí</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { n: '01', icon: <UserPlus className="w-5 h-5" />, color: 'bg-blue-500', title: 'Đăng ký nhu cầu', desc: 'Phụ huynh điền thông tin, yêu cầu môn học, lịch học' },
              { n: '02', icon: <Sparkles className="w-5 h-5" />, color: 'bg-purple-500', title: 'Tư vấn & ghép GS', desc: 'Trung tâm tìm gia sư phù hợp nhất trong 24h' },
              { n: '03', icon: <CheckCircle2 className="w-5 h-5" />, color: 'bg-emerald-500', title: 'Học thử & quyết định', desc: 'Học thử miễn phí, hài lòng mới cam kết' },
            ].map((item, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl p-6 text-center hover:bg-white hover:shadow-md hover:shadow-slate-200/50 transition-all border border-transparent hover:border-slate-200">
                <div className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-md`}>
                  {item.icon}
                </div>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Bước {item.n}</span>
                <h3 className="font-bold text-slate-800 mt-1 mb-1.5">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== VÌ SAO CHỌN ===== */}
      <section className="bg-slate-50 border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-8 text-center">Vì sao chọn Gia Sư Thành Đạt?</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: <ShieldCheck className="w-5 h-5" />, bg: 'bg-emerald-50 text-emerald-600', title: 'Xác minh hồ sơ', desc: 'CCCD & bằng cấp kiểm tra' },
              { icon: <Award className="w-5 h-5" />, bg: 'bg-blue-50 text-blue-600', title: 'Cam kết tiến bộ', desc: 'Đổi GS miễn phí' },
              { icon: <Clock className="w-5 h-5" />, bg: 'bg-purple-50 text-purple-600', title: 'Phản hồi 24h', desc: 'Xếp GS trong 1 ngày' },
              { icon: <MapPin className="w-5 h-5" />, bg: 'bg-amber-50 text-amber-600', title: 'Toàn Hà Nội', desc: 'Tại nhà & online' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-sm transition-all">
                <div className={`p-2.5 rounded-xl w-fit ${item.bg} mb-3`}>{item.icon}</div>
                <h3 className="font-bold text-slate-800 text-sm mb-0.5">{item.title}</h3>
                <p className="text-[11px] text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== GIA SƯ NỔI BẬT ===== */}
      {verifiedTutors.length > 0 && (
        <section className="bg-white border-b border-slate-100">
          <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Gia sư nổi bật</h2>
                <p className="text-xs text-slate-500 mt-0.5">Đã xác minh bởi trung tâm</p>
              </div>
              <button onClick={() => onNavigate('find-tutors')}
                className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1.5 transition-colors">
                Xem tất cả<ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {verifiedTutors.slice(0, 4).map((t) => (
                <div key={t.id || t.code}
                  className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => { onSelectTutorForBook(t); onNavigate('find-tutors'); }}>
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-2xl ${t.avatarColor || 'bg-blue-500'} flex items-center justify-center font-bold text-white text-lg shadow-sm shrink-0`}>
                      {t.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-slate-800 truncate">{t.name}</h4>
                        <span className="verified-badge">✓</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                        <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                          <Star className="w-3 h-3 fill-current" />{t.rating}
                        </span>
                        <span>•</span>
                        <span className="truncate">{t.experience || t.qualification}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {t.subjects.slice(0, 3).map((sub, i) => (
                          <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-[10px] font-semibold">{sub}</span>
                        ))}
                      </div>
                      <div className="text-xs font-bold text-blue-600">{fmt(t.hourlyRate)}đ/buổi</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== LỚP ĐANG TÌM ===== */}
      {pendingClasses.length > 0 && (
        <section className="bg-slate-50 border-b border-slate-100">
          <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Lớp cần gia sư</h2>
                <p className="text-xs text-slate-500 mt-0.5">Gia sư có thể ứng tuyển nhận lớp</p>
              </div>
              <button onClick={() => onNavigate('register-tutor')}
                className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1.5 transition-colors">
                Ứng tuyển<ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-3">
              {pendingClasses.slice(0, 6).map((cls) => (
                <div key={cls.id || cls.code}
                  className="bg-white rounded-xl border border-slate-200 p-4 hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer flex items-center justify-between gap-3"
                  onClick={() => { onSelectClassForApply(cls); onNavigate('register-tutor'); }}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 className="font-bold text-slate-800 text-sm">{cls.subject}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        cls.status === 'KHẨN CẤP' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      }`}>{cls.status}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{cls.location}</span>
                      <span className="font-bold text-blue-600">{fmt(cls.fee)}đ/buổi</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== CTA BOTTOM ===== */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10 sm:py-14 text-center">
          <h2 className="text-xl sm:text-2xl font-bold mb-2">Sẵn sàng tìm gia sư?</h2>
          <p className="text-blue-100 text-sm mb-6 max-w-sm mx-auto">Đăng ký miễn phí, nhận tư vấn trong 30 phút</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button onClick={() => onNavigate('parent-register')}
              className="w-full sm:w-auto px-8 py-3.5 bg-white text-blue-700 font-bold text-sm rounded-2xl shadow-lg cursor-pointer flex items-center justify-center gap-2 hover:shadow-xl transition-shadow">
              <BookOpen className="w-4 h-4" /><span>Phụ huynh đăng ký</span>
            </button>
            <button onClick={() => onNavigate('register-tutor')}
              className="w-full sm:w-auto px-8 py-3.5 bg-white/10 border border-white/20 text-white font-bold text-sm rounded-2xl cursor-pointer flex items-center justify-center gap-2 hover:bg-white/15 transition-colors">
              <GraduationCap className="w-4 h-4" /><span>Gia sư đăng ký</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
