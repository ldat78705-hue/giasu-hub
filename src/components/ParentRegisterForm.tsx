import React, { useState } from 'react';
import { ParentRegistration } from '../types';
import { CheckCircle2, Phone, Send, BookOpen } from 'lucide-react';

interface ParentRegisterFormProps {
  onSubmit: (reg: ParentRegistration) => Promise<void>;
  zaloNumber?: string;
  wards: string[];
}

const SUBJECTS = ['Toán', 'Tiếng Anh', 'Ngữ Văn', 'Vật Lý', 'Hóa Học', 'Sinh Học', 'IELTS', 'Tin Học', 'Luyện thi vào 10', 'Luyện thi ĐH'];
const GRADES = ['Lớp 1-5', 'Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9', 'Lớp 10', 'Lớp 11', 'Lớp 12', 'Đại học', 'Người đi làm'];
const MODES = [
  { value: 'Tại nhà' as const, icon: '🏠', label: 'Trực tiếp' },
  { value: 'Online' as const, icon: '💻', label: 'Trực tuyến' },
  { value: 'Cả hai' as const, icon: '🔄', label: 'Cả hai' },
];

const inp: React.CSSProperties = { width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, outline: 'none', background: '#f8fafc' };
const lbl: React.CSSProperties = { display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 };

export const ParentRegisterForm: React.FC<ParentRegisterFormProps> = ({ onSubmit, zaloNumber, wards }) => {
  const [parentName, setParentName] = useState('');
  const [phone, setPhone] = useState('');
  const [studentName, setStudentName] = useState('');
  const [grade, setGrade] = useState('Lớp 12');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [district, setDistrict] = useState('');
  const [mode, setMode] = useState<'Tại nhà' | 'Online' | 'Cả hai'>('Tại nhà');
  const [schedule, setSchedule] = useState('');
  const [note, setNote] = useState('');
  const [wardSearch, setWardSearch] = useState('');
  const [source, setSource] = useState<'Zalo' | 'Facebook' | 'Google' | 'Giới thiệu' | 'Website' | 'Khác'>('Website');
  const [referralCode, setReferralCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const toggleSubject = (sub: string) => {
    setSelectedSubjects(prev => prev.includes(sub) ? prev.filter(s => s !== sub) : [...prev, sub]);
  };

  const filteredWards = wards.filter(w => !wardSearch || w.toLowerCase().includes(wardSearch.toLowerCase()));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentName || !phone || selectedSubjects.length === 0) return;
    setIsSubmitting(true);
    try {
      await onSubmit({ parentName, phone, studentName, grade, subjects: selectedSubjects, district, mode, schedule, note, source, referralCode: referralCode || undefined, createdAt: Date.now(), status: 'Mới' });
      setSuccess(true);
    } catch (err) { console.error(err); }
    finally { setIsSubmitting(false); }
  };

  if (success) {
    return (
      <div style={{ paddingBottom: 80 }}>
        <div style={{ background: '#fff', border: '1px solid #d1fae5', borderRadius: 12, padding: '40px 24px', textAlign: 'center' }}>
          <CheckCircle2 size={48} color="#22c55e" style={{ margin: '0 auto 12px', display: 'block' }} />
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Đăng ký thành công!</h2>
          <p style={{ fontSize: 14, color: '#64748b', marginBottom: 20 }}>Trung tâm sẽ liên hệ trong <b>30 phút</b> để tư vấn và sắp xếp gia sư phù hợp.</p>
          {zaloNumber && (
            <a href={`https://zalo.me/${zaloNumber}`} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', background: '#2563eb', color: '#fff', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
              <Phone size={16} /> Liên hệ Zalo ngay
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#f0fdf4', color: '#16a34a', padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, marginBottom: 12 }}>
          <BookOpen size={14} /> Dành cho phụ huynh
        </div>
        <h1 style={{ fontSize: 'clamp(22px, 4vw, 28px)', fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>Đăng ký tìm gia sư</h1>
        <p style={{ fontSize: 14, color: '#64748b' }}>Miễn phí · Tư vấn trong 30 phút · Học thử 1-2 buổi</p>
      </div>

      <form onSubmit={handleSubmit} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* PH info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><label style={lbl}>Họ tên phụ huynh *</label><input required value={parentName} onChange={e => setParentName(e.target.value)} placeholder="VD: Chị Lan" style={inp} /></div>
            <div><label style={lbl}>Số điện thoại *</label><input required type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="0912345678" style={inp} /></div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><label style={lbl}>Tên học sinh</label><input value={studentName} onChange={e => setStudentName(e.target.value)} placeholder="VD: Minh" style={inp} /></div>
            <div>
              <label style={lbl}>Lớp / Trình độ</label>
              <select value={grade} onChange={e => setGrade(e.target.value)} style={inp}>
                {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>

          {/* Môn học */}
          <div>
            <label style={lbl}>Môn học cần tìm GS * (chọn nhiều)</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {SUBJECTS.map(sub => (
                <button key={sub} type="button" onClick={() => toggleSubject(sub)}
                  style={{ padding: '5px 12px', borderRadius: 16, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: '1px solid', background: selectedSubjects.includes(sub) ? '#2563eb' : '#fff', color: selectedSubjects.includes(sub) ? '#fff' : '#475569', borderColor: selectedSubjects.includes(sub) ? '#2563eb' : '#e2e8f0' }}>
                  {sub}
                </button>
              ))}
            </div>
          </div>

          {/* Hình thức học */}
          <div>
            <label style={lbl}>Hình thức học *</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {MODES.map(m => (
                <button key={m.value} type="button" onClick={() => setMode(m.value)}
                  style={{ padding: '10px 8px', borderRadius: 8, border: '1px solid', cursor: 'pointer', textAlign: 'center', fontSize: 12, fontWeight: 600, background: mode === m.value ? '#eff6ff' : '#fff', borderColor: mode === m.value ? '#2563eb' : '#e2e8f0', color: mode === m.value ? '#2563eb' : '#475569' }}>
                  <div style={{ fontSize: 18, marginBottom: 2 }}>{m.icon}</div>
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Khu vực */}
          {(mode === 'Tại nhà' || mode === 'Cả hai') && (
            <div>
              <label style={lbl}>Khu vực (chọn xã/phường)</label>
              <input value={wardSearch} onChange={e => setWardSearch(e.target.value)} placeholder="Tìm xã/phường..." style={{ ...inp, marginBottom: 6 }} />
              <div style={{ maxHeight: 120, overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: 8, padding: 6 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {filteredWards.slice(0, 30).map(w => (
                    <button key={w} type="button" onClick={() => setDistrict(w)}
                      style={{ padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 500, cursor: 'pointer', border: '1px solid', background: district === w ? '#2563eb' : '#fff', color: district === w ? '#fff' : '#475569', borderColor: district === w ? '#2563eb' : '#e2e8f0' }}>
                      {w}
                    </button>
                  ))}
                </div>
              </div>
              {district && <div style={{ fontSize: 11, color: '#2563eb', fontWeight: 600, marginTop: 4 }}>Đã chọn: {district}</div>}
            </div>
          )}

          {/* Lịch học */}
          <div><label style={lbl}>Lịch học mong muốn</label><input value={schedule} onChange={e => setSchedule(e.target.value)} placeholder="VD: Thứ 3, 5, 7 tối 19h-21h" style={inp} /></div>

          {/* Nguồn & Giới thiệu */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={lbl}>Biết đến qua *</label>
              <select value={source} onChange={e => setSource(e.target.value as typeof source)} style={inp}>
                <option value="Website">Website</option>
                <option value="Zalo">Zalo</option>
                <option value="Facebook">Facebook</option>
                <option value="Google">Google tìm kiếm</option>
                <option value="Giới thiệu">Người giới thiệu</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
            <div>
              <label style={lbl}>Mã giới thiệu (nếu có)</label>
              <input value={referralCode} onChange={e => setReferralCode(e.target.value)} placeholder="VD: PH001" style={inp} />
            </div>
          </div>

          {/* Ghi chú */}
          <div><label style={lbl}>Ghi chú thêm</label><textarea rows={2} value={note} onChange={e => setNote(e.target.value)} placeholder="Yêu cầu đặc biệt..." style={{ ...inp, resize: 'none' }} /></div>
        </div>

        <button type="submit" disabled={isSubmitting}
          style={{ marginTop: 20, width: '100%', padding: '14px 0', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: isSubmitting ? 'wait' : 'pointer', opacity: isSubmitting ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <Send size={16} /> {isSubmitting ? 'Đang gửi...' : 'Đăng ký tìm gia sư'}
        </button>

        {zaloNumber && (
          <div style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: '#64748b' }}>
            Hoặc liên hệ trực tiếp: <a href={`tel:${zaloNumber}`} style={{ fontWeight: 700, color: '#2563eb', textDecoration: 'none' }}>{zaloNumber}</a>
          </div>
        )}
      </form>
    </div>
  );
};
