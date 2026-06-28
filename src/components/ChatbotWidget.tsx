import React, { useState } from 'react';
import { Bot, Send, X, MessageCircle, Sparkles } from 'lucide-react';

interface ChatbotWidgetProps {
  apiKey: string;
  centerName?: string;
}

interface ChatMsg { role: 'user' | 'bot'; text: string; ts: number; }

// #18 Chatbot AI 24/7
export const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({ apiKey, centerName = 'Gia Sư Thành Đạt' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([
    { role: 'bot', text: `Chào bạn! 👋 Mình là trợ lý AI của ${centerName}. Bạn cần tư vấn gì về gia sư ạ?`, ts: Date.now() },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const systemPrompt = `Bạn là trợ lý tư vấn AI của trung tâm ${centerName}. Trả lời ngắn gọn, thân thiện bằng tiếng Việt.
Thông tin:
- Số điện thoại/Zalo: 0822448444
- Dịch vụ: Tìm gia sư tại nhà, online, luyện thi
- Các môn: Toán, Lý, Hóa, Anh, Văn, và nhiều môn khác
- Khu vực: Hà Nội
- Học thử miễn phí 1-2 buổi
- Đổi gia sư miễn phí nếu không hài lòng
Hướng dẫn phụ huynh đăng ký tại giasu-dusky.vercel.app/dang-ky-hoc hoặc gọi 0822448444.`;

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg: ChatMsg = { role: 'user', text: input.trim(), ts: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      if (!apiKey) {
        setMessages(prev => [...prev, { role: 'bot', text: 'Xin lỗi, chức năng AI chưa được cấu hình. Vui lòng liên hệ 0822448444 để được tư vấn trực tiếp!', ts: Date.now() }]);
        setLoading(false);
        return;
      }
      const history = messages.slice(-6).map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.text }] }));
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: [...history, { role: 'user', parts: [{ text: userMsg.text }] }],
          generationConfig: { maxOutputTokens: 300 },
        }),
      });
      const data = await res.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Xin lỗi, mình chưa hiểu câu hỏi. Anh/chị gọi 0822448444 để được tư vấn nhé!';
      setMessages(prev => [...prev, { role: 'bot', text: reply, ts: Date.now() }]);
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: 'Lỗi kết nối. Vui lòng gọi 0822448444 để được hỗ trợ!', ts: Date.now() }]);
    } finally { setLoading(false); }
  };

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)}
        style={{ position: 'fixed', bottom: 24, left: 20, zIndex: 50, width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(99,102,241,.4)' }}
        className="lg:flex hidden">
        <Bot size={24} />
      </button>
    );
  }

  return (
    <div style={{ position: 'fixed', bottom: 24, left: 20, zIndex: 55, width: 380, maxWidth: 'calc(100vw - 40px)', background: '#fff', borderRadius: 4, boxShadow: '0 8px 40px rgba(0,0,0,.15)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', maxHeight: 480 }}>
      {/* Header */}
      <div style={{ padding: '12px 16px', background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', borderRadius: '16px 16px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Sparkles size={18} color="#fff" />
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>Tư vấn AI 24/7</span>
        </div>
        <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', opacity: .8 }}><X size={18} /></button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 8, minHeight: 250 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '80%', padding: '8px 12px', borderRadius: 4, fontSize: 13, lineHeight: 1.5,
              background: m.role === 'user' ? '#6366f1' : '#f1f5f9',
              color: m.role === 'user' ? '#fff' : '#334155',
              borderBottomRightRadius: m.role === 'user' ? 2 : 12,
              borderBottomLeftRadius: m.role === 'user' ? 12 : 2,
            }}>{m.text}</div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ padding: '8px 16px', background: '#f1f5f9', borderRadius: 4, fontSize: 13, color: '#94a3b8' }}>Đang trả lời...</div>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ padding: '8px 12px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: 8 }}>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Hỏi về gia sư, học phí, khu vực..."
          style={{ flex: 1, padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13, outline: 'none' }} />
        <button onClick={sendMessage} disabled={loading || !input.trim()}
          style={{ padding: '8px 12px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', opacity: loading || !input.trim() ? .5 : 1 }}>
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};
