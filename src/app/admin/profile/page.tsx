'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Camera, Lock, Shield, Save, Mail, User as UserIcon } from 'lucide-react';

export default function AdminProfilePage() {
  const router = useRouter();
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    role: '',
    avatar: '',
  });
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [qrCode, setQrCode] = useState('');

  useEffect(() => {
    fetchProfileData();
  }, []);

  async function fetchProfileData() {
    try {
      const res = await fetch('/api/admin/profile');
      if (res.ok) {
        const data = await res.json();
        setProfileData(data);
        setFormData({
          name: data.name || '',
          email: data.email || '',
        });
      } else if (res.status === 401) {
        router.push('/api/auth/signin');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateProfile() {
    try {
      setSaving(true);
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setProfileData({ ...profileData, ...formData });
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error updating profile');
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword() {
    if (passwordForm.new !== passwordForm.confirm) {
      alert('New passwords do not match');
      return;
    }

    try {
      setSaving(true);
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordForm.current,
          newPassword: passwordForm.new,
        }),
      });
      if (res.ok) {
        alert('Password changed successfully!');
        setPasswordForm({ current: '', new: '', confirm: '' });
        setShowPasswordChange(false);
      } else {
        alert('Failed to change password');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error changing password');
    } finally {
      setSaving(false);
    }
  }

  async function handleEnable2FA() {
    try {
      setSaving(true);
      const res = await fetch('/api/admin/2fa/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        setQrCode(data.qrCode);
        setShow2FA(true);
      } else {
        alert('Failed to setup 2FA');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error setting up 2FA');
    } finally {
      setSaving(false);
    }
  }

  async function handleConfirm2FA(code: string) {
    try {
      setSaving(true);
      const res = await fetch('/api/admin/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      if (res.ok) {
        alert('2FA enabled successfully!');
        setTwoFAEnabled(true);
        setShow2FA(false);
      } else {
        alert('Invalid code');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error confirming 2FA');
    } finally {
      setSaving(false);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    try {
      setSaving(true);
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload-avatar', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setProfileData({ ...profileData, avatar: data.url });
        alert('Avatar updated successfully!');
      } else {
        alert('Failed to upload avatar');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error uploading avatar');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
          Profile Settings
        </h1>
        <p className="text-slate-400 text-lg">Manage your admin account and security settings</p>
      </div>

      {/* Profile Card */}
      <div className="bg-slate-900/50 border border-slate-700 backdrop-blur-sm rounded-lg p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0 group hover:scale-105 transition-transform duration-300">
              {profileData.avatar ? (
                <img src={profileData.avatar} alt={profileData.name} className="w-full h-full rounded-xl object-cover" />
              ) : (
                <UserIcon className="w-16 h-16 text-white" />
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white"
              onClick={() => document.getElementById('avatar-upload')?.click()}
            >
              <Camera className="w-4 h-4 mr-2" />
              Change Avatar
            </Button>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={saving}
              className="hidden"
            />
          </div>

          {/* Profile Info Section */}
          <div className="md:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-blue-400" />
                Basic Information
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="text-slate-300 text-sm font-medium mb-2 block">Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your name"
                    className="bg-slate-800 border-slate-700 hover:border-slate-600 focus:border-blue-500 transition-colors text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 text-sm font-medium mb-2 block">Email</label>
                  <Input
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    className="bg-slate-800 border-slate-700 hover:border-slate-600 focus:border-blue-500 transition-colors text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 text-sm font-medium mb-2 block">Role</label>
                  <div className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-semibold">
                    {profileData.role.charAt(0).toUpperCase() + profileData.role.slice(1)}
                  </div>
                </div>
                <Button
                  onClick={handleUpdateProfile}
                  disabled={saving}
                  className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium w-full"
                >
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Change Password */}
        <div className="bg-slate-900/50 border border-slate-700 backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-4">
            <Lock className="w-5 h-5 text-orange-400" />
            Change Password
          </h2>
          {!showPasswordChange ? (
            <Button
              onClick={() => setShowPasswordChange(true)}
              variant="outline"
              className="border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white w-full"
            >
              <Lock className="w-4 h-4 mr-2" />
              Update Password
            </Button>
          ) : (
            <div className="space-y-3">
              <Input
                type="password"
                placeholder="Current password"
                value={passwordForm.current}
                onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                className="bg-slate-800 border-slate-700 hover:border-slate-600 focus:border-blue-500 transition-colors text-white"
              />
              <Input
                type="password"
                placeholder="New password"
                value={passwordForm.new}
                onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                className="bg-slate-800 border-slate-700 hover:border-slate-600 focus:border-blue-500 transition-colors text-white"
              />
              <Input
                type="password"
                placeholder="Confirm new password"
                value={passwordForm.confirm}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                className="bg-slate-800 border-slate-700 hover:border-slate-600 focus:border-blue-500 transition-colors text-white"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleChangePassword}
                  disabled={saving}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-medium"
                >
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Change
                </Button>
                <Button
                  onClick={() => setShowPasswordChange(false)}
                  variant="outline"
                  className="flex-1 border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Two-Factor Authentication */}
        <div className="bg-slate-900/50 border border-slate-700 backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-green-400" />
            Two-Factor Authentication
          </h2>
          <div className="space-y-3">
            <div className={`px-3 py-2 rounded-lg text-sm font-medium ${
              twoFAEnabled 
                ? 'bg-green-600/20 text-green-400 border border-green-600/50' 
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}>
              {twoFAEnabled ? '✓ 2FA Enabled' : '○ 2FA Disabled'}
            </div>
            {!twoFAEnabled && (
              <Button
                onClick={handleEnable2FA}
                disabled={saving}
                className="bg-green-600 hover:bg-green-700 text-white font-medium w-full"
              >
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Shield className="w-4 h-4 mr-2" />}
                Enable 2FA
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 2FA Setup Modal */}
      {show2FA && qrCode && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-8 max-w-sm w-full mx-4 space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Setup Two-Factor Authentication</h3>
              <p className="text-slate-400">Scan this QR code with your authenticator app</p>
            </div>

            <div className="bg-white p-4 rounded-lg flex justify-center">
              {/* QR Code Image from Google Charts API */}
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCode)}`}
                alt="2FA QR Code"
                className="w-64 h-64"
              />
            </div>

            <div>
              <label className="text-slate-300 text-sm font-medium mb-2 block">Enter verification code</label>
              <Input
                type="text"
                placeholder="000000"
                maxLength={6}
                className="bg-slate-800 border-slate-700 hover:border-slate-600 focus:border-blue-500 transition-colors text-white text-center text-2xl tracking-widest"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleConfirm2FA((e.target as HTMLInputElement).value);
                  }
                }}
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => handleConfirm2FA((document.querySelector('input[type="text"]') as HTMLInputElement)?.value)}
                disabled={saving}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium"
              >
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Shield className="w-4 h-4 mr-2" />}
                Verify
              </Button>
              <Button
                onClick={() => setShow2FA(false)}
                variant="outline"
                className="flex-1 border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
