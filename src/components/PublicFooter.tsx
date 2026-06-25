import React from 'react';
import { ActiveTab } from '../types';
import { MapPin, Phone, Mail, Clock, Facebook, MessageCircle, GraduationCap, BookOpen, ShieldCheck, ArrowRight } from 'lucide-react';

interface PublicFooterProps {
  onNavigate: (tab: ActiveTab) => void;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({ onNavigate }) => {
  return (
    <footer id="site-footer" className="bg-[#0F172A] text-slate-300 border-t border-slate-800">
      {/* CTA Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Sẵn sàng tìm gia sư phù hợp cho con bạn?
          </h2>
          <p className="text-blue-100 text-sm sm:text-base max-w-xl mx-auto">
            Hơn 1,000 gia sư đã được xác thực đang chờ kết nối. Phí tư vấn hoàn toàn miễn phí.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('find-tutors')}
              className="px-8 py-3.5 bg-white text-blue-700 font-bold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Tìm Gia Sư Ngay</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('register-tutor')}
              className="px-8 py-3.5 bg-white/10 border border-white/20 hover:bg-white/20 text-white font-bold text-sm rounded-xl transition-all cursor-pointer flex items-center gap-2"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Đăng Ký Làm Gia Sư</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-8">
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/20 text-sm">
                GT
              </div>
              <span className="text-xl font-bold text-white tracking-tight">Gia Sư Hub</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Nền tảng kết nối gia sư dạy kèm chất lượng cao hàng đầu Việt Nam. Sử dụng AI thông minh để ghép nối học sinh - gia sư chính xác nhất.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-9 h-9 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors cursor-pointer">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-slate-800 hover:bg-green-600 rounded-lg flex items-center justify-center transition-colors cursor-pointer">
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-slate-800 hover:bg-red-600 rounded-lg flex items-center justify-center transition-colors cursor-pointer">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Links */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">Dịch vụ</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onNavigate('find-tutors')} className="text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3" />
                  <span>Tìm gia sư tại nhà</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('find-tutors')} className="text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3" />
                  <span>Gia sư online</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('find-tutors')} className="text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3" />
                  <span>Luyện thi IELTS / ĐH</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('register-tutor')} className="text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3" />
                  <span>Đăng ký làm gia sư</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: About */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">Cam kết</h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-start gap-2 text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Xác thực hồ sơ 100%</span>
              </li>
              <li className="flex items-start gap-2 text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Học thử miễn phí 2 buổi</span>
              </li>
              <li className="flex items-start gap-2 text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Hoàn tiền nếu không hài lòng</span>
              </li>
              <li className="flex items-start gap-2 text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>AI ghép nối chính xác 98%</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">Liên hệ</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5 text-slate-400">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>227 Nguyễn Văn Cừ, Q.5, TP.HCM</span>
              </li>
              <li className="flex items-center gap-2.5 text-slate-400">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="font-mono font-semibold">1900.xxxx</span>
              </li>
              <li className="flex items-center gap-2.5 text-slate-400">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>contact@giasuhub.vn</span>
              </li>
              <li className="flex items-center gap-2.5 text-slate-400">
                <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                <span>T2-CN: 7:00 - 21:00</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© 2026 Gia Sư Hub. Trung tâm gia sư uy tín hàng đầu Việt Nam.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Chính sách bảo mật</span>
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Điều khoản sử dụng</span>
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Quy chế hoạt động</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
