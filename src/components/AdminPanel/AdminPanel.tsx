import React, { useState, useEffect } from 'react';
import { 
  Shield, LayoutDashboard, Sparkles, Mic2, HeartHandshake, 
  BellRing, Settings, LogOut, Plus, Edit2, Trash2, Check, 
  X, Database, KeyRound, ExternalLink, MoonStar, Eye, EyeOff, 
  ChevronUp, ChevronDown, Download, Lock 
} from 'lucide-react';
import { Speaker, Imam, Khutbah, Dua, Reminder, AppSettings } from '../../types/islamic';
import { 
  loginAdmin, checkAdminAuth, logoutAdmin, changeAdminPassword,
  createSpeaker, updateSpeaker, deleteSpeaker,
  createImam, updateImam, deleteImam,
  createKhutbah, updateKhutbah, deleteKhutbah,
  createDua, updateDua, deleteDua,
  createReminder, updateReminder, deleteReminder,
  updateSettings, fetchStats 
} from '../../services/api';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  speakers: Speaker[];
  imams: Imam[];
  khutbahs: Khutbah[];
  duas: Dua[];
  reminders: Reminder[];
  settings: AppSettings;
  onRefreshAllData: () => Promise<void>;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  speakers,
  imams,
  khutbahs,
  duas,
  reminders,
  settings,
  onRefreshAllData,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Active admin tab
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'speakers' | 'imams' | 'khutbahs' | 'duas' | 'reminders' | 'settings' | 'supabase'
  >('dashboard');

  // Stats
  const [stats, setStats] = useState<any>(null);

  // Modals for editing/creating items
  const [editingSpeaker, setEditingSpeaker] = useState<Partial<Speaker> | null>(null);
  const [editingImam, setEditingImam] = useState<Partial<Imam> | null>(null);
  const [editingKhutbah, setEditingKhutbah] = useState<Partial<Khutbah> | null>(null);
  const [editingDua, setEditingDua] = useState<Partial<Dua> | null>(null);
  const [editingReminder, setEditingReminder] = useState<Partial<Reminder> | null>(null);

  // Password change state
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [pwdMsg, setPwdMsg] = useState<{ text: string; isError: boolean } | null>(null);

  // Notification / toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    if (isOpen) {
      setCheckingAuth(true);
      checkAdminAuth().then((auth) => {
        setIsAuthenticated(auth);
        setCheckingAuth(false);
        if (auth) {
          fetchStats().then(setStats).catch(console.warn);
        }
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);
    try {
      await loginAdmin(passwordInput);
      setIsAuthenticated(true);
      setPasswordInput('');
      const st = await fetchStats();
      setStats(st);
      showToast('এডমিন লগইন সফল হয়েছে!');
    } catch (err: any) {
      setLoginError(err.message || 'ভুল পাসওয়ার্ড। আবার চেষ্টা করুন।');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutAdmin();
    setIsAuthenticated(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdMsg(null);
    try {
      await changeAdminPassword(currentPwd, newPwd);
      setPwdMsg({ text: 'পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে', isError: false });
      setCurrentPwd('');
      setNewPwd('');
      setTimeout(() => setShowPasswordChange(false), 1500);
    } catch (err: any) {
      setPwdMsg({ text: err.message, isError: true });
    }
  };

  // ================= SPEAKERS CRUD =================
  const handleSaveSpeaker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSpeaker?.name || !editingSpeaker?.banglaName) return;

    try {
      if (editingSpeaker.id) {
        await updateSpeaker(editingSpeaker.id, editingSpeaker);
        showToast('বক্তা সফলভাবে আপডেট করা হয়েছে');
      } else {
        await createSpeaker({
          name: editingSpeaker.name,
          banglaName: editingSpeaker.banglaName,
          description: editingSpeaker.description || '',
          photoUrl: editingSpeaker.photoUrl || '',
          youtubeUrl: editingSpeaker.youtubeUrl || 'https://youtube.com',
          category: (editingSpeaker.category as any) || 'Waz',
          featured: !!editingSpeaker.featured,
          order: speakers.length + 1,
        });
        showToast('নতুন বক্তা সফলভাবে যুক্ত হয়েছে');
      }
      setEditingSpeaker(null);
      await onRefreshAllData();
    } catch (err) {
      console.error(err);
      showToast('বক্তা সংরক্ষণ করতে ব্যর্থ হয়েছে');
    }
  };

  const handleDeleteSpeaker = async (id: string) => {
    if (!confirm('আপনি কি নিশ্চিতভাবে এই বক্তাকে মুছে ফেলতে চান?')) return;
    try {
      await deleteSpeaker(id);
      showToast('বক্তা মুছে ফেলা হয়েছে');
      await onRefreshAllData();
    } catch (err) {
      console.error(err);
    }
  };

  // ================= IMAMS CRUD =================
  const handleSaveImam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingImam?.name) return;

    try {
      if (editingImam.id) {
        await updateImam(editingImam.id, editingImam);
        showToast('ইমাম সফলভাবে আপডেট করা হয়েছে');
      } else {
        await createImam({
          name: editingImam.name,
          arabicName: editingImam.arabicName || '',
          title: editingImam.title || 'Imam of Masjid al-Haram',
          mosque: editingImam.mosque || 'Masjid al-Haram, Makkah',
          photoUrl: editingImam.photoUrl || '',
          quranUrl: editingImam.quranUrl || '',
          khutbahUrl: editingImam.khutbahUrl || '',
          youtubeUrl: editingImam.youtubeUrl || '',
          featured: !!editingImam.featured,
          order: imams.length + 1,
        });
        showToast('নতুন ইমাম সফলভাবে যুক্ত হয়েছে');
      }
      setEditingImam(null);
      await onRefreshAllData();
    } catch (err) {
      console.error(err);
      showToast('ইমাম সংরক্ষণ করতে ব্যর্থ হয়েছে');
    }
  };

  const handleDeleteImam = async (id: string) => {
    if (!confirm('আপনি কি নিশ্চিতভাবে এই ইমামকে মুছে ফেলতে চান?')) return;
    try {
      await deleteImam(id);
      showToast('ইমাম মুছে ফেলা হয়েছে');
      await onRefreshAllData();
    } catch (err) {
      console.error(err);
    }
  };

  // ================= KHUTBAHS CRUD =================
  const handleSaveKhutbah = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingKhutbah?.title) return;

    try {
      if (editingKhutbah.id) {
        await updateKhutbah(editingKhutbah.id, editingKhutbah);
        showToast('খুতবা সফলভাবে আপডেট করা হয়েছে');
      } else {
        await createKhutbah({
          title: editingKhutbah.title,
          arabicTitle: editingKhutbah.arabicTitle || '',
          date: editingKhutbah.date || new Date().toISOString().split('T')[0],
          hijriDate: editingKhutbah.hijriDate || '',
          language: (editingKhutbah.language as any) || 'Arabic',
          audioUrl: editingKhutbah.audioUrl || '',
          sourceUrl: editingKhutbah.sourceUrl || 'https://sermons.islamic.network/',
          featured: !!editingKhutbah.featured,
          speaker: editingKhutbah.speaker || 'Masjid al-Haram Khateeb',
          duration: editingKhutbah.duration || '25:00',
          summary: editingKhutbah.summary || '',
          fullText: editingKhutbah.fullText || '',
        });
        showToast('নতুন খুতবা যুক্ত হয়েছে');
      }
      setEditingKhutbah(null);
      await onRefreshAllData();
    } catch (err) {
      console.error(err);
      showToast('খুতবা সংরক্ষণ করতে ব্যর্থ হয়েছে');
    }
  };

  const handleDeleteKhutbah = async (id: string) => {
    if (!confirm('আপনি কি নিশ্চিতভাবে এই খুতবাটি মুছে ফেলতে চান?')) return;
    try {
      await deleteKhutbah(id);
      showToast('খুতবা মুছে ফেলা হয়েছে');
      await onRefreshAllData();
    } catch (err) {
      console.error(err);
    }
  };

  // ================= DUAS CRUD =================
  const handleSaveDua = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDua?.arabic || !editingDua?.banglaTranslation) return;

    try {
      if (editingDua.id) {
        await updateDua(editingDua.id, editingDua);
        showToast('দোয়া আপডেট করা হয়েছে');
      } else {
        await createDua({
          arabic: editingDua.arabic,
          banglaTranslation: editingDua.banglaTranslation,
          englishTranslation: editingDua.englishTranslation || '',
          banglaTransliteration: editingDua.banglaTransliteration || '',
          source: editingDua.source || 'আল-কুরআন',
          category: (editingDua.category as any) || 'daily',
          featured: !!editingDua.featured,
        });
        showToast('নতুন দোয়া যুক্ত হয়েছে');
      }
      setEditingDua(null);
      await onRefreshAllData();
    } catch (err) {
      console.error(err);
      showToast('দোয়া সংরক্ষণ করতে ব্যর্থ হয়েছে');
    }
  };

  const handleDeleteDua = async (id: string) => {
    if (!confirm('আপনি কি এই দোয়াটি মুছে ফেলতে চান?')) return;
    try {
      await deleteDua(id);
      showToast('দোয়া মুছে ফেলা হয়েছে');
      await onRefreshAllData();
    } catch (err) {
      console.error(err);
    }
  };

  // ================= REMINDERS CRUD =================
  const handleSaveReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReminder?.banglaTitle || !editingReminder?.banglaContent) return;

    try {
      if (editingReminder.id) {
        await updateReminder(editingReminder.id, editingReminder);
        showToast('রিমাইন্ডার আপডেট করা হয়েছে');
      } else {
        await createReminder({
          title: editingReminder.title || editingReminder.banglaTitle,
          banglaTitle: editingReminder.banglaTitle,
          content: editingReminder.content || editingReminder.banglaContent,
          banglaContent: editingReminder.banglaContent,
          category: (editingReminder.category as any) || 'namaz',
          active: editingReminder.active !== undefined ? editingReminder.active : true,
        });
        showToast('নতুন রিমাইন্ডার যুক্ত হয়েছে');
      }
      setEditingReminder(null);
      await onRefreshAllData();
    } catch (err) {
      console.error(err);
      showToast('রিমাইন্ডার সংরক্ষণ ব্যর্থ হয়েছে');
    }
  };

  const handleDeleteReminder = async (id: string) => {
    if (!confirm('আপনি কি এই রিমাইন্ডারটি মুছে ফেলতে চান?')) return;
    try {
      await deleteReminder(id);
      showToast('রিমাইন্ডার মুছে ফেলা হয়েছে');
      await onRefreshAllData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-[#17C98B] text-[#06130F] font-bold text-xs shadow-2xl animate-in slide-in-from-top duration-200">
          {toastMessage}
        </div>
      )}

      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-6xl h-[92vh] bg-[#081A14] border border-[#17C98B]/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
      >
        
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#17C98B]/20 bg-[#06130F]/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#17C98B]/15 text-[#17C98B] border border-[#17C98B]/30">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#F5FFF9]">
                  NOOR Admin Panel
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#E7BD68]/20 text-[#E7BD68] font-bold">
                  /admin
                </span>
              </div>
              <p className="text-[11px] text-[#A7BEB3]">
                কন্টেন্ট ম্যানেজমেন্ট ও ডাটাবেজ কন্ট্রোল
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <>
                <button
                  onClick={() => setShowPasswordChange(!showPasswordChange)}
                  className="px-3 py-1.5 rounded-lg bg-[#081A14] border border-[#17C98B]/20 text-xs text-[#A7BEB3] hover:text-[#17C98B] flex items-center gap-1.5"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">পাসওয়ার্ড পরিবর্তন</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-500/30 text-xs text-red-300 hover:text-red-100 flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">লগআউট</span>
                </button>
              </>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#A7BEB3] hover:text-[#F5FFF9] hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Not Authenticated: Login View */}
        {!isAuthenticated ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="w-full max-w-md p-8 rounded-3xl bg-[#06130F] border border-[#17C98B]/20 shadow-2xl text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#17C98B]/15 border border-[#17C98B]/30 flex items-center justify-center mx-auto mb-4 text-[#17C98B]">
                <Lock className="w-8 h-8" />
              </div>

              <h4 className="text-xl font-bold text-[#F5FFF9] font-bengali">
                এডমিন প্যানেলে প্রবেশ করুন
              </h4>
              <p className="text-xs text-[#A7BEB3] mt-1 mb-6">
                নিরাপত্তার স্বার্থে পাসওয়ার্ড দিয়ে প্রমাণীকরণ আবশ্যক
              </p>

              {loginError && (
                <div className="mb-4 p-3 rounded-xl bg-red-950/50 border border-red-500/30 text-xs text-red-200">
                  {loginError}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <input
                    type="password"
                    autoFocus
                    placeholder="এডমিন পাসওয়ার্ড দিন (ডিফল্ট: noor2026)"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#081A14] border border-[#17C98B]/30 text-sm text-[#F5FFF9] focus:outline-none focus:border-[#17C98B]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#17C98B] to-[#0E9F70] text-[#06130F] font-bold text-sm shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
                >
                  {loginLoading ? 'যাচাই করা হচ্ছে...' : 'প্রবেশ করুন'}
                </button>
              </form>

              <div className="mt-6 pt-4 border-t border-[#17C98B]/15 text-[11px] text-[#A7BEB3]">
                💡 প্রাথমিক পাসওয়ার্ড: <code className="text-[#E7BD68] font-bold">noor2026</code> (লগইন করে পরিবর্তন করুন)
              </div>
            </div>
          </div>
        ) : (
          /* Authenticated Admin Dashboard Layout */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Sidebar Navigation */}
            <div className="w-full md:w-60 border-r border-[#17C98B]/20 bg-[#06130F]/60 p-4 space-y-1 overflow-x-auto md:overflow-y-auto flex md:flex-col shrink-0">
              {[
                { id: 'dashboard', label: 'ড্যাশবোর্ড', icon: LayoutDashboard },
                { id: 'speakers', label: 'ওয়াজ বক্তা', icon: Sparkles, count: speakers.length },
                { id: 'imams', label: 'হারামের ইমাম', icon: Shield, count: imams.length },
                { id: 'khutbahs', label: 'জুমার খুতবা', icon: Mic2, count: khutbahs.length },
                { id: 'duas', label: 'দোয়া সমূহ', icon: HeartHandshake, count: duas.length },
                { id: 'reminders', label: 'রিমাইন্ডার', icon: BellRing, count: reminders.length },
                { id: 'supabase', label: 'ডাটাবেজ / SQL', icon: Database },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer shrink-0 ${
                      isActive
                        ? 'bg-[#17C98B] text-[#06130F] font-bold shadow-md shadow-[#17C98B]/15'
                        : 'text-[#A7BEB3] hover:text-[#F5FFF9] hover:bg-[#17C98B]/10'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.count !== undefined && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-[#06130F]/30 text-[#06130F]' : 'bg-[#17C98B]/15 text-[#17C98B]'
                      }`}>
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Main Tab Content Area */}
            <div className="flex-1 p-6 overflow-y-auto bg-[#081A14]">
              
              {/* Change Password Dropdown Panel */}
              {showPasswordChange && (
                <div className="mb-6 p-5 rounded-2xl bg-[#06130F] border border-[#E7BD68]/30">
                  <h4 className="text-sm font-bold text-[#E7BD68] mb-3 flex items-center gap-2">
                    <KeyRound className="w-4 h-4" />
                    এডমিন পাসওয়ার্ড পরিবর্তন করুন
                  </h4>
                  {pwdMsg && (
                    <p className={`text-xs mb-3 ${pwdMsg.isError ? 'text-red-400' : 'text-green-400'}`}>
                      {pwdMsg.text}
                    </p>
                  )}
                  <form onSubmit={handleChangePassword} className="flex flex-wrap gap-3 items-center">
                    <input
                      type="password"
                      placeholder="বর্তমান পাসওয়ার্ড"
                      value={currentPwd}
                      onChange={(e) => setCurrentPwd(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-[#081A14] border border-[#17C98B]/20 text-xs text-[#F5FFF9]"
                    />
                    <input
                      type="password"
                      placeholder="নতুন পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)"
                      value={newPwd}
                      onChange={(e) => setNewPwd(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-[#081A14] border border-[#17C98B]/20 text-xs text-[#F5FFF9]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-[#E7BD68] text-[#06130F] font-bold text-xs"
                    >
                      পাসওয়ার্ড আপডেট করুন
                    </button>
                  </form>
                </div>
              )}

              {/* 1. DASHBOARD OVERVIEW */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-[#F5FFF9] font-bengali">
                      সিস্টেম ও কন্টেন্ট ওভারভিউ
                    </h3>
                    <p className="text-xs text-[#A7BEB3]">
                      রিয়েল-টাইম ডাটাবেজ তথ্য ও পরিসংখ্যান
                    </p>
                  </div>

                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 rounded-2xl bg-[#06130F] border border-[#17C98B]/20">
                      <span className="text-[11px] text-[#A7BEB3] block">মোট বক্তা</span>
                      <span className="text-2xl font-black text-[#17C98B] mt-1 block">
                        {speakers.length}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#06130F] border border-[#E7BD68]/20">
                      <span className="text-[11px] text-[#A7BEB3] block">হারামের ইমাম</span>
                      <span className="text-2xl font-black text-[#E7BD68] mt-1 block">
                        {imams.length}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#06130F] border border-[#17C98B]/20">
                      <span className="text-[11px] text-[#A7BEB3] block">জুমার খুতবা</span>
                      <span className="text-2xl font-black text-[#17C98B] mt-1 block">
                        {khutbahs.length}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#06130F] border border-[#E7BD68]/20">
                      <span className="text-[11px] text-[#A7BEB3] block">সংরক্ষিত দোয়া</span>
                      <span className="text-2xl font-black text-[#E7BD68] mt-1 block">
                        {duas.length}
                      </span>
                    </div>
                  </div>

                  {/* Flow description */}
                  <div className="p-5 rounded-2xl bg-[#06130F] border border-[#17C98B]/20 space-y-3">
                    <h4 className="text-sm font-bold text-[#17C98B] flex items-center gap-2">
                      <Database className="w-4 h-4" />
                      লাইভ কানেকশন ও ডাটাবেজ ফ্লো
                    </h4>
                    <p className="text-xs text-[#A7BEB3] leading-relaxed">
                      এডমিন প্যানেল থেকে যেকোনো বক্তা, ইমাম, খুতবা বা দোয়া যুক্ত, সম্পাদনা বা মুছে ফেললে তা তাৎক্ষণিকভাবে ব্যাকএন্ডের ডাটাবেজে সংরক্ষিত হয় এবং প্রধান ওয়েবসাইটে প্রদর্শিত হয়।
                    </p>
                    <div className="flex items-center gap-2 text-xs text-[#E7BD68]">
                      <span>Admin Panel</span>
                      <span>➔</span>
                      <span>Database (/data/noor-db.json)</span>
                      <span>➔</span>
                      <span>User Website</span>
                    </div>
                  </div>

                  {/* Backup download button */}
                  <div className="p-4 rounded-2xl bg-[#06130F] border border-[#17C98B]/20 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-[#F5FFF9] block">
                        সম্পূর্ণ ডাটাবেজ ব্যাকআপ (JSON)
                      </span>
                      <span className="text-[11px] text-[#A7BEB3]">
                        সব তথ্য এক ক্লিকে ব্যাকআপ এক্সপোর্ট করুন
                      </span>
                    </div>
                    <a
                      href="/api/backup/export"
                      download="noor-db-backup.json"
                      className="px-3.5 py-2 rounded-xl bg-[#17C98B]/15 text-[#17C98B] hover:bg-[#17C98B] hover:text-[#06130F] font-bold text-xs flex items-center gap-1.5 transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>ডাউনলোড JSON</span>
                    </a>
                  </div>
                </div>
              )}

              {/* 2. SPEAKERS MANAGER */}
              {activeTab === 'speakers' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-[#F5FFF9] font-bengali">
                        ওয়াজ বক্তা ও স্কলার তালিকা ({speakers.length})
                      </h3>
                      <p className="text-xs text-[#A7BEB3]">
                        বক্তা যুক্ত, পরিবর্তন বা মুছে ফেলুন
                      </p>
                    </div>
                    <button
                      onClick={() => setEditingSpeaker({ name: '', banglaName: '', category: 'Waz', featured: true })}
                      className="px-3.5 py-2 rounded-xl bg-[#17C98B] text-[#06130F] font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>নতুন বক্তা যুক্ত করুন</span>
                    </button>
                  </div>

                  {/* Speaker Edit Form Modal */}
                  {editingSpeaker && (
                    <div className="p-5 rounded-2xl bg-[#06130F] border border-[#17C98B]/30 mb-6 space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-[#17C98B]/15">
                        <h4 className="text-sm font-bold text-[#17C98B]">
                          {editingSpeaker.id ? 'বক্তা তথ্য সম্পাদনা' : 'নতুন বক্তা ফরম'}
                        </h4>
                        <button onClick={() => setEditingSpeaker(null)} className="text-gray-400 hover:text-white">
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <form onSubmit={handleSaveSpeaker} className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] text-[#A7BEB3] block mb-1">বাংলা নাম *</label>
                            <input
                              type="text"
                              required
                              value={editingSpeaker.banglaName || ''}
                              onChange={(e) => setEditingSpeaker({ ...editingSpeaker, banglaName: e.target.value })}
                              placeholder="যেমন: ড. মিজানুর রহমান আজহারী"
                              className="w-full px-3 py-2 rounded-xl bg-[#081A14] border border-[#17C98B]/20 text-xs text-[#F5FFF9]"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] text-[#A7BEB3] block mb-1">ইংরেজি নাম *</label>
                            <input
                              type="text"
                              required
                              value={editingSpeaker.name || ''}
                              onChange={(e) => setEditingSpeaker({ ...editingSpeaker, name: e.target.value })}
                              placeholder="Dr. Mizanur Rahman Azhari"
                              className="w-full px-3 py-2 rounded-xl bg-[#081A14] border border-[#17C98B]/20 text-xs text-[#F5FFF9]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] text-[#A7BEB3] block mb-1">ক্যাটেগরি</label>
                            <select
                              value={editingSpeaker.category || 'Waz'}
                              onChange={(e) => setEditingSpeaker({ ...editingSpeaker, category: e.target.value as any })}
                              className="w-full px-3 py-2 rounded-xl bg-[#081A14] border border-[#17C98B]/20 text-xs text-[#F5FFF9]"
                            >
                              <option value="Waz">Waz</option>
                              <option value="Tafsir">Tafsir</option>
                              <option value="Islamic Lecture">Islamic Lecture</option>
                              <option value="Youth Guidance">Youth Guidance</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-[11px] text-[#A7BEB3] block mb-1">ইউটিউব সার্চ/চ্যানেল লিংক</label>
                            <input
                              type="text"
                              value={editingSpeaker.youtubeUrl || ''}
                              onChange={(e) => setEditingSpeaker({ ...editingSpeaker, youtubeUrl: e.target.value })}
                              placeholder="https://youtube.com/..."
                              className="w-full px-3 py-2 rounded-xl bg-[#081A14] border border-[#17C98B]/20 text-xs text-[#F5FFF9]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] text-[#A7BEB3] block mb-1">পরিচিতি ও বিবরণ</label>
                          <textarea
                            rows={2}
                            value={editingSpeaker.description || ''}
                            onChange={(e) => setEditingSpeaker({ ...editingSpeaker, description: e.target.value })}
                            placeholder="বক্তার সংক্ষিপ্ত পরিচিতি..."
                            className="w-full px-3 py-2 rounded-xl bg-[#081A14] border border-[#17C98B]/20 text-xs text-[#F5FFF9]"
                          />
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <label className="flex items-center gap-2 text-xs text-[#F5FFF9] cursor-pointer">
                            <input
                              type="checkbox"
                              checked={!!editingSpeaker.featured}
                              onChange={(e) => setEditingSpeaker({ ...editingSpeaker, featured: e.target.checked })}
                              className="accent-[#17C98B]"
                            />
                            <span>ফিচার্ড বা জনপ্রিয় হিসেবে চিহ্নিত করুন</span>
                          </label>

                          <button
                            type="submit"
                            className="px-5 py-2 rounded-xl bg-[#17C98B] text-[#06130F] font-bold text-xs"
                          >
                            সংরক্ষণ করুন
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Speakers Table */}
                  <div className="space-y-2">
                    {speakers.map((s) => (
                      <div
                        key={s.id}
                        className="p-3.5 rounded-2xl bg-[#06130F] border border-[#17C98B]/15 flex items-center justify-between gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-[#F5FFF9] font-bengali">
                              {s.banglaName}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-[#17C98B]/15 text-[#17C98B]">
                              {s.category}
                            </span>
                            {s.featured && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#E7BD68]/20 text-[#E7BD68] font-bold">
                                Featured
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-[#A7BEB3] block mt-0.5">
                            {s.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingSpeaker(s)}
                            className="p-2 rounded-lg bg-[#081A14] hover:bg-[#17C98B]/20 text-[#A7BEB3] hover:text-[#17C98B]"
                            title="সম্পাদনা"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteSpeaker(s.id)}
                            className="p-2 rounded-lg bg-[#081A14] hover:bg-red-500/20 text-[#A7BEB3] hover:text-red-400"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. IMAMS MANAGER */}
              {activeTab === 'imams' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-[#F5FFF9] font-bengali">
                        মক্কা ও হারামের ইমাম ({imams.length})
                      </h3>
                      <p className="text-xs text-[#A7BEB3]">
                        ইমাম ও খতিবগণের তালিকা নিয়ন্ত্রণ
                      </p>
                    </div>
                    <button
                      onClick={() => setEditingImam({ name: '', arabicName: '', title: 'Imam & Khateeb', mosque: 'Masjid al-Haram, Makkah', featured: true })}
                      className="px-3.5 py-2 rounded-xl bg-[#E7BD68] text-[#06130F] font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>নতুন ইমাম যুক্ত করুন</span>
                    </button>
                  </div>

                  {editingImam && (
                    <div className="p-5 rounded-2xl bg-[#06130F] border border-[#E7BD68]/30 mb-6 space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-[#E7BD68]/15">
                        <h4 className="text-sm font-bold text-[#E7BD68]">
                          {editingImam.id ? 'ইমাম তথ্য সম্পাদনা' : 'নতুন ইমাম ফরম'}
                        </h4>
                        <button onClick={() => setEditingImam(null)} className="text-gray-400 hover:text-white">
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <form onSubmit={handleSaveImam} className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] text-[#A7BEB3] block mb-1">ইংরেজি নাম *</label>
                            <input
                              type="text"
                              required
                              value={editingImam.name || ''}
                              onChange={(e) => setEditingImam({ ...editingImam, name: e.target.value })}
                              placeholder="Sheikh Abdul Rahman Al-Sudais"
                              className="w-full px-3 py-2 rounded-xl bg-[#081A14] border border-[#E7BD68]/20 text-xs text-[#F5FFF9]"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] text-[#A7BEB3] block mb-1">আরবি নাম</label>
                            <input
                              type="text"
                              value={editingImam.arabicName || ''}
                              onChange={(e) => setEditingImam({ ...editingImam, arabicName: e.target.value })}
                              placeholder="الشيخ عبد الرحمن السديس"
                              className="w-full px-3 py-2 rounded-xl bg-[#081A14] border border-[#E7BD68]/20 text-xs text-[#F5FFF9]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] text-[#A7BEB3] block mb-1">পদবি (Title)</label>
                            <input
                              type="text"
                              value={editingImam.title || ''}
                              onChange={(e) => setEditingImam({ ...editingImam, title: e.target.value })}
                              placeholder="Imam & Khateeb"
                              className="w-full px-3 py-2 rounded-xl bg-[#081A14] border border-[#E7BD68]/20 text-xs text-[#F5FFF9]"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] text-[#A7BEB3] block mb-1">মসজিদ (Mosque)</label>
                            <input
                              type="text"
                              value={editingImam.mosque || ''}
                              onChange={(e) => setEditingImam({ ...editingImam, mosque: e.target.value })}
                              placeholder="Masjid al-Haram, Makkah"
                              className="w-full px-3 py-2 rounded-xl bg-[#081A14] border border-[#E7BD68]/20 text-xs text-[#F5FFF9]"
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <label className="flex items-center gap-2 text-xs text-[#F5FFF9]">
                            <input
                              type="checkbox"
                              checked={!!editingImam.featured}
                              onChange={(e) => setEditingImam({ ...editingImam, featured: e.target.checked })}
                              className="accent-[#E7BD68]"
                            />
                            <span>প্রধান ইমাম হিসেবে ফিচার্ড করুন</span>
                          </label>

                          <button
                            type="submit"
                            className="px-5 py-2 rounded-xl bg-[#E7BD68] text-[#06130F] font-bold text-xs"
                          >
                            সংরক্ষণ করুন
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  <div className="space-y-2">
                    {imams.map((i) => (
                      <div
                        key={i.id}
                        className="p-3.5 rounded-2xl bg-[#06130F] border border-[#E7BD68]/15 flex items-center justify-between gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-[#F5FFF9]">
                              {i.name}
                            </span>
                            <span className="text-xs text-[#E7BD68] font-arabic">
                              {i.arabicName}
                            </span>
                          </div>
                          <span className="text-xs text-[#A7BEB3] block mt-0.5">
                            {i.title} • {i.mosque}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingImam(i)}
                            className="p-2 rounded-lg bg-[#081A14] hover:bg-[#E7BD68]/20 text-[#A7BEB3] hover:text-[#E7BD68]"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteImam(i.id)}
                            className="p-2 rounded-lg bg-[#081A14] hover:bg-red-500/20 text-[#A7BEB3] hover:text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. KHUTBAHS MANAGER */}
              {activeTab === 'khutbahs' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-[#F5FFF9] font-bengali">
                        জুমার খুতবা কালেকশন ({khutbahs.length})
                      </h3>
                      <p className="text-xs text-[#A7BEB3]">
                        খুতবা যুক্ত ও অডিও লিংক ম্যানেজ করুন
                      </p>
                    </div>
                    <button
                      onClick={() => setEditingKhutbah({ title: '', language: 'Arabic', sourceUrl: 'https://sermons.islamic.network/', featured: true })}
                      className="px-3.5 py-2 rounded-xl bg-[#17C98B] text-[#06130F] font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>নতুন খুতবা যুক্ত করুন</span>
                    </button>
                  </div>

                  {editingKhutbah && (
                    <div className="p-5 rounded-2xl bg-[#06130F] border border-[#17C98B]/30 mb-6 space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-[#17C98B]/15">
                        <h4 className="text-sm font-bold text-[#17C98B]">
                          {editingKhutbah.id ? 'খুতবা সম্পাদনা' : 'নতুন খুতবা ফরম'}
                        </h4>
                        <button onClick={() => setEditingKhutbah(null)} className="text-gray-400 hover:text-white">
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <form onSubmit={handleSaveKhutbah} className="space-y-3">
                        <div>
                          <label className="text-[11px] text-[#A7BEB3] block mb-1">খুতবার শিরোনাম *</label>
                          <input
                            type="text"
                            required
                            value={editingKhutbah.title || ''}
                            onChange={(e) => setEditingKhutbah({ ...editingKhutbah, title: e.target.value })}
                            placeholder="যেমন: ইখলাস ও তাকওয়ার গুরুত্ব"
                            className="w-full px-3 py-2 rounded-xl bg-[#081A14] border border-[#17C98B]/20 text-xs text-[#F5FFF9]"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] text-[#A7BEB3] block mb-1">ভাষা</label>
                            <select
                              value={editingKhutbah.language || 'Arabic'}
                              onChange={(e) => setEditingKhutbah({ ...editingKhutbah, language: e.target.value as any })}
                              className="w-full px-3 py-2 rounded-xl bg-[#081A14] border border-[#17C98B]/20 text-xs text-[#F5FFF9]"
                            >
                              <option value="Arabic">Arabic</option>
                              <option value="English">English</option>
                              <option value="Urdu">Urdu</option>
                              <option value="Bengali">Bengali</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-[11px] text-[#A7BEB3] block mb-1">তারিখ</label>
                            <input
                              type="text"
                              value={editingKhutbah.date || ''}
                              onChange={(e) => setEditingKhutbah({ ...editingKhutbah, date: e.target.value })}
                              placeholder="Friday, 2026-10-02"
                              className="w-full px-3 py-2 rounded-xl bg-[#081A14] border border-[#17C98B]/20 text-xs text-[#F5FFF9]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] text-[#A7BEB3] block mb-1">অডিও স্ট্রিম URL</label>
                            <input
                              type="text"
                              value={editingKhutbah.audioUrl || ''}
                              onChange={(e) => setEditingKhutbah({ ...editingKhutbah, audioUrl: e.target.value })}
                              placeholder="https://...mp3"
                              className="w-full px-3 py-2 rounded-xl bg-[#081A14] border border-[#17C98B]/20 text-xs text-[#F5FFF9]"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] text-[#A7BEB3] block mb-1">সোর্স পেজ লিংক</label>
                            <input
                              type="text"
                              value={editingKhutbah.sourceUrl || ''}
                              onChange={(e) => setEditingKhutbah({ ...editingKhutbah, sourceUrl: e.target.value })}
                              placeholder="https://sermons.islamic.network/"
                              className="w-full px-3 py-2 rounded-xl bg-[#081A14] border border-[#17C98B]/20 text-xs text-[#F5FFF9]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] text-[#A7BEB3] block mb-1">খুতবার মূল বিষয়বস্তু ও সারাংশ (বাংলা)</label>
                          <textarea
                            rows={2}
                            value={editingKhutbah.summary || ''}
                            onChange={(e) => setEditingKhutbah({ ...editingKhutbah, summary: e.target.value })}
                            placeholder="খুতবার সংক্ষিপ্ত সারমর্ম..."
                            className="w-full px-3 py-2 rounded-xl bg-[#081A14] border border-[#17C98B]/20 text-xs text-[#F5FFF9]"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-[#A7BEB3] block mb-1">খুতবার নির্বাচিত অংশ / নসিহত (আরবি/বাংলা টেক্সট)</label>
                          <textarea
                            rows={3}
                            value={editingKhutbah.fullText || ''}
                            onChange={(e) => setEditingKhutbah({ ...editingKhutbah, fullText: e.target.value })}
                            placeholder="الحمد لله رب العالمين..."
                            className="w-full px-3 py-2 rounded-xl bg-[#081A14] border border-[#17C98B]/20 text-xs text-[#F5FFF9]"
                          />
                        </div>

                        <div className="flex justify-end pt-2">
                          <button
                            type="submit"
                            className="px-5 py-2 rounded-xl bg-[#17C98B] text-[#06130F] font-bold text-xs"
                          >
                            সংরক্ষণ করুন
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  <div className="space-y-2">
                    {khutbahs.map((k) => (
                      <div
                        key={k.id}
                        className="p-3.5 rounded-2xl bg-[#06130F] border border-[#17C98B]/15 flex items-center justify-between gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-[#F5FFF9] font-bengali">
                              {k.title}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-[#17C98B]/15 text-[#17C98B]">
                              {k.language}
                            </span>
                          </div>
                          <span className="text-xs text-[#A7BEB3] block mt-0.5">
                            {k.speaker} • {k.date}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingKhutbah(k)}
                            className="p-2 rounded-lg bg-[#081A14] hover:bg-[#17C98B]/20 text-[#A7BEB3] hover:text-[#17C98B]"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteKhutbah(k.id)}
                            className="p-2 rounded-lg bg-[#081A14] hover:bg-red-500/20 text-[#A7BEB3] hover:text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. DUAS MANAGER */}
              {activeTab === 'duas' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-[#F5FFF9] font-bengali">
                        মাসনূন দোয়া সমূহ ({duas.length})
                      </h3>
                      <p className="text-xs text-[#A7BEB3]">
                        কুরআন ও হাদিসের বিশুদ্ধ দোয়া ম্যানেজ করুন
                      </p>
                    </div>
                    <button
                      onClick={() => setEditingDua({ arabic: '', banglaTranslation: '', category: 'daily', source: 'আল-কুরআন' })}
                      className="px-3.5 py-2 rounded-xl bg-[#17C98B] text-[#06130F] font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>নতুন দোয়া যুক্ত করুন</span>
                    </button>
                  </div>

                  {editingDua && (
                    <div className="p-5 rounded-2xl bg-[#06130F] border border-[#17C98B]/30 mb-6 space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-[#17C98B]/15">
                        <h4 className="text-sm font-bold text-[#17C98B]">
                          {editingDua.id ? 'দোয়া সম্পাদনা' : 'নতুন দোয়া ফরম'}
                        </h4>
                        <button onClick={() => setEditingDua(null)} className="text-gray-400 hover:text-white">
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <form onSubmit={handleSaveDua} className="space-y-3">
                        <div>
                          <label className="text-[11px] text-[#A7BEB3] block mb-1">আরবি টেক্সট *</label>
                          <textarea
                            rows={2}
                            required
                            value={editingDua.arabic || ''}
                            onChange={(e) => setEditingDua({ ...editingDua, arabic: e.target.value })}
                            placeholder="رَبِّ زِدْنِي عِلْمًا"
                            className="w-full px-3 py-2 rounded-xl bg-[#081A14] border border-[#17C98B]/20 text-sm font-arabic text-[#E7BD68]"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-[#A7BEB3] block mb-1">বাংলা অনুবাদ *</label>
                          <textarea
                            rows={2}
                            required
                            value={editingDua.banglaTranslation || ''}
                            onChange={(e) => setEditingDua({ ...editingDua, banglaTranslation: e.target.value })}
                            placeholder="হে আমার পালনকর্তা! আমার জ্ঞান বৃদ্ধি করুন..."
                            className="w-full px-3 py-2 rounded-xl bg-[#081A14] border border-[#17C98B]/20 text-xs text-[#F5FFF9]"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] text-[#A7BEB3] block mb-1">ক্যাটেগরি</label>
                            <select
                              value={editingDua.category || 'daily'}
                              onChange={(e) => setEditingDua({ ...editingDua, category: e.target.value as any })}
                              className="w-full px-3 py-2 rounded-xl bg-[#081A14] border border-[#17C98B]/20 text-xs text-[#F5FFF9]"
                            >
                              <option value="daily">daily (দৈনন্দিন)</option>
                              <option value="knowledge">knowledge (জ্ঞান)</option>
                              <option value="parents">parents (পিতা-মাতা)</option>
                              <option value="forgiveness">forgiveness (ক্ষমা)</option>
                              <option value="morning_evening">morning_evening (সকাল-সন্ধ্যা)</option>
                              <option value="ramadan">ramadan (রমজান)</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-[11px] text-[#A7BEB3] block mb-1">সূত্র / রেফারেন্স *</label>
                            <input
                              type="text"
                              required
                              value={editingDua.source || ''}
                              onChange={(e) => setEditingDua({ ...editingDua, source: e.target.value })}
                              placeholder="সূরা ত্ব-হা (২০:১১৪)"
                              className="w-full px-3 py-2 rounded-xl bg-[#081A14] border border-[#17C98B]/20 text-xs text-[#F5FFF9]"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end pt-2">
                          <button
                            type="submit"
                            className="px-5 py-2 rounded-xl bg-[#17C98B] text-[#06130F] font-bold text-xs"
                          >
                            সংরক্ষণ করুন
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  <div className="space-y-2">
                    {duas.map((d) => (
                      <div
                        key={d.id}
                        className="p-3.5 rounded-2xl bg-[#06130F] border border-[#17C98B]/15 flex items-center justify-between gap-4"
                      >
                        <div>
                          <p className="font-arabic text-sm text-[#E7BD68] line-clamp-1">
                            {d.arabic}
                          </p>
                          <span className="text-xs text-[#F5FFF9] font-bengali block line-clamp-1 mt-0.5">
                            "{d.banglaTranslation}"
                          </span>
                          <span className="text-[10px] text-[#A7BEB3]">
                            সূত্র: {d.source} • ক্যাটেগরি: {d.category}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingDua(d)}
                            className="p-2 rounded-lg bg-[#081A14] hover:bg-[#17C98B]/20 text-[#A7BEB3] hover:text-[#17C98B]"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteDua(d.id)}
                            className="p-2 rounded-lg bg-[#081A14] hover:bg-red-500/20 text-[#A7BEB3] hover:text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. REMINDERS MANAGER */}
              {activeTab === 'reminders' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-[#F5FFF9] font-bengali">
                        ইসলামিক রিমাইন্ডার ({reminders.length})
                      </h3>
                      <p className="text-xs text-[#A7BEB3]">
                        দৈনিক হোমপেজে প্রদর্শিত রিমাইন্ডার নিয়ন্ত্রণ
                      </p>
                    </div>
                    <button
                      onClick={() => setEditingReminder({ banglaTitle: '', banglaContent: '', category: 'namaz', active: true })}
                      className="px-3.5 py-2 rounded-xl bg-[#17C98B] text-[#06130F] font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>নতুন রিমাইন্ডার</span>
                    </button>
                  </div>

                  {editingReminder && (
                    <div className="p-5 rounded-2xl bg-[#06130F] border border-[#17C98B]/30 mb-6 space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-[#17C98B]/15">
                        <h4 className="text-sm font-bold text-[#17C98B]">
                          {editingReminder.id ? 'রিমাইন্ডার সম্পাদনা' : 'নতুন রিমাইন্ডার ফরম'}
                        </h4>
                        <button onClick={() => setEditingReminder(null)} className="text-gray-400 hover:text-white">
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <form onSubmit={handleSaveReminder} className="space-y-3">
                        <div>
                          <label className="text-[11px] text-[#A7BEB3] block mb-1">শিরোনাম (বাংলা) *</label>
                          <input
                            type="text"
                            required
                            value={editingReminder.banglaTitle || ''}
                            onChange={(e) => setEditingReminder({ ...editingReminder, banglaTitle: e.target.value })}
                            placeholder="যেমন: নামাজ সময়মতো আদায় করুন"
                            className="w-full px-3 py-2 rounded-xl bg-[#081A14] border border-[#17C98B]/20 text-xs text-[#F5FFF9]"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-[#A7BEB3] block mb-1">বিবরণ / হাদিস বার্তা *</label>
                          <textarea
                            rows={3}
                            required
                            value={editingReminder.banglaContent || ''}
                            onChange={(e) => setEditingReminder({ ...editingReminder, banglaContent: e.target.value })}
                            placeholder="রাসূলুল্লাহ ﷺ বলেছেন..."
                            className="w-full px-3 py-2 rounded-xl bg-[#081A14] border border-[#17C98B]/20 text-xs text-[#F5FFF9]"
                          />
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <label className="flex items-center gap-2 text-xs text-[#F5FFF9]">
                            <input
                              type="checkbox"
                              checked={editingReminder.active !== false}
                              onChange={(e) => setEditingReminder({ ...editingReminder, active: e.target.checked })}
                              className="accent-[#17C98B]"
                            />
                            <span>সক্রিয় (Active)</span>
                          </label>

                          <button
                            type="submit"
                            className="px-5 py-2 rounded-xl bg-[#17C98B] text-[#06130F] font-bold text-xs"
                          >
                            সংরক্ষণ করুন
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  <div className="space-y-2">
                    {reminders.map((r) => (
                      <div
                        key={r.id}
                        className="p-3.5 rounded-2xl bg-[#06130F] border border-[#17C98B]/15 flex items-center justify-between gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-[#F5FFF9] font-bengali">
                              {r.banglaTitle}
                            </span>
                            <span className={`text-[10px] px-2 py-0.5 rounded ${
                              r.active ? 'bg-[#17C98B]/15 text-[#17C98B]' : 'bg-gray-800 text-gray-400'
                            }`}>
                              {r.active ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                            </span>
                          </div>
                          <span className="text-xs text-[#A7BEB3] block mt-0.5 line-clamp-1">
                            {r.banglaContent}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingReminder(r)}
                            className="p-2 rounded-lg bg-[#081A14] hover:bg-[#17C98B]/20 text-[#A7BEB3] hover:text-[#17C98B]"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteReminder(r.id)}
                            className="p-2 rounded-lg bg-[#081A14] hover:bg-red-500/20 text-[#A7BEB3] hover:text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 7. SUPABASE / FREE DEPLOYMENT SQL SCHEMA */}
              {activeTab === 'supabase' && (
                <div className="space-y-5">
                  <div>
                    <h3 className="text-xl font-bold text-[#F5FFF9] font-bengali">
                      Supabase ও ফ্রি ডিপ্লয়মেন্ট গাইড
                    </h3>
                    <p className="text-xs text-[#A7BEB3]">
                      Vercel, Netlify এবং Supabase ফ্রি টিয়ারে ডিপ্লয় করার নির্দেশনা ও রেডিমেড SQL স্কিমা
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#06130F] border border-[#17C98B]/20 space-y-3">
                    <h4 className="text-sm font-bold text-[#E7BD68] flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      বিনামূল্যে ডিপ্লয় করার ধাপসমূহ (Free Hosting):
                    </h4>
                    <ol className="text-xs text-[#A7BEB3] space-y-2 list-decimal list-inside leading-relaxed">
                      <li><strong className="text-[#F5FFF9]">ফ্রন্টএন্ড:</strong> GitHub রিপোজিটরিটি Vercel বা Netlify-তে ফ্রিতে ইমপোর্ট করুন।</li>
                      <li><strong className="text-[#F5FFF9]">ডাটাবেজ:</strong> Supabase.com-এ ফ্রি একাউন্ট খুলে নিচের SQL স্ক্রিপ্টটি SQL এডিটরে পেস্ট করে রান করুন।</li>
                      <li><strong className="text-[#F5FFF9]">সম্পূর্ণ স্বয়ংসম্পূর্ণ:</strong> বর্তমান প্রজেক্টটিতে ইতিমধ্যে লোকাল এক্সপ্রেস সার্ভার ও স্বয়ংক্রিয় ব্যাকআপ সিস্টেম সংযুক্ত রয়েছে।</li>
                    </ol>
                  </div>

                  {/* Copyable SQL Schema */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#17C98B]">
                        Supabase PostgreSQL DDL Schema (সম্পূর্ণ টেবিল স্কিমা):
                      </span>
                      <button
                        onClick={() => {
                          const sql = `-- Supabase Schema for NOOR Islamic Life
CREATE TABLE IF NOT EXISTS speakers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  bangla_name TEXT NOT NULL,
  description TEXT,
  photo_url TEXT,
  youtube_url TEXT,
  category TEXT DEFAULT 'Waz',
  featured BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS imams (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  arabic_name TEXT,
  title TEXT,
  mosque TEXT,
  photo_url TEXT,
  quran_url TEXT,
  khutbah_url TEXT,
  youtube_url TEXT,
  featured BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 1
);

CREATE TABLE IF NOT EXISTS khutbahs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  arabic_title TEXT,
  date TEXT NOT NULL,
  hijri_date TEXT,
  language TEXT DEFAULT 'Arabic',
  audio_url TEXT,
  source_url TEXT DEFAULT 'https://sermons.islamic.network/',
  featured BOOLEAN DEFAULT false,
  speaker TEXT,
  duration TEXT
);

CREATE TABLE IF NOT EXISTS duas (
  id TEXT PRIMARY KEY,
  arabic TEXT NOT NULL,
  bangla_translation TEXT NOT NULL,
  english_translation TEXT,
  bangla_transliteration TEXT,
  source TEXT NOT NULL,
  category TEXT DEFAULT 'daily',
  featured BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS reminders (
  id TEXT PRIMARY KEY,
  title TEXT,
  bangla_title TEXT NOT NULL,
  content TEXT,
  bangla_content TEXT NOT NULL,
  category TEXT DEFAULT 'namaz',
  active BOOLEAN DEFAULT true
);

-- Enable Row Level Security (RLS)
ALTER TABLE speakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE imams ENABLE ROW LEVEL SECURITY;
ALTER TABLE khutbahs ENABLE ROW LEVEL SECURITY;
ALTER TABLE duas ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all users
CREATE POLICY "Public Read Access" ON speakers FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON imams FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON khutbahs FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON duas FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON reminders FOR SELECT USING (true);
`;
                          navigator.clipboard.writeText(sql);
                          showToast('SQL স্কিমা কপি হয়েছে!');
                        }}
                        className="text-xs px-3 py-1.5 rounded-lg bg-[#17C98B]/20 text-[#17C98B] hover:bg-[#17C98B]/30 font-semibold cursor-pointer"
                      >
                        SQL স্ক্রিপ্ট কপি করুন
                      </button>
                    </div>

                    <pre className="p-4 rounded-2xl bg-[#06130F] border border-[#17C98B]/15 text-[11px] text-[#A7BEB3] font-mono overflow-x-auto max-h-72">
{`-- Supabase PostgreSQL Schema for NOOR — Islamic Life
CREATE TABLE IF NOT EXISTS speakers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  bangla_name TEXT NOT NULL,
  description TEXT,
  photo_url TEXT,
  youtube_url TEXT,
  category TEXT DEFAULT 'Waz',
  featured BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS imams (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  arabic_name TEXT,
  title TEXT,
  mosque TEXT,
  photo_url TEXT,
  quran_url TEXT,
  khutbah_url TEXT,
  youtube_url TEXT,
  featured BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 1
);

CREATE TABLE IF NOT EXISTS khutbahs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  arabic_title TEXT,
  date TEXT NOT NULL,
  hijri_date TEXT,
  language TEXT DEFAULT 'Arabic',
  audio_url TEXT,
  source_url TEXT DEFAULT 'https://sermons.islamic.network/',
  featured BOOLEAN DEFAULT false,
  speaker TEXT,
  duration TEXT
);

CREATE TABLE IF NOT EXISTS duas (
  id TEXT PRIMARY KEY,
  arabic TEXT NOT NULL,
  bangla_translation TEXT NOT NULL,
  english_translation TEXT,
  bangla_transliteration TEXT,
  source TEXT NOT NULL,
  category TEXT DEFAULT 'daily',
  featured BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS reminders (
  id TEXT PRIMARY KEY,
  title TEXT,
  bangla_title TEXT NOT NULL,
  content TEXT,
  bangla_content TEXT NOT NULL,
  category TEXT DEFAULT 'namaz',
  active BOOLEAN DEFAULT true
);`}
                    </pre>
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
