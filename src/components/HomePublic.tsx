import React, { useState } from 'react';
import { ClassItem, TutorItem, ActiveTab } from '../types';
import { Search, Star, MapPin, GraduationCap, BookOpen, ArrowRight, Users, ShieldCheck, Clock, Award, CheckCircle2, Phone, UserPlus } from 'lucide-react';

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
  classes, tutors, onNavigate, onSelectClassForApply, onSelectTutorForBook, onAiSearch, isSearching, zaloNumber,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const pendingClasses = classes.filter(c => c.status === 'ĐANG TÌM' || c.status === 'KHẨN CẤP');
  const verifiedTutors = tutors.filter(t => t.verified && t.status === 'online');
  const fmt = (v: number) => new Intl.NumberFormat('vi-VN').format(v);

  return (
    <div className="col-span-12 space-y-8 sm:space-y-12 pb-24 md:pb-16">

      {/* ===== HERO ===== */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 rounded-2xl sm:rounded-3xl overflow-hidden text-white">
        <div className="absolute inset-0 opacity-[0.07]">
          <div className="absolute top-0 left-0 w-80 h-80 bg-blue-400 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-indigo-400 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 px-5 py-10 sm:px-10 sm:py-14 lg:px-16 lg:py-20">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 px-3 py-1.5 rounded-full text-[11px] font-bold mb-5 backdrop-blur-sm">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span>Trung tâm gia sư uy tín tại Hà Nội</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-black leading-[1.15] mb-4">
              Tìm Gia Sư Giỏi<br />
              <span className="text-blue-400">Cho Con Bạn</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 max-w-md">
              Đội ngũ gia sư đã xác minh tại Hà Nội. Dạy kèm tại nhà & online. Cam kết tiến bộ.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button onClick={() => onNavigate('parent-register')}
                className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all cursor-pointer flex items-center justify-center gap-2">
                <UserPlus className="w-4 h-4" /><span>Đăng ký tìm gia sư miễn phí</span>
              </button>
              {zaloNumber && (
                <a href={`https://zalo.me/${zaloNumber}`} target="_blank" rel="noopener noreferrer"
                  className="px-6 py-3.5 bg-white/10 border border-white/20 hover:bg-white/20 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4" /><span>Gọi Zalo tư vấn</span>
                </a>
              )}
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-4 sm:gap-6 text-xs sm:text-sm text-slate-400">
              <div className="flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-blue-400" />
                <span><b className="text-white">{tutors.length}</b> gia sư</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span><b className="text-white">{pendingClasses.length}</b> lớp cần GS</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>Toàn Hà Nội</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== QUY TRÌNH 3 BƯỚC ===== */}
      <section>
        <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-5 px-1">Quy trình đơn giản</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { step: '1', icon: <UserPlus className="w-5 h-5" />, color: 'bg-blue-50 text-blue-600 border-blue-200', title: 'Đăng ký miễn phí', desc: 'Phụ huynh điền thông tin nhu cầu tìm gia sư' },
            { step: '2', icon: <Search className="w-5 h-5" />, color: 'bg-purple-50 text-purple-600 border-purple-200', title: 'Tư vấn & ghép đôi', desc: 'Trung tâm tìm gia sư phù hợp nhất' },
            { step: '3', icon: <CheckCircle2 className="w-5 h-5" />, color: 'bg-emerald-50 text-emerald-600 border-emerald-200', title: 'Học thử & bắt đầu', desc: 'Học thử trước khi đóng phí' },
          ].map((item, i) => (
            <div key={i} className={`bg-white rounded-2xl border p-5 sm:p-6 ${item.color.split(' ')[2]} hover:shadow-md transition-all`}>
              <div className={`w-10 h-10 rounded-xl ${item.color.split(' ').slice(0,2).join(' ')} flex items-center justify-center mb-3`}>{item.icon}</div>
              <h3 className="font-bold text-slate-800 text-sm mb-1">{item.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== VÌ SAO CHỌN ===== */}
      <section>
        <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-5 px-1">Vì sao chọn Gia Sư Thành Đạt?</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[
            { icon: <ShieldCheck className="w-5 h-5" />, color: 'text-emerald-600 bg-emerald-50', title: 'Xác minh hồ sơ', desc: 'Bằng cấp đã kiểm tra' },
            { icon: <Award className="w-5 h-5" />, color: 'text-blue-600 bg-blue-50', title: 'Cam kết tiến bộ', desc: 'Đổi GS miễn phí' },
            { icon: <Clock className="w-5 h-5" />, color: 'text-purple-600 bg-purple-50', title: 'Phản hồi nhanh', desc: 'Xếp GS trong 24h' },
            { icon: <MapPin className="w-5 h-5" />, color: 'text-amber-600 bg-amber-50', title: 'Toàn Hà Nội', desc: 'Tại nhà & online' },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 hover:border-blue-200 transition-all">
              <div className={`p-2 rounded-xl w-fit ${item.color} mb-2.5`}>{item.icon}</div>
              <h3 className="font-bold text-slate-800 text-xs sm:text-sm mb-0.5">{item.title}</h3>
              <p className="text-[11px] sm:text-xs text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== GIA SƯ NỔI BẬT ===== */}
      {verifiedTutors.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-5 px-1">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-800">Gia sư đã xác minh</h2>
              <p className="text-xs text-slate-500 mt-0.5">Hồ sơ đã được trung tâm kiểm duyệt</p>
            </div>
            <button onClick={() => onNavigate('find-tutors')}
              className="px-3 py-2 bg-white border border-slate-200 hover:border-blue-300 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1">
              <span>Xem tất cả</span><ArrowRight className="w-3.5 h-3.5" />
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
                      {t.verified && <span className="verified-badge">✓ Đã xác minh</span>}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                      <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                        <Star className="w-3 h-3 fill-current" />{t.rating}
                      </span>
                      <span>•</span>
                      <span>{t.experience}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-2.5">
                      {t.subjects.slice(0, 3).map((sub, i) => (
                        <span key={i} className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-[11px] font-semibold">{sub}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">{t.qualification}</span>
                      <span className="font-bold text-blue-600">{fmt(t.hourlyRate)}đ/h</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===== LỚP ĐANG TÌM GS ===== */}
      {pendingClasses.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-5 px-1">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-800">Lớp đang cần gia sư</h2>
              <p className="text-xs text-slate-500 mt-0.5">Gia sư có thể ứng tuyển nhận lớp</p>
            </div>
            <button onClick={() => onNavigate('register-tutor')}
              className="px-3 py-2 bg-white border border-slate-200 hover:border-blue-300 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1">
              <span>Xem tất cả</span><ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-3">
            {pendingClasses.slice(0, 5).map((cls) => (
              <div key={cls.id || cls.code}
                className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 hover:border-blue-200 transition-all cursor-pointer flex items-center justify-between gap-4"
                onClick={() => { onSelectClassForApply(cls); onNavigate('register-tutor'); }}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{cls.code}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      cls.status === 'KHẨN CẤP' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}>{cls.status}</span>
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">{cls.subject}</h4>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{cls.location}</span>
                    <span className="font-bold text-blue-600">{fmt(cls.fee)}đ/buổi</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 shrink-0" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===== CTA ĐĂNG KÝ ===== */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-center text-white">
        <h2 className="text-xl sm:text-2xl font-bold mb-2">Sẵn sàng tìm gia sư?</h2>
        <p className="text-blue-100 text-sm mb-6 max-w-md mx-auto">Đăng ký miễn phí, nhận tư vấn trong vòng 30 phút</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button onClick={() => onNavigate('parent-register')}
            className="w-full sm:w-auto px-8 py-3.5 bg-white text-blue-700 font-bold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2">
            <BookOpen className="w-4 h-4" /><span>Đăng ký ngay</span>
          </button>
          <button onClick={() => onNavigate('register-tutor')}
            className="w-full sm:w-auto px-8 py-3.5 bg-white/10 border border-white/20 text-white font-bold text-sm rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2">
            <GraduationCap className="w-4 h-4" /><span>Đăng ký làm gia sư</span>
          </button>
        </div>
      </section>

      {/* ===== EMPTY STATE ===== */}
      {pendingClasses.length === 0 && verifiedTutors.length === 0 && (
        <section className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center">
          <BookOpen className="w-10 h-10 mx-auto mb-3 text-slate-300" />
          <h3 className="text-base font-bold text-slate-700 mb-1.5">Hệ thống đang khởi tạo</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mb-5">
            Đăng ký nhu cầu tìm gia sư để trung tâm tư vấn miễn phí cho bạn.
          </p>
          <button onClick={() => onNavigate('parent-register')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl cursor-pointer">
            Đăng ký tìm gia sư
          </button>
        </section>
      )}
    </div>
  );
};

