'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Loader2, CheckCircle2, XCircle, ShieldAlert, ShieldCheck, Mail, User, ArrowUpRight, ArrowDownLeft, Pin, PinOff } from 'lucide-react';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  university?: string;
  isVerified: boolean;
  blacklisted: boolean;
  createdAt: string;
  isPinned?: boolean;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'student' | 'owner' | 'admin'>('all');
  const [pinnedUsers, setPinnedUsers] = useState<string[]>([]);
  
  // Modal states
  const [showBlacklistModal, setShowBlacklistModal] = useState(false);
  const [blacklistReason, setBlacklistReason] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/users');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function blacklistUser(id: string) {
    try {
      const res = await fetch(`/api/admin/users/${id}/blacklist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blacklist: true, reason: blacklistReason || 'No reason provided' }),
      });
      if (res.ok) {
        fetchUsers();
        setShowBlacklistModal(false);
        setBlacklistReason('');
        setSelectedUserId(null);
        setSuccessMessage('User blacklisted successfully!');
        setShowSuccessModal(true);
        setTimeout(() => setShowSuccessModal(false), 3000);
      } else {
        alert('Failed to blacklist user');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error blacklisting user');
    }
  }

  function openBlacklistModal(id: string) {
    setSelectedUserId(id);
    setBlacklistReason('');
    setShowBlacklistModal(true);
  }

  async function unblacklistUser(id: string) {
    try {
      const res = await fetch(`/api/admin/users/${id}/blacklist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blacklist: false }),
      });
      if (res.ok) {
        fetchUsers();
        setSuccessMessage('User unblocked successfully!');
        setShowSuccessModal(true);
        setTimeout(() => setShowSuccessModal(false), 3000);
      } else {
        alert('Failed to unblock user');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error unblocking user');
    }
  }

  async function verifyUser(id: string) {
    try {
      const res = await fetch(`/api/admin/users/${id}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verify: true }),
      });
      if (res.ok) {
        fetchUsers();
        setSuccessMessage('User verified successfully!');
        setShowSuccessModal(true);
        setTimeout(() => setShowSuccessModal(false), 3000);
      } else {
        alert('Failed to verify user');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error verifying user');
    }
  }

  async function unverifyUser(id: string) {
    try {
      const res = await fetch(`/api/admin/users/${id}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verify: false }),
      });
      if (res.ok) {
        fetchUsers();
        setSuccessMessage('User unverified successfully!');
        setShowSuccessModal(true);
        setTimeout(() => setShowSuccessModal(false), 3000);
      } else {
        alert('Failed to unverify user');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error updating user');
    }
  }

  const togglePin = (userId: string) => {
    setPinnedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const filtered = users.filter((u) => {
    const matchesFilter = filter === 'all' || u.role === filter;
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Sort: pinned first, then admins/owners, then students
  const sortedUsers = filtered.sort((a, b) => {
    const aPinned = pinnedUsers.includes(a._id) ? 0 : 1;
    const bPinned = pinnedUsers.includes(b._id) ? 0 : 1;
    if (aPinned !== bPinned) return aPinned - bPinned;
    
    const roleOrder = { admin: 0, owner: 1, student: 2 };
    const aRole = roleOrder[a.role as keyof typeof roleOrder] ?? 3;
    const bRole = roleOrder[b.role as keyof typeof roleOrder] ?? 3;
    return aRole - bRole;
  });

  const stats = {
    total: users.length,
    verified: users.filter(u => u.isVerified).length,
    students: users.filter(u => u.role === 'student').length,
    owners: users.filter(u => u.role === 'owner').length,
    admins: users.filter(u => u.role === 'admin').length,
  };

  const getRoleStyles = (role: string) => {
    switch(role) {
      case 'admin':
        return { bgColor: 'bg-slate-900/50', borderColor: 'border-red-600/30', gradientFrom: 'from-red-600', gradientTo: 'to-red-400', iconBg: 'bg-red-600/20', textColor: 'text-red-400' };
      case 'owner':
        return { bgColor: 'bg-slate-900/50', borderColor: 'border-purple-600/30', gradientFrom: 'from-purple-600', gradientTo: 'to-purple-400', iconBg: 'bg-purple-600/20', textColor: 'text-purple-400' };
      case 'student':
        return { bgColor: 'bg-slate-900/50', borderColor: 'border-blue-600/30', gradientFrom: 'from-blue-600', gradientTo: 'to-blue-400', iconBg: 'bg-blue-600/20', textColor: 'text-blue-400' };
      default:
        return { bgColor: 'bg-slate-900/50', borderColor: 'border-slate-700', gradientFrom: 'from-slate-600', gradientTo: 'to-slate-400', iconBg: 'bg-slate-600/20', textColor: 'text-slate-400' };
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">Users Management</h1>
        <p className="text-slate-400 text-lg">Monitor and manage students and property owners</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Users', value: stats.total, icon: User, color: 'from-blue-600 to-blue-400', bgColor: 'bg-blue-500/10' },
          { label: 'Verified', value: stats.verified, icon: CheckCircle2, color: 'from-green-600 to-green-400', bgColor: 'bg-green-500/10' },
          { label: 'Students', value: stats.students, icon: ArrowDownLeft, color: 'from-amber-600 to-amber-400', bgColor: 'bg-amber-500/10' },
          { label: 'Owners', value: stats.owners, icon: ArrowUpRight, color: 'from-purple-600 to-purple-400', bgColor: 'bg-purple-500/10' },
          { label: 'Admins', value: stats.admins, icon: ShieldCheck, color: 'from-red-600 to-red-400', bgColor: 'bg-red-500/10' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className={`relative overflow-hidden rounded-lg border border-slate-700 ${stat.bgColor} p-6 backdrop-blur-sm hover:border-slate-600 transition-all duration-300 group`}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br from-white transition-opacity duration-300" />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-slate-900/50 border border-slate-700 backdrop-blur-sm rounded-lg p-6 hover:border-slate-600 transition-all duration-300">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-slate-300 text-sm font-medium mb-2 block">Search Users</label>
            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-800 border-slate-700 hover:border-slate-600 focus:border-blue-500 transition-colors text-white"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-slate-300 text-sm font-medium mb-2 block">Filter by Role</label>
            <div className="flex gap-2 flex-wrap">
              {(['all', 'student', 'owner', 'admin'] as const).map((f) => (
                <Button
                  key={f}
                  variant={filter === f ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(f)}
                  className={`transition-all duration-300 ${
                    filter === f
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 border-0 hover:from-blue-700 hover:to-blue-600'
                      : 'border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Users Grid */}
      <div>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <User className="w-16 h-16 text-slate-600 mx-auto mb-4 opacity-50" />
            <p className="text-slate-400 text-lg">No users found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedUsers.map((user) => {
              const roleStyles = getRoleStyles(user.role);
              return (
              <div
                key={user._id}
                className={`group relative overflow-hidden rounded-lg border ${roleStyles.borderColor} bg-slate-900/50 backdrop-blur-sm p-6 hover:bg-slate-900/70 transition-all duration-300`}
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 bg-gradient-to-br ${roleStyles.gradientFrom} ${roleStyles.gradientTo} transition-opacity duration-300`} />

                <div className="relative space-y-4">
                  {/* User Info */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${roleStyles.gradientFrom} ${roleStyles.gradientTo} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white truncate group-hover:text-blue-300 transition-colors">{user.name}</h3>
                        <p className="text-slate-400 text-sm flex items-center gap-1.5 truncate">
                          <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="truncate">{user.email}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {(user.role === 'admin' || user.role === 'owner') && (
                        <button
                          onClick={() => togglePin(user._id)}
                          title={pinnedUsers.includes(user._id) ? 'Unpin user' : 'Pin user'}
                          className="p-1.5 rounded-lg hover:bg-slate-700/50 transition-colors text-slate-400 hover:text-yellow-400"
                        >
                          {pinnedUsers.includes(user._id) ? (
                            <Pin className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ) : (
                            <PinOff className="w-4 h-4" />
                          )}
                        </button>
                      )}
                      <div className={`px-2.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                        user.role === 'admin'
                          ? 'bg-red-600/20 text-red-400 border border-red-600/50'
                          : user.role === 'owner'
                          ? 'bg-purple-600/20 text-purple-400 border border-purple-600/50'
                          : 'bg-blue-600/20 text-blue-400 border border-blue-600/50'
                      }`}>
                        {user.role}
                      </div>
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div className="space-y-2 pt-2 border-t border-slate-700/50">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Verification</span>
                      <div className="flex items-center gap-2">
                        {user.isVerified ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            <span className="text-green-400 font-medium">Verified</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-400 font-medium">Pending</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Status</span>
                      <div className="flex items-center gap-2">
                        {user.blacklisted ? (
                          <>
                            <ShieldAlert className="w-4 h-4 text-red-500" />
                            <span className="text-red-400 font-medium">Blacklisted</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4 text-green-500" />
                            <span className="text-green-400 font-medium">Active</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-700/50 flex gap-2">
                    {user.isVerified ? (
                      <button
                        onClick={() => unverifyUser(user._id)}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 hover:text-amber-300 font-medium transition-all text-xs border border-amber-600/50 hover:border-amber-500 group/btn"
                        title="Remove verification"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Unverify</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => verifyUser(user._id)}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-green-600/20 hover:bg-green-600/30 text-green-400 hover:text-green-300 font-medium transition-all text-xs border border-green-600/50 hover:border-green-500 group/btn"
                        title="Verify user"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Verify</span>
                      </button>
                    )}
                    {user.blacklisted ? (
                      <button
                        onClick={() => unblacklistUser(user._id)}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-green-600/20 hover:bg-green-600/30 text-green-400 hover:text-green-300 font-medium transition-all text-xs border border-green-600/50 hover:border-green-500 group/btn"
                        title="Remove blacklist"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Unblock</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => openBlacklistModal(user._id)}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 font-medium transition-all text-xs border border-red-600/50 hover:border-red-500 group/btn"
                        title="Blacklist user"
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Block</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
            })}
          </div>
        )}

        {/* Blacklist Reason Modal */}
        <Dialog open={showBlacklistModal} onOpenChange={setShowBlacklistModal}>
          <DialogContent className="bg-slate-900 border border-red-600/30 backdrop-blur-sm">
            <DialogHeader>
              <DialogTitle className="text-xl text-white">
                Blacklist User
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-slate-300 text-sm">
                Enter the reason for blacklisting this user. This will be logged in the audit trail.
              </p>
              <Input
                placeholder="E.g., Fraudulent activity, Policy violation, Suspicious behavior..."
                value={blacklistReason}
                onChange={(e) => setBlacklistReason(e.target.value)}
                className="bg-slate-800 border-slate-700 hover:border-slate-600 focus:border-red-500 text-white"
              />
            </div>
            <DialogFooter>
              <Button
                onClick={() => {
                  setShowBlacklistModal(false);
                  setBlacklistReason('');
                  setSelectedUserId(null);
                }}
                variant="outline"
                className="border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={() => selectedUserId && blacklistUser(selectedUserId)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Blacklist User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Success Modal */}
        <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
          <DialogContent className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 border border-green-500/50 backdrop-blur-sm max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-center text-white">Success!</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-6 text-center">
              <div className="flex justify-center">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                </div>
              </div>
              <p className="text-green-200 text-sm">{successMessage}</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
