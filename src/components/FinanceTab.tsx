import React, { useState } from 'react';
import { TransactionItem } from '../types';
import { Plus, ArrowDownLeft, ArrowUpRight, CheckCircle2, Trash2, DollarSign, Clock, Download, Search, Printer } from 'lucide-react';
import { generateReceiptPDF } from '../utils';

interface FinanceTabProps {
  transactions: TransactionItem[];
  onAddTransaction: (tr: TransactionItem) => void;
  onDeleteTransaction?: (id: string) => void;
}

export const FinanceTab: React.FC<FinanceTabProps> = ({ transactions, onAddTransaction, onDeleteTransaction }) => {
  const [showModal, setShowModal] = useState(false);
  const [targetName, setTargetName] = useState('');
  const [amount, setAmount] = useState(500000);
  const [type, setType] = useState<TransactionItem['type']>('Thu phí gia sư');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const totalIncome = transactions
    .filter(t => t.type === 'Thu phí gia sư' && t.status === 'Thành công')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalRefund = transactions
    .filter(t => t.type === 'Hoàn tiền')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSalary = transactions
    .filter(t => t.type === 'Thanh toán lương')
    .reduce((sum, t) => sum + t.amount, 0);

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
    <div className="col-span-12 space-y-6">
      {/* Finance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">Tổng thu</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">{formatCurrency(totalIncome)}đ</div>
          <div className="text-xs text-slate-400 mt-1">40% tháng đầu (có thể điều chỉnh)</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">Hoàn trả</div>
          <div className="text-2xl font-bold text-rose-600 mt-1">{formatCurrency(totalRefund)}đ</div>
          <div className="text-xs text-slate-400 mt-1">Hoàn phí & bảo lưu</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">Chi phí</div>
          <div className="text-2xl font-bold text-amber-600 mt-1">{formatCurrency(totalSalary)}đ</div>
          <div className="text-xs text-slate-400 mt-1">Vận hành, quảng cáo...</div>
        </div>
        <div className="bg-[#0F172A] text-white p-5 rounded-2xl shadow-lg">
          <div className="text-slate-400 text-xs font-bold uppercase">Lợi nhuận ròng</div>
          <div className={`text-2xl font-bold mt-1 ${netRevenue >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {netRevenue >= 0 ? '+' : ''}{formatCurrency(netRevenue)}đ
          </div>
          <button onClick={() => setShowModal(true)}
            className="w-full mt-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
            <Plus className="w-4 h-4" /><span>Lập phiếu thu / chi</span>
          </button>
        </div>
      </div>

      {/* F39: Monthly Revenue Trend */}
      {transactions.length > 0 && (() => {
        const monthlyData: Record<string, { income: number; refund: number; expense: number }> = {};
        transactions.forEach(t => {
          const dateParts = t.date.split(/[/, ]/);
          const key = dateParts.length >= 2 ? `${dateParts[1]}/${dateParts[2] || new Date().getFullYear()}` : 'N/A';
          if (!monthlyData[key]) monthlyData[key] = { income: 0, refund: 0, expense: 0 };
          if (t.type === 'Thu phí gia sư') monthlyData[key].income += t.amount;
          else if (t.type === 'Hoàn tiền') monthlyData[key].refund += t.amount;
          else monthlyData[key].expense += t.amount;
        });
        const months = Object.entries(monthlyData).slice(-4);
        const maxVal = Math.max(...months.map(([, d]) => d.income), 1);
        return (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
            <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-4">📊 Doanh thu phí KN theo tháng</h4>
            <div className="flex items-end gap-3" style={{ height: 120 }}>
              {months.map(([month, data]) => {
                const h = Math.max(Math.round(data.income / maxVal * 100), 4);
                const net = data.income - data.refund - data.expense;
                return (
                  <div key={month} className="flex-1 flex flex-col items-center">
                    <div className="text-[9px] font-bold text-emerald-600 mb-1">{formatCurrency(data.income)}đ</div>
                    <div className="w-full rounded-t-lg transition-all" style={{ height: h, background: net >= 0 ? 'linear-gradient(135deg, #059669, #10b981)' : 'linear-gradient(135deg, #dc2626, #ef4444)' }} />
                    <div className="text-[10px] font-bold text-slate-600 mt-2">{month}</div>
                    {data.refund > 0 && <div className="text-[8px] text-red-500">-{formatCurrency(data.refund)}đ</div>}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-slate-600" />
            <span>Lịch sử Giao dịch</span>
            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">{transactions.length}</span>
          </h3>
          {transactions.length > 0 && (
            <button onClick={exportCSV}
              className="px-3 py-1.5 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-600 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-200">
              <Download className="w-3.5 h-3.5" /><span>Xuất CSV</span>
            </button>
          )}
        </div>

        {/* Search + Filter */}
        {transactions.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3 px-6 py-3 border-b border-slate-100">
            <div className="relative flex-1 max-w-xs">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                placeholder="Tìm mã phiếu, đối tượng..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500" />
            </div>
            <div className="flex gap-2 flex-wrap">
              {[
                { val: 'all', label: 'Tất cả' },
                { val: 'Thu phí gia sư', label: 'Phí kết nối' },
                { val: 'Hoàn tiền', label: 'Hoàn trả' },
                { val: 'Thanh toán lương', label: 'Vận hành' },
              ].map(f => (
                <button key={f.val} onClick={() => setTypeFilter(f.val)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border cursor-pointer transition-all ${
                    typeFilter === f.val ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
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
                          className="p-1.5 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition-colors cursor-pointer" title="In phiếu">
                          <Printer className="w-3.5 h-3.5" />
                        </button>
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
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-scale-in">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Lập Biên lai mới</h3>
            <form onSubmit={handleCreate} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Loại phiếu</label>
                <select value={type} onChange={(e) => setType(e.target.value as any)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 text-sm">
                  <option value="Thu phí gia sư">Thu phí kết nối (1 lần/lớp)</option>
                  <option value="Hoàn tiền">Hoàn trả phí cho gia sư</option>
                  <option value="Thanh toán lương">Chi phí vận hành / quảng cáo</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Đối tượng nộp/nhận *</label>
                <input type="text" required placeholder="Ví dụ: Gia sư Nguyễn Văn A - Lớp Toán 12"
                  value={targetName} onChange={(e) => setTargetName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Số tiền (VNĐ)</label>
                <input type="number" required value={amount} onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 text-sm font-bold text-blue-600" />
              </div>
              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer">Hủy</button>
                <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer">Tạo biên lai</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
