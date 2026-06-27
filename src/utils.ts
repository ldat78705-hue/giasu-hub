// ===== PDF Receipt Generator =====
export const generateReceiptPDF = (receipt: {
  receiptId: string; type: string; targetName: string; amount: number; date: string; status: string;
  centerName?: string; centerPhone?: string;
}) => {
  const fmt = (v: number) => new Intl.NumberFormat('vi-VN').format(v);
  const typeLabel = receipt.type === 'Thu phí gia sư' ? 'PHIẾU THU' : receipt.type === 'Hoàn tiền' ? 'PHIẾU HOÀN' : 'PHIẾU CHI';
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${typeLabel} ${receipt.receiptId}</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',sans-serif;padding:40px;max-width:600px;margin:0 auto}
.header{text-align:center;border-bottom:2px solid #1e40af;padding-bottom:16px;margin-bottom:24px}
.header h1{font-size:20px;color:#1e40af;margin-bottom:4px}.header p{font-size:12px;color:#64748b}
.badge{display:inline-block;background:#dbeafe;color:#1e40af;padding:4px 16px;border-radius:20px;font-size:13px;font-weight:700;margin-top:8px}
.row{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:14px}
.row .label{color:#64748b}.row .value{font-weight:600;color:#0f172a}
.amount{font-size:28px;font-weight:800;color:#1e40af;text-align:center;padding:20px 0;margin:16px 0;background:#f8fafc;border-radius:12px}
.footer{text-align:center;margin-top:32px;font-size:11px;color:#94a3b8;border-top:1px solid #e2e8f0;padding-top:16px}
@media print{body{padding:20px}}</style></head><body>
<div class="header"><h1>${receipt.centerName || 'Gia Sư Thành Đạt'}</h1>
<p>${receipt.centerPhone ? 'SĐT: ' + receipt.centerPhone : ''}</p>
<div class="badge">${typeLabel}</div></div>
<div class="row"><span class="label">Mã phiếu:</span><span class="value">${receipt.receiptId}</span></div>
<div class="row"><span class="label">Đối tượng:</span><span class="value">${receipt.targetName}</span></div>
<div class="row"><span class="label">Loại giao dịch:</span><span class="value">${receipt.type}</span></div>
<div class="row"><span class="label">Ngày:</span><span class="value">${receipt.date}</span></div>
<div class="row"><span class="label">Trạng thái:</span><span class="value">${receipt.status}</span></div>
<div class="amount">${fmt(receipt.amount)} VNĐ</div>
<div class="footer"><p>In ngày: ${new Date().toLocaleDateString('vi-VN')}</p><p style="margin-top:24px">Người lập phiếu _________________ &nbsp;&nbsp;&nbsp; Người nhận _________________</p></div>
</body></html>`;
  const w = window.open('', '_blank');
  if (w) { w.document.write(html); w.document.close(); w.print(); }
};

// ===== Duplicate Detection =====
export const findDuplicates = <T extends { phone?: string; parentPhone?: string; name?: string; parentName?: string }>(
  items: T[], newPhone: string, newName?: string
): T[] => {
  if (!newPhone) return [];
  const cleaned = newPhone.replace(/\s/g, '');
  return items.filter(item => {
    const itemPhone = (item.phone || item.parentPhone || '').replace(/\s/g, '');
    if (itemPhone === cleaned) return true;
    if (newName && (item.name || item.parentName || '').toLowerCase() === newName.toLowerCase()) return true;
    return false;
  });
};

// ===== Message Templates =====
export const MESSAGE_TEMPLATES = [
  {
    id: 'new_reg',
    title: '📋 Xác nhận đăng ký',
    template: 'Chào anh/chị {parentName}, Trung tâm Gia Sư Thành Đạt đã nhận đơn đăng ký môn {subject} cho bé {studentName}. Chúng tôi sẽ liên hệ trong vòng 30 phút. Hotline: {phone}',
  },
  {
    id: 'matched',
    title: '✅ Đã ghép gia sư',
    template: 'Chào anh/chị {parentName}, Trung tâm đã tìm được gia sư phù hợp cho bé {studentName} môn {subject}. GS {tutorName} sẽ liên hệ anh/chị để sắp xếp buổi học thử. Mọi thắc mắc xin gọi {phone}.',
  },
  {
    id: 'remind_contact',
    title: '📞 Nhắc liên hệ PH',
    template: 'Chào anh/chị {parentName}, Trung tâm Gia Sư Thành Đạt gọi để xác nhận nhu cầu tìm gia sư môn {subject} cho bé {studentName}. Anh/chị có tiện nghe máy không ạ?',
  },
  {
    id: 'tutor_approved',
    title: '🎓 Duyệt gia sư',
    template: 'Chào {tutorName}, Hồ sơ đăng ký gia sư của bạn đã được xác minh thành công. Bạn có thể bắt đầu nhận lớp từ bây giờ. Chúc bạn dạy tốt!',
  },
  {
    id: 'payment_remind',
    title: '💰 Nhắc thanh toán',
    template: 'Chào anh/chị {parentName}, Trung tâm xin nhắc về phí gia sư tháng này cho bé {studentName}. Số tiền: {amount}. Vui lòng thanh toán trước ngày {deadline}. Cảm ơn anh/chị!',
  },
  {
    id: 'class_cancel',
    title: '❌ Hủy lớp',
    template: 'Chào anh/chị {parentName}, Lớp {classCode} môn {subject} đã được hủy theo yêu cầu. Nếu cần tìm gia sư mới, vui lòng liên hệ {phone}. Trân trọng!',
  },
  {
    id: 'feedback_request',
    title: '⭐ Xin đánh giá',
    template: 'Chào anh/chị {parentName}, Bé {studentName} đã học với GS {tutorName} được 1 tháng. Anh/chị đánh giá chất lượng giảng dạy thế nào ạ? (1-5 sao). Phản hồi giúp trung tâm phục vụ tốt hơn!',
  },
];

// ===== Excel Import Parser =====
export const parseCSVImport = (csvText: string): Record<string, string>[] => {
  const lines = csvText.split('\n').filter(l => l.trim());
  if (lines.length < 2) return [];
  // Remove BOM
  const headerLine = lines[0].replace(/^\uFEFF/, '');
  const headers = headerLine.split(',').map(h => h.replace(/^"|"$/g, '').trim());
  return lines.slice(1).map(line => {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    for (const char of line) {
      if (char === '"') { inQuotes = !inQuotes; }
      else if (char === ',' && !inQuotes) { values.push(current.trim()); current = ''; }
      else { current += char; }
    }
    values.push(current.trim());
    const row: Record<string, string> = {};
    headers.forEach((h, i) => { row[h] = values[i] || ''; });
    return row;
  });
};

// ===== Reminder Logic =====
export const getOverdueRegistrations = (registrations: { status: string; createdAt: number; parentName: string; phone: string; id?: string }[]) => {
  const now = Date.now();
  const HOURS_24 = 24 * 60 * 60 * 1000;
  return registrations.filter(r => r.status === 'Mới' && (now - r.createdAt) > HOURS_24);
};

// ===== KPI Calculations =====
export const calculateKPIs = (
  matches: { status: string; createdAt: number; fee: number }[],
  registrations: { status: string; createdAt: number }[],
  tutors: { verified: boolean; status: string }[],
) => {
  const totalRegs = registrations.length;
  const matchedRegs = registrations.filter(r => r.status === 'Đã xếp lớp').length;
  const matchRate = totalRegs > 0 ? Math.round((matchedRegs / totalRegs) * 100) : 0;

  const now = Date.now();
  const thisMonth = matches.filter(m => {
    const d = new Date(m.createdAt);
    const n = new Date(now);
    return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear();
  });
  const lastMonth = matches.filter(m => {
    const d = new Date(m.createdAt);
    const n = new Date(now);
    const lm = n.getMonth() === 0 ? 11 : n.getMonth() - 1;
    const ly = n.getMonth() === 0 ? n.getFullYear() - 1 : n.getFullYear();
    return d.getMonth() === lm && d.getFullYear() === ly;
  });

  const revenueThisMonth = thisMonth.filter(m => m.status !== 'Hủy').reduce((s, m) => s + m.fee, 0);
  const revenueLastMonth = lastMonth.filter(m => m.status !== 'Hủy').reduce((s, m) => s + m.fee, 0);
  const revenueGrowth = revenueLastMonth > 0 ? Math.round(((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100) : 0;

  const activeTutors = tutors.filter(t => t.verified && t.status === 'online').length;
  const totalTutors = tutors.length;
  const tutorActiveRate = totalTutors > 0 ? Math.round((activeTutors / totalTutors) * 100) : 0;

  // Monthly revenue for chart (last 6 months)
  const monthlyRevenue: { month: string; revenue: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now);
    d.setMonth(d.getMonth() - i);
    const label = `T${d.getMonth() + 1}`;
    const rev = matches.filter(m => {
      const md = new Date(m.createdAt);
      return md.getMonth() === d.getMonth() && md.getFullYear() === d.getFullYear() && m.status !== 'Hủy';
    }).reduce((s, m) => s + m.fee, 0);
    monthlyRevenue.push({ month: label, revenue: rev });
  }

  return { matchRate, revenueThisMonth, revenueLastMonth, revenueGrowth, activeTutors, tutorActiveRate, thisMonthMatches: thisMonth.length, lastMonthMatches: lastMonth.length, monthlyRevenue };
};

