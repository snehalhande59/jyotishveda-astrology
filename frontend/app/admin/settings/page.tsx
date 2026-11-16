'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminApi } from '@/lib/admin-api';
import { getAdminUser, clearAdminSession } from '@/lib/admin-auth';
import {
  Settings,
  Shield,
  Key,
  User,
  LogOut,
  CheckCircle,
  AlertCircle,
  Server,
  Lock,
  RotateCw,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<any>(null);

  // Change Password Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    setAdminUser(getAdminUser());
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }

    setSavingPassword(true);
    setPasswordError(null);
    setPasswordSuccess(false);

    try {
      await adminApi.changePassword(currentPassword, newPassword);
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to update password');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleLogout = () => {
    clearAdminSession();
    router.replace('/admin/login');
  };

  return (
    <AdminLayout
      title="Admin Security &amp; Settings"
      subtitle="Manage your administrative credentials, session tokens, and security policies"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl">
        {/* Left Column: Admin Profile Card */}
        <div className="space-y-6">
          <div className="bg-[#141021] border border-[#2B233F] rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-black font-extrabold text-base shadow-md">
                {adminUser?.username?.[0]?.toUpperCase() || 'A'}
              </div>
              <div>
                <strong className="text-white text-base block font-bold leading-tight">
                  {adminUser?.username || 'Super Administrator'}
                </strong>
                <span className="text-amber-400 text-xs font-semibold uppercase tracking-wider block">
                  {adminUser?.role || 'Super Admin'}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#0F0C18] border border-[#261E38] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#8E84A6]">Email:</span>
                <span className="text-white font-mono">{adminUser?.email || 'admin@astroveda.com'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8E84A6]">Role Privilege:</span>
                <span className="text-amber-300 font-bold">Full Access</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8E84A6]">Active Session:</span>
                <span className="text-emerald-400 font-semibold">JWT Verified</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 font-bold text-xs flex items-center justify-center space-x-2 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out of Admin</span>
            </button>
          </div>

          {/* Security Overview */}
          <div className="bg-[#141021] border border-[#2B233F] rounded-2xl p-6 shadow-xl space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Security Protocols</span>
            </h4>
            <p className="text-[#8E84A6] leading-relaxed">
              Administrative APIs require signed Bearer tokens. All endpoints run strict server-side authorization checks on every operation.
            </p>
          </div>
        </div>

        {/* Right Column: Change Password */}
        <div className="lg:col-span-2 bg-[#141021] border border-[#2B233F] rounded-2xl p-6 shadow-xl space-y-6">
          <div className="border-b border-[#261E38] pb-3">
            <h3 className="font-bold text-white text-base flex items-center space-x-2">
              <Key className="w-4 h-4 text-amber-400" />
              <span>Update Admin Password</span>
            </h3>
            <p className="text-xs text-[#8E84A6]">
              Ensure your account uses a strong password with at least 8 characters, numbers, and symbols.
            </p>
          </div>

          {passwordSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>Password successfully updated!</span>
            </div>
          )}

          {passwordError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-[#C7BED6] block">Current Password *</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 bg-[#0C0A14] border border-[#2B233F] rounded-xl text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#C7BED6] block">New Password *</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full px-3.5 py-2.5 bg-[#0C0A14] border border-[#2B233F] rounded-xl text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#C7BED6] block">Confirm New Password *</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                className="w-full px-3.5 py-2.5 bg-[#0C0A14] border border-[#2B233F] rounded-xl text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              disabled={savingPassword}
              className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 text-black font-extrabold text-xs shadow-md shadow-amber-600/20 flex items-center space-x-2 transition-all disabled:opacity-50"
            >
              {savingPassword ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <span>Update Password</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
