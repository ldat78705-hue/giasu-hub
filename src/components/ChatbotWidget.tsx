import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, CheckCircle2, Edit3, UserPlus } from 'lucide-react';
import { ParentRegistration, TutorItem } from '../types';

interface ChatbotWidgetProps {
  apiKey: string;
  centerName?: string;
  onRegister?: (reg: ParentRegistration) => Promise<void>;
  wards?: string[];
  tutors?: TutorItem[];
}

interface ChatMsg {
  role: 'user' | 'bot';
  text: string;
  ts: number;
  quickReplies?: QuickReply[];
  summary?: DraftReg | null;
}

interface QuickReply { label: string; value: string; icon?: string; }

interface DraftReg {
  parentName: string;
  phone: string;
  subjects: string[];
  grade: string;
  district: string;
  schedule: string;
  mode: 'Tại nhà' | 'Online' | 'Cả hai';
  note: string;
}

type FlowStep = 'idle' | 'ask_name' | 'ask_phone' | 'ask_subject' | 'ask_grade' | 'ask_mode' | 'ask_area' | 'ask_schedule' | 'confirm' | 'done';

const SUBJECTS = ['Toán', 'Tiếng Anh', 'Ngữ Văn', 'Vật Lý', 'Hóa Học', 'Sinh Học', 'IELTS', 'Tin Học', 'Luyện thi ĐH'];
const GRADES = ['Lớp 1-5', 'Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9', 'Lớp 10', 'Lớp 11', 'Lớp 12', 'Đại học'];
const MODES: QuickReply[] = [
  { label: '🏠 Tại nhà', value: 'Tại nhà' },
  { label: '💻 Online', value: 'Online' },
  { label: '🔄 Cả hai', value: 'Cả hai' },
];
const POPULAR_AREAS = ['Ba Đình', 'Hoàn Kiếm', 'Đống Đa', 'Hai Bà Trưng', 'Cầu Giấy', 'Thanh Xuân', 'Hoàng Mai', 'Long Biên', 'Nam Từ Liêm', 'Bắc Từ Liêm', 'Hà Đông', 'Tây Hồ'];

const EMPTY_DRAFT: DraftReg = { parentName: '', phone: '', subjects: [], grade: '', district: '', schedule: '', mode: 'Tại nhà', note: '' };

