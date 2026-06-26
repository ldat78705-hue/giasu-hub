import React, { useState, useRef } from 'react';
import { TutorItem, EmergencyContact } from '../types';
import { GraduationCap, CheckCircle2, Send, ShieldCheck, AlertCircle, UserCheck, FileText, X, User, Upload, Plus, Trash2 } from 'lucide-react';

interface RegisterTutorPublicProps {
  onRegisterProfile: (tutor: TutorItem) => Promise<void>;
  cloudinaryCloudName: string;
  cloudinaryPreset: string;
  wards: string[];
}

const SUBJECTS = [
  'Toán', 'Ngữ Văn', 'Tiếng Anh', 'Vật Lý', 'Hóa Học', 'Sinh Học',
  'Lịch Sử', 'Địa Lý', 'GDCD', 'Tin Học',
  'IELTS', 'TOEIC', 'Tiếng Nhật', 'Tiếng Trung', 'Tiếng Hàn',
  'Piano', 'Guitar', 'Vẽ', 'Tiếng Việt (cho người nước ngoài)',
];
const GRADE_LEVELS = [
  'Tiểu học (1-5)', 'Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9',
  'Lớp 10', 'Lớp 11', 'Lớp 12',
  'Luyện thi vào 10', 'Luyện thi ĐH/ĐGNL', 'Đại học', 'Người đi làm',
];
const SCHEDULES = ['Sáng (7h-12h)', 'Chiều (13h-17h)', 'Tối (18h-21h)', 'Cả ngày'];
const TEACH_MODES = [
  { value: 'Tại nhà', icon: '🏠', label: 'Trực tiếp (tại nhà)' },
  { value: 'Online', icon: '💻', label: 'Trực tuyến (online)' },
  { value: 'Cả hai', icon: '🔄', label: 'Cả hai hình thức' },
];
const COLORS = ['bg-blue-500', 'bg-purple-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-indigo-500'];

async function uploadToCloudinary(file: File, cloudName: string, preset: string): Promise<string> {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', preset);
  fd.append('folder', 'giasu-thanhdat/tutors');
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body: fd });
  if (!res.ok) throw new Error('Upload failed');
  return (await res.json()).secure_url;
}

const inp: React.CSSProperties = { width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, outline: 'none', background: '#f8fafc' };
const lbl: React.CSSProperties = { display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 };

