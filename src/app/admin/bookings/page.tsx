'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

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
        return 'bg-green-600';
      case 'pending':
        return 'bg-yellow-600';
      case 'confirmed':
        return 'bg-blue-600';
      case 'rejected':
        return 'bg-red-600';
      default:
        return 'bg-slate-600';
    }
  };

  const totalRevenue = bookings
    .filter((b) => b.status === 'paid')
    .reduce((sum, b) => sum + b.amountPaid, 0);

  const stats = [
    { label: 'Total Bookings', value: bookings.length },
    { label: 'Paid Bookings', value: bookings.filter((b) => b.status === 'paid').length },
    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}` },
    { label: 'Average Booking', value: `₹${Math.round(totalRevenue / bookings.length).toLocaleString()}` },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Bookings Management</h1>
        <p className="text-slate-400">View and manage all bookings</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="bg-slate-900 border-slate-800">
            <CardContent className="pt-6">
              <p className="text-slate-400 text-sm mb-2">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="pt-6">
          <Input
            placeholder="Search by student name, email, or property..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-800 border-slate-700"
          />
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">{filtered.length} Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-slate-400 text-center py-8">No bookings found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-4 px-4 text-slate-300 font-semibold">Student</th>
                    <th className="text-left py-4 px-4 text-slate-300 font-semibold">Property</th>
                    <th className="text-left py-4 px-4 text-slate-300 font-semibold">Amount</th>
                    <th className="text-left py-4 px-4 text-slate-300 font-semibold">Status</th>
                    <th className="text-left py-4 px-4 text-slate-300 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((booking) => (
                    <tr key={booking._id} className="border-b border-slate-700/50 hover:bg-slate-800/30">
                      <td className="py-4 px-4">
                        <div>
                          <p className="text-white font-semibold">{booking.studentId?.name || 'N/A'}</p>
                          <p className="text-slate-400 text-sm">{booking.studentId?.email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-white">{booking.propertyId?.title || 'N/A'}</td>
                      <td className="py-4 px-4 text-white font-semibold">
                        ₹{booking.amountPaid.toLocaleString()}
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-slate-400 text-sm">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
