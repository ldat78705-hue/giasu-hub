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
            Sẵn sàng tìm gia sư phù hợp?
          </h2>
          <p className="text-blue-100 text-sm sm:text-base max-w-xl mx-auto">
            Đội ngũ gia sư giỏi tại Hà Nội đang chờ kết nối. Tư vấn hoàn toàn miễn phí.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button onClick={() => onNavigate('find-tutors')}
              className="px-8 py-3.5 bg-white text-blue-700 font-bold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center gap-2">
              <BookOpen className="w-4 h-4" /><span>Tìm Gia Sư Ngay</span><ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={() => onNavigate('register-tutor')}
              className="px-8 py-3.5 bg-white/10 border border-white/20 hover:bg-white/20 text-white font-bold text-sm rounded-xl transition-all cursor-pointer flex items-center gap-2">
              <GraduationCap className="w-4 h-4" /><span>Đăng Ký Làm Gia Sư</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/20 text-sm">TĐ</div>
              <span className="text-xl font-bold text-white tracking-tight">Gia Sư Thành Đạt</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Trung tâm gia sư uy tín tại Hà Nội. Kết nối gia sư giỏi với học sinh, cam kết chất lượng giảng dạy.
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

          {/* Services */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">Dịch vụ</h4>
            <ul className="space-y-2.5 text-sm">
              {['Gia sư tại nhà Hà Nội', 'Gia sư online', 'Luyện thi vào 10', 'Luyện thi Đại học'].map((s, i) => (
                <li key={i}>
                  <button onClick={() => onNavigate('find-tutors')} className="text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5">
                    <ArrowRight className="w-3 h-3" /><span>{s}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Commitments */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">Cam kết</h4>
            <ul className="space-y-2.5 text-sm">
              {['Gia sư đã xác thực', 'Học thử trước khi đóng phí', 'Đổi gia sư miễn phí', 'Tư vấn 24/7'].map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /><span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">Liên hệ</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5 text-slate-400">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" /><span>Hà Nội, Việt Nam</span>
              </li>
              <li className="flex items-center gap-2.5 text-slate-400">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" /><span>Liên hệ qua trang web</span>
              </li>
              <li className="flex items-center gap-2.5 text-slate-400">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" /><span>Liên hệ qua email</span>
              </li>
              <li className="flex items-center gap-2.5 text-slate-400">
                <Clock className="w-4 h-4 text-blue-400 shrink-0" /><span>T2-CN: 7:00 - 21:00</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-slate-800 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Gia Sư Thành Đạt. Trung tâm gia sư uy tín tại Hà Nội.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Chính sách bảo mật</span>
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Điều khoản sử dụng</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
