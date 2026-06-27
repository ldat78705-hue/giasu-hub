import React from 'react';
import { ClassItem, TutorItem, ActiveTab, ContactMessage } from '../types';
import { Star, MapPin, Phone, ChevronRight } from 'lucide-react';

interface HomePublicProps {
  classes: ClassItem[];
  tutors: TutorItem[];
  onNavigate: (tab: ActiveTab) => void;
  onAiSearch: (query: string) => void;
  isSearching: boolean;
  zaloNumber?: string;
  onContactSubmit?: (msg: ContactMessage) => Promise<void>;
}

const W = { maxWidth: 1024, margin: '0 auto', padding: '0 20px' } as const;
const fmt = (v: number) => new Intl.NumberFormat('vi-VN').format(v);

export const HomePublic: React.FC<HomePublicProps> = ({
  classes, tutors, onNavigate, zaloNumber,
}) => {
  const pending = classes.filter(c => c.status === 'ĐANG TÌM' || c.status === 'KHẨN CẤP');
  const verified = tutors.filter(t => t.verified && t.status === 'online');

  return (
    <div>
      {/* ===== HERO ===== */}
      <section style={{ background: '#fff', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ ...W, paddingTop: 64, paddingBottom: 64, textAlign: 'center' }}>
          <div style={{ display: 'inline-block', background: '#eff6ff', color: '#2563eb', padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, marginBottom: 20 }}>
            Trung tâm gia sư uy tín Hà Nội
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 800, color: '#0f172a', lineHeight: 1.15, marginBottom: 16 }}>
            Tìm gia sư giỏi<br />cho con bạn
          </h1>
          <p style={{ fontSize: 16, color: '#64748b', maxWidth: 480, margin: '0 auto 32px', lineHeight: 1.7 }}>
            Đội ngũ gia sư đã xác minh, cam kết tiến bộ. Học thử miễn phí, đổi giáo viên nếu không hài lòng.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => onNavigate('parent-register')}
              style={{ padding: '14px 32px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
              Tìm gia sư ngay
            </button>
            <button onClick={() => onNavigate('register-tutor')}
              style={{ padding: '14px 32px', background: '#f1f5f9', color: '#334155', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
              Gia sư đăng ký dạy
            </button>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ ...W, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 0, padding: '0 20px' }}>
          {[
            { v: `${Math.max(verified.length, 10)}+`, l: 'Gia sư xác minh' },
            { v: `${pending.length}`, l: 'Lớp đang tuyển' },
            { v: '98%', l: 'PH hài lòng' },
            { v: '30p', l: 'Phản hồi TB' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '24px 8px', borderRight: i < 3 ? '1px solid #e2e8f0' : 'none' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#2563eb' }}>{s.v}</div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== 3 STEPS ===== */}
      <section style={{ background: '#fff', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ ...W, paddingTop: 48, paddingBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', textAlign: 'center', marginBottom: 8 }}>Quy trình đơn giản</h2>
          <p style={{ fontSize: 14, color: '#64748b', textAlign: 'center', marginBottom: 36 }}>3 bước — miễn phí hoàn toàn</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
            {[
              { n: '1', t: 'Đăng ký nhu cầu', d: 'Điền môn học, lớp, khu vực, lịch học.' },
              { n: '2', t: 'Tư vấn & ghép GS', d: 'Trung tâm tìm gia sư phù hợp trong 24h.' },
              { n: '3', t: 'Học thử & quyết định', d: 'Học thử 1-2 buổi miễn phí.' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ width: 36, height: 36, background: '#2563eb', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, margin: '0 auto 12px' }}>{s.n}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>{s.t}</div>
                <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TUTORS ===== */}
      {verified.length > 0 && (
        <section style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ ...W, paddingTop: 48, paddingBottom: 48 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a' }}>Gia sư nổi bật</h2>
              <button onClick={() => onNavigate('find-tutors')} style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                Xem tất cả <ChevronRight size={14} />
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {verified.slice(0, 6).map(t => (
                <div key={t.id || t.code} onClick={() => onNavigate('find-tutors')}
                  style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 16, cursor: 'pointer' }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 8, background: t.avatarColor || '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                      {t.avatar}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                        <span style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{t.name}</span>
                        <span style={{ background: '#2563eb', color: '#fff', fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 4 }}>✓</span>
                      </div>
                      <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>
                        <Star size={12} style={{ display: 'inline', verticalAlign: '-2px', color: '#f59e0b', fill: '#f59e0b', marginRight: 2 }} />
                        {t.rating} · {t.experience || t.qualification}
                      </div>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 6 }}>
                        {t.subjects.slice(0, 3).map((s, si) => (
                          <span key={si} style={{ background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 500 }}>{s}</span>
                        ))}
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#2563eb' }}>{fmt(t.hourlyRate)}đ/buổi</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== CLASSES ===== */}
      {pending.length > 0 && (
        <section style={{ background: '#fff', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ ...W, paddingTop: 48, paddingBottom: 48 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a' }}>Lớp đang cần gia sư</h2>
              <button onClick={() => onNavigate('register-tutor')} style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                Đăng ký dạy <ChevronRight size={14} />
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {pending.slice(0, 6).map(cls => (
                <div key={cls.id || cls.code}
                  style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: 16 }}>
                  <div style={{ marginBottom: 8, display: 'flex', gap: 6 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4,
                      background: cls.status === 'KHẨN CẤP' ? '#fef2f2' : '#fffbeb',
                      color: cls.status === 'KHẨN CẤP' ? '#dc2626' : '#d97706',
                    }}>{cls.status}</span>
                    {cls.teachMode && (
                      <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 4, background: '#f0fdf4', color: '#16a34a' }}>
                        {cls.teachMode === 'Online' ? '💻 Trực tuyến' : cls.teachMode === 'Tại nhà' ? '🏠 Trực tiếp' : '🔄 Cả hai'}
                      </span>
                    )}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a', marginBottom: 4 }}>{cls.subject}</div>
                  {cls.studentInfo && <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>{cls.studentInfo}</div>}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: '#64748b', borderTop: '1px solid #e2e8f0', paddingTop: 8 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={12} />{cls.location}</span>
                    <span style={{ fontWeight: 700, color: '#2563eb' }}>{fmt(cls.fee)}đ/buổi</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== CTA ===== */}
      <section style={{ background: '#0f172a', color: '#fff' }}>
        <div style={{ ...W, paddingTop: 48, paddingBottom: 48, textAlign: 'center' }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Bạn cần tìm gia sư?</h2>
          <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 28 }}>Đăng ký miễn phí · Tư vấn trong 30 phút</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => onNavigate('parent-register')}
              style={{ padding: '12px 28px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
              Đăng ký tìm gia sư
            </button>
            {zaloNumber && (
              <a href={`https://zalo.me/${zaloNumber}`} target="_blank" rel="noopener noreferrer"
                style={{ padding: '12px 28px', background: 'transparent', color: '#fff', border: '1px solid #334155', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Phone size={16} /> Zalo tư vấn
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
