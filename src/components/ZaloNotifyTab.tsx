import React, { useState } from 'react';
import { MessageCircle, Send, Copy, Check, Phone, Bell, Users, Clock, Edit3 } from 'lucide-react';
import { ParentRegistration, ClassMatch, TutorItem } from '../types';

interface ZaloNotifyTabProps {
  registrations: ParentRegistration[];
  matches: ClassMatch[];
  tutors: TutorItem[];
}

interface NotifyTemplate {
  id: string;
  title: string;
  trigger: string;
  template: string;
  icon: string;
}

// Merged: ZaloNotifyTab + TemplatesTab (consolidated)
export const ZaloNotifyTab: React.FC<ZaloNotifyTabProps> = ({ registrations, matches, tutors }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedReg, setSelectedReg] = useState<ParentRegistration | null>(null);
  const [manualVars, setManualVars] = useState<Record<string, string>>({
    parentName: '', studentName: '', subjects: '', tutorName: '', phone: '0822448444',
    amount: '', deadline: '', tutorCode: '', grade: '', schedule: '',
  });
  const [useManual, setUseManual] = useState(false);

  const templates: NotifyTemplate[] = [
    { id: 'new_reg', title: 'Xác nhận đơn mới', trigger: 'Khi phụ huynh vừa đăng ký', icon: '📋',
      template: 'Chào anh/chị {parentName}, Trung tâm Gia Sư Thành Đạt đã nhận đơn đăng ký tìm gia sư {subjects} cho bé {studentName} ({grade}). Chúng tôi sẽ liên hệ trong vòng 30 phút. Hotline: 0822448444' },
    { id: 'contacted', title: 'Đã liên hệ thành công', trigger: 'Sau khi gọi phụ huynh', icon: '📞',
      template: 'Chào anh/chị {parentName}, Cảm ơn anh/chị đã trao đổi. Trung tâm đang tìm gia sư phù hợp nhất cho bé {studentName}. Dự kiến phản hồi trong 24-48h. Mọi thắc mắc liên hệ 0822448444.' },
    { id: 'matched', title: 'Đã ghép gia sư', trigger: 'Khi ghép xong gia sư', icon: '✅',
      template: 'Chào anh/chị {parentName}, Trung tâm đã tìm được gia sư phù hợp cho bé {studentName}! Gia sư {tutorName} sẽ liên hệ anh/chị để sắp xếp buổi học thử MIỄN PHÍ. Chúc bé học tốt!' },
    { id: 'trial', title: 'Nhắc buổi học thử', trigger: '1 ngày trước buổi thử', icon: '🎓',
      template: 'Nhắc nhở: Ngày mai bé {studentName} có buổi học thử môn {subjects} với gia sư {tutorName}. Thời gian: {schedule}. Anh/chị chuẩn bị sách vở cho bé nhé! Liên hệ: 0822448444' },
    { id: 'payment', title: 'Nhắc học phí', trigger: 'Cuối tháng', icon: '💰',
      template: 'Chào anh/chị {parentName}, Nhắc nhẹ về học phí tháng này cho bé {studentName}: {amount}đ. Hạn thanh toán: {deadline}. CK: [STK] - [NH]. Nội dung: HP {studentName}. Cảm ơn anh/chị!' },
    { id: 'feedback', title: 'Xin đánh giá sau 1 tháng', trigger: 'Sau 30 ngày học', icon: '⭐',
      template: 'Chào anh/chị {parentName}, Bé {studentName} đã học với gia sư {tutorName} được 1 tháng. Anh/chị đánh giá chất lượng giảng dạy thế nào ạ? (Trả lời 1-5 sao). Ý kiến của anh/chị giúp chúng tôi phục vụ tốt hơn!' },
    { id: 'cancel', title: 'Xác nhận hủy', trigger: 'Khi phụ huynh hủy đơn', icon: '❌',
      template: 'Chào anh/chị {parentName}, Trung tâm đã ghi nhận việc hủy đăng ký cho bé {studentName}. Nếu tương lai cần tìm gia sư, đừng ngần ngại liên hệ 0822448444. Chúc gia đình khỏe mạnh!' },
    { id: 'tutor_welcome', title: 'Chào gia sư mới', trigger: 'Khi duyệt gia sư', icon: '🎉',
      template: 'Chào {tutorName}! Hồ sơ gia sư của bạn đã được xác minh ✅. Mã gia sư: {tutorCode}. Từ bây giờ bạn có thể nhận lớp mới. Truy cập giasu-dusky.vercel.app để xem lớp đang tuyển. Chúc bạn dạy tốt!' },
    // F16: Email templates
    { id: 'email_confirm', title: '📧 Email: Xác nhận đăng ký', trigger: 'Gửi email phụ huynh', icon: '📧',
      template: 'Tiêu đề: [Gia Sư Thành Đạt] Xác nhận đăng ký tìm gia sư\n\nKính gửi Anh/Chị {parentName},\n\nTrung tâm Gia Sư Thành Đạt xin xác nhận đã nhận đơn đăng ký tìm gia sư cho bé {studentName} ({grade}).\n\nThông tin đăng ký:\n- Môn: {subjects}\n- Lịch học: {schedule}\n- Khu vực: {district}\n\nChúng tôi sẽ liên hệ Anh/Chị trong vòng 24h để trao đổi chi tiết.\n\nTrân trọng,\nGia Sư Thành Đạt\nHotline: 0822448444' },
    { id: 'email_matched', title: '📧 Email: Đã tìm được gia sư', trigger: 'Gửi email ghép xong', icon: '📧',
      template: 'Tiêu đề: [Gia Sư Thành Đạt] Đã tìm được gia sư cho bé {studentName}\n\nKính gửi Anh/Chị {parentName},\n\nChúng tôi vui mừng thông báo đã tìm được gia sư phù hợp cho bé {studentName}!\n\nThông tin gia sư:\n- Tên: {tutorName}\n- Mã gia sư: {tutorCode}\n\nGia sư sẽ liên hệ Anh/Chị trong 24h tới để sắp xếp buổi học thử MIỄN PHÍ.\n\nNếu có bất kỳ thắc mắc nào, vui lòng liên hệ:\n📞 Hotline: 0822448444\n💬 Zalo: 0822448444\n\nTrân trọng,\nGia Sư Thành Đạt' },
  ];

  const newRegs = registrations.filter(r => r.status === 'Mới');

  // F46: Recent matches needing notification (last 7 days, not yet old)
  const recentMatches = matches.filter(m => m.status === 'Đang dạy' && (Date.now() - m.createdAt) < 7 * 86400000);
  // F51: Matches > 30 days without review reminder
  const needReviewReminder = matches.filter(m => m.status === 'Đang dạy' && (Date.now() - m.startDate) > 30 * 86400000);

  const fillTemplate = (tmpl: string) => {
    let filled = tmpl;
    if (useManual || !selectedReg) {
      // Manual mode: fill from manualVars
      Object.entries(manualVars).forEach(([key, val]) => {
        filled = filled.split(`{${key}}`).join(String(val) || `{${key}}`);
      });
    } else {
      // Auto mode: fill from selected registration
      filled = filled.split('{parentName}').join(selectedReg.parentName);
      filled = filled.split('{studentName}').join(selectedReg.studentName || 'học sinh');
      filled = filled.split('{subjects}').join(selectedReg.subjects.join(', '));
      filled = filled.split('{grade}').join(selectedReg.grade);
      filled = filled.split('{schedule}').join(selectedReg.schedule || 'Chưa có');
      // Still fill manual vars for things not in registration
      ['tutorName', 'tutorCode', 'amount', 'deadline', 'phone'].forEach(key => {
        filled = filled.split(`{${key}}`).join(manualVars[key] || `{${key}}`);
      });
    }
    return filled;
  };

  const copyMsg = (id: string, text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const zaloPhone = selectedReg?.phone || '0822448444';

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Bell className="w-5 h-5 text-green-600" /> Tin nhắn & Thông báo Zalo
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">{templates.length} mẫu · Chọn phụ huynh hoặc nhập thủ công → Copy → Gửi Zalo</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setUseManual(false); setSelectedReg(null); }}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer border transition-all ${!useManual ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200'}`}>
            <Users className="w-3 h-3 inline mr-1" /> Chọn PH
          </button>
          <button onClick={() => { setUseManual(true); setSelectedReg(null); }}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer border transition-all ${useManual ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-slate-600 border-slate-200'}`}>
            <Edit3 className="w-3 h-3 inline mr-1" /> Nhập thủ công
          </button>
        </div>
      </div>

      {/* F46: Pending notifications for recent matches */}
      {recentMatches.length > 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <h3 className="text-xs font-bold uppercase text-emerald-600 mb-2 flex items-center gap-1">
            <Send className="w-3 h-3" /> Ghép lớp gần đây — cần gửi tin ({recentMatches.length})
          </h3>
          <div className="space-y-2">
            {recentMatches.slice(0, 5).map(m => {
              const tutor = tutors.find(t => t.code === m.tutorCode);
              const gsMsgPreview = `Chào ${m.tutorName}! Bạn đã được ghép lớp ${m.classSubject}. Học sinh: ${m.studentName || 'Chưa có'}. SĐT phụ huynh: ${m.parentPhone || 'Chưa có'}. Phí/buổi: ${new Intl.NumberFormat('vi-VN').format(m.fee)}đ. Truy cập giasu-dusky.vercel.app/cong-gia-su để xem chi tiết.`;
              const phMsgPreview = `Chào anh/chị! Trung tâm đã ghép gia sư ${m.tutorName} dạy ${m.classSubject} cho bé ${m.studentName || ''}. Gia sư sẽ liên hệ sớm. Mọi thắc mắc: 0822448444.`;
              return (
                <div key={m.id} className="bg-white rounded-lg p-3 flex items-center justify-between gap-3">
                  <div className="text-xs text-slate-700">
                    <span className="font-bold">{m.classSubject}</span> — Gia sư: {m.tutorName} · Học sinh: {m.studentName || 'Chưa có'}
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <button onClick={() => { navigator.clipboard.writeText(gsMsgPreview); setCopiedId('gs-' + m.id); setTimeout(() => setCopiedId(null), 2000); }}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer ${copiedId === 'gs-' + m.id ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}>
                      {copiedId === 'gs-' + m.id ? '✓' : '📋'} Tin gia sư
                    </button>
                    <button onClick={() => { navigator.clipboard.writeText(phMsgPreview); setCopiedId('ph-' + m.id); setTimeout(() => setCopiedId(null), 2000); }}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer ${copiedId === 'ph-' + m.id ? 'bg-indigo-100 text-indigo-700' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
                      {copiedId === 'ph-' + m.id ? '✓' : '📋'} Tin phụ huynh
                    </button>
                    {tutor?.phone && (
                      <a href={`https://zalo.me/${tutor.phone}`} target="_blank" rel="noreferrer"
                        className="px-2 py-1 rounded-lg text-[10px] font-bold bg-green-600 text-white hover:bg-green-700">
                        Zalo gia sư
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* F51: Review reminders for matches > 30 days */}
      {needReviewReminder.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h3 className="text-xs font-bold uppercase text-amber-600 mb-2 flex items-center gap-1">
            ⭐ Lớp &gt;30 ngày — nhắc phụ huynh đánh giá ({needReviewReminder.length})
          </h3>
          <div className="flex gap-2 flex-wrap">
            {needReviewReminder.slice(0, 6).map(m => {
              const days = Math.floor((Date.now() - m.startDate) / 86400000);
              const msg = `Chào anh/chị! Bé ${m.studentName || ''} đã học với gia sư ${m.tutorName} được ${days} ngày. Anh/chị vui lòng đánh giá tại: giasu-dusky.vercel.app/tra-cuu (nhập số điện thoại). Ý kiến giúp chúng tôi phục vụ tốt hơn!`;
              return (
                <button key={m.id} onClick={() => { navigator.clipboard.writeText(msg); setCopiedId('rv-' + m.id); setTimeout(() => setCopiedId(null), 2000); }}
                  className={`px-3 py-2 rounded-lg text-[11px] font-bold cursor-pointer border transition-all ${copiedId === 'rv-' + m.id ? 'bg-amber-100 border-amber-400 text-amber-700' : 'bg-white border-amber-200 text-amber-700 hover:bg-amber-50'}`}>
                  {copiedId === 'rv-' + m.id ? '✓ Đã copy' : `${m.classSubject} — ${m.studentName || m.tutorName} (${days}d)`}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Mode 1: Quick pick PH */}
      {!useManual && newRegs.length > 0 && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <h3 className="text-xs font-bold uppercase text-indigo-600 mb-2 flex items-center gap-1">
            <Users className="w-3 h-3" /> Phụ huynh mới cần liên hệ ({newRegs.length})
          </h3>
          <div className="flex gap-2 flex-wrap">
            {newRegs.slice(0, 10).map(r => (
              <button key={r.id} onClick={() => setSelectedReg(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer border transition-all ${
                  selectedReg?.id === r.id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'
                }`}>
                {r.parentName} · {r.phone}
              </button>
            ))}
          </div>
        </div>
      )}

      {!useManual && selectedReg && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-800 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Đang soạn cho: <strong>{selectedReg.parentName}</strong> ({selectedReg.phone}) · {selectedReg.subjects.join(', ')} · {selectedReg.district}</span>
          <button onClick={() => setSelectedReg(null)} className="ml-auto text-emerald-600 font-bold cursor-pointer hover:underline">Bỏ chọn</button>
        </div>
      )}

      {/* Mode 2: Manual variables */}
      {useManual && (
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
          <h3 className="text-xs font-bold uppercase text-slate-400 mb-3 flex items-center gap-1">
            <Edit3 className="w-3 h-3" /> Điền biến (tự động thay thế trong tin nhắn)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { key: 'parentName', label: 'Tên PH' },
              { key: 'studentName', label: 'Tên HS' },
              { key: 'subjects', label: 'Môn' },
              { key: 'tutorName', label: 'Tên GS' },
              { key: 'tutorCode', label: 'Mã GS' },
              { key: 'grade', label: 'Lớp' },
              { key: 'schedule', label: 'Lịch học' },
              { key: 'amount', label: 'Số tiền' },
              { key: 'deadline', label: 'Hạn thanh toán' },
              { key: 'phone', label: 'Số điện thoại trung tâm' },
            ].map(v => (
              <div key={v.key}>
                <label className="text-[10px] font-bold text-slate-500 uppercase">{v.label}</label>
                <input value={manualVars[v.key] || ''} onChange={e => setManualVars(p => ({ ...p, [v.key]: e.target.value }))}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-500 mt-0.5" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Extra vars when using PH picker mode */}
      {!useManual && selectedReg && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs">
          <h3 className="text-[10px] font-bold uppercase text-slate-400 mb-2">Biến bổ sung (GS, học phí...)</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[{ key: 'tutorName', label: 'Tên GS' }, { key: 'tutorCode', label: 'Mã GS' }, { key: 'amount', label: 'Số tiền' }, { key: 'deadline', label: 'Hạn TT' }].map(v => (
              <div key={v.key}>
                <label className="text-[10px] font-bold text-slate-500 uppercase">{v.label}</label>
                <input value={manualVars[v.key] || ''} onChange={e => setManualVars(p => ({ ...p, [v.key]: e.target.value }))}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-500 mt-0.5" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {templates.map(tmpl => {
          const filled = fillTemplate(tmpl.template);
          return (
            <div key={tmpl.id} className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs hover:border-green-200 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{tmpl.icon}</span>
                    <h3 className="text-sm font-bold text-slate-800">{tmpl.title}</h3>
                  </div>
                  <div className="text-[10px] text-slate-400 mb-2 flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" /> {tmpl.trigger}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">{filled}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-3 justify-end">
                <button onClick={() => copyMsg(tmpl.id, filled)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer flex items-center gap-1 ${
                    copiedId === tmpl.id ? 'bg-emerald-100 text-emerald-700' : 'bg-green-600 text-white hover:bg-green-700'
                  }`}>
                  {copiedId === tmpl.id ? <><Check className="w-3 h-3" /> Đã copy</> : <><Copy className="w-3 h-3" /> Copy</>}
                </button>
                <a href={`https://zalo.me/${zaloPhone}`} target="_blank" rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-bold flex items-center gap-1">
                  <Send className="w-3 h-3" /> Gửi Zalo
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
