import React, { useState } from 'react';
import { Phone, MessageCircle, HelpCircle, X, Send, CheckCircle2 } from 'lucide-react';
import { ContactMessage } from '../types';

interface FloatingActionsProps {
  zaloNumber?: string;
  phoneNumber?: string;
  onNavigateRegister: () => void;
  onContactSubmit?: (msg: ContactMessage) => Promise<void>;
}

export const FloatingActions: React.FC<FloatingActionsProps> = ({
  zaloNumber, phoneNumber, onNavigateRegister, onContactSubmit,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [cName, setCName] = useState('');
  const [cPhone, setCPhone] = useState('');
  const [cMsg, setCMsg] = useState('');
  const [cSent, setCSent] = useState(false);
  const [cSending, setCSending] = useState(false);

  const handleContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cName || !cPhone || !onContactSubmit) return;
    setCSending(true);
    try {
      await onContactSubmit({ name: cName, phone: cPhone, message: cMsg, createdAt: Date.now(), isRead: false });
      setCSent(true);
      setTimeout(() => { setCSent(false); setCName(''); setCPhone(''); setCMsg(''); setShowContact(false); }, 2500);
    } catch (err) { console.error(err); }
    finally { setCSending(false); }
  };

  const fabStyle: React.CSSProperties = {
    position: 'fixed', bottom: 24, right: 20, zIndex: 55, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10,
  };

  const btnBase: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: 8, border: 'none', borderRadius: 28, cursor: 'pointer',
    fontSize: 13, fontWeight: 600, boxShadow: '0 4px 12px rgba(0,0,0,.15)', transition: 'transform .15s, opacity .15s',
    whiteSpace: 'nowrap',
  };

  return (
    <>
      <div style={fabStyle} className="lg:flex hidden">
        {/* Expanded action buttons */}
        {expanded && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, animation: 'fadeIn .2s ease-out' }}>
            {/* Tư vấn */}
            <button onClick={() => { setShowContact(true); setExpanded(false); }}
              style={{ ...btnBase, padding: '10px 18px', background: '#fff', color: '#334155' }}>
              <HelpCircle size={18} color="#4f46e5" /> Yêu cầu tư vấn
            </button>

            {/* Zalo */}
            {zaloNumber && (
              <a href={`https://zalo.me/${zaloNumber}`} target="_blank" rel="noopener noreferrer"
                style={{ ...btnBase, padding: '10px 18px', background: '#fff', color: '#334155', textDecoration: 'none' }}>
                <MessageCircle size={18} color="#4f46e5" /> Zalo: {zaloNumber}
              </a>
            )}

            {/* Gọi điện */}
            {(phoneNumber || zaloNumber) && (
              <a href={`tel:${phoneNumber || zaloNumber}`}
                style={{ ...btnBase, padding: '10px 18px', background: '#fff', color: '#334155', textDecoration: 'none' }}>
                <Phone size={18} color="#dc2626" /> Gọi ngay
              </a>
            )}
          </div>
        )}

        {/* Main FAB */}
        <button onClick={() => setExpanded(!expanded)}
          style={{
            ...btnBase, width: 52, height: 52, padding: 0, justifyContent: 'center',
            background: expanded ? '#64748b' : '#4f46e5', color: '#fff',
            borderRadius: '50%',
          }}>
          {expanded ? <X size={22} /> : <MessageCircle size={22} />}
        </button>
      </div>

      {/* Mobile: simple fixed bottom buttons above nav */}
      <div className="lg:hidden" style={{
        position: 'fixed', bottom: 60, right: 12, zIndex: 55, display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        {zaloNumber && (
          <a href={`https://zalo.me/${zaloNumber}`} target="_blank" rel="noopener noreferrer"
            style={{ ...btnBase, width: 44, height: 44, padding: 0, justifyContent: 'center', borderRadius: '50%', background: '#4f46e5', color: '#fff', textDecoration: 'none' }}>
            <MessageCircle size={20} />
          </a>
        )}
        {(phoneNumber || zaloNumber) && (
          <a href={`tel:${phoneNumber || zaloNumber}`}
            style={{ ...btnBase, width: 44, height: 44, padding: 0, justifyContent: 'center', borderRadius: '50%', background: '#16a34a', color: '#fff', textDecoration: 'none' }}>
            <Phone size={20} />
          </a>
        )}
      </div>

      {/* Contact Popup */}
      {showContact && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(0,0,0,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowContact(false); }}>
          <div style={{ background: '#fff', borderRadius: 4, maxWidth: 420, width: '100%', padding: 24, position: 'relative' }}>
            <button onClick={() => setShowContact(false)} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
              <X size={20} />
            </button>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>Yêu cầu tư vấn</h3>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>Để lại thông tin, trung tâm sẽ liên hệ trong 30 phút.</p>

            {cSent ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <CheckCircle2 size={40} color="#22c55e" style={{ margin: '0 auto 8px', display: 'block' }} />
                <div style={{ fontWeight: 700, color: '#0f172a' }}>Đã gửi thành công!</div>
              </div>
            ) : (
              <form onSubmit={handleContact} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input required value={cName} onChange={e => setCName(e.target.value)} placeholder="Họ tên *"
                  style={{ padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 14, outline: 'none' }} />
                <input required value={cPhone} onChange={e => setCPhone(e.target.value)} placeholder="Số điện thoại *" type="tel"
                  style={{ padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 14, outline: 'none' }} />
                <textarea value={cMsg} onChange={e => setCMsg(e.target.value)} placeholder="Nội dung cần tư vấn..." rows={3}
                  style={{ padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 14, outline: 'none', resize: 'none' }} />
                <button type="submit" disabled={cSending}
                  style={{ padding: '12px 0', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 4, fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <Send size={16} /> {cSending ? 'Đang gửi...' : 'Gửi yêu cầu'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};
