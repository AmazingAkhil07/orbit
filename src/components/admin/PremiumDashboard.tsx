'use client';

import React from 'react';
import { Users, Home, ShoppingCart, DollarSign } from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  studentCount: number;
  ownerCount: number;
  totalProperties: number;
  approvedProperties: number;
  totalBookings: number;
  totalRevenue: number;
}

interface PremiumDashboardProps {
  stats: DashboardStats;
}

export function PremiumDashboard({ stats }: PremiumDashboardProps) {
  const statCards = [
    {
      label: 'Total Users',
      value: stats.totalUsers,
      change: `${stats.studentCount + stats.ownerCount} active users`,
      icon: Users,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      label: 'Properties',
      value: stats.totalProperties,
      change: `${stats.approvedProperties} approved`,
      icon: Home,
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
    },
    {
      label: 'Bookings',
      value: stats.totalBookings,
      change: `${stats.totalBookings} total bookings`,
      icon: ShoppingCart,
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
    },
    {
      label: 'Revenue',
      value: `₹${(stats.totalRevenue / 100000).toFixed(1)}L`,
      change: `Platform earnings`,
      icon: DollarSign,
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 p-6 transition-all duration-300 hover:shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <Icon className={`w-6 h-6 ${card.textColor}`} />
                </div>
              </div>
              <p className="text-slate-500 text-sm font-medium mb-1">{card.label}</p>
              <p className="text-3xl font-bold text-slate-900">{card.value}</p>
              <p className="text-slate-400 text-xs mt-2">{card.change}</p>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
        <div>
          <p className="text-slate-600 text-sm font-medium mb-2">Active Students</p>
          <p className="text-3xl font-bold text-blue-600">{stats.studentCount}</p>
        </div>
        <div>
          <p className="text-slate-600 text-sm font-medium mb-2">Active Owners</p>
          <p className="text-3xl font-bold text-purple-600">{stats.ownerCount}</p>
        </div>
        <div>
          <p className="text-slate-600 text-sm font-medium mb-2">Approved Properties</p>
          <p className="text-3xl font-bold text-green-600">{stats.approvedProperties}</p>
        </div>
      </div>
    </div>
  );
}
