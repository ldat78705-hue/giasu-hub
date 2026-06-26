import React from 'react';
import { ActiveTab } from '../types';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

interface PublicFooterProps {
  onNavigate: (tab: ActiveTab) => void;
  zaloNumber?: string;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({ onNavigate, zaloNumber }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 pb-20 md:pb-0">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center font-bold text-white text-sm">TĐ</div>
              <div>
                <div className="text-white font-bold text-sm">Gia Sư Thành Đạt</div>
                <div className="text-[9px] text-blue-400 font-bold uppercase tracking-wider">Uy tín hàng đầu Hà Nội</div>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-slate-500 max-w-xs">
              Kết nối phụ huynh với đội ngũ gia sư giỏi, đã xác minh tại Hà Nội.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Dịch vụ</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => onNavigate('find-tutors')} className="hover:text-white transition-colors cursor-pointer">Tìm gia sư</button></li>
              <li><button onClick={() => onNavigate('parent-register')} className="hover:text-white transition-colors cursor-pointer">Đăng ký học</button></li>
              <li><button onClick={() => onNavigate('register-tutor')} className="hover:text-white transition-colors cursor-pointer">Đăng ký dạy</button></li>
            </ul>
          </div>

          {/* Commitment */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Cam kết</h4>
            <ul className="space-y-2 text-xs">
              <li>✓ Gia sư đã xác minh</li>
              <li>✓ Học thử trước khi đóng phí</li>
              <li>✓ Đổi GS miễn phí</li>
              <li>✓ Tư vấn 7:00 - 21:00</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Liên hệ</h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" /><span>Hà Nội, Việt Nam</span></li>
              {zaloNumber && (
                <li>
                  <a href={`https://zalo.me/${zaloNumber}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-white transition-colors">
                    <MessageCircle className="w-3.5 h-3.5 text-blue-400 shrink-0" /><span>Zalo: {zaloNumber}</span>
                  </a>
                </li>
              )}
              <li className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" /><span>Liên hệ qua trang web</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-6 text-center text-[11px] text-slate-600">
          © {new Date().getFullYear()} Gia Sư Thành Đạt. Trung tâm gia sư uy tín tại Hà Nội.
        </div>
      </div>
    </footer>
  );
};
