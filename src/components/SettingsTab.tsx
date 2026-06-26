import React, { useState, useEffect } from 'react';
import { AdminSettings } from '../types';
import { Settings, Key, Building2, Phone, Mail, MapPin, Save, CheckCircle2, AlertCircle, Eye, EyeOff, Sparkles, RefreshCw, Trash2, Shield, MessageCircle, Globe } from 'lucide-react';

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
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'fail' | null>(null);

  useEffect(() => {
    setCenterName(settings.centerName || 'Gia Sư Thành Đạt');
    setCenterPhone(settings.centerPhone || '');
    setCenterEmail(settings.centerEmail || '');
    setCenterAddress(settings.centerAddress || '');
    setApiKey(settings.geminiApiKey || '');
    setZaloNumber(settings.zaloNumber || '');
    setFacebookUrl(settings.facebookUrl || '');
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
      </div>
    </div>
  );
};