export const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({
  apiKey, centerName = 'Gia Sư Thành Đạt', onRegister, wards = [], tutors = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [flowStep, setFlowStep] = useState<FlowStep>('idle');
  const [draft, setDraft] = useState<DraftReg>({ ...EMPTY_DRAFT });
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  // Init greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        role: 'bot', ts: Date.now(),
        text: `Chào bạn! 👋 Mình là trợ lý AI của ${centerName}.\n\nMình có thể giúp bạn:`,
        quickReplies: [
          { label: '📝 Đăng ký tìm gia sư', value: '__register__', icon: '📝' },
          { label: '❓ Tư vấn học phí', value: 'Học phí các môn bao nhiêu?', icon: '❓' },
          { label: '🔍 Tìm hiểu trung tâm', value: 'Giới thiệu về trung tâm', icon: '🔍' },
        ],
      }]);
    }
  }, [isOpen, centerName, messages.length]);

  // ─── Helpers ─────────────────────────
  const addBot = (text: string, quickReplies?: QuickReply[], summary?: DraftReg | null) => {
    setMessages(prev => [...prev, { role: 'bot', text, ts: Date.now(), quickReplies, summary }]);
  };
  const addUser = (text: string) => {
    setMessages(prev => [...prev, { role: 'user', text, ts: Date.now() }]);
  };

  // ─── Registration Flow ──────────────
  const startRegistration = () => {
    setDraft({ ...EMPTY_DRAFT });
    setSelectedSubjects([]);
    setFlowStep('ask_name');
    addBot('Tuyệt vời! Mình sẽ giúp anh/chị đăng ký tìm gia sư ngay ạ 🎓\n\nĐầu tiên, cho mình xin **họ tên phụ huynh** nhé?');
  };

  const handleFlowInput = (text: string) => {
    addUser(text);

    switch (flowStep) {
      case 'ask_name':
        setDraft(d => ({ ...d, parentName: text }));
        setFlowStep('ask_phone');
        addBot(`Cảm ơn anh/chị **${text}** ạ! 😊\n\nCho mình xin **số điện thoại** để trung tâm liên hệ tư vấn nhé?`);
        break;

      case 'ask_phone': {
        const phone = text.replace(/\s+/g, '');
        if (!/^0\d{9,10}$/.test(phone)) {
          addBot('Số điện thoại chưa đúng định dạng ạ. Vui lòng nhập lại SĐT bắt đầu bằng 0 (10-11 số) 📱');
          return;
        }
        setDraft(d => ({ ...d, phone }));
        setFlowStep('ask_subject');
        addBot(
          'Bé cần học **môn gì** ạ? Chọn 1 hoặc nhiều môn bên dưới 👇',
          SUBJECTS.map(s => ({ label: s, value: s })),
        );
        break;
      }

      case 'ask_subject':
        // handled by quick reply toggle below
        break;

      case 'ask_grade':
        setDraft(d => ({ ...d, grade: text }));
        setFlowStep('ask_mode');
        addBot(
          'Anh/chị muốn bé học **hình thức** nào ạ?',
          MODES,
        );
        break;

      case 'ask_mode':
        setDraft(d => ({ ...d, mode: text as DraftReg['mode'] }));
        if (text === 'Online') {
          setDraft(d => ({ ...d, district: 'Online' }));
          setFlowStep('ask_schedule');
          addBot('Anh/chị muốn bé học **lịch** nào ạ?\n\n_Ví dụ: Thứ 3, Thứ 5 tối 19h-21h_');
        } else {
          setFlowStep('ask_area');
          const areaButtons = POPULAR_AREAS.map(a => ({ label: a, value: a }));
          addBot('Bé ở **quận/huyện** nào tại Hà Nội ạ? 📍', areaButtons);
        }
        break;

      case 'ask_area':
        setDraft(d => ({ ...d, district: text }));
        setFlowStep('ask_schedule');
        addBot('Anh/chị muốn bé học **lịch** nào ạ?\n\n_Ví dụ: Thứ 3, Thứ 5 tối 19h-21h_');
        break;

      case 'ask_schedule':
        setDraft(d => {
          const updated = { ...d, schedule: text };
          // Show confirmation
          setTimeout(() => showConfirmation(updated), 100);
          return updated;
        });
        setFlowStep('confirm');
        break;

      default:
        break;
    }
  };

  const showConfirmation = (d: DraftReg) => {
    addBot(
      `📋 **Thông tin đăng ký:**`,
      [
        { label: '✅ Xác nhận đăng ký', value: '__confirm__' },
        { label: '✏️ Sửa lại', value: '__edit__' },
        { label: '❌ Hủy', value: '__cancel__' },
      ],
      d,
    );
  };

  const handleConfirmRegistration = async () => {
    if (!onRegister) {
      addBot('Xin lỗi, chức năng đăng ký chưa sẵn sàng. Vui lòng gọi 0822448444 để đăng ký trực tiếp ạ!');
      setFlowStep('idle');
      return;
    }
    setLoading(true);
    try {
      const reg: ParentRegistration = {
        parentName: draft.parentName,
        phone: draft.phone,
        studentName: '',
        grade: draft.grade,
        subjects: draft.subjects.length > 0 ? draft.subjects : selectedSubjects,
        district: draft.district,
        mode: draft.mode,
        schedule: draft.schedule,
        note: `[Đăng ký qua AI Chatbot] ${draft.note}`,
        source: 'Website',
        createdAt: Date.now(),
        status: 'Mới',
      };
      await onRegister(reg);
      setFlowStep('done');

      // Find matching tutors
      const regSubjects = reg.subjects.map(s => s.toLowerCase());
      const matched = tutors
        .filter(t => t.verified && t.status === 'online' && t.subjects.some(s => regSubjects.some(rs => s.toLowerCase().includes(rs))))
        .slice(0, 3);

      let successText = `🎉 **Đăng ký thành công!**\n\nTrung tâm sẽ liên hệ anh/chị **${draft.parentName}** qua số **${draft.phone}** trong vòng **30 phút** để tư vấn và sắp xếp gia sư phù hợp.`;

      if (matched.length > 0) {
        successText += `\n\n💡 **Gợi ý nhanh:** Có ${matched.length} gia sư phù hợp đang sẵn sàng:`;
        matched.forEach((t, i) => {
          successText += `\n${i + 1}. **${t.name}** — ${t.subjects.join(', ')} ⭐${t.rating}`;
        });
      }

      successText += `\n\n📞 Liên hệ ngay: **0822448444** (Zalo)`;

      addBot(successText, [
        { label: '📝 Đăng ký thêm', value: '__register__' },
        { label: '❓ Hỏi thêm', value: '__reset__' },
      ]);
    } catch {
      addBot('❌ Lỗi khi gửi đăng ký. Vui lòng thử lại hoặc gọi 0822448444!');
    } finally {
      setLoading(false);
    }
  };

  // ─── Subject Multi-select ──────────
  const handleSubjectToggle = (subject: string) => {
    setSelectedSubjects(prev => {
      const next = prev.includes(subject) ? prev.filter(s => s !== subject) : [...prev, subject];
      return next;
    });
  };

  const confirmSubjects = () => {
    if (selectedSubjects.length === 0) {
      addBot('Vui lòng chọn ít nhất 1 môn học ạ 📚', SUBJECTS.map(s => ({ label: s, value: s })));
      return;
    }
    addUser(selectedSubjects.join(', '));
    setDraft(d => ({ ...d, subjects: [...selectedSubjects] }));
    setFlowStep('ask_grade');
    addBot(
      `Tuyệt! Đã chọn: **${selectedSubjects.join(', ')}** 📚\n\nBé đang học **lớp mấy** ạ?`,
      GRADES.map(g => ({ label: g, value: g })),
    );
  };

  // ─── Quick Reply Handler ───────────
  const handleQuickReply = (qr: QuickReply) => {
    const v = qr.value;

    // Special actions
    if (v === '__register__') {
      addUser('Đăng ký tìm gia sư');
      startRegistration();
      return;
    }
    if (v === '__confirm__') {
      addUser('Xác nhận đăng ký');
      handleConfirmRegistration();
      return;
    }
    if (v === '__edit__') {
      addUser('Sửa lại thông tin');
      startRegistration();
      return;
    }
    if (v === '__cancel__') {
      addUser('Hủy đăng ký');
      setFlowStep('idle');
      addBot('Đã hủy ạ. Anh/chị cần gì mình giúp thêm không? 😊', [
        { label: '📝 Đăng ký tìm gia sư', value: '__register__' },
        { label: '❓ Hỏi thêm', value: '__reset__' },
      ]);
      return;
    }
    if (v === '__reset__') {
      setFlowStep('idle');
      addUser('Hỏi thêm');
      addBot(`Mình có thể giúp gì thêm ạ? 😊`, [
        { label: '📝 Đăng ký tìm gia sư', value: '__register__' },
        { label: '❓ Tư vấn học phí', value: 'Học phí các môn bao nhiêu?' },
      ]);
      return;
    }

    // Subject multi-select — don't advance, just toggle
    if (flowStep === 'ask_subject') {
      handleSubjectToggle(v);
      return;
    }

    // All other flow steps
    if (flowStep !== 'idle') {
      handleFlowInput(v);
      return;
    }

    // Idle — send to AI
    handleGeneralChat(v);
  };

  // ─── General AI Chat ───────────────
  const systemPrompt = `Bạn là trợ lý tư vấn AI thân thiện của trung tâm ${centerName}. Trả lời ngắn gọn bằng tiếng Việt, tối đa 4-5 câu.

Thông tin trung tâm:
- Số điện thoại/Zalo: 0822448444
- Dịch vụ: Tìm gia sư tại nhà & online tại Hà Nội
- Các môn: Toán, Lý, Hóa, Anh, Văn, Sinh, Sử, Địa, Tin, IELTS, Piano, Guitar
- Học phí tham khảo: Tiểu học 150-200k/buổi, THCS 200-250k/buổi, THPT 250-350k/buổi, IELTS/Đại học 400-500k/buổi
- Học thử miễn phí 1-2 buổi, đổi gia sư miễn phí
- Đội ngũ gia sư từ ĐHQG, Bách Khoa, Sư Phạm, đều xác minh CCCD + bằng cấp

QUAN TRỌNG: Nếu phụ huynh có ý muốn tìm gia sư, đăng ký, hoặc cần giúp đỡ chọn gia sư → hãy khuyến khích họ đăng ký bằng cách kết thúc câu trả lời bằng dòng:
"Anh/chị có muốn đăng ký tìm gia sư ngay không ạ? 😊"

Đừng bao giờ tự bịa số điện thoại hay thông tin khác.`;

  const handleGeneralChat = async (text: string) => {
    addUser(text);
    setLoading(true);

    // Detect registration intent from natural language
    const regKeywords = ['đăng ký', 'tìm gia sư', 'muốn học', 'cần gia sư', 'thuê gia sư', 'đăng kí', 'dang ky', 'register'];
    const hasRegIntent = regKeywords.some(k => text.toLowerCase().includes(k));

    if (hasRegIntent && onRegister) {
      setLoading(false);
      startRegistration();
      return;
    }

    try {
      if (!apiKey) {
        addBot('Xin lỗi, chức năng AI chưa được cấu hình.\n\nVui lòng gọi **0822448444** để được tư vấn trực tiếp!', [
          { label: '📝 Đăng ký tìm gia sư', value: '__register__' },
        ]);
        setLoading(false);
        return;
      }
      const history = messages.slice(-8).map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }],
      }));
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: [...history, { role: 'user', parts: [{ text }] }],
          generationConfig: { maxOutputTokens: 400 },
        }),
      });
      const data = await res.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Xin lỗi, mình chưa hiểu câu hỏi. Gọi 0822448444 để được tư vấn nhé!';

      // Check if AI response suggests registration
      const suggestsReg = reply.includes('đăng ký') || reply.includes('Đăng ký');
      addBot(reply, suggestsReg && onRegister ? [
        { label: '📝 Đăng ký ngay', value: '__register__' },
        { label: '❓ Hỏi thêm', value: '__reset__' },
      ] : undefined);
    } catch {
      addBot('Lỗi kết nối. Gọi **0822448444** để được hỗ trợ ạ!');
    } finally {
      setLoading(false);
    }
  };

  // ─── Send Handler ──────────────────
  const handleSend = () => {
    if (!input.trim() || loading) return;
    const text = input.trim();
    setInput('');

    if (flowStep !== 'idle' && flowStep !== 'done') {
      handleFlowInput(text);
    } else {
      handleGeneralChat(text);
    }
  };

  // ─── Render ────────────────────────
  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)}
        style={{ position: 'fixed', bottom: 24, left: 20, zIndex: 50, width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(99,102,241,.4)', transition: 'transform .15s' }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        className="lg:flex hidden">
        <Bot size={24} />
      </button>
    );
  }

  return (
    <div style={{ position: 'fixed', bottom: 24, left: 20, zIndex: 55, width: 400, maxWidth: 'calc(100vw - 40px)', background: '#fff', borderRadius: 4, boxShadow: '0 8px 40px rgba(0,0,0,.18)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', maxHeight: 560 }}>
      {/* Header */}
      <div style={{ padding: '14px 16px', background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', borderRadius: '4px 4px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: 'rgba(255,255,255,.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={16} color="#fff" />
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>Trợ lý AI 24/7</div>
            <div style={{ color: 'rgba(255,255,255,.7)', fontSize: 10, fontWeight: 500 }}>Tư vấn & Đăng ký tìm gia sư</div>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} style={{ background: 'rgba(255,255,255,.15)', border: 'none', color: '#fff', cursor: 'pointer', width: 28, height: 28, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={16} /></button>
      </div>

      {/* Progress bar for registration flow */}
      {flowStep !== 'idle' && flowStep !== 'done' && (
        <div style={{ padding: '8px 16px', background: '#f0fdf4', borderBottom: '1px solid #dcfce7', display: 'flex', alignItems: 'center', gap: 8 }}>
          <UserPlus size={14} style={{ color: '#16a34a', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#16a34a', marginBottom: 2 }}>Đang đăng ký tìm gia sư</div>
            <div style={{ height: 3, background: '#dcfce7', borderRadius: 99 }}>
              <div style={{
                height: 3, borderRadius: 99, background: '#16a34a', transition: 'width .3s',
                width: `${(['ask_name', 'ask_phone', 'ask_subject', 'ask_grade', 'ask_mode', 'ask_area', 'ask_schedule', 'confirm'].indexOf(flowStep) + 1) / 8 * 100}%`,
              }} />
            </div>
          </div>
          <button onClick={() => { setFlowStep('idle'); addBot('Đã hủy ạ. Mình giúp gì thêm không? 😊', [{ label: '📝 Đăng ký lại', value: '__register__' }]); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 10, fontWeight: 600 }}>Hủy</button>
        </div>
      )}

      {/* Messages */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 10, minHeight: 280 }}>
        {messages.map((m, i) => (
          <div key={i}>
            {/* Message bubble */}
            <div style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 2 }}>
              <div style={{
                maxWidth: '85%', padding: '10px 14px', borderRadius: 4, fontSize: 13, lineHeight: 1.6,
                background: m.role === 'user' ? '#6366f1' : '#f1f5f9',
                color: m.role === 'user' ? '#fff' : '#334155',
                whiteSpace: 'pre-wrap', wordBreak: 'break-word',
              }}
                dangerouslySetInnerHTML={{ __html: m.text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/_(.*?)_/g, '<i>$1</i>') }}
              />
            </div>

            {/* Registration summary card */}
            {m.summary && (
              <div style={{ maxWidth: '85%', margin: '6px 0', padding: 14, background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 4 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#1e40af', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <CheckCircle2 size={14} /> Thông tin đăng ký
                </div>
                {[
                  { icon: '👤', label: 'Phụ huynh', value: m.summary.parentName },
                  { icon: '📱', label: 'SĐT', value: m.summary.phone },
                  { icon: '📚', label: 'Môn', value: (m.summary.subjects.length > 0 ? m.summary.subjects : selectedSubjects).join(', ') },
                  { icon: '🎓', label: 'Lớp', value: m.summary.grade },
                  { icon: m.summary.mode === 'Online' ? '💻' : '🏠', label: 'Hình thức', value: m.summary.mode },
                  { icon: '📍', label: 'Khu vực', value: m.summary.district },
                  { icon: '🕒', label: 'Lịch', value: m.summary.schedule },
                ].map((row, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 0', fontSize: 12, color: '#334155' }}>
                    <span style={{ width: 18, textAlign: 'center' }}>{row.icon}</span>
                    <span style={{ color: '#64748b', minWidth: 64 }}>{row.label}:</span>
                    <span style={{ fontWeight: 600 }}>{row.value || '—'}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Quick reply buttons */}
            {m.quickReplies && m.quickReplies.length > 0 && i === messages.length - 1 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6, maxWidth: '90%' }}>
                {/* Subject multi-select mode */}
                {flowStep === 'ask_subject' ? (
                  <>
                    {m.quickReplies.map((qr, j) => (
                      <button key={j} onClick={() => handleQuickReply(qr)}
                        style={{
                          padding: '5px 12px', borderRadius: 4, fontSize: 11, fontWeight: 600, cursor: 'pointer',
                          border: '1px solid', transition: 'all .15s',
                          background: selectedSubjects.includes(qr.value) ? '#6366f1' : '#fff',
                          color: selectedSubjects.includes(qr.value) ? '#fff' : '#6366f1',
                          borderColor: selectedSubjects.includes(qr.value) ? '#6366f1' : '#c7d2fe',
                        }}>
                        {selectedSubjects.includes(qr.value) ? '✓ ' : ''}{qr.label}
                      </button>
                    ))}
                    {selectedSubjects.length > 0 && (
                      <button onClick={confirmSubjects}
                        style={{ padding: '5px 16px', borderRadius: 4, fontSize: 11, fontWeight: 700, cursor: 'pointer', background: '#16a34a', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                        Tiếp tục ({selectedSubjects.length} môn) →
                      </button>
                    )}
                  </>
                ) : (
                  m.quickReplies.map((qr, j) => (
                    <button key={j} onClick={() => handleQuickReply(qr)}
                      style={{
                        padding: '6px 14px', borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                        background: '#fff', color: '#6366f1', border: '1px solid #c7d2fe',
                        transition: 'all .15s', display: 'flex', alignItems: 'center', gap: 4,
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#eef2ff'; e.currentTarget.style.borderColor = '#6366f1'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#c7d2fe'; }}>
                      {qr.label}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ padding: '10px 16px', background: '#f1f5f9', borderRadius: 4, fontSize: 13, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ display: 'flex', gap: 4 }}>
                <span style={{ width: 6, height: 6, background: '#94a3b8', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0s' }} />
                <span style={{ width: 6, height: 6, background: '#94a3b8', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '.2s' }} />
                <span style={{ width: 6, height: 6, background: '#94a3b8', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '.4s' }} />
              </div>
              Đang trả lời...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ padding: '10px 12px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: 8, background: '#fafbfc' }}>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder={flowStep === 'ask_subject' ? 'Hoặc nhập môn khác...' : flowStep !== 'idle' ? 'Nhập câu trả lời...' : 'Hỏi về gia sư, học phí, khu vực...'}
          style={{ flex: 1, padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13, outline: 'none', background: '#fff' }} />
        <button onClick={handleSend} disabled={loading || !input.trim()}
          style={{ padding: '10px 14px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', opacity: loading || !input.trim() ? .4 : 1, transition: 'opacity .15s' }}>
          <Send size={16} />
        </button>
      </div>

      {/* Bounce keyframes */}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};
