'use client';

import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/admin/ui/GlassCard';
import { GlassTable, GlassTableHeader, GlassTableBody, GlassTableRow, GlassTableHead, GlassTableCell } from '@/components/admin/ui/GlassTable';
import { PageHeader } from '@/components/admin/ui/PageHeader';
import { Input } from '@/components/ui/input';
import { Loader2, Search, Filter } from 'lucide-react';

interface Booking {
  _id: string;
  studentId?: { name: string; email: string };
  propertyId?: { title: string };
  amountPaid: number;
  status: string;
  createdAt: string;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/bookings');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  const filtered = bookings.filter(
    (b) =>
      b.studentId?.name.toLowerCase().includes(search.toLowerCase()) ||
      b.propertyId?.title.toLowerCase().includes(search.toLowerCase()) ||
      b.studentId?.email.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'pending':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'confirmed':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'rejected':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20';
    }
  };

  const totalRevenue = bookings
    .filter((b) => b.status === 'paid')
    .reduce((sum, b) => sum + b.amountPaid, 0);

  const stats = [
    { label: 'Total Bookings', value: bookings.length },
    { label: 'Paid Bookings', value: bookings.filter((b) => b.status === 'paid').length },
    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}` },
    { label: 'Average Booking', value: `₹${Math.round(totalRevenue / bookings.length || 0).toLocaleString()}` },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Bookings Management"
        description="View and manage all bookings across the platform"
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

      {/* Search & Filter Bar */}
      <GlassCard className="p-4 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input
            placeholder="Search by student name, email, or property..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 focus:border-blue-500/50 transition-all text-white placeholder:text-zinc-600 pl-10 h-10 rounded-xl"
          />
        </div>
        <button className="p-2.5 rounded-xl bg-zinc-900/50 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
          <Filter className="w-4 h-4" />
        </button>
      </GlassCard>

      {/* Bookings Table */}
      <GlassCard className="overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white font-heading">{filtered.length} Bookings Found</h2>
        </div>
        <div>
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-zinc-500">No bookings found matching your search</p>
            </div>
          ) : (
            <GlassTable>
              <GlassTableHeader>
                <GlassTableRow>
                  <GlassTableHead>Student</GlassTableHead>
                  <GlassTableHead>Property</GlassTableHead>
                  <GlassTableHead>Amount</GlassTableHead>
                  <GlassTableHead>Status</GlassTableHead>
                  <GlassTableHead>Date</GlassTableHead>
                </GlassTableRow>
              </GlassTableHeader>
              <GlassTableBody>
                {filtered.map((booking) => (
                  <GlassTableRow key={booking._id}>
                    <GlassTableCell>
                      <div>
                        <p className="text-white font-medium">{booking.studentId?.name || 'N/A'}</p>
                        <p className="text-zinc-500 text-xs">{booking.studentId?.email}</p>
                      </div>
                    </GlassTableCell>
                    <GlassTableCell className="text-zinc-300">{booking.propertyId?.title || 'N/A'}</GlassTableCell>
                    <GlassTableCell className="text-white font-medium font-mono">
                      ₹{booking.amountPaid.toLocaleString()}
                    </GlassTableCell>
                    <GlassTableCell>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold border ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </GlassTableCell>
                    <GlassTableCell className="text-zinc-500 text-sm">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </GlassTableCell>
                  </GlassTableRow>
                ))}
              </GlassTableBody>
            </GlassTable>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
