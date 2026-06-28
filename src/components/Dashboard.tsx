import React from 'react';
import {
  BookOpen, GraduationCap, DollarSign, Copy, Star, Trophy,
  Sparkles, Clock, UserPlus, RefreshCw, Users, ChevronRight, ArrowRight
} from 'lucide-react';
import {
  ClassItem, TutorItem, ClassMatch, ParentRegistration, AttendanceRecord,
  TutorReview, TransactionItem, ActiveTab
} from '../types';

interface DashboardProps {
  classes: ClassItem[];
  tutors: TutorItem[];
  matches: ClassMatch[];
  registrations: ParentRegistration[];
  attendance: AttendanceRecord[];
  reviews: TutorReview[];
  transactions: TransactionItem[];
  totalRevenue: number;
  onNavigate: (tab: ActiveTab) => void;
  selectedClass?: ClassItem;
  aiMatches?: { tutorCode: string; matchPercentage: number; aiRationale: string }[];
  isMatchingLoading: boolean;
  onRunMatch: () => void;
  hasApiKey: boolean;
}

const fmt = (v: number) => new Intl.NumberFormat('vi-VN').format(v);

export const Dashboard: React.FC<DashboardProps> = ({
  classes, tutors, matches, registrations, attendance, reviews, transactions,
  totalRevenue, onNavigate, selectedClass, aiMatches, isMatchingLoading, onRunMatch, hasApiKey,
}) => {
  const pendingClasses = classes.filter(c => c.status === 'ĐANG TÌM' || c.status === 'KHẨN CẤP').length;
  const activeMatches = matches.filter(m => m.status === 'Đang dạy').length;
  const doneMatches = matches.filter(m => m.status === 'Hoàn thành').length;
  const matchRate = matches.length > 0 ? Math.round((doneMatches + activeMatches) / matches.length * 100) : 0;
  const pendingRegs = registrations.filter(r => r.status === 'Mới').length;

  const weekAgo = Date.now() - 7 * 86400000;
  const weekRegs = registrations.filter(r => r.createdAt > weekAgo).length;
  const weekMatches = matches.filter(m => m.createdAt > weekAgo).length;

  const tutorMap: Record<string, { name: string; active: number; rating: number }> = {};
  matches.filter(m => m.status === 'Đang dạy').forEach(m => {
    if (!tutorMap[m.tutorCode]) tutorMap[m.tutorCode] = { name: m.tutorName, active: 0, rating: 0 };
    tutorMap[m.tutorCode].active++;
  });
  Object.keys(tutorMap).forEach(code => {
    const rs = reviews.filter(rv => rv.tutorCode === code);
    tutorMap[code].rating = rs.length > 0
      ? rs.reduce((s, rv) => s + rv.rating, 0) / rs.length
      : (tutors.find(t => t.code === code)?.rating || 0);
  });
  const topTutors = Object.entries(tutorMap)
    .sort((a, b) => (b[1].active * 3 + b[1].rating * 2) - (a[1].active * 3 + a[1].rating * 2))
    .slice(0, 5);

  const recentPending = classes
    .filter(c => c.status === 'ĐANG TÌM' || c.status === 'KHẨN CẤP')
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
    .slice(0, 6);

  const monthLabels = ['T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12'];
  const currentMonth = new Date().getMonth();
  const monthData = monthLabels.map((label, idx) => {
    const start = new Date(new Date().getFullYear(), idx, 1).getTime();
    const end = new Date(new Date().getFullYear(), idx + 1, 1).getTime();
    const revenue = transactions
      .filter(t => {
        const d = t.createdAt || 0;
        return d >= start && d < end && t.status === 'Thành công';
      })
      .reduce((sum, t) => sum + (t.amount || 0), 0);
    return { label, revenue, isCurrent: idx === currentMonth };
  });
  const maxRevenue = Math.max(...monthData.map(d => d.revenue), 100000);

  const avgRating = tutors.length > 0
    ? (tutors.reduce((s, t) => s + t.rating, 0) / tutors.length).toFixed(1) : '0';

  const copyReport = () => {
    const r = [
      '📊 BÁO CÁO — Gia Sư Thành Đạt',
      `📅 ${new Date().toLocaleDateString('vi-VN')}`,
      `📋 Đơn mới tuần: +${weekRegs}`,
      `🎓 Ghép tuần: +${weekMatches}`,
      `📚 Đang dạy: ${activeMatches}`,
      `💰 Doanh thu: ${fmt(totalRevenue)}đ`,
    ].join('\n');
    navigator.clipboard.writeText(r);
    alert('Đã sao chép!');
  };

  // Shared card style
  const card: React.CSSProperties = {
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
  };

  const kpiCards = [
    { icon: <Users style={{ width: 20, height: 20 }} />, iconBg: '#eff6ff', iconColor: '#2563eb', label: 'Học viên đang học', value: String(activeMatches) },
    { icon: <BookOpen style={{ width: 20, height: 20 }} />, iconBg: '#fffbeb', iconColor: '#d97706', label: 'Lớp học hoạt động', value: String(classes.filter(c => c.status === 'ĐÃ CÓ GIA SƯ').length) },
    { icon: <DollarSign style={{ width: 20, height: 20 }} />, iconBg: '#ecfdf5', iconColor: '#059669', label: 'Doanh thu tháng này', value: `${fmt(totalRevenue)} đ` },
    { icon: <Clock style={{ width: 20, height: 20 }} />, iconBg: '#fff1f2', iconColor: '#e11d48', label: 'Đơn chờ xử lý', value: String(pendingRegs) },
    { icon: <UserPlus style={{ width: 20, height: 20 }} />, iconBg: '#f5f3ff', iconColor: '#7c3aed', label: 'Lớp cần gia sư', value: `${pendingClasses}/${classes.length}` },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── KPI ROW ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
        {kpiCards.map((c, i) => (
          <div
            key={i}
            onClick={() => onNavigate(i === 0 ? 'matches' : i === 1 ? 'classes' : i === 2 ? 'finance' : i === 3 ? 'registrations' : 'classes')}
            style={{
              ...card,
              padding: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              cursor: 'pointer',
              transition: 'box-shadow 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
          >
            <div style={{
              width: 42, height: 42, borderRadius: 4,
              background: c.iconBg, color: c.iconColor,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              {c.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, color: '#64748b', fontWeight: 500, marginBottom: 2 }}>{c.label}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#1e293b' }}>{c.value}</div>
            </div>
            <ChevronRight style={{ width: 16, height: 16, color: '#cbd5e1', flexShrink: 0 }} />
          </div>
        ))}
      </div>

      {/* ── CHARTS ROW ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Revenue chart */}
        <div style={{ ...card, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>📊 Thu - Chi</div>
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>Biểu đồ doanh thu theo tháng</div>
            </div>
            <span style={{ fontSize: 11, fontWeight: 500, color: '#94a3b8', background: '#f8fafc', padding: '4px 8px', borderRadius: 4 }}>
              {new Date().getFullYear()}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 140 }}>
            {monthData.map((d, i) => {
              const pct = maxRevenue > 0 ? (d.revenue / maxRevenue) * 100 : 0;
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
                  <div
                    title={`${d.label}: ${fmt(d.revenue)}đ`}
                    style={{
                      width: '60%',
                      height: `${Math.max(pct, d.revenue > 0 ? 4 : 0)}%`,
                      minHeight: d.revenue > 0 ? 4 : 0,
                      background: d.isCurrent ? '#4f46e5' : '#a5b4fc',
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 0.3s',
                    }}
                  />
                  <span style={{ fontSize: 10, fontWeight: d.isCurrent ? 700 : 500, color: d.isCurrent ? '#4f46e5' : '#94a3b8' }}>
                    {d.label}
                  </span>
                </div>
              );
            })}
          </div>
          <div style={{ borderTop: '1px solid #f1f5f9', marginTop: 12, paddingTop: 10, fontSize: 12, color: '#64748b' }}>
            Tổng thu: <b style={{ color: '#1e293b' }}>{fmt(totalRevenue)}đ</b>
          </div>
        </div>

        {/* Match rate + overview */}
        <div style={{ ...card, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', marginBottom: 16 }}>📈 Tỷ lệ ghép lớp</div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 16 }}>
            {[
              { label: 'Tổng lớp', value: classes.length, color: '#1e293b' },
              { label: 'Đã ghép', value: doneMatches + activeMatches, color: '#059669' },
              { label: 'Đang tìm', value: pendingClasses, color: '#d97706' },
              { label: 'Tỷ lệ', value: `${matchRate}%`, color: '#4f46e5' },
            ].map((item, i) => (
              <div key={i} style={{ background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: 4, padding: 10, textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: item.color }}>{item.value}</div>
                <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>{item.label}</div>
              </div>
            ))}
          </div>

          {/* Progress */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748b', marginBottom: 4 }}>
              <span>Tiến độ ghép lớp</span>
              <span style={{ fontWeight: 700, color: '#1e293b' }}>{matchRate}%</span>
            </div>
            <div style={{ width: '100%', height: 10, background: '#f1f5f9', borderRadius: 999 }}>
              <div style={{ height: 10, background: 'linear-gradient(90deg, #4f46e5, #10b981)', borderRadius: 999, width: `${matchRate}%`, transition: 'width 0.5s' }} />
            </div>
          </div>

          {/* System stats */}
          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { icon: '🎓', label: 'Tổng gia sư', value: tutors.length },
              { icon: '✅', label: 'Gia sư sẵn sàng', value: tutors.filter(t => t.status === 'online').length },
              { icon: '📋', label: 'Tổng đăng ký', value: registrations.length },
              { icon: '⭐', label: 'Điểm đánh giá TB', value: `${avgRating} ★` },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                <span style={{ flex: 1, fontSize: 13, color: '#475569' }}>{item.label}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── BOTTOM ROW: Classes + Tutors ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>

        {/* Classes table */}
        <div style={card}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>📚 Lớp mới cần gia sư</span>
            <span
              onClick={() => onNavigate('classes')}
              style={{ fontSize: 12, fontWeight: 600, color: '#4f46e5', cursor: 'pointer' }}
            >
              Xem tất cả →
            </span>
          </div>
          {recentPending.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
              Không có lớp nào cần tìm gia sư
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                  <th style={{ padding: '8px 20px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Môn học</th>
                  <th style={{ padding: '8px 20px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Khu vực</th>
                  <th style={{ padding: '8px 20px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Trạng thái</th>
                  <th style={{ padding: '8px 20px', textAlign: 'right', fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phí/buổi</th>
                </tr>
              </thead>
              <tbody>
                {recentPending.map(cls => (
                  <tr
                    key={cls.id || cls.code}
                    onClick={() => onNavigate('classes')}
                    style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '10px 20px' }}>
                      <div style={{ fontWeight: 600, color: '#1e293b' }}>{cls.subject}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>{cls.code}</div>
                    </td>
                    <td style={{ padding: '10px 20px', color: '#475569' }}>{cls.location}</td>
                    <td style={{ padding: '10px 20px' }}>
                      <span style={{
                        fontSize: 10, fontWeight: 700,
                        padding: '2px 8px', borderRadius: 999,
                        background: cls.status === 'KHẨN CẤP' ? '#fff1f2' : '#fffbeb',
                        color: cls.status === 'KHẨN CẤP' ? '#e11d48' : '#d97706',
                        border: `1px solid ${cls.status === 'KHẨN CẤP' ? '#fecdd3' : '#fef3c7'}`,
                      }}>
                        {cls.status === 'KHẨN CẤP' ? 'Khẩn cấp' : 'Đang tìm'}
                      </span>
                    </td>
                    <td style={{ padding: '10px 20px', textAlign: 'right', fontWeight: 700, color: '#334155' }}>
                      {fmt(cls.fee)}đ
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Top tutors + copy */}
        <div style={{ ...card, padding: 20, display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', marginBottom: 14 }}>🏆 Gia sư nổi bật</div>

          {topTutors.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}>
              <Trophy style={{ width: 36, height: 36, marginBottom: 8 }} />
              <span style={{ fontSize: 12, color: '#94a3b8' }}>Chưa có dữ liệu</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
              {topTutors.map(([code, data], i) => {
                const tutor = tutors.find(t => t.code === code);
                const COLORS = ['#4f46e5', '#f59e0b', '#10b981', '#ec4899', '#64748b'];
                return (
                  <div key={code} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 4px', borderRadius: 4 }}>
                    <span style={{ width: 18, fontSize: 12, fontWeight: 700, color: '#94a3b8', textAlign: 'center' }}>{i + 1}</span>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: tutor?.avatarColor || COLORS[i],
                      color: '#fff', fontSize: 11, fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {tutor?.avatar || data.name.charAt(0)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{data.name}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>{data.active} lớp · ★ {data.rating.toFixed(1)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <button
            onClick={copyReport}
            style={{
              marginTop: 14, width: '100%', padding: '10px 0',
              background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 4,
              fontSize: 13, fontWeight: 500, color: '#475569',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
          >
            <Copy style={{ width: 14, height: 14 }} /> Sao chép báo cáo
          </button>

          {hasApiKey && (
            <div style={{ marginTop: 12, padding: 14, background: '#eef2ff', border: '1px solid #c7d2fe', borderRadius: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#4f46e5', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Sparkles style={{ width: 14, height: 14 }} /> AI Gợi ý
                </span>
                {selectedClass && (
                  <button onClick={onRunMatch} disabled={isMatchingLoading}
                    style={{ background: 'none', border: 'none', color: '#4f46e5', cursor: 'pointer', padding: 4 }}>
                    <RefreshCw style={{ width: 14, height: 14, animation: isMatchingLoading ? 'spin 1s linear infinite' : 'none' }} />
                  </button>
                )}
              </div>
              {!selectedClass ? (
                <p style={{ fontSize: 12, color: '#64748b' }}>
                  Chọn lớp tại <span style={{ color: '#4f46e5', fontWeight: 600, cursor: 'pointer' }} onClick={() => onNavigate('classes')}>Quản lý lớp</span> để AI phân tích.
                </p>
              ) : (
                <p style={{ fontSize: 12, color: '#64748b' }}>Lớp {selectedClass.code} đã chọn. Nhấn nút làm mới.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
