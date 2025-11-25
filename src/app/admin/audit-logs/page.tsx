'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Activity, Filter, Download, Clock, Search, X } from 'lucide-react';
import { CSVLink } from 'react-csv';
import { formatDistanceToNow, format, parseISO } from 'date-fns';

interface AuditLog {
  _id: string;
  admin: string;
  action: string;
  subject: string;
  details?: string;
  createdAt: string;
  changes?: Record<string, any>;
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(true);
  const today = new Date().toISOString().split('T')[0];
  const [dateRange, setDateRange] = useState({ start: today, end: today });
  const [adminFilter, setAdminFilter] = useState('all');
  const [admins, setAdmins] = useState<string[]>([]);

  useEffect(() => {
    fetchAuditLogs();
    fetchAdmins();
  }, []);

  async function fetchAuditLogs() {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/audit-logs');
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch (error) {
      console.error('Error:', error);
      // Generate mock logs for demo if API doesn't exist yet
      setLogs(generateMockLogs());
    } finally {
      setLoading(false);
    }
  }

  async function fetchAdmins() {
    try {
      const res = await fetch('/api/admin/users?role=admin');
      if (res.ok) {
        const data = await res.json();
        const adminNames = (data.users?.map((u: any) => u.name) || []) as string[];
        setAdmins([...new Set(adminNames)]);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  function generateMockLogs(): AuditLog[] {
    const actions = ['User Verified', 'User Blocked', 'Property Approved', 'Property Rejected', 'Booking Confirmed', 'User Profile Updated'];
    const subjects = ['User', 'Property', 'Booking'];
    const logs = [];
    const today = new Date();
    
    for (let i = 0; i < 20; i++) {
      const randomHour = Math.floor(Math.random() * 24);
      const randomMinute = Math.floor(Math.random() * 60);
      const logDate = new Date(today);
      logDate.setHours(randomHour, randomMinute, 0, 0);
      
      logs.push({
        _id: `log-${i}`,
        admin: 'Admin User',
        action: actions[Math.floor(Math.random() * actions.length)],
        subject: subjects[Math.floor(Math.random() * subjects.length)],
        details: `Performed action on ${subjects[Math.floor(Math.random() * subjects.length)].toLowerCase()}`,
        createdAt: logDate.toISOString(),
        changes: { status: 'updated' }
      });
    }
    return logs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  const filtered = logs.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.admin.toLowerCase().includes(search.toLowerCase()) ||
      log.details?.toLowerCase().includes(search.toLowerCase());
    
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    const matchesAdmin = adminFilter === 'all' || log.admin === adminFilter;
    
    let matchesDate = true;
    if (dateRange.start) {
      const logDate = new Date(log.createdAt);
      const startDate = new Date(dateRange.start);
      matchesDate = matchesDate && logDate >= startDate;
    }
    if (dateRange.end) {
      const logDate = new Date(log.createdAt);
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59);
      matchesDate = matchesDate && logDate <= endDate;
    }

    return matchesSearch && matchesAction && matchesAdmin && matchesDate;
  });

  const actions = [...new Set(logs.map(l => l.action))];

  const csvData = filtered.map(log => ({
    'Admin': log.admin,
    'Action': log.action,
    'Subject': log.subject,
    'Details': log.details || 'N/A',
    'Date': format(parseISO(log.createdAt), 'PPpp'),
  }));

  function exportPDF() {
    // Simple text-based PDF export
    const content = filtered.map(log => 
      `Admin: ${log.admin}\nAction: ${log.action}\nSubject: ${log.subject}\nDetails: ${log.details || 'N/A'}\nDate: ${format(parseISO(log.createdAt), 'MMM dd, yyyy HH:mm')}\n---\n`
    ).join('\n');

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', `audit-logs-${new Date().toISOString().split('T')[0]}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-2">
          Audit Logs
        </h1>
        <p className="text-slate-400 text-lg">View and track all admin activities, user changes, and system events</p>
      </div>

      {/* Info Box */}
      <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-600/30 backdrop-blur-sm rounded-lg p-6">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-400" />
            What is Audit Logging?
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            The Audit Log records all actions taken in your admin dashboard. Every time an admin verifies a user, approves a property, blocks someone, or makes any change - it gets logged here with:
          </p>
          <ul className="text-slate-300 text-sm space-y-2 ml-4">
            <li>✓ <span className="font-medium">Who</span> performed the action (Admin name)</li>
            <li>✓ <span className="font-medium">What</span> action was taken (Verified User, Approved Property, etc)</li>
            <li>✓ <span className="font-medium">When</span> it happened (exact date and time)</li>
            <li>✓ <span className="font-medium">Details</span> about what was changed</li>
          </ul>
          <p className="text-slate-300 text-sm pt-2">
            <span className="text-purple-400 font-medium">💡 Use Case:</span> Need to know who approved a property last week? Check the audit logs!
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-slate-900/50 border border-slate-700 backdrop-blur-sm rounded-lg p-6">
        <p className="text-slate-400 text-sm font-medium mb-2">Total Activities Logged</p>
        <p className="text-3xl font-bold text-white">{logs.length}</p>
      </div>

      {/* Search Icon Button */}
      <div className="flex gap-2">
        <Button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            showFilters
              ? 'bg-purple-600 hover:bg-purple-700 text-white'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
          }`}
        >
          {showFilters ? (
            <>
              <X className="w-4 h-4" />
              Hide Filters
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              Show Filters
            </>
          )}
        </Button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-slate-900/50 border border-slate-700 backdrop-blur-sm rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Search & Filter Logs
            </h2>
            <p className="text-slate-400 text-sm">Use these tools to find specific activities</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-1">
              <label className="text-slate-300 text-sm font-medium mb-2 block">🔍 Search</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Type action name, admin name, or details..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-slate-800 border-slate-700 hover:border-slate-600 focus:border-purple-500 transition-colors text-white flex-1"
                />
                <Button
                  onClick={() => {}}
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-3 flex-shrink-0"
                  title="Search"
                >
                  <Search className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-slate-500 text-xs mt-1">Search across all fields</p>
            </div>

            <div>
              <label className="text-slate-300 text-sm font-medium mb-2 block">📋 Action Type</label>
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 hover:border-slate-600 focus:border-purple-500 text-white transition-colors"
              >
                <option value="all">All Actions</option>
                {actions.map(action => (
                  <option key={action} value={action}>{action}</option>
                ))}
              </select>
              <p className="text-slate-500 text-xs mt-1">Filter by what happened</p>
            </div>

            <div>
              <label className="text-slate-300 text-sm font-medium mb-2 block">👤 Admin</label>
              <select
                value={adminFilter}
                onChange={(e) => setAdminFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 hover:border-slate-600 focus:border-purple-500 text-white transition-colors"
              >
                <option value="all">All Admins</option>
                {admins.map(admin => (
                  <option key={admin} value={admin}>{admin}</option>
                ))}
              </select>
              <p className="text-slate-500 text-xs mt-1">Filter by who did it</p>
            </div>

            <div>
              <label className="text-slate-300 text-sm font-medium mb-2 block">📅 Date Range</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="flex-1 px-2 py-2 rounded-lg bg-slate-800 border border-slate-700 hover:border-slate-600 focus:border-purple-500 text-white transition-colors text-sm"
                  title="From date"
                />
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="flex-1 px-2 py-2 rounded-lg bg-slate-800 border border-slate-700 hover:border-slate-600 focus:border-purple-500 text-white transition-colors text-sm"
                  title="To date"
                />
              </div>
              <p className="text-slate-500 text-xs mt-1">Filter by when it happened</p>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap pt-4 border-t border-slate-700">
            <Button
              onClick={() => {
                setSearch('');
                setActionFilter('all');
                setAdminFilter('all');
                setDateRange({ start: today, end: today });
              }}
              variant="outline"
              className="border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white"
            >
              🔄 Reset All Filters
            </Button>

            {csvData.length > 0 && (
              <>
                <CSVLink
                  data={csvData}
                  filename={`audit-logs-${new Date().toISOString().split('T')[0]}.csv`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
                >
                  <Download className="w-4 h-4" />
                  📊 Export as CSV
                </CSVLink>

                <Button
                  onClick={exportPDF}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium"
                >
                  <Download className="w-4 h-4 mr-2" />
                  📄 Export as Text
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Logs List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Activity className="w-16 h-16 text-slate-600 mx-auto mb-4 opacity-50" />
          <p className="text-slate-400 text-lg">No activity logs found</p>
          <p className="text-slate-500 text-sm mt-2">Try adjusting your filters or check back later</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="text-slate-400 text-sm mb-4">
            Showing <span className="text-purple-400 font-semibold">{filtered.length}</span> activities
          </div>
          {filtered.map((log) => (
            <div
              key={log._id}
              className="bg-slate-900/50 border border-slate-700 rounded-lg p-5 hover:border-slate-600 transition-all duration-300 hover:bg-slate-900/70"
            >
              <div className="space-y-4">
                {/* Top Row: Action and Details */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Activity className="w-5 h-5 text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-bold text-lg text-white">{log.action}</h3>
                        <span className="text-xs px-3 py-1 rounded-full bg-purple-600/20 text-purple-300 border border-purple-600/50 font-medium">
                          {log.subject}
                        </span>
                      </div>
                      <p className="text-slate-300 text-sm mt-2">{log.details || 'No additional details'}</p>
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Admin, Time */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
                  <div className="space-y-1">
                    <p className="text-slate-400 text-xs font-medium">PERFORMED BY</p>
                    <p className="text-white font-semibold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      {log.admin}
                    </p>
                  </div>

                  <div className="space-y-1 text-right">
                    <p className="text-slate-400 text-xs font-medium">WHEN</p>
                    <div className="flex flex-col items-end">
                      <p className="text-white font-semibold">{formatDistanceToNow(parseISO(log.createdAt), { addSuffix: true })}</p>
                      <p className="text-slate-500 text-xs">{format(parseISO(log.createdAt), 'MMM dd, yyyy · hh:mm a')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
