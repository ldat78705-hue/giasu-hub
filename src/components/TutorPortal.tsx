import React, { useState } from 'react';
import { TutorItem, ClassMatch, AttendanceRecord, TutorReview, ClassItem } from '../types';
import { GraduationCap, BookOpen, Calendar, DollarSign, Star, CheckCircle2, Clock, XCircle, AlertCircle, LogOut, Search, PhoneOff } from 'lucide-react';

interface TutorPortalProps {
  tutors: TutorItem[];
  matches: ClassMatch[];
  attendance: AttendanceRecord[];
  reviews: TutorReview[];
  classes: ClassItem[];
  onLogout: () => void;
  onReportAbsence?: (record: Omit<AttendanceRecord, 'id'>) => Promise<void>;
}

const fmt = (v: number) => new Intl.NumberFormat('vi-VN').format(v);

export const TutorPortal: React.FC<TutorPortalProps> = ({ tutors, matches, attendance, reviews, classes, onLogout, onReportAbsence }) => {
  const [gsCode, setGsCode] = useState('');
  const [gsPhone, setGsPhone] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [tutor, setTutor] = useState<TutorItem | null>(null);
  const [activeTab, setActiveTab] = useState<'classes' | 'schedule' | 'income' | 'reviews' | 'openClasses'>('classes');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const found = tutors.find(t => t.code.toUpperCase() === gsCode.toUpperCase().trim() && t.phone === gsPhone.trim());
    if (found) {
      setTutor(found);
      setLoggedIn(true);
    } else {
      alert('Không tìm thấy. Vui lòng kiểm tra mã GS và SĐT.');
    }
  };

  if (!loggedIn || !tutor) {
    return (
      <div style={{ maxWidth: 420, margin: '40px auto', padding: 20 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, background: 'linear-gradient(135deg, #2563eb, #7c3aed)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <GraduationCap size={28} color="#fff" />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>Cổng Gia Sư</h1>
          <p style={{ fontSize: 14, color: '#64748b' }}>Đăng nhập bằng mã GS và số điện thoại</p>
        </div>
        <form onSubmit={handleLogin} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Mã gia sư</label>
            <input type="text" value={gsCode} onChange={e => setGsCode(e.target.value)} placeholder="VD: GS001" required
              style={{ width: '100%', padding: '12px 14px', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 15, outline: 'none', background: '#f8fafc' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Số điện thoại</label>
            <input type="tel" value={gsPhone} onChange={e => setGsPhone(e.target.value)} placeholder="0912345678" required
              style={{ width: '100%', padding: '12px 14px', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 15, outline: 'none', background: '#f8fafc' }} />
          </div>
          <button type="submit" style={{ padding: '14px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
            Đăng nhập
          </button>
        </form>
      </div>
    );
  }

  // Logged in data
  const myMatches = matches.filter(m => m.tutorCode === tutor.code);
  const activeMatches = myMatches.filter(m => m.status === 'Đang dạy');
  const myAttendance = attendance.filter(a => a.tutorCode === tutor.code);
  const myReviews = reviews.filter(r => r.tutorCode === tutor.code);
  const avgRating = myReviews.length > 0 ? (myReviews.reduce((s, r) => s + r.rating, 0) / myReviews.length).toFixed(1) : '—';

  // Income this month
  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const monthAttendance = myAttendance.filter(a => a.date.startsWith(thisMonth) && a.status === 'Đã dạy');
  const estimatedIncome = monthAttendance.reduce((s, a) => {
    const match = myMatches.find(m => m.id === a.matchId);
    return s + (match?.fee || 0);
  }, 0);

  // Open classes matching tutor subjects
  const openClasses = classes.filter(c =>
    (c.status === 'ĐANG TÌM' || c.status === 'KHẨN CẤP') &&
    tutor.subjects.some(s => c.subject.toLowerCase().includes(s.toLowerCase()))
  );

  // Week schedule
  const weekDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  const today = new Date();
  const getWeekDates = () => {
    const d = new Date(today);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return Array.from({ length: 7 }, (_, i) => {
      const wd = new Date(d);
      wd.setDate(diff + i);
      return wd;
    });
  };
  const weekDates = getWeekDates();

  const tabs = [
    { id: 'classes' as const, label: 'Lớp đang dạy', icon: <BookOpen size={16} /> },
    { id: 'schedule' as const, label: 'Lịch tuần', icon: <Calendar size={16} /> },
    { id: 'income' as const, label: 'Thu nhập', icon: <DollarSign size={16} /> },
    { id: 'reviews' as const, label: 'Đánh giá', icon: <Star size={16} /> },
    { id: 'openClasses' as const, label: `Lớp phù hợp (${openClasses.length})`, icon: <Search size={16} /> },
  ];

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 20px', paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: tutor.avatarColor || '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 16 }}>
            {tutor.avatar}
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>{tutor.name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748b' }}>
              <span style={{ fontFamily: 'monospace', background: '#f1f5f9', padding: '1px 6px', borderRadius: 4 }}>{tutor.code}</span>
              {tutor.verified ? (
                <span style={{ color: '#16a34a', display: 'flex', alignItems: 'center', gap: 2, fontWeight: 600, fontSize: 11 }}><CheckCircle2 size={12} /> Đã xác minh</span>
              ) : (
                <span style={{ color: '#d97706', display: 'flex', alignItems: 'center', gap: 2, fontWeight: 600, fontSize: 11 }}><Clock size={12} /> Đang xem xét</span>
              )}
            </div>
          </div>
        </div>
        <button onClick={() => { setLoggedIn(false); setTutor(null); onLogout(); }}
          style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '8px 14px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12, fontWeight: 600, color: '#64748b', cursor: 'pointer' }}>
          <LogOut size={14} /> Đăng xuất
        </button>
      </div>

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Lớp đang dạy', value: activeMatches.length, color: '#2563eb' },
          { label: 'Buổi tháng này', value: monthAttendance.length, color: '#16a34a' },
          { label: 'Thu nhập (ước)', value: fmt(estimatedIncome) + 'đ', color: '#f59e0b' },
          { label: 'Đánh giá TB', value: avgRating, color: '#8b5cf6' },
        ].map((s, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 14, textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 10, color: '#64748b', fontWeight: 500, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, overflowX: 'auto', paddingBottom: 4 }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', border: '1px solid', transition: 'all .15s',
              background: activeTab === tab.id ? '#2563eb' : '#fff',
              color: activeTab === tab.id ? '#fff' : '#64748b',
              borderColor: activeTab === tab.id ? '#2563eb' : '#e2e8f0',
            }}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* === Tab Content === */}
      {activeTab === 'classes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {activeMatches.length === 0 ? (
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 32, textAlign: 'center', color: '#94a3b8' }}>
              <BookOpen size={32} style={{ margin: '0 auto 8px', display: 'block' }} />
              <p style={{ fontWeight: 600 }}>Chưa có lớp nào đang dạy</p>
            </div>
          ) : activeMatches.map(m => {
            const matchAtt = myAttendance.filter(a => a.matchId === m.id);
            const taught = matchAtt.filter(a => a.status === 'Đã dạy').length;
            return (
              <div key={m.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>{m.classSubject}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 6, background: '#dcfce7', color: '#16a34a' }}>Đang dạy</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 13, color: '#64748b' }}>
                  <div>📚 {m.classCode}</div>
                  <div>👨‍🎓 {m.studentName || 'N/A'}</div>
                  <div>💰 {fmt(m.fee)}đ/buổi</div>
                  <div>📅 {new Date(m.startDate).toLocaleDateString('vi-VN')}</div>
                  <div>✅ {taught}/{matchAtt.length} buổi đã dạy</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'schedule' && (
        <>
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
          {weekDates.map((wd, i) => {
            const dateStr = wd.toISOString().slice(0, 10);
            const dayAtt = myAttendance.filter(a => a.date === dateStr);
            const isToday = wd.toDateString() === today.toDateString();
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px', borderBottom: '1px solid #f1f5f9', background: isToday ? '#eff6ff' : 'transparent' }}>
                <div style={{ width: 48, textAlign: 'center' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>{weekDays[i]}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: isToday ? '#2563eb' : '#334155' }}>{wd.getDate()}</div>
                </div>
                <div style={{ flex: 1 }}>
                  {dayAtt.length === 0 ? (
                    <span style={{ fontSize: 12, color: '#94a3b8', fontStyle: 'italic' }}>Không có buổi học</span>
                  ) : dayAtt.map((a, j) => (
                    <div key={j} style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      {a.status === 'Đã dạy' ? <CheckCircle2 size={14} color="#16a34a" /> : <XCircle size={14} color="#dc2626" />}
                      <span style={{ fontWeight: 600, color: '#334155' }}>{a.classCode}</span>
                      <span style={{ color: '#64748b' }}>→ {a.studentName}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* F27: Absence report */}
        {onReportAbsence && activeMatches.length > 0 && (
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 16, marginTop: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <PhoneOff size={14} color="#dc2626" />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>Báo nghỉ hôm nay</span>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {activeMatches.map(m => (
                <button key={m.id}
                  onClick={async () => {
                    const dateStr = new Date().toISOString().slice(0, 10);
                    if (!window.confirm(`Xác nhận báo nghỉ lớp ${m.classSubject} ngày hôm nay (${dateStr})?`)) return;
                    await onReportAbsence({
                      matchId: m.id!, classCode: m.classCode, tutorCode: tutor.code,
                      tutorName: tutor.name, studentName: m.studentName || '',
                      date: dateStr, status: 'Nghỉ GS', note: 'GS tự báo nghỉ từ Portal',
                      createdAt: Date.now(),
                    });
                    alert('Báo nghỉ thành công! Admin sẽ được thông báo.');
                  }}
                  style={{ padding: '8px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, fontSize: 12, fontWeight: 600, color: '#dc2626', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <XCircle size={12} /> Nghỉ {m.classSubject}
                </button>
              ))}
            </div>
          </div>
        )}
        </>
      )}

      {activeTab === 'income' && (
        <div>
          <div style={{ background: 'linear-gradient(135deg, #059669, #0d9488)', borderRadius: 16, padding: 28, color: '#fff', marginBottom: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.8, marginBottom: 4 }}>Thu nhập ước tính tháng {now.getMonth() + 1}</div>
            <div style={{ fontSize: 32, fontWeight: 800 }}>{fmt(estimatedIncome)}đ</div>
            <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>{monthAttendance.length} buổi × phí/buổi (100% về gia sư)</div>
          </div>
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 16 }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 12 }}>Chi tiết theo lớp</h4>
            {activeMatches.map(m => {
              const taught = myAttendance.filter(a => a.matchId === m.id && a.date.startsWith(thisMonth) && a.status === 'Đã dạy').length;
              return (
                <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9', fontSize: 13 }}>
                  <span style={{ color: '#334155', fontWeight: 500 }}>{m.classCode} — {m.classSubject}</span>
                  <span style={{ color: '#059669', fontWeight: 700 }}>{taught} buổi × {fmt(m.fee)}đ = {fmt(taught * m.fee)}đ</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'reviews' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {myReviews.length === 0 ? (
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 32, textAlign: 'center', color: '#94a3b8' }}>
              <Star size={32} style={{ margin: '0 auto 8px', display: 'block' }} />
              <p style={{ fontWeight: 600 }}>Chưa có đánh giá nào</p>
            </div>
          ) : myReviews.map(r => (
            <div key={r.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 16 }}>
              <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>
                {[1,2,3,4,5].map(s => <Star key={s} size={14} style={{ color: s <= r.rating ? '#f59e0b' : '#e2e8f0', fill: s <= r.rating ? '#f59e0b' : 'none' }} />)}
              </div>
              <p style={{ fontSize: 14, color: '#334155', marginBottom: 8, fontStyle: 'italic' }}>"{r.comment || 'Không có nhận xét'}"</p>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>PH: {r.parentName} · {new Date(r.createdAt).toLocaleDateString('vi-VN')}</div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'openClasses' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {openClasses.length === 0 ? (
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 32, textAlign: 'center', color: '#94a3b8' }}>
              <AlertCircle size={32} style={{ margin: '0 auto 8px', display: 'block' }} />
              <p style={{ fontWeight: 600 }}>Không có lớp phù hợp với môn bạn dạy</p>
            </div>
          ) : openClasses.map(cls => (
            <div key={cls.id || cls.code} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{cls.subject}</span>
                <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: cls.status === 'KHẨN CẤP' ? '#fef2f2' : '#fffbeb', color: cls.status === 'KHẨN CẤP' ? '#dc2626' : '#d97706' }}>{cls.status}</span>
              </div>
              {cls.studentInfo && <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>{cls.studentInfo}</div>}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748b', borderTop: '1px solid #f1f5f9', paddingTop: 8 }}>
                <span>📍 {cls.location}</span>
                <span style={{ fontWeight: 700, color: '#2563eb' }}>{fmt(cls.fee)}đ/buổi</span>
              </div>
              {cls.schedule && <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>🕐 {cls.schedule}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
