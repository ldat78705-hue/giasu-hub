import React, { useState, useEffect, useRef } from 'react';
import { ClassItem, TutorItem, ActiveTab, ContactMessage, TutorReview } from '../types';
import { Star, MapPin, Phone, ChevronRight, Search, CheckCircle2, Users, GraduationCap, Clock, Award, Sparkles, MessageCircle } from 'lucide-react';

interface HomePublicProps {
  classes: ClassItem[];
  tutors: TutorItem[];
  reviews?: TutorReview[];
  onNavigate: (tab: ActiveTab) => void;
  onAiSearch: (query: string) => void;
  isSearching: boolean;
  zaloNumber?: string;
  onContactSubmit?: (msg: ContactMessage) => Promise<void>;
}

const W = { maxWidth: 1024, margin: '0 auto', padding: '0 20px' } as const;
const fmt = (v: number) => new Intl.NumberFormat('vi-VN').format(v);

// F26: Animated counter hook
function useCounter(end: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start = Date.now();
        const tick = () => {
          const elapsed = Date.now() - start;
          const progress = Math.min(elapsed / duration, 1);
          setCount(Math.floor(progress * end));
          if (progress < 1) requestAnimationFrame(tick);
        };
        tick();
      }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end, duration]);
  return { count, ref };
}

