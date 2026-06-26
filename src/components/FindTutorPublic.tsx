import React, { useState } from 'react';
import { TutorItem, ClassItem } from '../types';
import { Search, Star, MapPin, GraduationCap, CheckCircle2, Send, X, UserPlus, Phone, BookOpen, Clock } from 'lucide-react';

interface FindTutorPublicProps {
  tutors: TutorItem[];
  onBookTutor: (tutor: TutorItem, studentName: string, phone: string, notes: string) => Promise<void>;
  onPostRequest: (cls: ClassItem) => Promise<void>;
}

const fmt = (v: number) => new Intl.NumberFormat('vi-VN').format(v);
const subjects = ['Tất cả', 'Toán', 'Tiếng Anh', 'IELTS', 'Vật Lý', 'Hóa Học', 'Ngữ Văn', 'Tin Học', 'Luyện thi'];

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 8,
  fontSize: 14, outline: 'none', background: '#f8fafc',
};

export const FindTutorPublic: React.FC<FindTutorPublicProps> = ({ tutors, onBookTutor, onPostRequest }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('Tất cả');
  const [selectedTutor, setSelectedTutor] = useState<TutorItem | null>(null);
  const [studentName, setStudentName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [reqSubject, setReqSubject] = useState('');
  const [reqGrade, setReqGrade] = useState('');
  const [reqLocation, setReqLocation] = useState('');
  const [reqNotes, setReqNotes] = useState('');
  const [requestSuccess, setRequestSuccess] = useState(false);

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

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqSubject || !reqLocation) return;
    await onPostRequest({
      code: `#YC${Math.floor(1000 + Math.random() * 9000)}`,
      subject: `${reqSubject} (${reqGrade || 'Phổ thông'})`,
      studentInfo: reqGrade, location: reqLocation, fee: 300000,
      status: 'ĐANG TÌM', createdAt: Date.now(), requirements: reqNotes,
    });
    setRequestSuccess(true);
    setTimeout(() => { setRequestSuccess(false); setShowRequestModal(false); setReqSubject(''); setReqGrade(''); setReqLocation(''); setReqNotes(''); }, 2500);
  };

  return (
    <div style={{ paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>Tìm gia sư</h1>
          <p style={{ fontSize: 14, color: '#64748b' }}>{filtered.length} gia sư đã xác minh</p>
        </div>
        <button onClick={() => setShowRequestModal(true)}
          style={{ padding: '10px 20px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
          <UserPlus size={16} /> Gửi yêu cầu tìm GS
        </button>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 16 }}>
        <Search size={16} style={{ position: 'absolute', left: 14, top: 13, color: '#94a3b8' }} />
        <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
          placeholder="Tìm theo tên, môn dạy, khu vực..."
          style={{ ...inputStyle, paddingLeft: 40, background: '#fff', border: '1px solid #e2e8f0' }} />
      </div>

      {/* Subject chips */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, marginBottom: 24 }} className="scrollbar-hide">
        {subjects.map(sub => (
          <button key={sub} onClick={() => setSelectedSubject(sub)}
            style={{
              padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 500, cursor: 'pointer',
              border: '1px solid', whiteSpace: 'nowrap', flexShrink: 0, transition: 'all .15s',
              background: selectedSubject === sub ? '#2563eb' : '#fff',
              color: selectedSubject === sub ? '#fff' : '#475569',
              borderColor: selectedSubject === sub ? '#2563eb' : '#e2e8f0',
            }}>
            {sub}
          </button>
        ))}
      </div>

      {/* Tutor Grid or Empty State */}
      {filtered.length === 0 ? (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '48px 24px', textAlign: 'center' }}>
          <GraduationCap size={40} style={{ color: '#cbd5e1', margin: '0 auto 12px', display: 'block' }} />
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#334155', marginBottom: 6 }}>Chưa tìm thấy gia sư phù hợp</h3>
          <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 20, maxWidth: 360, margin: '0 auto 20px' }}>
            Hãy gửi yêu cầu, trung tâm sẽ tìm gia sư phù hợp cho bạn trong vòng 24 giờ.
          </p>
          <button onClick={() => setShowRequestModal(true)}
            style={{ padding: '10px 24px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            Gửi yêu cầu tìm gia sư
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {filtered.map(t => (
            <div key={t.id || t.code} onClick={() => setSelectedTutor(t)}
              style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20, cursor: 'pointer', transition: 'border-color .15s, box-shadow .15s' }}
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
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===== BOOKING MODAL ===== */}
      {selectedTutor && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(0,0,0,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
          onClick={() => !bookingSuccess && setSelectedTutor(null)}>
          <div style={{ background: '#fff', borderRadius: 12, maxWidth: 440, width: '100%', padding: 24, position: 'relative' }} onClick={e => e.stopPropagation()}>
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

                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>Đặt lịch thuê gia sư</h3>

                <form onSubmit={handleBook} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>Họ tên phụ huynh *</label>
                    <input required value={studentName} onChange={e => setStudentName(e.target.value)} placeholder="VD: Chị Lan" style={inputStyle} />
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
                    style={{ padding: '12px 0', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <Send size={16} /> Đặt lịch thuê gia sư
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* ===== REQUEST MODAL ===== */}
      {showRequestModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(0,0,0,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
          onClick={() => !requestSuccess && setShowRequestModal(false)}>
          <div style={{ background: '#fff', borderRadius: 12, maxWidth: 440, width: '100%', padding: 24, position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowRequestModal(false)} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><X size={20} /></button>

            {requestSuccess ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <CheckCircle2 size={40} color="#22c55e" style={{ margin: '0 auto 8px', display: 'block' }} />
                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: 16 }}>Đã gửi yêu cầu!</div>
                <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Trung tâm sẽ tìm gia sư phù hợp cho bạn.</p>
              </div>
            ) : (
              <>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>Gửi yêu cầu tìm gia sư</h3>
                <p style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>Trung tâm sẽ tìm GS phù hợp trong 24h.</p>

                <form onSubmit={handleRequest} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <input required value={reqSubject} onChange={e => setReqSubject(e.target.value)} placeholder="Môn học cần tìm GS *" style={inputStyle} />
                  <input value={reqGrade} onChange={e => setReqGrade(e.target.value)} placeholder="Lớp / Trình độ" style={inputStyle} />
                  <input required value={reqLocation} onChange={e => setReqLocation(e.target.value)} placeholder="Khu vực (VD: Cầu Giấy) *" style={inputStyle} />
                  <textarea rows={2} value={reqNotes} onChange={e => setReqNotes(e.target.value)} placeholder="Yêu cầu thêm..." style={{ ...inputStyle, resize: 'none' }} />
                  <button type="submit"
                    style={{ padding: '12px 0', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                    Gửi yêu cầu
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
