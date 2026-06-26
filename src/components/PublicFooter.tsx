import React from 'react';
import { ActiveTab } from '../types';
import { Phone, Mail, MapPin, MessageCircle, GraduationCap, BookOpen, UserPlus, ChevronRight } from 'lucide-react';

interface PublicFooterProps {
  onNavigate: (tab: ActiveTab) => void;
  zaloNumber?: string;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({ onNavigate, zaloNumber }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 pb-20 lg:pb-0">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-white text-sm">TĐ</div>
              <div>
                <div className="text-white font-bold text-sm">Gia Sư Thành Đạt</div>
                <div className="text-[9px] text-blue-400 font-semibold uppercase tracking-wider">Tri thức hôm nay, thành công ngày mai</div>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-slate-500 max-w-xs mb-4">
              Kết nối phụ huynh với đội ngũ gia sư giỏi, đã xác minh tại Hà Nội. Dạy kèm tại nhà & online.
            </p>
            {zaloNumber && (
              <a href={`https://zalo.me/${zaloNumber}`} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/10 border border-blue-600/20 text-blue-400 hover:text-blue-300 text-xs font-semibold rounded-lg transition-colors">
                <MessageCircle className="w-3.5 h-3.5" />Zalo: {zaloNumber}
              </a>
            )}
          </div>

          {/* Dịch vụ */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Dịch vụ</h4>
            <ul className="space-y-2.5 text-sm">
              <li><button onClick={() => onNavigate('find-tutors')} className="hover:text-white transition-colors cursor-pointer flex items-center gap-1">Tìm gia sư</button></li>
              <li><button onClick={() => onNavigate('parent-register')} className="hover:text-white transition-colors cursor-pointer flex items-center gap-1">Đăng ký tìm gia sư</button></li>
              <li><button onClick={() => onNavigate('register-tutor')} className="hover:text-white transition-colors cursor-pointer flex items-center gap-1">Đăng ký làm gia sư</button></li>
            </ul>
          </div>

          {/* Cam kết */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Cam kết</h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2"><span className="w-1 h-1 bg-blue-500 rounded-full" />Gia sư đã xác minh</li>
              <li className="flex items-center gap-2"><span className="w-1 h-1 bg-blue-500 rounded-full" />Học thử trước khi đóng phí</li>
              <li className="flex items-center gap-2"><span className="w-1 h-1 bg-blue-500 rounded-full" />Đổi GS miễn phí</li>
              <li className="flex items-center gap-2"><span className="w-1 h-1 bg-blue-500 rounded-full" />Tư vấn 7:00 - 21:00</li>
            </ul>
          </div>

          {/* Liên hệ */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Liên hệ</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>Hà Nội, Việt Nam</span>
              </li>
              {zaloNumber && (
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                  <a href={`tel:${zaloNumber}`} className="hover:text-white transition-colors">{zaloNumber}</a>
                </li>
              )}
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Liên hệ qua trang web</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-600">
            © {new Date().getFullYear()} Gia Sư Thành Đạt. Trung tâm gia sư uy tín tại Hà Nội.
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-600">
            <button onClick={() => onNavigate('home')} className="hover:text-slate-400 cursor-pointer transition-colors">Trang chủ</button>
            <button onClick={() => onNavigate('find-tutors')} className="hover:text-slate-400 cursor-pointer transition-colors">Gia sư</button>
            <button onClick={() => onNavigate('parent-register')} className="hover:text-slate-400 cursor-pointer transition-colors">Đăng ký</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
