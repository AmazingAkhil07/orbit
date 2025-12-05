'use client';

import { Building2, MapPin, Users, DollarSign, Star, MoreVertical, Edit2, Trash2, Eye, BarChart3, Plus } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function OwnerPropertiesPage() {
  // Mock Data
  const properties = [
    {
      id: '1',
      title: 'Sunny Villa PG',
      address: '123, 4th Cross, Koramangala, Bangalore',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80',
      status: 'active',
      occupancy: { occupied: 8, total: 10 },
      revenue: 120000,
      rating: 4.5,
      reviews: 12,
      lastUpdated: '2 days ago',
    },
    {
      id: '2',
      title: 'Green Heights Luxury Stay',
      address: '45, Indiranagar Double Road, Bangalore',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80',
      status: 'active',
      occupancy: { occupied: 15, total: 20 },
      revenue: 250000,
      rating: 4.8,
      reviews: 28,
      lastUpdated: '5 hours ago',
    },
    {
      id: '3',
      title: 'Urban Nest Student Housing',
      address: '88, HSR Layout Sector 1, Bangalore',
      image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80',
      status: 'draft',
      occupancy: { occupied: 0, total: 12 },
      revenue: 0,
      rating: 0,
      reviews: 0,
      lastUpdated: '1 week ago',
    },
  ];

  const [filter, setFilter] = useState('all');

  const filteredProperties = filter === 'all' 
    ? properties 
    : properties.filter(p => p.status === filter);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">My Properties</h1>
          <p className="text-zinc-400 mt-1">Manage your listings, availability, and pricing.</p>
        </div>
        <Link
          href="/owner/properties/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded-xl transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add New Property
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {['all', 'active', 'draft', 'inactive'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all ${
              filter === status
                ? 'bg-white text-black'
                : 'bg-zinc-900/50 text-zinc-400 hover:text-white hover:bg-white/10 border border-white/5'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <div
            key={property.id}
            className="group bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all duration-300"
          >
            {/* Image Section */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={property.image}
                alt={property.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  property.status === 'active' 
                    ? 'bg-emerald-500 text-black' 
                    : 'bg-zinc-500 text-white'
                }`}>
                  {property.status}
                </span>
              </div>

              {/* Quick Stats Overlay */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <div>
                  <h3 className="text-white font-bold text-lg truncate">{property.title}</h3>
                  <div className="flex items-center gap-1 text-zinc-300 text-xs">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate max-w-[200px]">{property.address}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-5 space-y-4">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-zinc-500">Occupancy</p>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-400" />
                    <span className="text-white font-medium">
                      {property.occupancy.occupied}/{property.occupancy.total}
                    </span>
                  </div>
                  {/* Progress Bar */}
                  <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${(property.occupancy.occupied / property.occupancy.total) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-zinc-500">Revenue (Mo)</p>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    <span className="text-white font-medium">
                      ₹{(property.revenue / 1000).toFixed(1)}k
                    </span>
                  </div>
                </div>
              </div>

              <div className="h-px bg-white/5" />

              {/* Actions */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 text-amber-400 text-sm font-medium">
                  <Star className="w-4 h-4 fill-amber-400" />
                  {property.rating > 0 ? property.rating : 'New'}
                  <span className="text-zinc-500 font-normal">({property.reviews})</span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/owner/properties/${property.id}/analytics`}
                    className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    title="Analytics"
                  >
                    <BarChart3 className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/owner/properties/${property.id}/edit`}
                    className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/pg/${property.id}`} // Assuming public route
                    target="_blank"
                    className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    title="View Public Page"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Add New Card (Empty State) */}
        <Link
          href="/owner/properties/new"
          className="group flex flex-col items-center justify-center gap-4 bg-zinc-900/20 border border-dashed border-white/10 rounded-2xl p-6 hover:bg-white/5 hover:border-emerald-500/50 transition-all duration-300 min-h-[380px]"
        >
          <div className="p-4 rounded-full bg-zinc-800 group-hover:bg-emerald-500/20 text-zinc-400 group-hover:text-emerald-400 transition-colors">
            <Plus className="w-8 h-8" />
          </div>
          <div className="text-center">
            <h3 className="text-white font-medium mb-1">Add New Property</h3>
            <p className="text-sm text-zinc-500">List a new PG or Hostel</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
