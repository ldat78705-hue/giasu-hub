import React from 'react';
import { ClassItem, TutorItem, ActiveTab } from '../types';
import { Star, MapPin, GraduationCap, BookOpen, ShieldCheck, Clock, CheckCircle2, Phone, UserPlus, ChevronRight } from 'lucide-react';

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
      <section className="bg-gradient-to-b from-blue-600 to-blue-700 text-white">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-16 sm:py-20 text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-4">
            Tìm gia sư giỏi tại Hà Nội
          </h1>
          <p className="text-blue-100 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
            Đội ngũ gia sư đã xác minh, dạy kèm tại nhà & online. Cam kết tiến bộ hoặc đổi giáo viên miễn phí.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button onClick={() => onNavigate('parent-register')}
              className="w-full sm:w-auto px-8 py-3.5 bg-white text-blue-700 font-bold text-sm rounded-lg shadow-lg cursor-pointer hover:bg-blue-50 transition-colors">
              Tìm gia sư ngay
            </button>
            <button onClick={() => onNavigate('register-tutor')}
              className="w-full sm:w-auto px-8 py-3.5 bg-blue-500 text-white font-bold text-sm rounded-lg border border-blue-400 cursor-pointer hover:bg-blue-400 transition-colors">
              Gia sư đăng ký dạy
            </button>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="bg-white border-b border-slate-100 -mt-6 relative z-10">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <div className="bg-white rounded-xl shadow-lg shadow-slate-200/60 border border-slate-100 grid grid-cols-2 sm:grid-cols-4 divide-x divide-slate-100">
            {[
              { value: `${Math.max(tutors.length, 10)}+`, label: 'Gia sư' },
              { value: `${pendingClasses.length}`, label: 'Lớp đang tuyển' },
              { value: '98%', label: 'Hài lòng' },
              { value: '24h', label: 'Phản hồi' },
            ].map((s, i) => (
              <div key={i} className="py-5 px-3 text-center">
                <div className="text-xl sm:text-2xl font-black text-blue-600">{s.value}</div>
                <div className="text-[11px] sm:text-xs text-slate-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== QUY TRÌNH ===== */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 py-14 sm:py-16">
          <h2 className="text-lg sm:text-xl font-bold text-slate-800 text-center mb-2">Quy trình 3 bước</h2>
          <p className="text-sm text-slate-500 text-center mb-10">Đơn giản, nhanh chóng, miễn phí</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { n: '1', title: 'Phụ huynh đăng ký', desc: 'Điền thông tin nhu cầu: môn học, lớp, khu vực, lịch học mong muốn.' },
              { n: '2', title: 'Trung tâm tư vấn', desc: 'Tư vấn miễn phí qua Zalo/điện thoại, tìm gia sư phù hợp nhất trong 24h.' },
              { n: '3', title: 'Học thử & quyết định', desc: 'Học thử 1-2 buổi miễn phí. Hài lòng mới cam kết lâu dài.' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-3">{item.n}</div>
                <h3 className="font-bold text-slate-800 text-sm mb-1.5">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CAM KẾT ===== */}
      <section className="bg-slate-50 border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 py-14 sm:py-16">
          <h2 className="text-lg sm:text-xl font-bold text-slate-800 text-center mb-10">Vì sao chọn chúng tôi?</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {[
              { icon: <ShieldCheck className="w-5 h-5" />, title: 'Hồ sơ xác minh', desc: 'CCCD & bằng cấp' },
              { icon: <CheckCircle2 className="w-5 h-5" />, title: 'Cam kết tiến bộ', desc: 'Đổi GS miễn phí' },
              { icon: <Clock className="w-5 h-5" />, title: 'Phản hồi 24h', desc: 'Ghép GS nhanh' },
              { icon: <MapPin className="w-5 h-5" />, title: 'Toàn Hà Nội', desc: 'Tại nhà & online' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mx-auto mb-2.5">{item.icon}</div>
                <h3 className="font-bold text-slate-800 text-xs mb-0.5">{item.title}</h3>
                <p className="text-[11px] text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== GIA SƯ NỔI BẬT ===== */}
      {verifiedTutors.length > 0 && (
        <section className="bg-white border-b border-slate-100">
          <div className="max-w-5xl mx-auto px-5 sm:px-8 py-14 sm:py-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg sm:text-xl font-bold text-slate-800">Gia sư nổi bật</h2>
              <button onClick={() => onNavigate('find-tutors')}
                className="text-blue-600 text-xs font-bold cursor-pointer hover:underline flex items-center gap-1">
                Xem tất cả<ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {verifiedTutors.slice(0, 6).map((t) => (
                <div key={t.id || t.code}
                  className="border border-slate-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
                  onClick={() => { onSelectTutorForBook(t); onNavigate('find-tutors'); }}>
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg ${t.avatarColor || 'bg-blue-500'} flex items-center justify-center font-bold text-white text-sm shrink-0`}>
                      {t.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="font-bold text-slate-800 text-sm truncate">{t.name}</span>
                        <span className="text-[9px] bg-blue-600 text-white px-1.5 py-px rounded font-bold">✓</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mb-2">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500 inline mr-0.5" />{t.rating} • {t.experience || t.qualification}
                      </div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {t.subjects.slice(0, 3).map((sub, si) => (
                          <span key={si} className="px-1.5 py-px bg-slate-100 text-slate-600 rounded text-[10px] font-medium">{sub}</span>
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

      {/* ===== LỚP CẦN GIA SƯ ===== */}
      {pendingClasses.length > 0 && (
        <section className="bg-slate-50 border-b border-slate-100">
          <div className="max-w-5xl mx-auto px-5 sm:px-8 py-14 sm:py-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg sm:text-xl font-bold text-slate-800">Lớp đang cần gia sư</h2>
              <button onClick={() => onNavigate('register-tutor')}
                className="text-blue-600 text-xs font-bold cursor-pointer hover:underline flex items-center gap-1">
                Ứng tuyển<ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingClasses.slice(0, 6).map((cls) => (
                <div key={cls.id || cls.code}
                  className="bg-white border border-slate-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
                  onClick={() => { onSelectClassForApply(cls); onNavigate('register-tutor'); }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      cls.status === 'KHẨN CẤP' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}>{cls.status}</span>
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm mb-1">{cls.subject}</h4>
                  {cls.studentInfo && <p className="text-[11px] text-slate-500 mb-2 truncate">{cls.studentInfo}</p>}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{cls.location}</span>
                    <span className="font-bold text-blue-600">{fmt(cls.fee)}đ/buổi</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== CTA ===== */}
      <section className="bg-blue-600 text-white">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-14 sm:py-16 text-center">
          <h2 className="text-xl sm:text-2xl font-bold mb-3">Sẵn sàng tìm gia sư?</h2>
          <p className="text-blue-100 text-sm mb-8 max-w-md mx-auto">Đăng ký miễn phí, nhận tư vấn trong 30 phút.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button onClick={() => onNavigate('parent-register')}
              className="w-full sm:w-auto px-8 py-3.5 bg-white text-blue-700 font-bold text-sm rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
              Phụ huynh đăng ký
            </button>
            <button onClick={() => onNavigate('register-tutor')}
              className="w-full sm:w-auto px-8 py-3.5 bg-blue-500 text-white font-bold text-sm rounded-lg border border-blue-400 cursor-pointer hover:bg-blue-400 transition-colors">
              Gia sư đăng ký
            </button>
            {zaloNumber && (
              <a href={`https://zalo.me/${zaloNumber}`} target="_blank" rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-3.5 bg-blue-500 text-white font-bold text-sm rounded-lg border border-blue-400 hover:bg-blue-400 transition-colors flex items-center justify-center gap-2">
                <Phone className="w-4 h-4" />Zalo tư vấn
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
