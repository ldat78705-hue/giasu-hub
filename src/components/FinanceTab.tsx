import React, { useState } from 'react';
import { TransactionItem } from '../types';
import { Plus, DollarSign, ArrowDownLeft, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface FinanceTabProps {
  transactions: TransactionItem[];
  onAddTransaction: (tr: TransactionItem) => void;
}

export const FinanceTab: React.FC<FinanceTabProps> = ({ transactions, onAddTransaction }) => {
  const [showModal, setShowModal] = useState(false);
  const [targetName, setTargetName] = useState('');
  const [amount, setAmount] = useState(500000);
  const [type, setType] = useState<TransactionItem['type']>('Thu phí gia sư');

  const totalIncome = transactions
    .filter(t => t.type === 'Thu phí gia sư' && t.status === 'Thành công')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalRefund = transactions
    .filter(t => t.type === 'Hoàn tiền')
    .reduce((sum, t) => sum + t.amount, 0);

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

  return (
    <div className="col-span-12 space-y-6">
      {/* Finance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">Tổng doanh thu phí kết nối</div>
          <div className="text-3xl font-bold text-emerald-600 mt-2">{new Intl.NumberFormat('vi-VN').format(totalIncome)}đ</div>
          <div className="text-xs text-slate-400 mt-1">Đã khấu trừ phí hệ thống 10%</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">Hoàn trả học phí / Bảo lưu</div>
          <div className="text-3xl font-bold text-rose-600 mt-2">{new Intl.NumberFormat('vi-VN').format(totalRefund)}đ</div>
          <div className="text-xs text-slate-400 mt-1">Cam kết hoàn tiền 100% nếu hỏng lớp</div>
        </div>

        <div className="bg-[#0F172A] text-white p-6 rounded-2xl shadow-lg flex flex-col justify-between">
          <div>
            <div className="text-slate-400 text-xs font-bold uppercase">Biên lai điện tử</div>
            <div className="text-2xl font-bold mt-1">Tự động xuất hoá đơn VAT</div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="w-full mt-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Lập phiếu thu / chi</span>
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <h3 className="font-bold text-lg text-slate-800 mb-4">Lịch sử Giao dịch & Biên lai (Real-time)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[11px] uppercase tracking-widest text-slate-400 bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-3 font-semibold">Mã Biên Lai</th>
                <th className="px-6 py-3 font-semibold">Loại giao dịch</th>
                <th className="px-6 py-3 font-semibold">Đối tượng</th>
                <th className="px-6 py-3 font-semibold">Số tiền</th>
                <th className="px-6 py-3 font-semibold">Thời gian</th>
                <th className="px-6 py-3 font-semibold">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {transactions.map((tr) => (
                <tr key={tr.id || tr.receiptId} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-xs text-slate-700">{tr.receiptId}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 w-fit ${
                      tr.type === 'Thu phí gia sư'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-rose-50 text-rose-700'
                    }`}>
                      {tr.type === 'Thu phí gia sư' ? <ArrowDownLeft className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                      {tr.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-800">{tr.targetName}</td>
                  <td className={`px-6 py-4 font-bold ${tr.type === 'Thu phí gia sư' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {tr.type === 'Thu phí gia sư' ? '+' : '-'}{new Intl.NumberFormat('vi-VN').format(tr.amount)}đ
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500 font-mono">{tr.date}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-green-100 text-green-800 rounded-lg text-[10px] font-bold flex items-center gap-1 w-fit">
                      <CheckCircle2 className="w-3 h-3" />
                      {tr.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Lập Biên lai mới</h3>
            <form onSubmit={handleCreate} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Loại phiếu</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 text-sm"
                >
                  <option value="Thu phí gia sư">Thu phí nhận lớp gia sư (40% học phí)</option>
                  <option value="Hoàn tiền">Hoàn trả tiền cọc cho gia sư/phụ huynh</option>
                  <option value="Thanh toán lương">Thanh toán chi phí vận hành</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Đối tượng nộp/nhận</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Gia sư Nguyễn Anh (#CS2301)"
                  value={targetName}
                  onChange={(e) => setTargetName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Số tiền (VNĐ)</label>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 text-sm font-bold text-blue-600"
                />
              </div>
              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
                >
                  Tạo biên lai
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
