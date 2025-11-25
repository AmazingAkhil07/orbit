import { Users, Home, ShoppingCart, TrendingUp, BarChart3, Shield, Zap, Lock, User as UserIcon, CheckCircle2, Mail } from 'lucide-react';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Property from '@/models/Property';
import Booking from '@/models/Booking';
import { Badge } from '@/components/ui/badge';
import { PremiumDashboard } from '@/components/admin/PremiumDashboard';
import { Cube3D, Pyramid3D, Sphere3D, Torus3D } from '@/components/admin/Models3D';

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
    <div className="space-y-12">
      {/* Header Section with Gradient */}
      <style>{`
        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-slideInDown {
          animation: slideInDown 0.6s ease-out forwards;
        }
        
        .animate-slideInUp {
          animation: slideInUp 0.6s ease-out forwards;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.5s ease-out forwards;
        }
        
        .service-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        
        .service-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          transition: left 0.5s ease;
        }
        
        .service-card:hover::before {
          left: 100%;
        }
        
        .service-card:hover {
          transform: translateY(-8px);
          border-color: currentColor;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        
        .stat-card-hover {
          transition: all 0.3s ease;
        }
        
        .stat-card-hover:hover {
          transform: translateY(-4px);
        }
      `}</style>

      {/* Admin Profile Card */}
      {adminUser && (
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6 md:p-8 animate-slideInDown">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4 flex-1">
              {/* Avatar */}
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                {adminUser.image ? (
                  <img src={adminUser.image} alt={adminUser.name || 'Admin'} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <UserIcon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                )}
              </div>
              
              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-2xl md:text-3xl font-bold text-white">{adminUser.name || 'Admin User'}</h2>
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/50">Admin</Badge>
                </div>
                <div className="flex items-center gap-2 text-slate-400 mb-3">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{adminUser.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-green-400 text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verified Admin</span>
                  </div>
                  <div className="text-slate-500 text-xs">•</div>
                  <span className="text-slate-400 text-sm">Full Platform Access</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 w-full md:w-auto">
              <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                <p className="text-slate-400 text-xs mb-1">Role</p>
                <p className="text-white font-semibold">Admin</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                <p className="text-slate-400 text-xs mb-1">Status</p>
                <p className="text-green-400 font-semibold">Active</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                <p className="text-slate-400 text-xs mb-1">Access</p>
                <p className="text-blue-400 font-semibold">Full</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700 p-8 md:p-12">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(59,130,246,0.4),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(139,92,246,0.4),transparent_50%)]"></div>
        </div>
        
        <div className="relative z-10">
          <div className="animate-slideInDown">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              Welcome Back, <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Admin</span>
            </h1>
            <p className="text-slate-300 text-lg">Manage your Orbit platform with powerful tools and insights</p>
          </div>
          
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 animate-slideInUp">
            {statsData.map((stat, idx) => (
              <div key={idx} className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4 stat-card-hover" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-blue-400">{stat.icon}</div>
                  <p className="text-slate-400 text-sm">{stat.title}</p>
                </div>
                <p className="text-2xl md:text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-slate-500 text-xs mt-1">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="space-y-6">
        <div className="animate-fadeIn">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Admin Services</h2>
          <p className="text-slate-400">Complete control over your platform with advanced management tools</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, idx) => (
            <Link key={idx} href={service.href}>
              <div 
                className={`service-card group relative h-full bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-6 cursor-pointer animate-scaleIn overflow-hidden`}
                style={{ animationDelay: service.delay }}
              >
                {/* Decorative 3D Background */}
                <div className="absolute bottom-0 right-0 w-32 h-32 opacity-5 group-hover:opacity-10 transition-opacity">
                  {idx % 4 === 0 && <Cube3D />}
                  {idx % 4 === 1 && <Sphere3D />}
                  {idx % 4 === 2 && <Pyramid3D />}
                  {idx % 4 === 3 && <Torus3D />}
                </div>

                {/* Gradient Background */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity rounded-xl bg-gradient-to-br ${service.color}`}></div>
                
                {/* Glow Effect */}
                <div className={`absolute -inset-0.5 opacity-0 group-hover:opacity-20 rounded-xl blur bg-gradient-to-br ${service.color} transition-opacity -z-10`}></div>
                
                <div className="relative z-10 space-y-4">
                  {/* Icon Container */}
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${service.color} text-white group-hover:scale-110 transition-transform`}>
                    {service.icon}
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-bold text-white leading-tight">
                    {service.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-slate-300 text-sm leading-relaxed group-hover:text-slate-100 transition-colors">
                    {service.description}
                  </p>
                  
                  {/* Arrow Indicator */}
                  <div className="flex items-center gap-2 text-slate-300 group-hover:text-white transition-colors text-sm font-medium pt-2">
                    <span>Access</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Premium Analytics Dashboard */}
      <div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Analytics & Performance</h2>
        <PremiumDashboard stats={stats} />
      </div>

      {/* Stats Grid */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Quick Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slideInUp">
          {statsData.map((stat, idx) => (
            <div key={idx} className="relative bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4 stat-card-hover overflow-hidden group" style={{ animationDelay: `${idx * 100}ms` }}>
              {/* Decorative 3D Background */}
              <div className="absolute top-0 right-0 w-20 h-20 opacity-5 group-hover:opacity-10 transition-opacity">
                {idx % 4 === 0 && <Cube3D />}
                {idx % 4 === 1 && <Sphere3D />}
                {idx % 4 === 2 && <Pyramid3D />}
                {idx % 4 === 3 && <Torus3D />}
              </div>
              
              <div className="relative z-10 flex items-center gap-2 mb-2">
                <div className="text-blue-400">{stat.icon}</div>
                <p className="text-slate-400 text-sm">{stat.title}</p>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-white">{stat.value}</p>
              <p className="text-slate-500 text-xs mt-1">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-6 md:p-8 animate-slideInUp">
        <div className="flex flex-row items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Recent Bookings</h2>
            <p className="text-slate-400 text-sm">Latest booking activities on your platform</p>
          </div>
          <Link href="/admin/bookings">
            <button className="px-4 py-2 text-sm border border-slate-600 text-slate-300 hover:border-blue-500 hover:text-white hover:bg-blue-500/10 rounded-lg transition-all duration-300 font-medium">
              View All →
            </button>
          </Link>
        </div>
        
        <div className="space-y-3">
          {recentBookings.length === 0 ? (
            <div className="text-center py-12">
              <Lock className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No bookings yet</p>
            </div>
          ) : (
            recentBookings.map((booking: any, idx) => (
              <div
                key={booking._id.toString()}
                className="group flex items-center justify-between p-4 bg-slate-800/50 hover:bg-slate-800 rounded-lg border border-slate-700 hover:border-slate-600 transition-all duration-300 cursor-pointer"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="flex-1">
                  <p className="text-white font-semibold group-hover:text-blue-400 transition-colors">{booking.propertyId?.title || 'Unknown Property'}</p>
                  <p className="text-slate-400 text-sm">{booking.studentId?.name || 'Unknown Student'}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">₹{booking.amountPaid.toLocaleString()}</p>
                  <Badge
                    variant={booking.status === 'paid' ? 'default' : 'secondary'}
                    className={`text-xs font-medium ${
                      booking.status === 'paid'
                        ? 'bg-green-600/80 text-white'
                        : booking.status === 'pending'
                        ? 'bg-yellow-600/80 text-white'
                        : 'bg-slate-600/80 text-white'
                    }`}
                  >
                    {booking.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 border border-blue-700/50 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="w-6 h-6 text-blue-400" />
            <h3 className="font-semibold text-white">Security First</h3>
          </div>
          <p className="text-blue-100/70 text-sm">Your platform is protected with enterprise-grade security</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 border border-purple-700/50 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <Zap className="w-6 h-6 text-purple-400" />
            <h3 className="font-semibold text-white">Real-time Updates</h3>
          </div>
          <p className="text-purple-100/70 text-sm">All data updates in real-time as activities occur</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-900/50 to-green-800/50 border border-green-700/50 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <BarChart3 className="w-6 h-6 text-green-400" />
            <h3 className="font-semibold text-white">Advanced Analytics</h3>
          </div>
          <p className="text-green-100/70 text-sm">Get insights with detailed analytics and reports</p>
        </div>
      </div>
    </div>
  );
}
