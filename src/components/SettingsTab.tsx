import React, { useState, useEffect } from 'react';
import { AdminSettings, FeeConfigItem, AdminRole, ADMIN_ROLE_CONFIG } from '../types';
import { Settings, Key, Building2, Phone, Mail, MapPin, Save, CheckCircle2, AlertCircle, Eye, EyeOff, Sparkles, RefreshCw, Trash2, Shield, MessageCircle, Globe, Cloud, Plus, X, Search, DollarSign, CreditCard } from 'lucide-react';
import { DEFAULT_HANOI_WARDS } from '../hanoiWards';

const SUBJECTS_FEE = ['Toán', 'Văn', 'Anh', 'Lý', 'Hóa', 'Sinh', 'Sử', 'Địa', 'Tin học', 'IELTS', 'Tiếng Nhật', 'Tiếng Hàn', 'Piano', 'Guitar'];
const GRADES_FEE = ['Lớp 1-5', 'Lớp 6-9', 'Lớp 10-12', 'Đại học', 'Người đi làm'];

interface SettingsTabProps {
  settings: AdminSettings;
  onSaveSettings: (settings: Partial<AdminSettings>) => Promise<void>;
  onTestApiKey: (key: string) => Promise<boolean>;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ settings, onSaveSettings, onTestApiKey }) => {
  const [centerName, setCenterName] = useState(settings.centerName || 'Gia Sư Thành Đạt');
  const [centerPhone, setCenterPhone] = useState(settings.centerPhone || '');
  const [centerEmail, setCenterEmail] = useState(settings.centerEmail || '');
  const [centerAddress, setCenterAddress] = useState(settings.centerAddress || '');
  const [apiKey, setApiKey] = useState(settings.geminiApiKey || '');
  const [showApiKey, setShowApiKey] = useState(false);
  const [zaloNumber, setZaloNumber] = useState(settings.zaloNumber || '');
  const [facebookUrl, setFacebookUrl] = useState(settings.facebookUrl || '');
  const [cloudinaryCloudName, setCloudinaryCloudName] = useState(settings.cloudinaryCloudName || '');
  const [cloudinaryPreset, setCloudinaryPreset] = useState(settings.cloudinaryPreset || '');
  const [wards, setWards] = useState<string[]>(settings.wards || DEFAULT_HANOI_WARDS);
  const [newWard, setNewWard] = useState('');
  const [wardSearchTerm, setWardSearchTerm] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'fail' | null>(null);
  // Feature 8: Fee configuration
  const [feeConfig, setFeeConfig] = useState<FeeConfigItem[]>(settings.feeConfig || []);
  const [showFeeForm, setShowFeeForm] = useState(false);
  const [feeSubject, setFeeSubject] = useState('Toán');
  const [feeGrade, setFeeGrade] = useState('Lớp 10-12');
  const [feeArea, setFeeArea] = useState('Toàn TP');
  const [feeOffline, setFeeOffline] = useState(200000);
  const [feeOnline, setFeeOnline] = useState(150000);
  // Feature 17: Admin role
  const [adminRole, setAdminRole] = useState<AdminRole>(settings.adminRole || 'super_admin');
  // F42: Bank info
  const [bankName, setBankName] = useState(settings.bankName || '');
  const [bankAccount, setBankAccount] = useState(settings.bankAccount || '');
  const [bankAccountName, setBankAccountName] = useState(settings.bankAccountName || '');
  const [bankBin, setBankBin] = useState(settings.bankBin || '');
  // Admin password
  const [adminPassword, setAdminPassword] = useState(settings.adminPassword || 'admin123');

  useEffect(() => {
    setCenterName(settings.centerName || 'Gia Sư Thành Đạt');
    setCenterPhone(settings.centerPhone || '');
    setCenterEmail(settings.centerEmail || '');
    setCenterAddress(settings.centerAddress || '');
    setApiKey(settings.geminiApiKey || '');
    setZaloNumber(settings.zaloNumber || '');
    setFacebookUrl(settings.facebookUrl || '');
    setCloudinaryCloudName(settings.cloudinaryCloudName || '');
    setCloudinaryPreset(settings.cloudinaryPreset || '');
    setWards(settings.wards || DEFAULT_HANOI_WARDS);
    setFeeConfig(settings.feeConfig || []);
    setAdminRole(settings.adminRole || 'super_admin');
    setBankName(settings.bankName || '');
    setBankAccount(settings.bankAccount || '');
    setBankAccountName(settings.bankAccountName || '');
    setBankBin(settings.bankBin || '');
    setAdminPassword(settings.adminPassword || 'admin123');
  }, [settings]);

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      await onSaveSettings({
        centerName,
        centerPhone,
        centerEmail,
        centerAddress,
        geminiApiKey: apiKey,
        zaloNumber,
        facebookUrl,
        cloudinaryCloudName,
        cloudinaryPreset,
        wards,
        feeConfig,
        adminRole,
        bankName, bankAccount, bankAccountName, bankBin,
        adminPassword,
        updatedAt: Date.now(),
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Save settings failed:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestKey = async () => {
    if (!apiKey.trim()) return;
    setIsTesting(true);
    setTestResult(null);
    try {
      const ok = await onTestApiKey(apiKey);
      setTestResult(ok ? 'success' : 'fail');
    } catch {
      setTestResult('fail');
    } finally {
      setIsTesting(false);
    }
  };

  const maskedKey = apiKey ? apiKey.slice(0, 8) + '•'.repeat(Math.max(0, apiKey.length - 12)) + apiKey.slice(-4) : '';

  return (
    <div className="col-span-12 space-y-6 animate-fade-in">
      {/* Save Success Toast */}
      {saveSuccess && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-semibold animate-fade-in">
          <CheckCircle2 className="w-5 h-5" />
          <span>Đã lưu cài đặt thành công!</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Settings className="w-5 h-5 text-slate-600" />
            <span>Cài đặt hệ thống</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">Quản lý API key AI, thông tin trung tâm và cấu hình hệ thống</p>
        </div>
        <button
          onClick={handleSaveAll}
          disabled={isSaving}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-md shadow-blue-600/20"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Đang lưu...' : 'Lưu tất cả'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI API Key Configuration */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Cấu hình AI (Gemini API)</h3>
              <p className="text-[11px] text-slate-500">API key dùng cho Smart Matching, SEO Optimizer và AI Search</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Gemini API Key</label>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => { setApiKey(e.target.value); setTestResult(null); }}
                placeholder="AIzaSy... (lấy tại aistudio.google.com/apikey)"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 text-sm font-mono pr-24"
              />
              <div className="absolute right-2 top-1.5 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  title={showApiKey ? 'Ẩn key' : 'Hiện key'}
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={handleTestKey}
                  disabled={isTesting || !apiKey.trim()}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-600 text-[10px] font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                >
                  {isTesting ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                  <span>{isTesting ? '...' : 'Test'}</span>
                </button>
              </div>
            </div>

            {/* Test result */}
            {testResult === 'success' && (
              <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Kết nối thành công! API key hoạt động tốt.</span>
              </div>
            )}
            {testResult === 'fail' && (
              <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg border border-red-200">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Kết nối thất bại. Kiểm tra lại API key.</span>
              </div>
            )}
          </div>

          <div className="bg-blue-50 p-4 rounded-xl text-xs text-blue-800 space-y-1.5 border border-blue-100">
            <div className="font-bold flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-blue-600" />
              <span>Hướng dẫn lấy API Key</span>
            </div>
            <ol className="list-decimal list-inside space-y-0.5 text-blue-700">
              <li>Truy cập <b>aistudio.google.com/apikey</b></li>
              <li>Nhấn <b>"Create API Key"</b></li>
              <li>Copy key và dán vào ô trên</li>
              <li>Nhấn <b>"Test"</b> để kiểm tra kết nối</li>
            </ol>
          </div>

          {/* Current key status */}
          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
            <span className="text-slate-500">Trạng thái:</span>
            {apiKey ? (
              <span className="flex items-center gap-1.5 text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                Đã cấu hình
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-amber-600 font-bold bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
                Chưa cấu hình
              </span>
            )}
          </div>
        </div>

        {/* Center Information */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Thông tin trung tâm</h3>
              <p className="text-[11px] text-slate-500">Thông tin hiển thị trên trang công khai và biên lai</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Tên trung tâm</label>
            <div className="relative">
              <Building2 className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                value={centerName}
                onChange={(e) => setCenterName(e.target.value)}
                placeholder="Gia Sư Thành Đạt"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Số điện thoại / Hotline</label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  value={centerPhone}
                  onChange={(e) => setCenterPhone(e.target.value)}
                  placeholder="1900.xxxx"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Email liên hệ</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="email"
                  value={centerEmail}
                  onChange={(e) => setCenterEmail(e.target.value)}
                  placeholder="contact@giasuthanhdat.vn"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 text-sm"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Địa chỉ văn phòng</label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                value={centerAddress}
                onChange={(e) => setCenterAddress(e.target.value)}
                placeholder="Hà Nội"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          {/* Zalo & Social */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h4 className="font-bold text-xs uppercase text-slate-600 flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4 text-blue-500" /><span>Zalo & Mạng xã hội</span>
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Số Zalo</label>
                <div className="relative">
                  <MessageCircle className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input type="text" value={zaloNumber} onChange={(e) => setZaloNumber(e.target.value)}
                    placeholder="0912345678"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 text-sm" />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Hiển thị nút Zalo trên trang công khai</p>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Facebook URL</label>
                <div className="relative">
                  <Globe className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input type="text" value={facebookUrl} onChange={(e) => setFacebookUrl(e.target.value)}
                    placeholder="https://facebook.com/..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 text-sm" />
                </div>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
            Cập nhật lần cuối: {settings.updatedAt ? new Date(settings.updatedAt).toLocaleString('vi-VN') : 'Chưa cập nhật'}
          </div>
        </div>

        {/* Cloudinary Config */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5 col-span-1 lg:col-span-2">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Cấu hình lưu trữ ảnh (Cloudinary)</h3>
              <p className="text-[11px] text-slate-500">Gia sư gửi ảnh CCCD & bằng cấp — Miễn phí 25GB</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Cloud Name</label>
              <input type="text" value={cloudinaryCloudName} onChange={(e) => setCloudinaryCloudName(e.target.value)}
                placeholder="Ví dụ: dkpvfqz1"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 text-sm font-mono" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Upload Preset (Unsigned)</label>
              <input type="text" value={cloudinaryPreset} onChange={(e) => setCloudinaryPreset(e.target.value)}
                placeholder="Ví dụ: o1stheydat"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 text-sm font-mono" />
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-xl text-xs text-purple-800 space-y-1.5 border border-purple-100">
            <div className="font-bold flex items-center gap-1.5">
              <Cloud className="w-4 h-4 text-purple-600" />
              <span>Hướng dẫn lấy thông tin Cloudinary</span>
            </div>
            <ol className="list-decimal list-inside space-y-0.5 text-purple-700">
              <li>Đăng nhập <b>cloudinary.com/console</b></li>
              <li>Copy <b>Cloud Name</b> từ Dashboard</li>
              <li>Vào Settings → Upload → Upload presets</li>
              <li>Tạo preset mới, đặt <b>Signing Mode: Unsigned</b></li>
              <li>Copy tên preset và dán vào ô trên</li>
            </ol>
          </div>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
            <span className="text-slate-500">Trạng thái:</span>
            {cloudinaryCloudName && cloudinaryPreset ? (
              <span className="flex items-center gap-1.5 text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>Đã cấu hình
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-amber-600 font-bold bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>Chưa cấu hình
              </span>
            )}
          </div>
        </div>

        {/* F42: Bank Info for QR */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Tài khoản ngân hàng</h3>
              <p className="text-[11px] text-slate-500">QR thanh toán phí kết nối cho gia sư</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Ngân hàng</label>
              <select value={bankName} onChange={e => setBankName(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm">
                <option value="">-- Chọn --</option>
                {['Techcombank', 'Vietcombank', 'BIDV', 'VietinBank', 'MB Bank', 'ACB', 'Sacombank', 'TPBank', 'VPBank', 'Agribank'].map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Mã BIN</label>
              <input type="text" value={bankBin} onChange={e => setBankBin(e.target.value)} placeholder="Ví dụ: 970407"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Số tài khoản</label>
            <input type="text" value={bankAccount} onChange={e => setBankAccount(e.target.value)} placeholder="0123456789"
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm" />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Chủ tài khoản</label>
            <input type="text" value={bankAccountName} onChange={e => setBankAccountName(e.target.value)} placeholder="NGUYEN VAN A"
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm" />
          </div>
          {bankAccount && bankBin && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-700">
              ✅ Đã cấu hình — QR sẽ hiện khi thu phí kết nối
            </div>
          )}
        </div>

        {/* Admin Password */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <div className="p-2 bg-red-50 text-red-600 rounded-xl">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Mật khẩu quản trị</h3>
              <p className="text-[11px] text-slate-500">Dùng để đăng nhập tại /quan-tri</p>
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Mật khẩu hiện tại</label>
            <input type="text" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} placeholder="admin123"
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm" />
            <p className="text-[10px] text-slate-400 mt-1">Mặc định: admin123 — Hãy đổi sang mật khẩu mạnh hơn</p>
          </div>
        </div>

        {/* Ward Management */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5 col-span-1 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Quản lý Xã/Phường</h3>
                <p className="text-[11px] text-slate-500">Danh sách khu vực hiển thị cho gia sư & phụ huynh • {wards.length} địa điểm</p>
              </div>
            </div>
            <button type="button" onClick={() => { setWards(DEFAULT_HANOI_WARDS); }}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold rounded-lg cursor-pointer flex items-center gap-1">
              <RefreshCw className="w-3 h-3" /><span>Reset mặc định</span>
            </button>
          </div>

          {/* Add new ward */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Plus className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input type="text" value={newWard} onChange={e => setNewWard(e.target.value)}
                placeholder="Nhập tên xã/phường mới..."
                onKeyDown={e => {
                  if (e.key === 'Enter' && newWard.trim() && !wards.includes(newWard.trim())) {
                    setWards(prev => [...prev, newWard.trim()]);
                    setNewWard('');
                  }
                }}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 text-sm" />
            </div>
            <button type="button" onClick={() => {
              if (newWard.trim() && !wards.includes(newWard.trim())) {
                setWards(prev => [...prev, newWard.trim()]);
                setNewWard('');
              }
            }}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" /><span>Thêm</span>
            </button>
          </div>

          {/* Search wards */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input type="text" value={wardSearchTerm} onChange={e => setWardSearchTerm(e.target.value)}
              placeholder="🔍 Tìm xã/phường..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 text-sm" />
          </div>

          {/* Ward list */}
          <div className="flex flex-wrap gap-1.5 max-h-64 overflow-y-auto">
            {wards.filter(w => !wardSearchTerm || w.toLowerCase().includes(wardSearchTerm.toLowerCase())).map((w, i) => (
              <span key={`${w}-${i}`} className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 hover:border-red-300 hover:bg-red-50 group transition-colors">
                {w}
                <button type="button" onClick={() => setWards(prev => prev.filter((_, idx) => idx !== wards.indexOf(w)))}
                  className="w-3.5 h-3.5 text-slate-300 group-hover:text-red-500 cursor-pointer flex items-center justify-center">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <p className="text-[10px] text-slate-400">
            Nhấn <b>Lưu tất cả cài đặt</b> để áp dụng. Danh sách này hiển thị ở form đăng ký gia sư và form đăng ký học.
          </p>
        </div>

        {/* Feature 17: Admin Role Configuration */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4 col-span-1 lg:col-span-2">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <div className="p-2 bg-red-50 text-red-600 rounded-xl">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Phân quyền Admin</h3>
              <p className="text-[11px] text-slate-500">Chọn vai trò để giới hạn tabs hiển thị trong sidebar</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(Object.entries(ADMIN_ROLE_CONFIG) as [AdminRole, typeof ADMIN_ROLE_CONFIG[AdminRole]][]).map(([role, config]) => (
              <button key={role} onClick={() => setAdminRole(role)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all text-left ${
                  adminRole === role ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-slate-200 hover:border-slate-300'
                }`}>
                <div className="w-3 h-3 rounded-full mb-2" style={{ background: config.color }} />
                <div className="text-sm font-bold text-slate-800">{config.label}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{config.tabs.length} tabs</div>
              </button>
            ))}
          </div>
          <p className="text-[10px] text-slate-400">⚠️ Thay đổi vai trò sẽ ảnh hưởng đến sidebar sau khi lưu. Super Admin có toàn quyền.</p>
        </div>

        {/* Feature 8: Fee Configuration */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5 col-span-1 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Cấu hình biểu phí</h3>
                <p className="text-[11px] text-slate-500">Tự động gợi ý phí khi tạo lớp mới • {feeConfig.length} quy tắc</p>
              </div>
            </div>
            <button type="button" onClick={() => setShowFeeForm(!showFeeForm)}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-bold rounded-lg cursor-pointer flex items-center gap-1">
              <Plus className="w-3 h-3" /><span>Thêm quy tắc</span>
            </button>
          </div>

          {showFeeForm && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-1">Môn</label>
                  <select value={feeSubject} onChange={e => setFeeSubject(e.target.value)}
                    className="w-full px-2 py-2 border border-slate-200 rounded-lg text-xs outline-none">
                    {SUBJECTS_FEE.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-1">Cấp</label>
                  <select value={feeGrade} onChange={e => setFeeGrade(e.target.value)}
                    className="w-full px-2 py-2 border border-slate-200 rounded-lg text-xs outline-none">
                    {GRADES_FEE.map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-1">Khu vực</label>
                  <input value={feeArea} onChange={e => setFeeArea(e.target.value)} placeholder="Toàn TP"
                    className="w-full px-2 py-2 border border-slate-200 rounded-lg text-xs outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-1">Phí Offline</label>
                  <input type="number" value={feeOffline} onChange={e => setFeeOffline(+e.target.value)}
                    className="w-full px-2 py-2 border border-slate-200 rounded-lg text-xs outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-1">Phí Online</label>
                  <input type="number" value={feeOnline} onChange={e => setFeeOnline(+e.target.value)}
                    className="w-full px-2 py-2 border border-slate-200 rounded-lg text-xs outline-none" />
                </div>
              </div>
              <button onClick={() => {
                const newFee: FeeConfigItem = { id: `fee${Date.now()}`, subject: feeSubject, grade: feeGrade, area: feeArea, feeOffline, feeOnline };
                setFeeConfig(prev => [...prev, newFee]);
                setShowFeeForm(false);
              }}
                className="px-4 py-2 bg-amber-600 text-white text-xs font-bold rounded-lg cursor-pointer">Thêm quy tắc phí</button>
            </div>
          )}

          {feeConfig.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-3 py-2 text-left font-bold text-slate-600">Môn</th>
                    <th className="px-3 py-2 text-left font-bold text-slate-600">Cấp</th>
                    <th className="px-3 py-2 text-left font-bold text-slate-600">Khu vực</th>
                    <th className="px-3 py-2 text-right font-bold text-slate-600">Offline (đ/buổi)</th>
                    <th className="px-3 py-2 text-right font-bold text-slate-600">Online (đ/buổi)</th>
                    <th className="px-3 py-2 text-center font-bold text-slate-600">Xóa</th>
                  </tr>
                </thead>
                <tbody>
                  {feeConfig.map(f => (
                    <tr key={f.id} className="border-t border-slate-100 hover:bg-slate-50">
                      <td className="px-3 py-2 font-semibold text-slate-700">{f.subject}</td>
                      <td className="px-3 py-2 text-slate-600">{f.grade}</td>
                      <td className="px-3 py-2 text-slate-600">{f.area}</td>
                      <td className="px-3 py-2 text-right font-bold text-emerald-700">{new Intl.NumberFormat('vi-VN').format(f.feeOffline)}đ</td>
                      <td className="px-3 py-2 text-right font-bold text-blue-700">{new Intl.NumberFormat('vi-VN').format(f.feeOnline)}đ</td>
                      <td className="px-3 py-2 text-center">
                        <button onClick={() => setFeeConfig(prev => prev.filter(x => x.id !== f.id))}
                          className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded cursor-pointer">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center py-4">Chưa có quy tắc phí nào. Nhấn "Thêm quy tắc" để bắt đầu.</p>
          )}
          <p className="text-[10px] text-slate-400">Nhấn <b>Lưu tất cả cài đặt</b> để áp dụng. Khi tạo lớp mới, hệ thống sẽ tự động gợi ý phí theo cấu hình này.</p>
        </div>
      </div>
    </div>
  );
};
