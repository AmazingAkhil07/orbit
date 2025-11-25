'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp } from 'lucide-react';

export default function AdminAnalyticsPage() {
  // Placeholder analytics page
  // In a real app, you'd fetch and visualize actual data

  const metrics = [
    {
      title: 'Daily Active Users',
      value: '0',
      description: 'Coming soon - Real-time tracking',
      icon: '👥',
    },
    {
      title: 'Weekly Bookings',
      value: '0',
      description: 'Coming soon - Booking trends',
      icon: '📊',
    },
    {
      title: 'Revenue This Month',
      value: '₹0',
      description: 'Coming soon - Revenue analytics',
      icon: '💰',
    },
    {
      title: 'Conversion Rate',
      value: '0%',
      description: 'Coming soon - Visitor to booking ratio',
      icon: '📈',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
        <p className="text-slate-400">Track platform metrics and insights</p>
      </div>

      {/* Info Banner */}
      <Card className="bg-blue-900/30 border-blue-600">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="text-3xl">📊</div>
            <div>
              <h3 className="text-white font-semibold mb-1">Analytics Coming Soon</h3>
              <p className="text-slate-300">
                Advanced analytics with charts, trends, and detailed insights will be available in the next phase.
                This includes DAU, revenue trends, conversion rates, and more.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, i) => (
          <Card key={i} className="bg-slate-900 border-slate-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-slate-300">{metric.title}</CardTitle>
                <span className="text-2xl">{metric.icon}</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-white mb-1">{metric.value}</p>
              <p className="text-xs text-slate-400">{metric.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Placeholder for Chart */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Booking Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-slate-800/50 rounded-lg border border-slate-700/50">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">Chart visualization coming soon</p>
              <p className="text-slate-500 text-sm mt-2">Charts will display booking trends over time</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Placeholder for Revenue Chart */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Revenue Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-slate-800/50 rounded-lg border border-slate-700/50">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">Revenue analytics coming soon</p>
              <p className="text-slate-500 text-sm mt-2">See revenue breakdown by property and time period</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
