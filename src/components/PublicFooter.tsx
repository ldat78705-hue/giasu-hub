import React from 'react';
import { ActiveTab } from '../types';
import { Phone, MapPin } from 'lucide-react';

interface PublicFooterProps {
  onNavigate: (tab: ActiveTab) => void;
  zaloNumber?: string;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({ onNavigate, zaloNumber }) => {
  return (
    <footer style={{ background: '#0f172a', color: '#94a3b8', paddingBottom: 80 }} className="lg:pb-0">
      <div style={{ maxWidth: 1024, margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 32 }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 28, height: 28, background: '#2563eb', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 10 }}>TĐ</div>
              <span style={{ fontWeight: 700, fontSize: 14, color: '#fff' }}>Gia Sư Thành Đạt</span>
            </div>
            <p style={{ fontSize: 12, lineHeight: 1.6 }}>
              Kết nối phụ huynh với đội ngũ gia sư giỏi tại Hà Nội.
            </p>
          </div>

          {/* Links */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Dịch vụ</div>
            {[
              { label: 'Tìm gia sư', tab: 'find-tutors' as ActiveTab },
              { label: 'Đăng ký tìm gia sư', tab: 'parent-register' as ActiveTab },
              { label: 'Trở thành gia sư', tab: 'register-tutor' as ActiveTab },
              { label: 'Tra cứu đơn đăng ký', tab: 'status-lookup' as ActiveTab },
            ].map((l, i) => (
              <button key={i} onClick={() => onNavigate(l.tab)}
                style={{ display: 'block', background: 'none', border: 'none', color: '#94a3b8', fontSize: 13, cursor: 'pointer', padding: '3px 0', textAlign: 'left' }}>
                {l.label}
              </button>
            ))}
          </div>

          {/* Contact */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Liên hệ</div>
            <div style={{ fontSize: 13, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><MapPin size={14} /> Hà Nội, Việt Nam</span>
              {zaloNumber && <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Phone size={14} /> {zaloNumber}</span>}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div style={{ borderTop: '1px solid #1e293b', marginTop: 32, paddingTop: 16, fontSize: 12, textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16 }}>
          <span>© 2026 Gia Sư Thành Đạt</span>
          <button onClick={() => onNavigate('dashboard')} style={{ background: 'none', border: 'none', color: '#475569', fontSize: 11, cursor: 'pointer' }}>Quản trị</button>
        </div>
      </div>
    </footer>
  );
};
