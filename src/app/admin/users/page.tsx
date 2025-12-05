'use client';

import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/admin/ui/GlassCard';
import { GlassTable, GlassTableHeader, GlassTableBody, GlassTableRow, GlassTableHead, GlassTableCell } from '@/components/admin/ui/GlassTable';
import { PageHeader } from '@/components/admin/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Loader2, CheckCircle2, XCircle, ShieldAlert, ShieldCheck, Mail, User, Pin, PinOff, Search, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

interface UserData {
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
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
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

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  // Sort: pinned first, then admins/owners, then students
  const sortedUsers = filtered.sort((a, b) => {
    const aPinned = pinnedUsers.includes(a._id) ? 0 : 1;
    const bPinned = pinnedUsers.includes(b._id) ? 0 : 1;
    if (aPinned !== bPinned) return aPinned - bPinned;

    const roleOrder = { admin: 0, owner: 1, student: 2 };
    // @ts-expect-error - role is string
    const aRole = roleOrder[a.role] ?? 3;
    // @ts-expect-error - role is string
    const bRole = roleOrder[b.role] ?? 3;
    return aRole - bRole;
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'owner':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default:
        return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20';
    }
  };

  const stats = [
    { label: 'Total Users', value: users.length },
    { label: 'Students', value: users.filter((u) => u.role === 'student').length },
    { label: 'Property Owners', value: users.filter((u) => u.role === 'owner').length },
    { label: 'Verified', value: users.filter((u) => u.isVerified).length },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="User Management"
        description="Manage user accounts, roles, and verification status"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <GlassCard key={i} className="p-6">
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">{stat.label}</p>
            <p className="text-3xl font-bold text-white tracking-tight font-heading">{stat.value}</p>
          </GlassCard>
        ))}
      </div>

      {/* Search Bar */}
      <GlassCard className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 focus:border-blue-500/50 transition-all text-white placeholder:text-zinc-600 pl-10 h-10 rounded-xl w-full md:w-96"
          />
        </div>
      </GlassCard>

      {/* Users Table */}
      <GlassCard className="overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white font-heading">{filtered.length} Users Found</h2>
        </div>
        <div>
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-zinc-500">No users found matching your search</p>
            </div>
          ) : (
            <GlassTable>
              <GlassTableHeader>
                <GlassTableRow>
                  <GlassTableHead>User</GlassTableHead>
                  <GlassTableHead>Role</GlassTableHead>
                  <GlassTableHead>Status</GlassTableHead>
                  <GlassTableHead>Joined</GlassTableHead>
                  <GlassTableHead className="text-right">Actions</GlassTableHead>
                </GlassTableRow>
              </GlassTableHeader>
              <GlassTableBody>
                {sortedUsers.map((user) => (
                  <GlassTableRow key={user._id}>
                    <GlassTableCell>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center border border-white/5">
                          <User className="w-5 h-5 text-zinc-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-white font-medium">{user.name || 'N/A'}</p>
                            {(user.role === 'admin' || user.role === 'owner') && (
                              <button
                                onClick={() => togglePin(user._id)}
                                title={pinnedUsers.includes(user._id) ? 'Unpin user' : 'Pin user'}
                                className={`transition-colors ${pinnedUsers.includes(user._id)
                                  ? 'text-yellow-500'
                                  : 'text-zinc-600 hover:text-zinc-400'
                                  }`}
                              >
                                {pinnedUsers.includes(user._id) ? (
                                  <Pin className="w-3 h-3 fill-current" />
                                ) : (
                                  <PinOff className="w-3 h-3" />
                                )}
                              </button>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-zinc-500 text-xs">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </GlassTableCell>
                    <GlassTableCell>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold border ${getRoleBadge(user.role)}`}>
                        {user.role}
                      </span>
                    </GlassTableCell>
                    <GlassTableCell>
                      <div className="space-y-1">
                        {user.isVerified ? (
                          <div className="flex items-center gap-1.5 text-emerald-500">
                            <CheckCircle2 className="w-3 h-3" />
                            <span className="text-xs font-medium">Verified</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-zinc-500">
                            <ShieldAlert className="w-3 h-3" />
                            <span className="text-xs font-medium">Unverified</span>
                          </div>
                        )}
                        {user.blacklisted && (
                          <div className="flex items-center gap-1.5 text-red-500">
                            <XCircle className="w-3 h-3" />
                            <span className="text-xs font-medium">Blacklisted</span>
                          </div>
                        )}
                      </div>
                    </GlassTableCell>
                    <GlassTableCell className="text-zinc-500 text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </GlassTableCell>
                    <GlassTableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {user.isVerified ? (
                          <button
                            onClick={() => unverifyUser(user._id)}
                            className="p-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"
                            title="Unverify User"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => verifyUser(user._id)}
                            className="p-2 rounded-lg hover:bg-emerald-500/10 text-zinc-400 hover:text-emerald-500 transition-colors"
                            title="Verify User"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}

                        {user.role === 'owner' && (
                          <Link
                            href={`/owner/dashboard?ownerId=${user._id}`}
                            className="p-2 rounded-lg hover:bg-blue-500/10 text-zinc-400 hover:text-blue-500 transition-colors"
                            title="View Owner Dashboard"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                          </Link>
                        )}

                        {user.blacklisted ? (
                          <button
                            onClick={() => unblacklistUser(user._id)}
                            className="p-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"
                            title="Unblock User"
                          >
                            <ShieldCheck className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => openBlacklistModal(user._id)}
                            className="p-2 rounded-lg hover:bg-red-500/10 text-zinc-400 hover:text-red-500 transition-colors"
                            title="Block User"
                          >
                            <ShieldAlert className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </GlassTableCell>
                  </GlassTableRow>
                ))}
              </GlassTableBody>
            </GlassTable>
          )}
        </div>
      </GlassCard>

      {/* Blacklist Reason Modal */}
      <Dialog open={showBlacklistModal} onOpenChange={setShowBlacklistModal}>
        <DialogContent className="bg-zinc-950 border border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-xl text-white">Blacklist User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-zinc-400 text-sm">
              Enter the reason for blacklisting this user. This will be logged in the audit trail.
            </p>
            <Input
              placeholder="E.g., Fraudulent activity, Policy violation..."
              value={blacklistReason}
              onChange={(e) => setBlacklistReason(e.target.value)}
              className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-red-500"
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
              className="border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900"
            >
              Cancel
            </Button>
            <Button
              onClick={() => selectedUserId && blacklistUser(selectedUserId)}
              className="bg-red-600 hover:bg-red-700 text-white border-0"
            >
              Blacklist User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="bg-zinc-950 border border-zinc-800 max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center text-white">Success</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-6 text-center">
            <div className="flex justify-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              </div>
            </div>
            <p className="text-zinc-400 text-sm">{successMessage}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