export const RegisterTutorPublic: React.FC<RegisterTutorPublicProps> = ({
  onRegisterProfile, cloudinaryCloudName, cloudinaryPreset, wards,
}) => {
  const [step, setStep] = useState(1);

  // Step 1: Thông tin cá nhân
  const [regName, setRegName] = useState('');
  const [regGender, setRegGender] = useState<'Nam' | 'Nữ'>('Nam');
  const [regDob, setRegDob] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regQual, setRegQual] = useState('');
  const [regExp, setRegExp] = useState('');
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);

  // Step 2: Chuyên môn
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [selectedSchedules, setSelectedSchedules] = useState<string[]>([]);
  const [teachMode, setTeachMode] = useState('Cả hai');
  const [wardSearch, setWardSearch] = useState('');
  const [regRate, setRegRate] = useState(200000);
  const [regIntro, setRegIntro] = useState('');

  // Step 3: Hồ sơ đính kèm — CCCD 2 mặt, nhiều bằng cấp, file khác
  const [cccdFront, setCccdFront] = useState<File | null>(null);
  const [cccdBack, setCccdBack] = useState<File | null>(null);
  const [cccdFrontPreview, setCccdFrontPreview] = useState('');
  const [cccdBackPreview, setCccdBackPreview] = useState('');
  const [degreeFiles, setDegreeFiles] = useState<{ file: File; preview: string }[]>([]);
  const [otherFiles, setOtherFiles] = useState<{ file: File; preview: string; label: string }[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');

  const cccdFrontRef = useRef<HTMLInputElement>(null);
  const cccdBackRef = useRef<HTMLInputElement>(null);
  const degreeRef = useRef<HTMLInputElement>(null);
  const otherRef = useRef<HTMLInputElement>(null);

  const hasCloudinary = !!cloudinaryCloudName && !!cloudinaryPreset;

  const toggle = (list: string[], setter: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    setter(prev => prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]);
  };

  const handleFileSelect = (file: File | null, setter: (f: File | null) => void, previewSetter: (s: string) => void) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { alert('File quá lớn (tối đa 10MB)'); return; }
    setter(file);
    previewSetter(URL.createObjectURL(file));
  };

  const addDegreeFile = (file: File | null) => {
    if (!file || file.size > 10 * 1024 * 1024) return;
    setDegreeFiles(prev => [...prev, { file, preview: URL.createObjectURL(file) }]);
  };

  const addOtherFile = (file: File | null) => {
    if (!file || file.size > 10 * 1024 * 1024) return;
    setOtherFiles(prev => [...prev, { file, preview: URL.createObjectURL(file), label: '' }]);
  };

  const addEmergency = () => setEmergencyContacts(prev => [...prev, { name: '', phone: '', relation: '' }]);
  const updateEmergency = (i: number, field: keyof EmergencyContact, val: string) => {
    setEmergencyContacts(prev => prev.map((c, idx) => idx === i ? { ...c, [field]: val } : c));
  };
  const removeEmergency = (i: number) => setEmergencyContacts(prev => prev.filter((_, idx) => idx !== i));

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regPhone || selectedSubjects.length === 0) return;
    if ((teachMode === 'Tại nhà' || teachMode === 'Cả hai') && selectedAreas.length === 0) return;
    setIsSubmitting(true);

    try {
      const tutorCode = `GS${Math.floor(100 + Math.random() * 900)}`;
      const documentUrls: TutorItem['documentUrls'] = {};

      if (hasCloudinary) {
        if (cccdFront) {
          setUploadProgress('Đang tải CCCD mặt trước...');
          documentUrls.cccdFrontUrl = await uploadToCloudinary(cccdFront, cloudinaryCloudName, cloudinaryPreset);
        }
        if (cccdBack) {
          setUploadProgress('Đang tải CCCD mặt sau...');
          documentUrls.cccdBackUrl = await uploadToCloudinary(cccdBack, cloudinaryCloudName, cloudinaryPreset);
        }
        if (degreeFiles.length > 0) {
          documentUrls.degreeUrls = [];
          for (let i = 0; i < degreeFiles.length; i++) {
            setUploadProgress(`Đang tải bằng cấp ${i + 1}/${degreeFiles.length}...`);
            const url = await uploadToCloudinary(degreeFiles[i].file, cloudinaryCloudName, cloudinaryPreset);
            documentUrls.degreeUrls.push(url);
          }
        }
        if (otherFiles.length > 0) {
          documentUrls.otherUrls = [];
          for (let i = 0; i < otherFiles.length; i++) {
            setUploadProgress(`Đang tải file khác ${i + 1}/${otherFiles.length}...`);
            const url = await uploadToCloudinary(otherFiles[i].file, cloudinaryCloudName, cloudinaryPreset);
            documentUrls.otherUrls.push(url);
          }
        }
      }
      setUploadProgress('Đang gửi hồ sơ...');

      const parts = regName.trim().split(' ');
      const initials = parts.length > 1 ? `${parts[0][0]}${parts[parts.length - 1][0]}` : parts[0].slice(0, 2);

      await onRegisterProfile({
        code: tutorCode, name: regName, subjects: selectedSubjects, gradeLevels: selectedGrades,
        qualification: regQual || '', experience: regExp || '', hourlyRate: Number(regRate) || 200000,
        rating: 5.0, status: 'offline', verified: false, registeredAt: Date.now(),
        avatar: initials.toUpperCase(), avatarColor: COLORS[Math.floor(Math.random() * COLORS.length)],
        phone: regPhone, email: regEmail, area: `${regAddress} | ${teachMode}`,
        teachingAreas: selectedAreas,
        emergencyContacts: emergencyContacts.filter(c => c.name && c.phone),
        documentUrls: Object.keys(documentUrls).length > 0 ? documentUrls : undefined,
      });
      setRegSuccess(true);
    } catch (err) {
      console.error('Register failed:', err);
      alert('Đã xảy ra lỗi. Vui lòng thử lại.');
    } finally { setIsSubmitting(false); setUploadProgress(''); }
  };

  const isStep1Valid = !!regName && !!regPhone;
  const isStep2Valid = selectedSubjects.length > 0 && (teachMode === 'Online' || selectedAreas.length > 0);

  const filteredWards = wards.filter(w => !wardSearch || w.toLowerCase().includes(wardSearch.toLowerCase()));

  // ===== SUCCESS =====
  if (regSuccess) {
    return (
      <div style={{ paddingBottom: 80 }}>
        <div style={{ maxWidth: 480, margin: '0 auto', background: '#fff', border: '1px solid #d1fae5', borderRadius: 12, padding: '40px 24px', textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, background: '#fef3c7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <ShieldCheck size={28} color="#d97706" />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Đăng ký thành công!</h2>
          <p style={{ fontSize: 14, color: '#64748b', marginBottom: 20 }}>Hồ sơ đang được <b>xem xét và xác minh</b>.</p>
          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, padding: 16, textAlign: 'left' }}>
            {[
              { icon: <AlertCircle size={14} />, text: 'Thời gian xác minh: trong vòng 24 giờ' },
              { icon: <UserCheck size={14} />, text: 'Hồ sơ hiển thị công khai sau khi xác minh' },
              { icon: <FileText size={14} />, text: 'CCCD & bằng cấp được bảo mật, chỉ admin xem' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#92400e', marginBottom: i < 2 ? 8 : 0 }}>
                {item.icon} <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#eff6ff', color: '#2563eb', padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, marginBottom: 12 }}>
          <GraduationCap size={14} /> Cổng đăng ký dành cho gia sư
        </div>
        <h1 style={{ fontSize: 'clamp(22px, 4vw, 28px)', fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>Đăng ký làm gia sư</h1>
        <p style={{ fontSize: 14, color: '#64748b' }}>Thu nhập cao, lịch linh hoạt. Hồ sơ xác minh bởi trung tâm.</p>
      </div>

      {/* Stepper */}
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
          {[{ n: 1, l: 'Thông tin' }, { n: 2, l: 'Chuyên môn' }, { n: 3, l: 'Hồ sơ' }].map((s, i) => (
            <React.Fragment key={s.n}>
              {i > 0 && <div style={{ width: 24, height: 2, borderRadius: 2, background: step >= s.n ? '#2563eb' : '#e2e8f0' }} />}
              <button onClick={() => { if (s.n <= step || (s.n === 2 && isStep1Valid) || (s.n === 3 && isStep1Valid && isStep2Valid)) setStep(s.n); }}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: 'none', background: step === s.n ? '#2563eb' : step > s.n ? '#dbeafe' : '#f1f5f9', color: step === s.n ? '#fff' : step > s.n ? '#2563eb' : '#94a3b8' }}>
                <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800 }}>
                  {step > s.n ? '✓' : s.n}
                </span>
                {s.l}
              </button>
            </React.Fragment>
          ))}
        </div>

        <form onSubmit={handleRegister}>
          {/* ===== STEP 1: Thông tin cá nhân ===== */}
          {step === 1 && (
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
                <User size={16} color="#2563eb" /> Thông tin cá nhân
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div><label style={lbl}>Họ và tên đầy đủ *</label><input required value={regName} onChange={e => setRegName(e.target.value)} placeholder="Nguyễn Văn A" style={inp} /></div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={lbl}>Giới tính</label>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {(['Nam', 'Nữ'] as const).map(g => (
                        <button key={g} type="button" onClick={() => setRegGender(g)}
                          style={{ flex: 1, padding: '8px 0', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: '1px solid', background: regGender === g ? '#2563eb' : '#fff', color: regGender === g ? '#fff' : '#475569', borderColor: regGender === g ? '#2563eb' : '#e2e8f0' }}>
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div><label style={lbl}>Năm sinh</label><input type="number" value={regDob} onChange={e => setRegDob(e.target.value)} placeholder="VD: 2001" min="1970" max="2010" style={inp} /></div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div><label style={lbl}>Số điện thoại *</label><input required type="tel" value={regPhone} onChange={e => setRegPhone(e.target.value)} placeholder="0912345678" style={inp} /></div>
                  <div><label style={lbl}>Email</label><input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} placeholder="email@gmail.com" style={inp} /></div>
                </div>

                <div><label style={lbl}>Nơi ở hiện tại</label><input value={regAddress} onChange={e => setRegAddress(e.target.value)} placeholder="VD: Số 5 ngõ 120 Trần Cung, Cầu Giấy" style={inp} /></div>
                <div><label style={lbl}>Trường / Bằng cấp / Trình độ</label><input value={regQual} onChange={e => setRegQual(e.target.value)} placeholder="VD: Cử nhân ĐHSP Hà Nội / SV năm 4 ĐH Bách Khoa" style={inp} /></div>
                <div><label style={lbl}>Kinh nghiệm giảng dạy</label><input value={regExp} onChange={e => setRegExp(e.target.value)} placeholder="VD: 3 năm dạy kèm Toán cấp 3" style={inp} /></div>

                {/* SĐT người thân */}
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <label style={{ ...lbl, marginBottom: 0 }}>Số điện thoại người thân (liên hệ khi cần)</label>
                    <button type="button" onClick={addEmergency}
                      style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', background: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                      <Plus size={12} /> Thêm
                    </button>
                  </div>
                  {emergencyContacts.map((c, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 100px 30px', gap: 6, marginBottom: 6, alignItems: 'center' }}>
                      <input value={c.name} onChange={e => updateEmergency(i, 'name', e.target.value)} placeholder="Họ tên" style={{ ...inp, padding: '8px 10px', fontSize: 13 }} />
                      <input value={c.phone} onChange={e => updateEmergency(i, 'phone', e.target.value)} placeholder="SĐT" type="tel" style={{ ...inp, padding: '8px 10px', fontSize: 13 }} />
                      <select value={c.relation} onChange={e => updateEmergency(i, 'relation', e.target.value)}
                        style={{ ...inp, padding: '8px 6px', fontSize: 12 }}>
                        <option value="">Quan hệ</option>
                        {['Bố', 'Mẹ', 'Anh/Chị', 'Bác', 'Chú', 'Vợ/Chồng', 'Khác'].map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                      <button type="button" onClick={() => removeEmergency(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={14} /></button>
                    </div>
                  ))}
                </div>
              </div>

              <button type="button" onClick={() => { if (isStep1Valid) setStep(2); }}
                style={{ marginTop: 20, width: '100%', padding: '12px 0', background: isStep1Valid ? '#2563eb' : '#94a3b8', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: isStep1Valid ? 'pointer' : 'not-allowed' }}>
                Tiếp theo: Chuyên môn →
              </button>
            </div>
          )}

          {/* ===== STEP 2: Chuyên môn ===== */}
          {step === 2 && (
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>📚 Chuyên môn & Khu vực</h3>

              {/* Hình thức dạy */}
              <div style={{ marginBottom: 16 }}>
                <label style={lbl}>Hình thức dạy *</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  {TEACH_MODES.map(m => (
                    <button key={m.value} type="button" onClick={() => setTeachMode(m.value)}
                      style={{ padding: '10px 8px', borderRadius: 8, border: '1px solid', cursor: 'pointer', textAlign: 'center', fontSize: 12, fontWeight: 600, background: teachMode === m.value ? '#eff6ff' : '#fff', borderColor: teachMode === m.value ? '#2563eb' : '#e2e8f0', color: teachMode === m.value ? '#2563eb' : '#475569' }}>
                      <div style={{ fontSize: 18, marginBottom: 2 }}>{m.icon}</div>
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Môn dạy */}
              <div style={{ marginBottom: 16 }}>
                <label style={lbl}>Môn dạy * (chọn nhiều)</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {SUBJECTS.map(sub => (
                    <button key={sub} type="button" onClick={() => toggle(selectedSubjects, setSelectedSubjects, sub)}
                      style={{ padding: '5px 12px', borderRadius: 16, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: '1px solid', background: selectedSubjects.includes(sub) ? '#2563eb' : '#fff', color: selectedSubjects.includes(sub) ? '#fff' : '#475569', borderColor: selectedSubjects.includes(sub) ? '#2563eb' : '#e2e8f0' }}>
                      {sub}
                    </button>
                  ))}
                </div>
              </div>

              {/* Khối lớp */}
              <div style={{ marginBottom: 16 }}>
                <label style={lbl}>Khối lớp dạy (chọn nhiều)</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {GRADE_LEVELS.map(g => (
                    <button key={g} type="button" onClick={() => toggle(selectedGrades, setSelectedGrades, g)}
                      style={{ padding: '5px 12px', borderRadius: 16, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: '1px solid', background: selectedGrades.includes(g) ? '#7c3aed' : '#fff', color: selectedGrades.includes(g) ? '#fff' : '#475569', borderColor: selectedGrades.includes(g) ? '#7c3aed' : '#e2e8f0' }}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lịch dạy */}
              <div style={{ marginBottom: 16 }}>
                <label style={lbl}>Lịch có thể dạy</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {SCHEDULES.map(s => (
                    <button key={s} type="button" onClick={() => toggle(selectedSchedules, setSelectedSchedules, s)}
                      style={{ padding: '5px 12px', borderRadius: 16, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: '1px solid', background: selectedSchedules.includes(s) ? '#059669' : '#fff', color: selectedSchedules.includes(s) ? '#fff' : '#475569', borderColor: selectedSchedules.includes(s) ? '#059669' : '#e2e8f0' }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Khu vực */}
              {(teachMode === 'Tại nhà' || teachMode === 'Cả hai') && (
                <div style={{ marginBottom: 16 }}>
                  <label style={lbl}>Khu vực có thể dạy * (chọn xã/phường)</label>
                  <input value={wardSearch} onChange={e => setWardSearch(e.target.value)} placeholder="Tìm xã/phường..." style={{ ...inp, marginBottom: 8 }} />
                  <div style={{ maxHeight: 160, overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: 8, padding: 8 }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {filteredWards.slice(0, 50).map(w => (
                        <button key={w} type="button" onClick={() => toggle(selectedAreas, setSelectedAreas, w)}
                          style={{ padding: '4px 10px', borderRadius: 12, fontSize: 11, fontWeight: 500, cursor: 'pointer', border: '1px solid', background: selectedAreas.includes(w) ? '#2563eb' : '#fff', color: selectedAreas.includes(w) ? '#fff' : '#475569', borderColor: selectedAreas.includes(w) ? '#2563eb' : '#e2e8f0' }}>
                          {w}
                        </button>
                      ))}
                    </div>
                  </div>
                  {selectedAreas.length > 0 && (
                    <div style={{ fontSize: 11, color: '#2563eb', marginTop: 6, fontWeight: 600 }}>Đã chọn: {selectedAreas.join(', ')}</div>
                  )}
                </div>
              )}

              {/* Mức lương */}
              <div style={{ marginBottom: 16 }}>
                <label style={lbl}>Mức phí mong muốn (VNĐ/buổi)</label>
                <input type="number" value={regRate} onChange={e => setRegRate(Number(e.target.value))} min={50000} step={10000} style={inp} />
              </div>

              {/* Giới thiệu */}
              <div>
                <label style={lbl}>Giới thiệu bản thân</label>
                <textarea rows={3} value={regIntro} onChange={e => setRegIntro(e.target.value)} placeholder="Mô tả ngắn về phương pháp dạy, thành tích..." style={{ ...inp, resize: 'none' }} />
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
                <button type="button" onClick={() => setStep(1)} style={{ flex: 1, padding: '12px 0', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>← Quay lại</button>
                <button type="button" onClick={() => { if (isStep2Valid) setStep(3); }}
                  style={{ flex: 2, padding: '12px 0', background: isStep2Valid ? '#2563eb' : '#94a3b8', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: isStep2Valid ? 'pointer' : 'not-allowed' }}>
                  Tiếp theo: Hồ sơ →
                </button>
              </div>
            </div>
          )}

          {/* ===== STEP 3: Hồ sơ đính kèm ===== */}
          {step === 3 && (
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>📎 Hồ sơ đính kèm</h3>
              <p style={{ fontSize: 12, color: '#64748b', marginBottom: 20 }}>Tải ảnh CCCD 2 mặt và bằng cấp để xác minh nhanh hơn.</p>

              {/* CCCD 2 mặt */}
              <div style={{ marginBottom: 20 }}>
                <label style={lbl}>CCCD / CMND (2 mặt)</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {/* Mặt trước */}
                  <div>
                    <input ref={cccdFrontRef} type="file" accept="image/*" hidden onChange={e => handleFileSelect(e.target.files?.[0] || null, setCccdFront, setCccdFrontPreview)} />
                    {cccdFrontPreview ? (
                      <div style={{ position: 'relative' }}>
                        <img src={cccdFrontPreview} alt="CCCD trước" style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8, border: '1px solid #e2e8f0' }} />
                        <button type="button" onClick={() => { setCccdFront(null); setCccdFrontPreview(''); }}
                          style={{ position: 'absolute', top: 4, right: 4, width: 22, height: 22, background: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={12} /></button>
                        <div style={{ fontSize: 10, color: '#64748b', textAlign: 'center', marginTop: 4 }}>Mặt trước</div>
                      </div>
                    ) : (
                      <button type="button" onClick={() => cccdFrontRef.current?.click()}
                        style={{ width: '100%', height: 120, border: '2px dashed #cbd5e1', borderRadius: 8, background: '#f8fafc', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, color: '#94a3b8' }}>
                        <Upload size={20} /><span style={{ fontSize: 11, fontWeight: 600 }}>Mặt trước</span>
                      </button>
                    )}
                  </div>
                  {/* Mặt sau */}
                  <div>
                    <input ref={cccdBackRef} type="file" accept="image/*" hidden onChange={e => handleFileSelect(e.target.files?.[0] || null, setCccdBack, setCccdBackPreview)} />
                    {cccdBackPreview ? (
                      <div style={{ position: 'relative' }}>
                        <img src={cccdBackPreview} alt="CCCD sau" style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8, border: '1px solid #e2e8f0' }} />
                        <button type="button" onClick={() => { setCccdBack(null); setCccdBackPreview(''); }}
                          style={{ position: 'absolute', top: 4, right: 4, width: 22, height: 22, background: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={12} /></button>
                        <div style={{ fontSize: 10, color: '#64748b', textAlign: 'center', marginTop: 4 }}>Mặt sau</div>
                      </div>
                    ) : (
                      <button type="button" onClick={() => cccdBackRef.current?.click()}
                        style={{ width: '100%', height: 120, border: '2px dashed #cbd5e1', borderRadius: 8, background: '#f8fafc', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, color: '#94a3b8' }}>
                        <Upload size={20} /><span style={{ fontSize: 11, fontWeight: 600 }}>Mặt sau</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Bằng cấp */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <label style={{ ...lbl, marginBottom: 0 }}>Bằng cấp / Chứng chỉ</label>
                  <input ref={degreeRef} type="file" accept="image/*" hidden onChange={e => { addDegreeFile(e.target.files?.[0] || null); e.target.value = ''; }} />
                  <button type="button" onClick={() => degreeRef.current?.click()}
                    style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', background: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                    <Plus size={12} /> Thêm ảnh
                  </button>
                </div>
                {degreeFiles.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 8 }}>
                    {degreeFiles.map((d, i) => (
                      <div key={i} style={{ position: 'relative' }}>
                        <img src={d.preview} alt={`Bằng cấp ${i + 1}`} style={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 6, border: '1px solid #e2e8f0' }} />
                        <button type="button" onClick={() => setDegreeFiles(prev => prev.filter((_, idx) => idx !== i))}
                          style={{ position: 'absolute', top: 2, right: 2, width: 18, height: 18, background: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={10} /></button>
                      </div>
                    ))}
                  </div>
                ) : <div style={{ fontSize: 12, color: '#94a3b8' }}>Chưa có ảnh bằng cấp</div>}
              </div>

              {/* File khác */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <label style={{ ...lbl, marginBottom: 0 }}>Tài liệu khác (nếu có)</label>
                  <input ref={otherRef} type="file" accept="image/*" hidden onChange={e => { addOtherFile(e.target.files?.[0] || null); e.target.value = ''; }} />
                  <button type="button" onClick={() => otherRef.current?.click()}
                    style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                    <Plus size={12} /> Thêm file
                  </button>
                </div>
                {otherFiles.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 8 }}>
                    {otherFiles.map((f, i) => (
                      <div key={i} style={{ position: 'relative' }}>
                        <img src={f.preview} alt={`File ${i + 1}`} style={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 6, border: '1px solid #e2e8f0' }} />
                        <button type="button" onClick={() => setOtherFiles(prev => prev.filter((_, idx) => idx !== i))}
                          style={{ position: 'absolute', top: 2, right: 2, width: 18, height: 18, background: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={10} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {!hasCloudinary && (
                <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 8, padding: 12, fontSize: 12, color: '#92400e', marginBottom: 16 }}>
                  ⚠️ Chưa cấu hình Cloudinary. Ảnh sẽ không được lưu trữ. Liên hệ admin.
                </div>
              )}

              <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
                <button type="button" onClick={() => setStep(2)} style={{ flex: 1, padding: '12px 0', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>← Quay lại</button>
                <button type="submit" disabled={isSubmitting}
                  style={{ flex: 2, padding: '12px 0', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: isSubmitting ? 'wait' : 'pointer', opacity: isSubmitting ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <Send size={16} /> {isSubmitting ? uploadProgress || 'Đang gửi...' : 'Gửi đăng ký'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