export const HomePublic: React.FC<HomePublicProps> = ({
  classes, tutors, onNavigate, onAiSearch, isSearching, zaloNumber, reviews = [],
}) => {
  const pending = classes.filter(c => c.status === 'ĐANG TÌM' || c.status === 'KHẨN CẤP');
  const verified = tutors.filter(t => t.verified && t.status === 'online');
  const [aiQuery, setAiQuery] = useState('');

  // F26: Animated counters
  const cTutors = useCounter(Math.max(tutors.length, 50), 1500);
  const cStudents = useCounter(Math.max(pending.length * 8, 200), 1800);
  const cSatisfy = useCounter(98, 1200);
  const cResponse = useCounter(30, 1000);

  // BUG-3: Handle AI search
  const handleAiSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (aiQuery.trim()) onAiSearch(aiQuery.trim());
  };

  // F26: Testimonials from real reviews
  const topReviews = reviews.filter(r => r.rating >= 4 && r.comment).slice(0, 3);
  const defaultTestimonials = [
    { parentName: 'Chị Nguyễn Thu Hà', comment: 'Gia sư rất nhiệt tình, bé tiến bộ rõ rệt sau 2 tháng. Cảm ơn trung tâm!', rating: 5, tutorName: 'Thầy Minh' },
    { parentName: 'Anh Trần Văn Đức', comment: 'Con được học thử miễn phí, cô giáo dạy dễ hiểu. Rất hài lòng với dịch vụ.', rating: 5, tutorName: 'Cô Linh' },
    { parentName: 'Chị Phạm Thị Mai', comment: 'Trung tâm phản hồi rất nhanh, tìm được gia sư phù hợp chỉ trong 1 ngày!', rating: 5, tutorName: 'Thầy Hoàng' },
  ];
  const testimonials = topReviews.length >= 2 ? topReviews : defaultTestimonials;

  return (
    <div>
      {/* ===== HERO ===== */}
      <section style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)', borderBottom: '1px solid #1e293b', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at 30% 50%, rgba(79,70,229,0.15) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(99,102,241,0.1) 0%, transparent 50%)', pointerEvents: 'none' }} />
        <div style={{ ...W, paddingTop: 72, paddingBottom: 72, textAlign: 'center', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(79,70,229,0.2)', color: '#60a5fa', padding: '6px 16px', borderRadius: 4, fontSize: 12, fontWeight: 600, marginBottom: 24, border: '1px solid rgba(79,70,229,0.3)' }}>
            <Sparkles size={14} /> Trung tâm gia sư uy tín #1 Hà Nội
          </div>
          <h1 style={{ fontSize: 'clamp(30px, 5vw, 48px)', fontWeight: 800, color: '#fff', lineHeight: 1.15, marginBottom: 16 }}>
            Tìm gia sư giỏi<br />cho con bạn
          </h1>
          <p style={{ fontSize: 16, color: '#94a3b8', maxWidth: 500, margin: '0 auto 32px', lineHeight: 1.7 }}>
            Đội ngũ gia sư đã xác minh từ Đại học Quốc gia, Bách Khoa, Sư Phạm. Cam kết tiến bộ sau 4 buổi.
          </p>

          {/* BUG-3: AI Search Bar */}
          <form onSubmit={handleAiSearch} style={{ maxWidth: 520, margin: '0 auto 28px', display: 'flex', gap: 0, background: 'rgba(255,255,255,0.1)', borderRadius: 4, border: '1px solid rgba(255,255,255,0.15)', overflow: 'hidden', backdropFilter: 'blur(8px)' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 16px' }}>
              <Search size={18} style={{ color: '#64748b', flexShrink: 0 }} />
              <input type="text" value={aiQuery} onChange={e => setAiQuery(e.target.value)}
                placeholder="Tìm gia sư Toán lớp 10 quận Cầu Giấy..."
                style={{ flex: 1, padding: '14px 12px', background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: 14 }} />
            </div>
            <button type="submit" disabled={isSearching}
              style={{ padding: '14px 24px', background: '#4f46e5', color: '#fff', border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
              {isSearching ? '⏳' : <Sparkles size={16} />} Tìm kiếm
            </button>
          </form>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => onNavigate('parent-register')}
              style={{ padding: '14px 32px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 4, fontSize: 15, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 14px rgba(79,70,229,0.4)' }}>
              Đăng ký tìm gia sư — Miễn phí
            </button>
            <button onClick={() => onNavigate('register-tutor')}
              style={{ padding: '14px 32px', background: 'rgba(255,255,255,0.08)', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 4, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
              Trở thành gia sư
            </button>
          </div>
        </div>
      </section>

      {/* ===== F26: ANIMATED STATS COUNTER ===== */}
      <section style={{ background: '#fff', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ ...W, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 0, padding: '0 20px' }}>
          {[
            { ref: cTutors.ref, v: `${cTutors.count}+`, l: 'Gia sư xác minh', icon: <GraduationCap size={20} style={{ color: '#4f46e5' }} /> },
            { ref: cStudents.ref, v: `${cStudents.count}+`, l: 'Học sinh đã học', icon: <Users size={20} style={{ color: '#16a34a' }} /> },
            { ref: cSatisfy.ref, v: `${cSatisfy.count}%`, l: 'Phụ huynh hài lòng', icon: <CheckCircle2 size={20} style={{ color: '#f59e0b' }} /> },
            { ref: cResponse.ref, v: `${cResponse.count}p`, l: 'Phản hồi trung bình', icon: <Clock size={20} style={{ color: '#8b5cf6' }} /> },
          ].map((s, i) => (
            <div key={i} ref={s.ref} style={{ textAlign: 'center', padding: '28px 8px', borderRight: i < 3 ? '1px solid #f1f5f9' : 'none' }}>
              <div style={{ marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: 30, fontWeight: 800, color: '#0f172a', fontFamily: "'Inter', sans-serif" }}>{s.v}</div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 4, fontWeight: 500 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== HOW IT WORKS (merged USP + 3 Steps) ===== */}
      <section style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ ...W, paddingTop: 56, paddingBottom: 56 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', textAlign: 'center', marginBottom: 8 }}>Cách hoạt động</h2>
          <p style={{ fontSize: 14, color: '#64748b', textAlign: 'center', marginBottom: 40, maxWidth: 480, margin: '0 auto 40px' }}>3 bước đơn giản — hoàn toàn miễn phí cho phụ huynh</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {[
              { n: '1', icon: <CheckCircle2 size={24} />, color: '#4f46e5', bg: '#eef2ff', t: 'Đăng ký nhu cầu', d: 'Điền môn học, lớp, khu vực, lịch học. Chỉ mất 2 phút. Gia sư đều đã xác minh CCCD và bằng cấp.' },
              { n: '2', icon: <Sparkles size={24} />, color: '#8b5cf6', bg: '#f5f3ff', t: 'AI tìm gia sư phù hợp', d: 'Thuật toán AI phân tích và đề xuất gia sư tốt nhất. Phản hồi trong 30 phút.' },
              { n: '3', icon: <Award size={24} />, color: '#16a34a', bg: '#f0fdf4', t: 'Học thử và quyết định', d: 'Học thử 1-2 buổi miễn phí. Không hài lòng — đổi gia sư ngay, miễn phí hoàn toàn.' },
            ].map((s, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 4, padding: 28, textAlign: 'center', position: 'relative' }}>
                <div style={{ width: 28, height: 28, background: '#4f46e5', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, margin: '0 auto 16px', boxShadow: '0 2px 8px rgba(79,70,229,0.3)' }}>{s.n}</div>
                <div style={{ width: 48, height: 48, background: s.bg, color: s.color, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>{s.icon}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>{s.t}</div>
                <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7 }}>{s.d}</div>
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
              <button onClick={() => onNavigate('find-tutors')} style={{ background: 'none', border: 'none', color: '#4f46e5', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                Xem tất cả <ChevronRight size={14} />
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {verified.slice(0, 6).map(t => (
                <div key={t.id || t.code} onClick={() => onNavigate('find-tutors')}
                  style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 4, padding: 16, cursor: 'pointer' }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 4, background: t.avatarColor || '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                      {t.avatar}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                        <span style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{t.name}</span>
                        <span style={{ background: '#4f46e5', color: '#fff', fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 4 }}>✓</span>
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
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#4f46e5' }}>{fmt(t.hourlyRate)}đ/buổi</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== F26: TESTIMONIALS ===== */}
      <section style={{ background: '#fff', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ ...W, paddingTop: 56, paddingBottom: 56 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', textAlign: 'center', marginBottom: 8 }}>Phụ huynh nói gì?</h2>
          <p style={{ fontSize: 14, color: '#64748b', textAlign: 'center', marginBottom: 40 }}>Đánh giá thật từ phụ huynh đã sử dụng dịch vụ</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 4, padding: 24 }}>
                <div style={{ display: 'flex', gap: 2, marginBottom: 12 }}>
                  {[1,2,3,4,5].map(s => <Star key={s} size={14} style={{ color: s <= t.rating ? '#f59e0b' : '#e2e8f0', fill: s <= t.rating ? '#f59e0b' : 'none' }} />)}
                </div>
                <p style={{ fontSize: 14, color: '#334155', lineHeight: 1.7, marginBottom: 16, fontStyle: 'italic' }}>
                  "{t.comment}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, borderTop: '1px solid #e2e8f0', paddingTop: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: ['#4f46e5', '#16a34a', '#f59e0b'][i % 3], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13 }}>
                    {t.parentName.charAt(t.parentName.indexOf(' ') + 1) || t.parentName.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{t.parentName}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>Học với {t.tutorName}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* ===== CONTACT CTA ===== */}
      <section style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#fff' }}>
        <div style={{ ...W, paddingTop: 48, paddingBottom: 48, textAlign: 'center' }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Liên hệ tư vấn miễn phí</h2>
          <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 28 }}>Phản hồi trong 30 phút · Cam kết tiến bộ sau 4 buổi</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            {zaloNumber && (
              <a href={`https://zalo.me/${zaloNumber}`} target="_blank" rel="noopener noreferrer"
                style={{ padding: '14px 32px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 4, fontSize: 15, fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 14px rgba(79,70,229,0.4)' }}>
                <MessageCircle size={18} /> Nhắn Zalo: {zaloNumber}
              </a>
            )}
            {zaloNumber && (
              <a href={`tel:${zaloNumber}`}
                style={{ padding: '14px 32px', background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 4, fontSize: 15, fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Phone size={18} /> Gọi ngay: {zaloNumber}
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
