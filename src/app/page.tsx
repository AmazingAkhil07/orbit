import HeroSection from '@/components/landing/HeroSection';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Shield, Zap, ArrowRight, Star, Users, Check, ArrowUpRight } from 'lucide-react';
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
		<div className='min-h-screen bg-black text-zinc-100 selection:bg-white selection:text-black'>
			<HeroSection />

			{/* Value Proposition Section - Bento Grid */}
			<section className='py-32 px-4 border-t border-zinc-900'>
				<div className='container mx-auto'>
					<ScrollReveal>
						<h2 className='text-4xl md:text-6xl font-bold tracking-tighter text-white mb-16'>
							WHY <span className='text-zinc-600'>ORBIT?</span>
						</h2>
					</ScrollReveal>

					<div className='grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 h-auto md:h-[600px]'>
						{/* Large Card - Verified */}
						<ScrollReveal className='md:col-span-2 md:row-span-2 h-full' width='100%'>
							<div className='group relative h-full w-full bg-zinc-900 rounded-3xl p-8 overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-all'>
								{/* Background Image */}
								<div className='absolute inset-0 bg-[url("https://images.unsplash.com/photo-1522771753035-4a50356c6518?q=80&w=2670&auto=format&fit=crop")] bg-cover bg-center opacity-30 group-hover:scale-105 transition-transform duration-700' />
								<div className='absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent' />

								{/* Floating Badge */}
								<div className='absolute top-8 right-8 bg-green-500/20 backdrop-blur-md border border-green-500/30 text-green-400 px-4 py-2 rounded-full flex items-center gap-2'>
									<Shield className='w-4 h-4 fill-current' />
									<span className='text-sm font-bold uppercase tracking-wider'>Verified</span>
								</div>

								{/* Checklist Visual */}
								<div className='absolute top-1/2 left-8 -translate-y-1/2 space-y-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-x-[-20px] group-hover:translate-x-0 hidden md:block'>
									{['Physically Visited', 'Owner Verified', 'Amenities Checked'].map((item, i) => (
										<div
											key={i}
											className='flex items-center gap-3 bg-black/50 backdrop-blur-sm p-3 rounded-xl border border-white/10 w-fit'
										>
											<div className='bg-green-500 rounded-full p-1'>
												<Check className='w-3 h-3 text-black' />
											</div>
											<span className='text-white font-medium'>{item}</span>
										</div>
									))}
								</div>

								<div className='relative z-10 h-full flex flex-col justify-end'>
									<h3 className='text-3xl md:text-5xl font-bold text-white mb-4'>
										100% Verified Listings
									</h3>
									<p className='text-zinc-300 text-lg max-w-md'>
										Every property is physically visited and verified by our expert team. No fake
										listings, no surprises.
									</p>
								</div>
							</div>
						</ScrollReveal>

						{/* Small Card 1 - Instant Booking */}
						<ScrollReveal className='h-full' width='100%' delay={0.3}>
							<div className='group relative h-full min-h-[250px] bg-zinc-900 rounded-3xl p-8 border border-zinc-800 hover:bg-zinc-800/50 transition-all overflow-hidden'>
								{/* Decorative Gradient */}
								<div className='absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-[50px] rounded-full group-hover:bg-blue-500/30 transition-colors' />

								{/* Mock UI Element */}
								<div className='absolute top-8 right-8 bg-zinc-800/80 backdrop-blur border border-white/10 p-4 rounded-2xl shadow-xl transform rotate-6 group-hover:rotate-0 transition-transform duration-500'>
									<div className='flex items-center gap-3 mb-2'>
										<div className='w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center'>
											<Check className='w-4 h-4 text-green-500' />
										</div>
										<div>
											<div className='h-2 w-16 bg-zinc-600 rounded mb-1' />
											<div className='h-2 w-10 bg-zinc-700 rounded' />
										</div>
									</div>
									<div className='h-8 w-full bg-blue-600 rounded-lg flex items-center justify-center text-[10px] font-bold text-white'>
										BOOKED
									</div>
								</div>

								<div className='relative z-10 h-full flex flex-col justify-end'>
									<div className='w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform'>
										<Zap className='w-6 h-6 text-white' />
									</div>
									<h3 className='text-2xl font-bold text-white mb-2'>Instant Booking</h3>
									<p className='text-zinc-400 text-sm'>
										Skip the wait. Secure your room in under 5 minutes.
									</p>
								</div>
							</div>
						</ScrollReveal>

						{/* Small Card 2 - Hyper Local */}
						<ScrollReveal className='h-full' width='100%' delay={0.4}>
							<div className='group relative h-full min-h-[250px] bg-zinc-900 rounded-3xl p-8 border border-zinc-800 hover:bg-zinc-800/50 transition-all overflow-hidden'>
								{/* Map Pattern */}
								<div
									className='absolute inset-0 opacity-20'
									style={{
										backgroundImage: 'radial-gradient(#4f4f4f 1px, transparent 1px)',
										backgroundSize: '20px 20px',
									}}
								/>

								{/* Floating Pins */}
								<div className='absolute top-10 right-10'>
									<div className='relative'>
										<div className='absolute -top-8 -right-4 bg-white text-black text-[10px] font-bold px-2 py-1 rounded shadow-lg transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all'>
											DSU Campus
										</div>
										<MapPin className='w-6 h-6 text-red-500 animate-bounce' />
										<div className='w-6 h-1 bg-red-500/50 blur-sm rounded-full mt-1' />
									</div>
								</div>

								<div className='relative z-10 h-full flex flex-col justify-end'>
									<div className='w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-white group-hover:text-black transition-colors'>
										<MapPin className='w-6 h-6' />
									</div>
									<h3 className='text-2xl font-bold text-white mb-2'>Hyper Local</h3>
									<p className='text-zinc-400 text-sm'>
										Curated specifically for your campus and surrounding areas.
									</p>
								</div>
							</div>
						</ScrollReveal>
					</div>
				</div>
			</section>

			{/* Featured Properties - Immersive Cards */}
			<section className='py-32 px-4 border-t border-zinc-900 bg-zinc-950'>
				<div className='container mx-auto'>
					<div className='flex flex-col md:flex-row justify-between items-end mb-16 gap-8'>
						<ScrollReveal>
							<h2 className='text-4xl md:text-6xl font-bold tracking-tighter text-white'>
								FEATURED
								<span className='text-zinc-600 ml-4'>SPACES</span>
							</h2>
						</ScrollReveal>

						<ScrollReveal delay={0.2}>
							<Link href='/search'>
								<Button
									variant='outline'
									className='rounded-full border-zinc-700 text-white hover:bg-white hover:text-black transition-all h-12 px-8 text-base'
								>
									View All Properties
								</Button>
							</Link>
						</ScrollReveal>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
						{FEATURED_PROPERTIES.map((prop, i) => (
							<ScrollReveal key={prop.id} delay={0.3 + i * 0.15}>
								<Link href={`/pg/${prop.slug}`} className='group block relative'>
									<div className='relative aspect-[3/4] overflow-hidden rounded-2xl bg-zinc-900'>
										<img
											src={prop.image}
											alt={prop.title}
											className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
										/>
										{/* Gradient Overlay - Subtle */}
										<div className='absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity' />

										{/* Content Overlay */}
										<div className='absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300'>
											<div className='flex justify-between items-end mb-2'>
												<h3 className='text-2xl font-bold text-white leading-tight'>
													{prop.title}
												</h3>
												<div className='bg-white text-black rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0'>
													<ArrowUpRight className='w-5 h-5' />
												</div>
											</div>

											<p className='text-zinc-300 text-sm flex items-center gap-1 mb-4'>
												<MapPin className='w-3 h-3' /> {prop.location}
											</p>

											<div className='flex items-center justify-between border-t border-white/20 pt-4'>
												<div className='flex gap-2'>
													{prop.tags.map((tag) => (
														<span
															key={tag}
															className='text-[10px] uppercase tracking-wider font-bold bg-white/20 backdrop-blur-md px-2 py-1 rounded text-white'
														>
															{tag}
														</span>
													))}
												</div>
												<p className='text-lg font-bold text-white'>
													₹{prop.price.toLocaleString()}
													<span className='text-xs font-normal text-zinc-400'>
														/mo
													</span>
												</p>
											</div>
										</div>
									</div>
								</Link>
							</ScrollReveal>
						))}
					</div>
				</div>
			</section>

			{/* CTA Section - Bold Typography */}
			<section className='py-40 px-4 border-t border-zinc-900 relative overflow-hidden'>
				<div className='container mx-auto text-center relative z-10'>
					<ScrollReveal>
						<h2 className='text-[15vw] leading-[0.8] font-bold tracking-tighter text-zinc-900 select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full pointer-events-none'>
							ORBIT
						</h2>

						<div className='relative z-10'>
							<h3 className='text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight'>
								READY TO MOVE IN?
							</h3>
							<p className='text-xl text-zinc-400 mb-12 max-w-2xl mx-auto'>
								Join thousands of students who found their dream home with Orbit. Verified
								properties, instant booking, zero hassle.
							</p>
							<Button
								size='lg'
								className='bg-white text-black hover:bg-zinc-200 rounded-full px-12 h-16 text-xl font-bold transition-all hover:scale-105'
							>
								Get Started Now
							</Button>
						</div>
					</ScrollReveal>
				</div>
			</section>
		</div>
	);
}
