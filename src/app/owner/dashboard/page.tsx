'use client';

import { Building2, Users, DollarSign, Star, TrendingUp, ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, XCircle, Eye } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function OwnerDashboard() {
  const searchParams = useSearchParams();
  const ownerId = searchParams.get('ownerId');
  const isViewingAsAdmin = !!ownerId;

  // Mock Data
  const stats = [
    {
      label: 'Total Properties',
      value: '3',
      change: '+1 this month',
      trend: 'up',
      icon: Building2,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      label: 'Occupancy Rate',
      value: '85%',
      change: '+5% vs last month',
      trend: 'up',
      icon: Users,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
    {
      label: 'Monthly Revenue',
      value: '₹45,000',
      change: '+12% vs last month',
      trend: 'up',
      icon: DollarSign,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
    },
    {
      label: 'Average Rating',
      value: '4.8',
      change: '0.2 vs last month',
      trend: 'up',
      icon: Star,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'booking',
      title: 'New Booking Request',
      description: 'Rahul Kumar requested Room 101 at Sunny Villa',
      time: '2 hours ago',
      status: 'pending',
    },
    {
      id: 2,
      type: 'review',
      title: 'New Review Received',
      description: 'Priya Sharma gave 5 stars to Green Heights',
      time: '5 hours ago',
      status: 'completed',
    },
    {
      id: 3,
      type: 'payment',
      title: 'Payment Processed',
      description: 'Monthly rent received from Amit Singh',
      time: '1 day ago',
      status: 'completed',
    },
    {
      id: 4,
      type: 'booking',
      title: 'Booking Cancelled',
      description: 'Sneha Gupta cancelled booking for Room 202',
      time: '2 days ago',
      status: 'cancelled',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Admin View Banner */}
      {isViewingAsAdmin && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-center gap-3 text-blue-400 animate-in fade-in slide-in-from-top-2">
          <Eye className="w-5 h-5" />
          <span className="font-medium">Admin View Mode: You are viewing this dashboard as an administrator.</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
          <p className="text-zinc-400 mt-1">Welcome back! Here's what's happening with your properties.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/owner/properties/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded-xl transition-all hover:scale-105 active:scale-95"
          >
            <Building2 className="w-4 h-4" />
            Add Property
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="group relative overflow-hidden bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6 hover:bg-white/5 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg ${
                  stat.trend === 'up' ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'
                }`}>
                  {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.change}
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-zinc-400 text-sm font-medium">{stat.label}</h3>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Recent Activity</h2>
            <Link href="/owner/notifications" className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
              View All
            </Link>
          </div>
          
          <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden">
            <div className="divide-y divide-white/5">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="p-4 hover:bg-white/5 transition-colors flex items-start gap-4">
                  <div className={`mt-1 p-2 rounded-full ${
                    activity.type === 'booking' ? 'bg-blue-500/10 text-blue-400' :
                    activity.type === 'review' ? 'bg-purple-500/10 text-purple-400' :
                    'bg-emerald-500/10 text-emerald-400'
                  }`}>
                    {activity.type === 'booking' ? <Clock className="w-4 h-4" /> :
                     activity.type === 'review' ? <Star className="w-4 h-4" /> :
                     <DollarSign className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-white font-medium">{activity.title}</h4>
                      <span className="text-xs text-zinc-500">{activity.time}</span>
                    </div>
                    <p className="text-sm text-zinc-400 mb-2">{activity.description}</p>
                    <div className="flex items-center gap-2">
                      {activity.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-amber-500/10 text-amber-400">
                          <Clock className="w-3 h-3" /> Pending
                        </span>
                      )}
                      {activity.status === 'completed' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400">
                          <CheckCircle2 className="w-3 h-3" /> Completed
                        </span>
                      )}
                      {activity.status === 'cancelled' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-red-500/10 text-red-400">
                          <XCircle className="w-3 h-3" /> Cancelled
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions & Tips */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4">
            <Link href="/owner/properties/new" className="group p-4 bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl hover:bg-white/5 transition-all flex items-center gap-4">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-white font-medium">List New Property</h3>
                <p className="text-sm text-zinc-400">Add a new PG to your portfolio</p>
              </div>
            </Link>
            
            <Link href="/owner/bookings" className="group p-4 bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl hover:bg-white/5 transition-all flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-white font-medium">Manage Bookings</h3>
                <p className="text-sm text-zinc-400">Review pending requests</p>
              </div>
            </Link>

            <Link href="/owner/payments" className="group p-4 bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl hover:bg-white/5 transition-all flex items-center gap-4">
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-white font-medium">Payment History</h3>
                <p className="text-sm text-zinc-400">View earnings and settlements</p>
              </div>
            </Link>
          </div>

          {/* Pro Tip Card */}
          <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-emerald-600 to-teal-800">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3 text-emerald-100">
                <TrendingUp className="w-5 h-5" />
                <span className="font-semibold">Pro Tip</span>
              </div>
              <h3 className="text-white font-bold mb-2">Boost Your Occupancy</h3>
              <p className="text-emerald-100 text-sm mb-4">
                Properties with 5+ high-quality photos get 40% more inquiries. Update your gallery today!
              </p>
              <Link href="/owner/properties" className="inline-block px-4 py-2 bg-white text-emerald-700 font-semibold rounded-lg text-sm hover:bg-emerald-50 transition-colors">
                Update Photos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
