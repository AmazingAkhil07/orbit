'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Shield, Mail, Trash2, RotateCcw, Download, CheckCircle2, Search, X } from 'lucide-react';
import { CSVLink } from 'react-csv';

interface BlacklistedUser {
  _id: string;
  name: string;
  email: string;
  blacklistReason?: string;
  blacklistedAt?: string;
  blacklistedBy?: string;
}

export default function BlacklistedUsersPage() {
  const [users, setUsers] = useState<BlacklistedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [unblocking, setUnblocking] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchBlacklistedUsers();
  }, [refreshKey]);

  async function fetchBlacklistedUsers() {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/users');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      // Filter only blacklisted users
      const blacklistedUsers = (data.users || []).filter((u: any) => u.blacklisted === true);
      setUsers(blacklistedUsers);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function unblacklistUser(id: string) {
    try {
      const res = await fetch(`/api/admin/users/${id}/blacklist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blacklist: false }),
      });
      if (res.ok) {
        setRefreshKey(prev => prev + 1);
        setSelectedUsers(selectedUsers.filter(uid => uid !== id));
        alert('User unblocked successfully!');
      } else {
        alert('Failed to unblock user');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error unblocking user');
    }
  }

  async function bulkUnblock() {
    try {
      setUnblocking(true);
      const results = await Promise.all(
        selectedUsers.map(id =>
          fetch(`/api/admin/users/${id}/blacklist`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ blacklist: false }),
          })
        )
      );
      const allSuccess = results.every(r => r.ok);
      if (allSuccess) {
        setRefreshKey(prev => prev + 1);
        setSelectedUsers([]);
        alert(`${selectedUsers.length} users unblocked successfully!`);
      } else {
        alert('Some users failed to unblock');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error during bulk unblock');
    } finally {
      setUnblocking(false);
    }
  }

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const csvData = filtered.map(u => ({
    Name: u.name,
    Email: u.email,
    'Blacklist Reason': u.blacklistReason || 'N/A',
    'Blacklisted Date': u.blacklistedAt ? new Date(u.blacklistedAt).toLocaleString() : 'N/A',
    'Blacklisted By': u.blacklistedBy || 'N/A',
  }));

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent mb-2">
          Blacklisted Users
        </h1>
        <p className="text-slate-400 text-lg">Manage blocked users and restrictions</p>
      </div>

      {/* Stats and Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/50 border border-red-600/30 backdrop-blur-sm rounded-lg p-6">
          <p className="text-slate-400 text-sm font-medium mb-2">Total Blacklisted</p>
          <p className="text-3xl font-bold text-white">{users.length}</p>
        </div>

        <div className="md:col-span-2 flex gap-2 flex-wrap items-end">
          <Button
            onClick={() => setSelectedUsers(filtered.map(u => u._id))}
            disabled={filtered.length === 0}
            variant="outline"
            className="border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Select All ({filtered.length})
          </Button>

          {selectedUsers.length > 0 && (
            <>
              <Button
                onClick={() => setSelectedUsers([])}
                variant="outline"
                className="border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white"
              >
                Deselect All
              </Button>
              <Button
                onClick={bulkUnblock}
                disabled={unblocking}
                className="bg-green-600 hover:bg-green-700 text-white font-medium"
              >
                {unblocking ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RotateCcw className="w-4 h-4 mr-2" />
                )}
                Unblock {selectedUsers.length}
              </Button>
            </>
          )}

          {csvData.length > 0 && (
            <CSVLink
              data={csvData}
              filename={`blacklisted-users-${new Date().toISOString().split('T')[0]}.csv`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
            >
              <Download className="w-4 h-4" />
              Export Report
            </CSVLink>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-slate-300 text-sm font-medium">Search Users</label>
          <Button
            onClick={() => {
              setShowSearch(!showSearch);
              if (!showSearch) setSearch('');
            }}
            size="sm"
            variant="outline"
            className="border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white"
          >
            {showSearch ? (
              <>
                <X className="w-4 h-4 mr-2" />
                Hide
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Show
              </>
            )}
          </Button>
        </div>
        {showSearch && (
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-800 border-slate-700 hover:border-slate-600 focus:border-blue-500 transition-colors text-white"
            autoFocus
          />
        )}
      </div>

      {/* Users List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-red-500" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Shield className="w-16 h-16 text-slate-600 mx-auto mb-4 opacity-50" />
          <p className="text-slate-400 text-lg">{search ? 'No users found' : 'No blacklisted users'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((user) => (
            <div
              key={user._id}
              className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-all duration-300 flex items-center justify-between group"
            >
              <div className="flex items-center gap-4 flex-1">
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user._id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedUsers([...selectedUsers, user._id]);
                    } else {
                      setSelectedUsers(selectedUsers.filter(id => id !== user._id));
                    }
                  }}
                  className="w-5 h-5 rounded cursor-pointer accent-red-600"
                />

                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-600 to-red-400 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate">{user.name}</h3>
                  <p className="text-slate-400 text-sm flex items-center gap-1.5 truncate">
                    <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                    {user.email}
                  </p>
                  {user.blacklistReason && (
                    <p className="text-red-400 text-xs mt-1">📌 Reason: {user.blacklistReason}</p>
                  )}
                  {user.blacklistedAt && (
                    <p className="text-slate-500 text-xs mt-1">
                      🕐 {new Date(user.blacklistedAt).toLocaleString()}
                      {user.blacklistedBy && ` by ${user.blacklistedBy}`}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  onClick={() => unblacklistUser(user._id)}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white font-medium"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Unblock
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

