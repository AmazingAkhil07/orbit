'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Eye, CheckCircle2, XCircle, Clock, MapPin, Home, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface Property {
  _id: string;
  title: string;
  slug: string;
  address?: string;
  price?: { amount: number };
  approvalStatus: string;
  createdAt: string;
  ownerId?: { name: string; email: string };
}

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProperties();
  }, []);

  async function fetchProperties() {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/properties');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setProperties(data.properties || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function approveProperty(id: string) {
    try {
      const res = await fetch(`/api/admin/properties/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approvalStatus: 'approved' }),
      });
      if (res.ok) {
        fetchProperties();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async function rejectProperty(id: string) {
    try {
      const res = await fetch(`/api/admin/properties/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approvalStatus: 'rejected' }),
      });
      if (res.ok) {
        fetchProperties();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const filtered = properties.filter((p) => {
    const matchesFilter = filter === 'all' || p.approvalStatus === filter;
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.address?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: properties.length,
    approved: properties.filter(p => p.approvalStatus === 'approved').length,
    pending: properties.filter(p => p.approvalStatus === 'pending').length,
    rejected: properties.filter(p => p.approvalStatus === 'rejected').length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">Properties Management</h1>
        <p className="text-slate-400 text-lg">Review and approve property listings</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Properties', value: stats.total, icon: Home, color: 'from-blue-600 to-blue-400', bgColor: 'bg-blue-500/10' },
          { label: 'Approved', value: stats.approved, icon: CheckCircle2, color: 'from-green-600 to-green-400', bgColor: 'bg-green-500/10' },
          { label: 'Pending Review', value: stats.pending, icon: Clock, color: 'from-amber-600 to-amber-400', bgColor: 'bg-amber-500/10' },
          { label: 'Rejected', value: stats.rejected, icon: XCircle, color: 'from-red-600 to-red-400', bgColor: 'bg-red-500/10' },
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
            <label className="text-slate-300 text-sm font-medium mb-2 block">Search Properties</label>
            <Input
              placeholder="Search by name or address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-800 border-slate-700 hover:border-slate-600 focus:border-blue-500 transition-colors text-white"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-slate-300 text-sm font-medium mb-2 block">Filter by Status</label>
            <div className="flex gap-2">
              {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
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

      {/* Properties Grid */}
      <div>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Home className="w-16 h-16 text-slate-600 mx-auto mb-4 opacity-50" />
            <p className="text-slate-400 text-lg">No properties found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((prop) => (
              <div
                key={prop._id}
                className="group relative overflow-hidden rounded-lg border border-slate-700 bg-slate-900/50 backdrop-blur-sm hover:border-slate-600 hover:bg-slate-900/70 transition-all duration-300"
              >
                {/* Gradient Background */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-5 bg-gradient-to-br from-blue-500 to-purple-500 transition-opacity duration-300" />

                <div className="relative p-6 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate group-hover:text-blue-300 transition-colors line-clamp-2">
                        {prop.title}
                      </h3>
                      <p className="text-slate-400 text-sm flex items-center gap-1.5 mt-1 truncate">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">{prop.address || 'No address'}</span>
                      </p>
                    </div>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 ${
                      prop.approvalStatus === 'approved'
                        ? 'bg-green-600/20'
                        : prop.approvalStatus === 'rejected'
                        ? 'bg-red-600/20'
                        : 'bg-amber-600/20'
                    }`}>
                      {prop.approvalStatus === 'approved' && <CheckCircle2 className="w-5 h-5 text-green-400" />}
                      {prop.approvalStatus === 'rejected' && <XCircle className="w-5 h-5 text-red-400" />}
                      {prop.approvalStatus === 'pending' && <Clock className="w-5 h-5 text-amber-400" />}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="pt-2 border-t border-slate-700/50 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Price</span>
                      <div className="flex items-center gap-1 text-white font-semibold">
                        <span className="text-green-400 text-lg">₹</span>
                        {(prop.price?.amount || 0).toLocaleString('en-IN')}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Status</span>
                      <div className={`px-2.5 py-1 rounded text-xs font-semibold ${
                        prop.approvalStatus === 'approved'
                          ? 'bg-green-600/20 text-green-400 border border-green-600/50'
                          : prop.approvalStatus === 'rejected'
                          ? 'bg-red-600/20 text-red-400 border border-red-600/50'
                          : 'bg-amber-600/20 text-amber-400 border border-amber-600/50'
                      }`}>
                        {(prop.approvalStatus || 'pending').charAt(0).toUpperCase() + (prop.approvalStatus || 'pending').slice(1)}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm pt-2">
                      <span className="text-slate-400 text-xs">Added</span>
                      <span className="text-slate-300 text-xs">{new Date(prop.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-700/50 space-y-2">
                    {prop.approvalStatus === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => approveProperty(prop._id)}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-green-600/20 hover:bg-green-600/30 text-green-400 hover:text-green-300 font-medium transition-all text-sm border border-green-600/50 hover:border-green-500"
                          title="Approve property"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => rejectProperty(prop._id)}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 font-medium transition-all text-sm border border-red-600/50 hover:border-red-500"
                          title="Reject property"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                      </div>
                    )}
                    <Link href={`/pg/${prop.slug}`} className="block">
                      <button className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 hover:text-blue-300 font-medium transition-all text-sm border border-blue-600/50 hover:border-blue-500">
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
