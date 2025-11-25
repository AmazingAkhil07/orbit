'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { Shield, Zap, Users, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CARDS = [
  {
    id: 1,
    title: "WE DON'T TRUST.",
    subtitle: "WE VERIFY.",
    description: "Every single property on Orbit is physically visited, inspected, and verified by our team. No catfishing. No surprises.",
    image: "https://images.unsplash.com/photo-1522771753035-4a50356c6518?q=80&w=2670&auto=format&fit=crop",
    color: "bg-zinc-900",
    textColor: "text-white",
    icon: <Shield className="w-8 h-8" />,
    stats: ["150+ Checks", "Owner Verified", "Speed Test"]
  },
  {
    id: 2,
    title: "KEEP YOUR",
    subtitle: "MONEY.",
    description: "Why pay a month's rent as brokerage? Connect directly with property owners and save up to ₹15,000 on every booking.",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2670&auto=format&fit=crop",
    color: "bg-white",
    textColor: "text-black",
    icon: <Zap className="w-8 h-8" />,
    stats: ["0% Brokerage", "No Hidden Fees", "Direct Chat"]
  },
  {
    id: 3,
    title: "INSTANT",
    subtitle: "COMMUNITY.",
    description: "Don't just rent a room. Join a tribe. Exclusive events, gaming nights, and a network of students from your campus.",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2670&auto=format&fit=crop",
    color: "bg-blue-600",
    textColor: "text-white",
    icon: <Users className="w-8 h-8" />,
    stats: ["Weekly Events", "Study Groups", "Gaming Nights"]
  }
];

const Card = ({ card, index, progress, range, targetScale }: { 
  card: typeof CARDS[0], 
  index: number, 
  progress: MotionValue<number>, 
  range: number[], 
  targetScale: number 
}) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'start start']
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1]);
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div ref={container} className="h-screen flex items-center justify-center sticky top-0">
      <motion.div 
        style={{ scale, top: `calc(-5vh + ${index * 25}px)` }} 
        className={`relative flex flex-col md:flex-row w-full max-w-6xl h-[60vh] md:h-[70vh] rounded-[2rem] overflow-hidden shadow-2xl origin-top ${card.color}`}
      >
        {/* Content Side */}
        <div className={`flex-1 p-8 md:p-16 flex flex-col justify-between relative z-20 ${card.textColor}`}>
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className={`p-3 rounded-full ${card.textColor === 'text-white' ? 'bg-white/10' : 'bg-black/10'}`}>
                {card.icon}
              </div>
              <span className="text-sm font-bold tracking-widest uppercase opacity-70">Orbit Standard</span>
            </div>
            
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[0.9] mb-6">
              {card.title}
              <br />
              <span className="opacity-50">{card.subtitle}</span>
            </h2>
            
            <p className="text-lg md:text-xl opacity-80 max-w-md leading-relaxed">
              {card.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 mt-8">
            {card.stats.map((stat, i) => (
              <div key={i} className={`px-4 py-2 rounded-full border text-sm font-bold flex items-center gap-2 ${card.textColor === 'text-white' ? 'border-white/20 bg-white/5' : 'border-black/20 bg-black/5'}`}>
                <CheckCircle2 className="w-4 h-4" />
                {stat}
              </div>
            ))}
          </div>
        </div>

        {/* Image Side */}
        <div className="flex-1 relative overflow-hidden h-full min-h-[300px]">
          <motion.div style={{ scale: imageScale }} className="absolute inset-0 w-full h-full">
            <img 
              src={card.image} 
              alt={card.title} 
              className="w-full h-full object-cover"
            />
            <div className={`absolute inset-0 ${card.textColor === 'text-white' ? 'bg-black/20' : 'bg-white/10'}`} />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default function WhyOrbit() {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end']
  });

  return (
    <section ref={container} className="relative bg-black">
      <div className="h-[50vh] flex items-center justify-center sticky top-0 z-0">
        <h2 className="text-[12vw] font-bold text-zinc-900 tracking-tighter leading-none text-center select-none">
          WHY ORBIT?
        </h2>
      </div>
      
      <div className="relative z-10 pb-[20vh]">
        {CARDS.map((card, i) => {
          const targetScale = 1 - ((CARDS.length - i) * 0.05);
          return (
            <Card 
              key={i} 
              card={card} 
              index={i} 
              progress={scrollYProgress}
              range={[i * 0.25, 1]}
              targetScale={targetScale}
            />
          );
        })}
      </div>
    </section>
  );
}
