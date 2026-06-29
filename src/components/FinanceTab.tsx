import React, { useState } from 'react';
import { TransactionItem } from '../types';
import { Plus, ArrowDownLeft, ArrowUpRight, CheckCircle2, Trash2, DollarSign, Clock, Download, Search, Printer, Pencil, X } from 'lucide-react';
import { generateReceiptPDF } from '../utils';

interface FinanceTabProps {
  transactions: TransactionItem[];
  onAddTransaction: (tr: TransactionItem) => void;
  onDeleteTransaction?: (id: string) => void;
  onUpdateTransaction?: (id: string, data: Partial<TransactionItem>) => void;
}

export const FinanceTab: React.FC<FinanceTabProps> = ({ transactions, onAddTransaction, onDeleteTransaction, onUpdateTransaction }) => {
  const [showModal, setShowModal] = useState(false);
  const [targetName, setTargetName] = useState('');
  const [amount, setAmount] = useState(500000);
  const [type, setType] = useState<TransactionItem['type']>('Thu phí gia sư');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  // Edit transaction state
  const [editTr, setEditTr] = useState<TransactionItem | null>(null);
  const [etAmount, setEtAmount] = useState(0);
  const [etType, setEtType] = useState<TransactionItem['type']>('Thu phí gia sư');
  const [etTarget, setEtTarget] = useState('');
  const [etNote, setEtNote] = useState('');

  const totalIncome = transactions
    .filter(t => t.type === 'Thu phí gia sư' && t.status === 'Thành công')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalRefund = transactions
    .filter(t => t.type === 'Hoàn tiền' && t.status === 'Thành công')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const totalSalary = transactions
    .filter(t => t.type === 'Thanh toán lương' && t.status === 'Thành công')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const netRevenue = totalIncome - totalRefund - totalSalary;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetName) return;
    onAddTransaction({
      receiptId: `REC-${Math.floor(1000 + Math.random() * 9000)}`,
      type,
      amount: Number(amount) || 200000,
      targetName,
      date: new Date().toLocaleDateString('vi-VN') + ' ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      status: 'Thành công',
    });
    setShowModal(false);
    setTargetName('');
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('vi-VN').format(val);

  const exportCSV = () => {
    if (transactions.length === 0) return;
    const header = 'Mã Biên Lai,Loại,Đối tượng,Số tiền,Thời gian,Trạng thái\n';
    const rows = transactions.map(t => `${t.receiptId},${t.type},"${t.targetName}",${t.amount},${t.date},${t.status}`).join('\n');
    const blob = new Blob(["\uFEFF" + header + rows], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `tai-chinh-${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Finance Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        {[
          { label: 'Tổng thu', value: totalIncome, color: '#059669', icon: <ArrowDownLeft className="w-5 h-5" />, desc: 'Phí kết nối gia sư', bg: '#ecfdf5', iconBg: '#d1fae5' },
          { label: 'Hoàn trả', value: totalRefund, color: '#e11d48', icon: <ArrowUpRight className="w-5 h-5" />, desc: 'Hoàn phí & bảo lưu', bg: '#fff1f2', iconBg: '#fecdd3' },
          { label: 'Chi phí', value: totalSalary, color: '#d97706', icon: <DollarSign className="w-5 h-5" />, desc: 'Vận hành, quảng cáo', bg: '#fffbeb', iconBg: '#fef3c7' },
        ].map((m, i) => (
          <div key={i} className="bg-white rounded-lg border border-slate-200 shadow-xs" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 4, background: m.iconBg, color: m.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {m.icon}
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{m.label}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: m.color, lineHeight: 1.2 }}>{formatCurrency(m.value)}đ</div>
              </div>
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>{m.desc}</div>
          </div>
        ))}
        <div style={{ padding: 20, background: '#0f172a', borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: 120, height: 120, background: 'radial-gradient(circle, rgba(79,70,229,0.3) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Lợi nhuận ròng</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: netRevenue >= 0 ? '#34d399' : '#fb7185', lineHeight: 1.2, marginBottom: 12 }}>
            {netRevenue >= 0 ? '+' : ''}{formatCurrency(netRevenue)}đ
          </div>
          <button onClick={() => setShowModal(true)}
            style={{ width: '100%', padding: '10px 16px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 4, fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'background 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#4338ca')}
            onMouseLeave={e => (e.currentTarget.style.background = '#4f46e5')}>
            <Plus className="w-4 h-4" /> Lập phiếu thu / chi
          </button>
        </div>
      </div>

      {/* F39: Monthly Revenue Trend — redesigned chart */}
      {(() => {
        // Build monthly data from transactions
        const monthlyData: Record<string, { income: number; refund: number; expense: number; sortKey: number }> = {};
        transactions.forEach(t => {
          const dateParts = t.date.split(/[/,\- ]/);
          if (dateParts.length < 2) return;
          // Support DD/MM/YYYY format
          let dayStr = dateParts[0], monthStr = dateParts[1], yearStr = dateParts[2] || String(new Date().getFullYear());
          // Handle MM/DD/YYYY (shouldn't happen with vi-VN but just in case)
          const monthNum = monthStr.padStart(2, '0');
          const yearNum = yearStr.slice(0, 4); // take first 4 chars in case of trailing chars
          const key = `T${monthNum}/${yearNum}`;
          const sortKey = parseInt(yearNum) * 100 + parseInt(monthNum);
          if (!monthlyData[key]) monthlyData[key] = { income: 0, refund: 0, expense: 0, sortKey };
          if (t.type === 'Thu phí gia sư') monthlyData[key].income += Math.abs(t.amount);
          else if (t.type === 'Hoàn tiền') monthlyData[key].refund += Math.abs(t.amount);
          else monthlyData[key].expense += Math.abs(t.amount); // Vận hành, Thanh toán lương, etc.
        });
        
        // Sort chronologically and take last 6
        const months = Object.entries(monthlyData)
          .sort(([, a], [, b]) => a.sortKey - b.sortKey)
          .slice(-6);
        if (months.length === 0) return null;
        
        const maxVal = Math.max(...months.map(([, d]) => Math.max(d.income, d.refund + d.expense)), 100000);
        const chartH = 200;
        const gridLines = [0, 0.25, 0.5, 0.75, 1];
        
        return (
          <div className="bg-white rounded-lg border border-slate-200 shadow-xs" style={{ padding: '24px 24px 16px' }}>
            {/* Header */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h4 style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <DollarSign className="w-4 h-4" style={{ color: '#4f46e5' }} /> Doanh thu theo tháng
                </h4>
              </div>
              <div style={{ display: 'flex', gap: 20, fontSize: 11, color: '#64748b', marginTop: 8 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 12, height: 12, borderRadius: 2, background: 'linear-gradient(135deg, #059669, #10b981)', display: 'inline-block' }} /> Phí kết nối (Thu)
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 12, height: 12, borderRadius: 2, background: 'linear-gradient(135deg, #e11d48, #f43f5e)', display: 'inline-block' }} /> Hoàn trả & Chi phí
                </span>
              </div>
            </div>
            
            {/* Chart area */}
            <div style={{ position: 'relative', height: chartH, marginBottom: 8 }}>
              {/* Grid lines + Y-axis labels */}
              {gridLines.map((pct, i) => (
                <div key={i} style={{ position: 'absolute', left: 60, right: 0, bottom: pct * chartH, borderBottom: `1px ${i === 0 ? 'solid' : 'dashed'} #f1f5f9`, zIndex: 0 }}>
                  <span style={{ position: 'absolute', left: -60, top: -8, fontSize: 10, color: '#94a3b8', fontWeight: 500, width: 56, textAlign: 'right' }}>
                    {formatCurrency(Math.round(maxVal * pct / 1000) * 1000)}
                  </span>
                </div>
              ))}
              
              {/* Bars */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: months.length <= 2 ? 48 : 16, height: '100%', paddingLeft: 64, paddingRight: 16, position: 'relative', zIndex: 1 }}>
                {months.map(([month, data]) => {
                  const incomeH = data.income > 0 ? Math.max(Math.round(data.income / maxVal * chartH), 6) : 0;
                  const totalExpense = data.refund + data.expense;
                  const expenseH = totalExpense > 0 ? Math.max(Math.round(totalExpense / maxVal * chartH), 6) : 0;
                  const net = data.income - totalExpense;
                  return (
                    <div key={month} style={{ flex: 1, maxWidth: 100, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      {/* Value label on top */}
                      {incomeH > 0 && (
                        <div style={{ fontSize: 10, fontWeight: 700, color: '#059669', marginBottom: 4, whiteSpace: 'nowrap' }}>
                          {formatCurrency(data.income)}đ
                        </div>
                      )}
                      {incomeH === 0 && expenseH > 0 && (
                        <div style={{ fontSize: 10, fontWeight: 700, color: '#e11d48', marginBottom: 4, whiteSpace: 'nowrap' }}>
                          -{formatCurrency(totalExpense)}đ
                        </div>
                      )}
                      {/* Bar group */}
                      <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', width: '100%', justifyContent: 'center' }}>
                        {/* Income bar */}
                        {incomeH > 0 && (
                          <div title={`Thu: ${formatCurrency(data.income)}đ`} style={{ 
                            width: expenseH > 0 ? '45%' : '65%', 
                            height: incomeH, 
                            background: 'linear-gradient(180deg, #059669 0%, #10b981 100%)', 
                            borderRadius: '3px 3px 0 0',
                            transition: 'height 0.3s ease',
                            minHeight: 6,
                          }} />
                        )}
                        {/* Expense bar */}
                        {expenseH > 0 && (
                          <div title={`Chi/Hoàn: ${formatCurrency(totalExpense)}đ`} style={{ 
                            width: incomeH > 0 ? '45%' : '65%', 
                            height: expenseH, 
                            background: 'linear-gradient(180deg, #e11d48 0%, #f43f5e 100%)', 
                            borderRadius: '3px 3px 0 0',
                            transition: 'height 0.3s ease',
                            minHeight: 6,
                          }} />
                        )}
                      </div>
                      {/* Month label */}
                      <div style={{ fontSize: 11, fontWeight: 600, color: '#475569', marginTop: 8 }}>{month}</div>
                      {/* Net label */}
                      <div style={{ fontSize: 10, fontWeight: 700, color: net >= 0 ? '#059669' : '#e11d48', marginTop: 2, whiteSpace: 'nowrap' }}>
                        {net >= 0 ? '+' : ''}{formatCurrency(net)}đ
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Transactions Table */}
      <div className="bg-white rounded-lg border border-slate-200/75 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-indigo-600" />
            <span>Lịch sử Giao dịch</span>
            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">{transactions.length}</span>
          </h3>
          {transactions.length > 0 && (
            <button onClick={exportCSV}
              className="px-3 py-1.5 bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-600 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-200">
              <Download className="w-3.5 h-3.5" /><span>Xuất CSV</span>
            </button>
          )}
        </div>

        {/* Search + Filter */}
        {transactions.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3 px-6 py-3 border-b border-slate-100">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 4, flex: 1, maxWidth: 320 }} className="focus-within:border-indigo-500 focus-within:bg-white transition-colors">
              <Search style={{ width: 16, height: 16, color: '#94a3b8', flexShrink: 0 }} />
              <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                placeholder="Tìm mã phiếu, đối tượng..."
                style={{ border: 'none', background: 'transparent', outline: 'none', padding: '8px 0', fontSize: 14, width: '100%' }} />
            </div>
            <div className="flex gap-2 flex-wrap">
              {[
                { val: 'all', label: 'Tất cả' },
                { val: 'Thu phí gia sư', label: 'Phí kết nối' },
                { val: 'Hoàn tiền', label: 'Hoàn trả' },
                { val: 'Thanh toán lương', label: 'Vận hành' },
              ].map(f => (
                <button key={f.val} onClick={() => setTypeFilter(f.val)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold border cursor-pointer transition-all ${
                    typeFilter === f.val ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                  }`}>{f.label}</button>
              ))}
            </div>
          </div>
        )}

        {transactions.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <DollarSign className="w-10 h-10 mx-auto mb-3 text-slate-300" />
            <p className="font-semibold text-sm">Chưa có giao dịch nào</p>
            <p className="text-xs mt-1">Nhấn "Lập phiếu thu / chi" để bắt đầu ghi nhận tài chính</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[11px] uppercase tracking-widest text-slate-400 bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-3 font-semibold">Mã Biên Lai</th>
                  <th className="px-6 py-3 font-semibold">Loại</th>
                  <th className="px-6 py-3 font-semibold">Đối tượng</th>
                  <th className="px-6 py-3 font-semibold">Số tiền</th>
                  <th className="px-6 py-3 font-semibold">Thời gian</th>
                  <th className="px-6 py-3 font-semibold">Trạng thái</th>
                  <th className="px-6 py-3 font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-100">
                {transactions
                  .filter(t => typeFilter === 'all' || t.type === typeFilter)
                  .filter(t => !searchTerm || t.targetName.toLowerCase().includes(searchTerm.toLowerCase()) || t.receiptId.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((tr) => (
                  <tr key={tr.id || tr.receiptId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-xs text-slate-700">{tr.receiptId}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 w-fit ${
                        tr.type === 'Thu phí gia sư' ? 'bg-emerald-50 text-emerald-700' :
                        tr.type === 'Thanh toán lương' ? 'bg-amber-50 text-amber-700' :
                        'bg-rose-50 text-rose-700'
                      }`}>
                        {tr.type === 'Thu phí gia sư' ? <ArrowDownLeft className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                        {tr.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-800">{tr.targetName}</td>
                    <td className={`px-6 py-4 font-bold ${tr.type === 'Thu phí gia sư' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {tr.type === 'Thu phí gia sư' ? '+' : '-'}{formatCurrency(tr.amount)}đ
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 font-mono">{tr.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 w-fit ${
                        tr.status === 'Thành công' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {tr.status === 'Thành công' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {tr.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => generateReceiptPDF(tr)}
                          className="p-1.5 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors cursor-pointer" title="In phiếu">
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        {tr.id && onUpdateTransaction && (
                          <button onClick={() => { setEditTr(tr); setEtAmount(tr.amount); setEtType(tr.type); setEtTarget(tr.targetName); setEtNote(tr.note || ''); }}
                            className="p-1.5 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition-colors cursor-pointer" title="Sửa giao dịch">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {tr.id && onDeleteTransaction && (
                          <button onClick={() => { if (window.confirm(`Xóa giao dịch ${tr.receiptId}?`)) onDeleteTransaction(tr.id!); }}
                            className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-2xl border border-slate-200/75 animate-scale-in">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Lập Biên lai mới</h3>
            <form onSubmit={handleCreate} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Loại phiếu</label>
                <select value={type} onChange={(e) => setType(e.target.value as any)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-indigo-500 text-sm transition-colors">
                  <option value="Thu phí gia sư">Thu phí kết nối (1 lần/lớp)</option>
                  <option value="Hoàn tiền">Hoàn trả phí cho gia sư</option>
                  <option value="Thanh toán lương">Chi phí vận hành / quảng cáo</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Đối tượng nộp/nhận *</label>
                <input type="text" required placeholder="Ví dụ: Gia sư Nguyễn Văn A - Lớp Toán 12"
                  value={targetName} onChange={(e) => setTargetName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-indigo-500 text-sm transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Số tiền (VNĐ)</label>
                <input type="number" required value={amount} onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-indigo-500 text-sm font-bold text-indigo-600 transition-colors" />
              </div>
              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors">Hủy</button>
                <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-sm">Tạo biên lai</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Transaction Modal */}
      {editTr && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4" onClick={() => setEditTr(null)}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>✏️ Sửa giao dịch {editTr.receiptId}</h3>
              <button onClick={() => setEditTr(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><X style={{ width: 18, height: 18 }} /></button>
            </div>
            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4, textTransform: 'uppercase' }}>Loại</label>
                  <select value={etType} onChange={e => setEtType(e.target.value as TransactionItem['type'])}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 text-sm">
                    <option value="Thu phí gia sư">Thu phí gia sư</option>
                    <option value="Hoàn tiền">Hoàn tiền</option>
                    <option value="Thanh toán lương">Thanh toán lương</option>
                    <option value="Vận hành">Vận hành</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4, textTransform: 'uppercase' }}>Số tiền (VNĐ)</label>
                  <input type="number" value={etAmount} onChange={e => setEtAmount(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-indigo-500 text-sm" />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4, textTransform: 'uppercase' }}>Đối tượng</label>
                <input value={etTarget} onChange={e => setEtTarget(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-indigo-500 text-sm" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4, textTransform: 'uppercase' }}>Ghi chú</label>
                <input value={etNote} onChange={e => setEtNote(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-indigo-500 text-sm" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 8, borderTop: '1px solid #e2e8f0' }}>
                <button onClick={() => setEditTr(null)} style={{ padding: '8px 16px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 12, fontWeight: 700, cursor: 'pointer', background: '#fff', color: '#475569' }}>Hủy</button>
                <button onClick={() => { if (editTr?.id && onUpdateTransaction) { onUpdateTransaction(editTr.id, { amount: etAmount, type: etType, targetName: etTarget, note: etNote }); setEditTr(null); } }}
                  style={{ padding: '8px 20px', border: 'none', borderRadius: 4, fontSize: 12, fontWeight: 700, cursor: 'pointer', background: '#4f46e5', color: '#fff' }}>💾 Lưu</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
