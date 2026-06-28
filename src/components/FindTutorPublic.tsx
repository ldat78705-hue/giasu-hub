import React, { useState } from 'react';
import { TutorItem, ActiveTab } from '../types';
import { Search, Star, MapPin, GraduationCap, CheckCircle2, Send, X, Phone, GitCompareArrows, Users, Clock, Shield, Award } from 'lucide-react';

interface FindTutorPublicProps {
  tutors: TutorItem[];
  onBookTutor: (tutor: TutorItem, studentName: string, phone: string, notes: string) => Promise<void>;
  onNavigate: (tab: ActiveTab) => void;
}

const fmt = (v: number) => new Intl.NumberFormat('vi-VN').format(v);
const subjects = ['Tất cả', 'Toán', 'Tiếng Anh', 'IELTS', 'Vật Lý', 'Hóa Học', 'Ngữ Văn', 'Tin Học', 'Luyện thi'];

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 8,
  fontSize: 14, outline: 'none', background: '#f8fafc',
};

export const FindTutorPublic: React.FC<FindTutorPublicProps> = ({ tutors, onBookTutor, onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('Tất cả');
  const [selectedTutor, setSelectedTutor] = useState<TutorItem | null>(null);
  const [studentName, setStudentName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  // F20: Compare state
  const [compareCodes, setCompareCodes] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  const toggleCompare = (code: string) => {
    setCompareCodes(prev => prev.includes(code) ? prev.filter(c => c !== code) : prev.length < 3 ? [...prev, code] : prev);
  };

  const verifiedTutors = tutors.filter(t => t.verified);

  const filtered = verifiedTutors.filter(t => {
    const matchSearch = !searchTerm || t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.subjects.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchSub = selectedSubject === 'Tất cả' || t.subjects.some(s => s.toLowerCase().includes(selectedSubject.toLowerCase()));
    return matchSearch && matchSub;
  });

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTutor || !studentName || !phone) return;
    await onBookTutor(selectedTutor, studentName, phone, notes);
    setBookingSuccess(true);
    setTimeout(() => { setBookingSuccess(false); setSelectedTutor(null); setStudentName(''); setPhone(''); setNotes(''); }, 2500);
  };

  return (
    <div style={{ paddingBottom: 80 }}>
      {/* ===== HEADER ===== */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 'clamp(22px, 4vw, 28px)', fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>
          Tìm gia sư tại Hà Nội
        </h1>
        <p style={{ fontSize: 14, color: '#64748b' }}>
          {verifiedTutors.length > 0
            ? `${verifiedTutors.length} gia sư đã xác minh · Chọn và đặt lịch học thử miễn phí`
            : 'Đăng ký để trung tâm tìm gia sư phù hợp nhất cho bạn'}
        </p>
      </div>

      {/* ===== SEARCH + FILTER BAR ===== */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: 20, marginBottom: 24 }}>
        <div style={{ position: 'relative', marginBottom: 16 }}>
          <Search size={16} style={{ position: 'absolute', left: 14, top: 13, color: '#94a3b8' }} />
          <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên, môn dạy, khu vực..."
            style={{ ...inputStyle, paddingLeft: 40, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10 }} />
        </div>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }} className="scrollbar-hide">
          {subjects.map(sub => (
            <button key={sub} onClick={() => setSelectedSubject(sub)}
              style={{
                padding: '7px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                border: '1px solid', whiteSpace: 'nowrap', flexShrink: 0, transition: 'all .15s',
                background: selectedSubject === sub ? '#2563eb' : '#fff',
                color: selectedSubject === sub ? '#fff' : '#475569',
                borderColor: selectedSubject === sub ? '#2563eb' : '#e2e8f0',
              }}>
              {sub}
            </button>
          ))}
        </div>
        {searchTerm && (
          <div style={{ marginTop: 10, fontSize: 12, color: '#64748b' }}>
            Kết quả cho "<b>{searchTerm}</b>" — {filtered.length} gia sư
          </div>
        )}
      </div>

      {/* ===== TUTOR GRID or EMPTY STATE ===== */}
      {filtered.length === 0 ? (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '56px 24px', textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <GraduationCap size={28} style={{ color: '#94a3b8' }} />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>
            {verifiedTutors.length === 0 ? 'Hệ thống đang cập nhật gia sư' : 'Không tìm thấy gia sư phù hợp'}
          </h3>
          <p style={{ fontSize: 14, color: '#64748b', maxWidth: 420, margin: '0 auto 24px', lineHeight: 1.6 }}>
            {verifiedTutors.length === 0
              ? 'Đội ngũ gia sư đang được xác minh. Hãy đăng ký nhu cầu, trung tâm sẽ tìm và liên hệ bạn trong 30 phút.'
              : 'Thử tìm với từ khóa khác, hoặc đăng ký để trung tâm tìm giúp bạn.'}
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => onNavigate('parent-register')}
              style={{ padding: '12px 28px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px rgba(37,99,235,0.2)' }}>
              Đăng ký tìm gia sư miễn phí
            </button>
            {verifiedTutors.length > 0 && searchTerm && (
              <button onClick={() => { setSearchTerm(''); setSelectedSubject('Tất cả'); }}
                style={{ padding: '12px 28px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                Xóa bộ lọc
              </button>
            )}
          </div>

          {/* Trust signals — only in empty state */}
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 32, flexWrap: 'wrap' }}>
            {[
              { icon: <Shield size={14} />, text: 'Đã xác minh', color: '#2563eb' },
              { icon: <Clock size={14} />, text: 'Phản hồi 30 phút', color: '#16a34a' },
              { icon: <Award size={14} />, text: 'Học thử miễn phí', color: '#f59e0b' },
            ].map((item, i) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: item.color }}>
                {item.icon} {item.text}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Results header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <span style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>
              <Users size={14} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: 4 }} />
              {filtered.length} gia sư phù hợp
            </span>
            {compareCodes.length > 0 && (
              <span style={{ fontSize: 12, color: '#2563eb', fontWeight: 600 }}>{compareCodes.length}/3 đã chọn so sánh</span>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
            {filtered.map(t => (
              <div key={t.id || t.code} onClick={() => setSelectedTutor(t)}
                style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 20, cursor: 'pointer', transition: 'border-color .15s, box-shadow .15s', position: 'relative' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#93c5fd'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(37,99,235,.08)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}>
                <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 12,
                    background: t.avatarColor?.replace('bg-', '').includes('-') ? `var(--color-${t.avatarColor.replace('bg-', '')})` : '#3b82f6',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: 700, fontSize: 16, flexShrink: 0,
                  }}>{t.avatar}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>{t.name}</span>
                      {t.verified && <span style={{ background: '#2563eb', color: '#fff', fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 4 }}>✓</span>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#64748b', marginBottom: 8 }}>
                      <Star size={13} style={{ color: '#f59e0b', fill: '#f59e0b' }} />
                      <span style={{ fontWeight: 600 }}>{t.rating}</span>
                      <span>·</span>
                      <span>{t.experience}</span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
                      {t.subjects.slice(0, 4).map((sub, i) => (
                        <span key={i} style={{ background: '#eff6ff', color: '#2563eb', padding: '3px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600 }}>{sub}</span>
                      ))}
                      {(t.subjects.length > 4) && <span style={{ color: '#94a3b8', fontSize: 11 }}>+{t.subjects.length - 4}</span>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, color: '#64748b', borderTop: '1px solid #f1f5f9', paddingTop: 8 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <MapPin size={12} /> {t.area || t.teachingAreas?.slice(0, 2).join(', ') || 'Hà Nội'}
                      </span>
                      <span style={{ fontWeight: 700, color: '#2563eb', fontSize: 14 }}>{fmt(t.hourlyRate)}đ/buổi</span>
                    </div>
                  </div>
                  {/* F20: Compare checkbox */}
                  <div style={{ position: 'absolute', top: 8, right: 8 }} onClick={e => e.stopPropagation()}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', padding: '3px 8px', borderRadius: 6, background: compareCodes.includes(t.code) ? '#eff6ff' : '#f8fafc', border: `1px solid ${compareCodes.includes(t.code) ? '#93c5fd' : '#e2e8f0'}`, fontSize: 10, fontWeight: 600, color: compareCodes.includes(t.code) ? '#2563eb' : '#94a3b8' }}>
                      <input type="checkbox" checked={compareCodes.includes(t.code)} onChange={() => toggleCompare(t.code)} style={{ accentColor: '#2563eb', width: 12, height: 12 }} />
                      So sánh
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* F20: Floating compare bar */}
      {compareCodes.length >= 2 && (
        <div style={{ position: 'fixed', bottom: 80, left: '50%', transform: 'translateX(-50%)', background: '#0f172a', color: '#fff', padding: '12px 24px', borderRadius: 16, display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.3)', zIndex: 40, animation: 'slideUp 0.3s ease' }}>
          <GitCompareArrows size={18} />
          <span style={{ fontSize: 13, fontWeight: 600 }}>{compareCodes.length} gia sư đã chọn</span>
          <button onClick={() => setShowCompare(true)} style={{ padding: '8px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>So sánh ngay</button>
          <button onClick={() => setCompareCodes([])} style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.1)', color: '#94a3b8', border: 'none', borderRadius: 8, fontSize: 12, cursor: 'pointer' }}>Xóa</button>
        </div>
      )}

      {/* F20: Compare Modal */}
      {showCompare && (() => {
        const compareTutors = compareCodes.map(code => verifiedTutors.find(t => t.code === code)).filter(Boolean) as TutorItem[];
        return (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setShowCompare(false)}>
            <div style={{ background: '#fff', borderRadius: 16, maxWidth: 800, width: '100%', maxHeight: '80vh', overflow: 'auto', padding: 32 }} onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}><GitCompareArrows size={20} /> So sánh gia sư</h2>
                <button onClick={() => setShowCompare(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><X size={20} /></button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${compareTutors.length}, 1fr)`, gap: 16 }}>
                {compareTutors.map(t => (
                  <div key={t.code} style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 20, textAlign: 'center' }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 16, margin: '0 auto 12px' }}>{t.avatar}</div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a', marginBottom: 4 }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: '#2563eb', fontWeight: 600, background: '#eff6ff', padding: '2px 8px', borderRadius: 4, display: 'inline-block', marginBottom: 16 }}>✓ Đã xác minh</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left' }}>
                      {[
                        { label: 'Đánh giá', value: <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Star size={12} style={{ color: '#f59e0b', fill: '#f59e0b' }} />{t.rating}/5</span> },
                        { label: 'Kinh nghiệm', value: t.experience || t.qualification },
                        { label: 'Môn dạy', value: t.subjects.join(', ') },
                        { label: 'Khu vực', value: t.area || 'Hà Nội' },
                        { label: 'Học phí', value: <span style={{ fontWeight: 700, color: '#2563eb' }}>{fmt(t.hourlyRate)}đ/buổi</span> },
                      ].map((row, ri) => (
                        <div key={ri} style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: 8 }}>
                          <div style={{ fontSize: 10, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 2 }}>{row.label}</div>
                          <div style={{ fontSize: 13, color: '#334155', fontWeight: 500 }}>{row.value}</div>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => { setSelectedTutor(t); setShowCompare(false); }}
                      style={{ marginTop: 16, width: '100%', padding: '10px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                      Chọn gia sư này
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ===== BOOKING MODAL ===== */}
      {selectedTutor && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(0,0,0,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
          onClick={() => !bookingSuccess && setSelectedTutor(null)}>
          <div style={{ background: '#fff', borderRadius: 16, maxWidth: 440, width: '100%', padding: 28, position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedTutor(null)} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><X size={20} /></button>

            {bookingSuccess ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <CheckCircle2 size={40} color="#22c55e" style={{ margin: '0 auto 8px', display: 'block' }} />
                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: 16 }}>Đã gửi yêu cầu!</div>
                <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Trung tâm sẽ liên hệ xác nhận sớm nhất.</p>
              </div>
            ) : (
              <>
                {/* Tutor info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{selectedTutor.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>{selectedTutor.name}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{selectedTutor.subjects.join(' · ')} · {fmt(selectedTutor.hourlyRate)}đ</div>
                  </div>
                </div>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>Đặt lịch học thử miễn phí</h3>

                <form onSubmit={handleBook} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>Họ tên phụ huynh *</label>
                    <input required value={studentName} onChange={e => setStudentName(e.target.value)} placeholder="Ví dụ: Nguyễn Thị Lan" style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>Số điện thoại *</label>
                    <input required type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="0912345678" style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>Ghi chú</label>
                    <textarea rows={2} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Lớp, khu vực, yêu cầu..." style={{ ...inputStyle, resize: 'none' }} />
                  </div>
                  <button type="submit"
                    style={{ padding: '13px 0', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <Send size={16} /> Đặt lịch học thử
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
