import { Users, Home, ShoppingCart, TrendingUp, BarChart3, Shield, Zap, Lock, User as UserIcon, CheckCircle2, Mail, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Property from '@/models/Property';
import Booking from '@/models/Booking';
import { Badge } from '@/components/ui/badge';

async function getAdminStats() {
  try {
    await dbConnect();
    console.log('Fetching admin stats...');

    const totalUsers = await User.countDocuments();
    const totalProperties = await Property.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const paidBookings = await Booking.countDocuments({ status: 'paid' });
    const totalRevenue = await Booking.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$amountPaid' } } },
    ]);

    const thisMonthBookings = await Booking.countDocuments({
      createdAt: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      },
    });

    const studentCount = await User.countDocuments({ role: 'student' });
    const ownerCount = await User.countDocuments({ role: 'owner' });
    const verifiedUsers = await User.countDocuments({ isVerified: true });

    const stats = {
      totalUsers,
      studentCount,
      ownerCount,
      verifiedUsers,
      totalProperties,
      approvedProperties: await Property.countDocuments({ approvalStatus: 'approved' }),
      pendingProperties: await Property.countDocuments({ approvalStatus: 'pending' }),
      totalBookings,
      paidBookings,
      thisMonthBookings,
      totalRevenue: totalRevenue[0]?.total || 0,
    };

    console.log('Admin stats fetched:', stats);
    return stats;
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    throw error;
  }
}

async function getRecentActivity() {
  try {
    await dbConnect();

    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('studentId', 'name email')
      .populate('propertyId', 'title')
      .lean();

    return recentBookings;
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    return [];
  }
}

