import React, { useState } from 'react';
import { TutorItem, ParentRegistration, ClassMatch, AttendanceRecord } from '../types';
import { Search, CheckCircle2, Clock, ShieldCheck, AlertCircle, Phone, BookOpen, GraduationCap, XCircle, Calendar, Users, Star } from 'lucide-react';

interface StatusLookupProps {
  tutors: TutorItem[];
  registrations: ParentRegistration[];
  matches?: ClassMatch[];
  attendance?: AttendanceRecord[];
  zaloNumber?: string;
}

const inp: React.CSSProperties = { width: '100%', padding: '12px 16px', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 15, outline: 'none', background: '#f8fafc' };

export const StatusLookup: React.FC<StatusLookupProps> = ({ tutors, registrations, matches = [], attendance = [], zaloNumber }) => {
  const [phone, setPhone] = useState('');
  const [searched, setSearched] = useState(false);
  const [foundTutors, setFoundTutors] = useState<TutorItem[]>([]);
  const [foundRegs, setFoundRegs] = useState<ParentRegistration[]>([]);
  const [foundMatches, setFoundMatches] = useState<ClassMatch[]>([]);
  const [foundAttendance, setFoundAttendance] = useState<AttendanceRecord[]>([]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 3) return;
    const cleaned = phone.replace(/\s/g, '');
    const isGsCode = cleaned.toUpperCase().startsWith('GS');
    if (isGsCode) {
      // Search by GS code
      setFoundTutors(tutors.filter(t => t.code.toUpperCase() === cleaned.toUpperCase()));
      setFoundRegs([]);
      const tutorMatches = matches.filter(m => m.tutorCode.toUpperCase() === cleaned.toUpperCase());
      setFoundMatches(tutorMatches);
      setFoundAttendance(attendance.filter(a => a.tutorCode.toUpperCase() === cleaned.toUpperCase()));
    } else {
      // Search by phone
      setFoundTutors(tutors.filter(t => t.phone === cleaned));
      setFoundRegs(registrations.filter(r => r.phone === cleaned));
      setFoundMatches(matches.filter(m => m.parentPhone === cleaned));
      setFoundAttendance(attendance.filter(a => {
        const matchForA = matches.find(m => m.id === a.matchId);
        return matchForA?.parentPhone === cleaned;
      }));
    }
    setSearched(true);
  };

  const formatDate = (ts: number) => new Date(ts).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const fmt = (v: number) => new Intl.NumberFormat('vi-VN').format(v);

  return (
    <div style={{ paddingBottom: 80 }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fef3c7', color: '#d97706', padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, marginBottom: 12 }}>
          <Search size={14} /> Tra cứu trạng thái
        </div>
        <h1 style={{ fontSize: 'clamp(22px, 4vw, 28px)', fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>Tra cứu & Theo dõi</h1>
        <p style={{ fontSize: 14, color: '#64748b' }}>Nhập SĐT hoặc mã gia sư (VD: GS001) để xem đơn đăng ký, gia sư, lịch học.</p>
      </div>

      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <form onSubmit={handleSearch} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24, marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8 }}>Số điện thoại hoặc Mã gia sư</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder="0912345678 hoặc GS001" style={{ ...inp, flex: 1 }} required />
            <button type="submit" style={{ padding: '12px 24px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
              <Search size={16} /> Tra cứu
            </button>
          </div>
        </form>

        {/* Results */}
        {searched && (
          <div>
            {foundTutors.length === 0 && foundRegs.length === 0 ? (
              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '32px 24px', textAlign: 'center' }}>
                <XCircle size={36} style={{ color: '#94a3b8', margin: '0 auto 8px', display: 'block' }} />
                <p style={{ fontSize: 15, fontWeight: 600, color: '#334155', marginBottom: 4 }}>Không tìm thấy</p>
                <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 16 }}>Không có đơn đăng ký nào với số điện thoại này.</p>
                {zaloNumber && (
                  <a href={`https://zalo.me/${zaloNumber}`} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#2563eb', color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                    <Phone size={14} /> Liên hệ trung tâm
                  </a>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* Tutor registrations */}
                {foundTutors.map(t => (
                  <div key={t.id || t.code} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                      <GraduationCap size={18} color="#2563eb" />
                      <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Đăng ký gia sư</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                        <span style={{ color: '#64748b' }}>Họ tên</span>
                        <span style={{ fontWeight: 600, color: '#0f172a' }}>{t.name}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                        <span style={{ color: '#64748b' }}>Mã</span>
                        <span style={{ fontWeight: 600, color: '#0f172a', fontFamily: 'monospace' }}>{t.code}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                        <span style={{ color: '#64748b' }}>Môn dạy</span>
                        <span style={{ fontWeight: 600, color: '#0f172a' }}>{t.subjects.join(', ')}</span>
                      </div>
                      {t.registeredAt && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                          <span style={{ color: '#64748b' }}>Ngày đăng ký</span>
                          <span style={{ fontWeight: 500, color: '#475569' }}>{formatDate(t.registeredAt)}</span>
                        </div>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, paddingTop: 8, borderTop: '1px solid #f1f5f9' }}>
                        <span style={{ color: '#64748b' }}>Trạng thái</span>
                        {t.verified ? (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 12px', background: '#dcfce7', color: '#16a34a', borderRadius: 6, fontWeight: 700, fontSize: 12 }}>
                            <CheckCircle2 size={14} /> Đã xác minh ✓
                          </span>
                        ) : (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 12px', background: '#fef3c7', color: '#d97706', borderRadius: 6, fontWeight: 700, fontSize: 12 }}>
                            <Clock size={14} /> Đang xem xét
                          </span>
                        )}
                      </div>
                    </div>
                    {!t.verified && (
                      <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: 12, marginTop: 12, fontSize: 12, color: '#1e40af' }}>
                        <AlertCircle size={12} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 4 }} />
                        Hồ sơ đang được xem xét. Trung tâm sẽ liên hệ trong vòng 24 giờ.
                      </div>
                    )}
                  </div>
                ))}

                {/* Parent registrations */}
                {foundRegs.map((r, i) => (
                  <div key={r.id || i} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                      <BookOpen size={18} color="#16a34a" />
                      <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Đăng ký tìm gia sư</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                        <span style={{ color: '#64748b' }}>Phụ huynh</span>
                        <span style={{ fontWeight: 600, color: '#0f172a' }}>{r.parentName}</span>
                      </div>
                      {r.studentName && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                          <span style={{ color: '#64748b' }}>Học sinh</span>
                          <span style={{ fontWeight: 600, color: '#0f172a' }}>{r.studentName}</span>
                        </div>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                        <span style={{ color: '#64748b' }}>Môn học</span>
                        <span style={{ fontWeight: 600, color: '#0f172a' }}>{r.subjects.join(', ')}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                        <span style={{ color: '#64748b' }}>Ngày đăng ký</span>
                        <span style={{ fontWeight: 500, color: '#475569' }}>{formatDate(r.createdAt)}</span>
                      </div>
                      {/* Trial info */}
                      {r.trialDate && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, background: '#f5f3ff', padding: '6px 10px', borderRadius: 6, marginTop: 4 }}>
                          <span style={{ color: '#7c3aed', fontWeight: 600 }}>📅 Học thử</span>
                          <span style={{ fontWeight: 600, color: '#7c3aed' }}>{r.trialDate} {r.trialTime || ''} {r.trialStatus ? `· ${r.trialStatus}` : ''}</span>
                        </div>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, paddingTop: 8, borderTop: '1px solid #f1f5f9' }}>
                        <span style={{ color: '#64748b' }}>Trạng thái</span>
                        <span style={{
                          padding: '4px 12px', borderRadius: 6, fontWeight: 700, fontSize: 12,
                          background: r.status === 'Đã xếp lớp' ? '#dcfce7' : r.status === 'Đã liên hệ' ? '#dbeafe' : r.status === 'Hủy' ? '#fef2f2' : '#fef3c7',
                          color: r.status === 'Đã xếp lớp' ? '#16a34a' : r.status === 'Đã liên hệ' ? '#2563eb' : r.status === 'Hủy' ? '#dc2626' : '#d97706',
                        }}>
                          {r.status === 'Mới' ? '⏳ Đang xử lý' : r.status === 'Đã liên hệ' ? '📞 Đã liên hệ' : r.status === 'Đã xếp lớp' ? '✅ Đã xếp lớp' : '❌ Đã hủy'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Feature 7: Active matches for this parent */}
                {foundMatches.length > 0 && (
                  <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                      <Users size={18} color="#8b5cf6" />
                      <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Gia sư đang dạy</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {foundMatches.map(m => {
                        const matchAttendance = foundAttendance.filter(a => a.matchId === m.id);
                        const totalSessions = matchAttendance.length;
                        const completedSessions = matchAttendance.filter(a => a.status === 'Đã dạy').length;
                        return (
                          <div key={m.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: 14 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                              <span style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{m.classSubject}</span>
                              <span style={{
                                padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700,
                                background: m.status === 'Đang dạy' ? '#dcfce7' : '#e2e8f0',
                                color: m.status === 'Đang dạy' ? '#16a34a' : '#64748b',
                              }}>{m.status}</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, color: '#64748b' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Gia sư</span>
                                <span style={{ fontWeight: 600, color: '#0f172a' }}>{m.tutorName}</span>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Học phí</span>
                                <span style={{ fontWeight: 600, color: '#2563eb' }}>{fmt(m.fee)}đ/buổi</span>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Bắt đầu</span>
                                <span>{new Date(m.startDate).toLocaleDateString('vi-VN')}</span>
                              </div>
                              {totalSessions > 0 && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 6, borderTop: '1px solid #e2e8f0', marginTop: 4 }}>
                                  <span>Điểm danh</span>
                                  <span style={{ fontWeight: 600, color: '#16a34a' }}>{completedSessions}/{totalSessions} buổi đã dạy</span>
                                </div>
                              )}
                            </div>
                            {/* Last attendance feedback */}
                            {matchAttendance.length > 0 && matchAttendance[0].tutorFeedback && (
                              <div style={{ marginTop: 8, background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: 6, padding: 8, fontSize: 11, color: '#7c3aed' }}>
                                <strong>Nhận xét GS (buổi gần nhất):</strong> {matchAttendance[0].tutorFeedback}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
