import HeroSection from '@/components/landing/HeroSection';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Shield, Zap, ArrowRight, Star, Users } from 'lucide-react';
import Link from 'next/link';

// Mock Data for Featured Properties
const FEATURED_PROPERTIES = [
  {
    id: '1',
    title: 'Sai Balaji PG',
    slug: 'sai-balaji-pg',
    location: 'Harohalli, Karnataka',
    price: 6500,
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80',
    rating: 4.5,
    tags: ['Premium', 'Food Included'],
  },
  {
    id: '2',
    title: 'DSU Hostels',
    slug: 'dsu-hostels',
    location: 'DSU Campus',
    price: 9000,
    image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    rating: 4.2,
    tags: ['On Campus', 'Secure'],
  },
  {
    id: '3',
    title: 'Green View Residency',
    slug: 'green-view',
    location: 'Near Bus Stand',
    price: 4500,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    rating: 3.8,
    tags: ['Budget', 'Freedom'],
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <HeroSection />

      {/* Value Proposition Section - Enhanced */}
      <section className="py-32 px-4 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59,130,246,0.3) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(147,51,234,0.3) 0%, transparent 50%)`
          }} />
        </div>
        
        <div className="container mx-auto relative z-10">
          <ScrollReveal className="text-center mb-20">
            <span className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold mb-6">
              🚀 Why Choose Us
            </span>
            <h2 className="text-4xl md:text-6xl font-black mb-8 bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
              Why Orbit?
            </h2>
            <p className="text-xl md:text-2xl text-zinc-300 max-w-4xl mx-auto leading-relaxed">
              We don&apos;t just list rooms. We <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 font-semibold">curate experiences</span>. 
              <br className="hidden md:block" />Every property is verified, every review is real, every student is satisfied.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                icon: Shield,
                title: '100% Verified',
                desc: 'Every property is physically visited and verified by our expert team. No fake listings, no surprises.',
                color: 'from-green-500 to-emerald-500',
                bgColor: 'bg-green-500/10',
                borderColor: 'border-green-500/20'
              },
              {
                icon: Zap,
                title: 'Live Availability',
                desc: 'See real-time room availability with instant booking. No more endless calling and waiting.',
                color: 'from-blue-500 to-cyan-500',
                bgColor: 'bg-blue-500/10',
                borderColor: 'border-blue-500/20'
              },
              {
                icon: MapPin,
                title: 'Hyper Local',
                desc: 'Built specifically for your campus and city. We know every street, every convenience store.',
                color: 'from-purple-500 to-pink-500',
                bgColor: 'bg-purple-500/10',
                borderColor: 'border-purple-500/20'
              },
            ].map((feature, i) => (
              <ScrollReveal key={i} delay={0.3 + i * 0.15}>
                <Card className={`group relative bg-white/5 backdrop-blur-xl border ${feature.borderColor} hover:bg-white/10 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl`}>
                  {/* Hover Glow Effect */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${feature.bgColor} rounded-lg blur-xl`} />
                  
                  <CardContent className="p-8 text-center relative">
                    {/* Icon with Gradient Background */}
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-10 h-10 text-white" />
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-300 group-hover:to-purple-300 transition-all duration-300">
                      {feature.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-zinc-300 leading-relaxed text-lg">
                      {feature.desc}
                    </p>
                    
                    {/* Decorative Element */}
                    <div className={`w-full h-1 bg-gradient-to-r ${feature.color} mt-6 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties - Enhanced */}
      <section className="py-32 px-4 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-purple-950/10 to-black/50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)] animate-pulse" />
        
        <div className="container mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16">
            <ScrollReveal>
              <div className="mb-6 lg:mb-0">
                <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold mb-4">
                  🏆 Premium Collection
                </span>
                <h2 className="text-4xl md:text-6xl font-black mb-4 bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                  Featured Spaces
                </h2>
                <p className="text-xl text-zinc-300 max-w-lg">
                  Handpicked premium accommodations with the highest ratings and best amenities
                </p>
              </div>
            </ScrollReveal>
            
            <ScrollReveal delay={0.2}>
              <Link href="/search">
                <Button 
                  variant="outline" 
                  className="bg-white/5 backdrop-blur-xl border-white/20 text-white hover:bg-white/10 hover:border-white/30 rounded-full px-8 py-3 text-lg font-semibold transition-all duration-300 group"
                >
                  View All Properties
                  <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURED_PROPERTIES.map((prop, i) => (
              <ScrollReveal key={prop.id} delay={0.3 + i * 0.15}>
                <Link href={`/pg/${prop.slug}`}>
                  <Card className="group relative bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden transition-all duration-500 hover:bg-white/10 hover:border-white/20 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20">
                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10" />
                    </div>
                    
                    <div className="aspect-[4/3] relative overflow-hidden">
                      <img
                        src={prop.image}
                        alt={prop.title}
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                      />
                      
                      {/* Image Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      
                      {/* Tags */}
                      <div className="absolute top-4 left-4 flex gap-2">
                        {prop.tags.map((tag) => (
                          <Badge 
                            key={tag} 
                            className="bg-black/70 backdrop-blur-md border-white/20 text-white hover:bg-black/80 font-semibold px-3 py-1 text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      {/* Rating Badge */}
                      <div className="absolute top-4 right-4 flex items-center bg-yellow-500/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-white text-sm font-bold shadow-lg">
                        <Star className="w-4 h-4 mr-1 fill-current" />
                        {prop.rating}
                      </div>
                      
                      {/* Quick Action Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/20">
                        <Button className="bg-white text-black hover:bg-zinc-200 rounded-full px-6 py-2 font-semibold shadow-xl transform scale-95 group-hover:scale-100 transition-all duration-300">
                          View Details
                        </Button>
                      </div>
                    </div>
                    
                    <CardContent className="p-6 relative">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors duration-300 mb-1">
                            {prop.title}
                          </h3>
                          <div className="flex items-center text-zinc-400 text-sm">
                            <MapPin className="w-4 h-4 mr-1 text-blue-400" />
                            {prop.location}
                          </div>
                        </div>
                      </div>
                      
                      {/* Price Section */}
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex flex-col">
                          <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-black text-white">₹{prop.price.toLocaleString()}</span>
                            <span className="text-zinc-400 text-sm font-medium">/month</span>
                          </div>
                          <span className="text-xs text-green-400 font-medium">✓ All inclusive</span>
                        </div>
                        
                        {/* Availability Indicator */}
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                          <span className="text-xs text-green-400 font-medium">Available</span>
                        </div>
                      </div>
                      
                      {/* Features Preview */}
                      <div className="mt-4 flex items-center gap-4 text-xs text-zinc-400">
                        <span className="flex items-center gap-1">
                          <div className="w-1 h-1 bg-blue-400 rounded-full" />
                          WiFi
                        </span>
                        <span className="flex items-center gap-1">
                          <div className="w-1 h-1 bg-blue-400 rounded-full" />
                          Food
                        </span>
                        <span className="flex items-center gap-1">
                          <div className="w-1 h-1 bg-blue-400 rounded-full" />
                          Security
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Search Section */}
      <section className="py-32 px-4 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/30 via-purple-950/20 to-black/60" />
        <div className="absolute inset-0 particles" />
        
        <div className="container mx-auto relative z-10">
          <ScrollReveal className="text-center mb-16">
            <span className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold mb-6">
              🔍 Quick Search
            </span>
            <h2 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
              Find Your Perfect Space
            </h2>
            <p className="text-xl text-zinc-300 max-w-3xl mx-auto mb-12">
              Search from 500+ verified PGs and hostels. Filter by budget, location, amenities and more.
            </p>
          </ScrollReveal>

          {/* Interactive Search Bar */}
          <ScrollReveal delay={0.2}>
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-500 group">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Location */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-zinc-300">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-5 h-5 text-blue-400" />
                      <input 
                        type="text" 
                        placeholder="Near DSU, Harohalli..." 
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                      />
                    </div>
                  </div>
                  
                  {/* Budget */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-zinc-300">Budget</label>
                    <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300">
                      <option value="">Any Budget</option>
                      <option value="0-5000">₹0-5,000</option>
                      <option value="5000-8000">₹5,000-8,000</option>
                      <option value="8000-12000">₹8,000-12,000</option>
                      <option value="12000+">₹12,000+</option>
                    </select>
                  </div>
                  
                  {/* Type */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-zinc-300">Type</label>
                    <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300">
                      <option value="">All Types</option>
                      <option value="pg">PG</option>
                      <option value="hostel">Hostel</option>
                      <option value="shared">Shared Room</option>
                      <option value="single">Single Room</option>
                    </select>
                  </div>
                  
                  {/* Search Button */}
                  <div className="flex items-end">
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl h-12 font-semibold shadow-2xl shadow-blue-500/25 border-0 transition-all duration-300 group-hover:scale-105">
                      <span className="flex items-center justify-center gap-2">
                        Search Now
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Button>
                  </div>
                </div>
                
                {/* Quick Filters */}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex flex-wrap gap-3">
                    <span className="text-sm text-zinc-400">Quick filters:</span>
                    {['Food Included', 'WiFi', 'AC Rooms', 'Near College', 'Parking'].map((filter, index) => (
                      <button 
                        key={index}
                        className="px-4 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/30 rounded-full text-sm text-zinc-300 hover:text-white transition-all duration-300"
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-32 px-4 relative overflow-hidden">
        {/* Stunning Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-purple-950 to-black" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/15 to-pink-500/15 rounded-full blur-3xl animate-pulse-slow" />
        </div>
        
        <div className="container mx-auto text-center relative z-10">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto">
              <span className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 text-green-400 text-sm font-bold mb-8">
                ✨ Join 10,000+ Happy Students
              </span>
              
              <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-purple-300">
                  Ready to find your
                </span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-gradient-x">
                  perfect space?
                </span>
              </h2>
              
              <p className="text-2xl text-zinc-200 mb-12 max-w-3xl mx-auto leading-relaxed">
                Join thousands of students who found their <span className="text-blue-400 font-semibold">dream home</span> with Orbit.
                <br className="hidden md:block" />
                Verified properties, instant booking, zero hassle.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full px-12 h-16 text-xl font-bold shadow-2xl shadow-blue-500/25 border-0 transition-all duration-300 hover:scale-105 animate-pulse-glow">
                  <span className="flex items-center gap-3">
                    Get Started Now
                    <ArrowRight className="w-6 h-6" />
                  </span>
                </Button>
                
                <Button size="lg" variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 rounded-full px-12 h-16 text-xl font-semibold backdrop-blur-xl transition-all duration-300 hover:scale-105">
                  Watch Demo
                </Button>
              </div>
              
              {/* Trust Indicators */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
                {[
                  { value: '500+', label: 'Verified PGs', icon: Shield },
                  { value: '10K+', label: 'Happy Students', icon: Users },
                  { value: '15+', label: 'Cities', icon: MapPin },
                  { value: '4.8', label: 'Avg Rating', icon: Star }
                ].map((stat, index) => (
                  <div key={index} className="text-center group">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-zinc-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