export default async function AdminDashboard() {
  let stats;
  let error = null;
  const session = await getServerSession(authOptions);
  const adminUser = session?.user;

  try {
    stats = await getAdminStats();
  } catch (err) {
    error = 'Failed to load dashboard data';
    console.error('Dashboard error:', err);
  }

  const recentBookings = await getRecentActivity();

  if (!stats || error) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">{error || 'Failed to load dashboard data'}</p>
      </div>
    );
  }

  const statsData = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      description: `${stats.studentCount} students, ${stats.ownerCount} owners`,
      icon: <Users className="w-5 h-5" />,
    },
    {
      title: 'Properties',
      value: stats.totalProperties,
      description: `${stats.approvedProperties} approved, ${stats.pendingProperties} pending`,
      icon: <Home className="w-5 h-5" />,
    },
    {
      title: 'Bookings',
      value: stats.totalBookings,
      description: `${stats.paidBookings} paid, ${stats.thisMonthBookings} this month`,
      icon: <ShoppingCart className="w-5 h-5" />,
    },
    {
      title: 'Revenue',
      value: `₹${(stats.totalRevenue / 100000).toFixed(1)}L`,
      description: 'Total from paid bookings',
      icon: <TrendingUp className="w-5 h-5" />,
    },
  ];

  const services = [
    {
      title: 'User Management',
      description: 'Control user roles, verify accounts, and manage blacklists',
      icon: <Users className="w-8 h-8" />,
      href: '/admin/users',
      color: 'from-blue-500 to-blue-600',
      delay: '0ms',
    },
    {
      title: 'Property Control',
      description: 'Approve, reject, or manage all properties on the platform',
      icon: <Home className="w-8 h-8" />,
      href: '/admin/properties',
      color: 'from-purple-500 to-purple-600',
      delay: '100ms',
    },
    {
      title: 'Booking Analytics',
      description: 'Track bookings, payments, and rental activities',
      icon: <ShoppingCart className="w-8 h-8" />,
      href: '/admin/bookings',
      color: 'from-green-500 to-green-600',
      delay: '200ms',
    },
    {
      title: 'Performance Metrics',
      description: 'Detailed analytics and platform performance insights',
      icon: <BarChart3 className="w-8 h-8" />,
      href: '/admin/analytics',
      color: 'from-orange-500 to-orange-600',
      delay: '300ms',
    },
    {
      title: 'Security',
      description: 'Manage security settings and monitor platform safety',
      icon: <Shield className="w-8 h-8" />,
      href: '/admin/users',
      color: 'from-red-500 to-red-600',
      delay: '400ms',
    },
    {
      title: 'System Performance',
      description: 'Monitor system health and optimize platform resources',
      icon: <Zap className="w-8 h-8" />,
      href: '/admin',
      color: 'from-yellow-500 to-yellow-600',
      delay: '500ms',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Command Center</h1>
          <p className="text-zinc-400 mt-1">Platform overview and management controls</p>
        </div>

        {adminUser && (
          <div className="flex items-center gap-3 bg-zinc-900/50 border border-zinc-800 rounded-full px-4 py-2">
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
              {adminUser.image ? (
                <img src={adminUser.image} alt={adminUser.name || 'Admin'} className="w-full h-full rounded-full object-cover" />
              ) : (
                <UserIcon className="w-4 h-4 text-zinc-400" />
              )}
            </div>
            <div className="text-sm">
              <p className="text-white font-medium leading-none">{adminUser.name || 'Admin'}</p>
              <p className="text-zinc-500 text-xs leading-none mt-1">Administrator</p>
            </div>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, idx) => (
          <div key={idx} className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-zinc-900 rounded-lg text-zinc-400 group-hover:text-white transition-colors">
                {stat.icon}
              </div>
              <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Metric</span>
            </div>
            <p className="text-3xl font-bold text-white tracking-tight mb-1">{stat.value}</p>
            <p className="text-sm text-zinc-500">{stat.description}</p>
          </div>
        ))}
      </div>

      {/* Services Grid */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-zinc-400" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service, idx) => (
            <Link key={idx} href={service.href}>
              <div className="h-full bg-zinc-900/30 border border-zinc-800 rounded-xl p-5 hover:bg-zinc-900/50 hover:border-zinc-700 transition-all cursor-pointer group">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-400 group-hover:text-white group-hover:border-zinc-700 transition-all">
                    {service.icon}
                  </div>
                  <ExternalLink className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                </div>
                <h3 className="text-base font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">{service.title}</h3>
                <p className="text-sm text-zinc-500 line-clamp-2">{service.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-zinc-400" />
              Recent Bookings
            </h2>
            <Link href="/admin/bookings" className="text-sm text-zinc-500 hover:text-white transition-colors">
              View All
            </Link>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
            {recentBookings.length === 0 ? (
              <div className="text-center py-12">
                <Lock className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
                <p className="text-zinc-500">No bookings recorded yet</p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-800">
                {recentBookings.map((booking: any) => (
                  <div key={booking._id.toString()} className="p-4 flex items-center justify-between hover:bg-zinc-900/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center border border-zinc-800">
                        <Home className="w-5 h-5 text-zinc-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{booking.propertyId?.title || 'Unknown Property'}</p>
                        <p className="text-xs text-zinc-500">{booking.studentId?.name || 'Unknown Student'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-white">₹{booking.amountPaid.toLocaleString()}</p>
                      <Badge
                        variant="outline"
                        className={`mt-1 text-[10px] uppercase tracking-wider border-0 ${booking.status === 'paid' ? 'bg-emerald-500/10 text-emerald-500' :
                          booking.status === 'pending' ? 'bg-amber-500/10 text-amber-500' :
                            'bg-zinc-500/10 text-zinc-500'
                          }`}
                      >
                        {booking.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* System Status */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-zinc-400" />
            System Status
          </h2>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">Database</span>
              <span className="flex items-center gap-2 text-xs font-medium text-emerald-500">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Operational
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">API Gateway</span>
              <span className="flex items-center gap-2 text-xs font-medium text-emerald-500">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Operational
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">Storage</span>
              <span className="flex items-center gap-2 text-xs font-medium text-emerald-500">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Operational
              </span>
            </div>
            <div className="pt-4 border-t border-zinc-800">
              <p className="text-xs text-zinc-500">Last check: Just now</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
