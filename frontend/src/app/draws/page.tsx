'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import { drawService } from '@/services/draws';
import { Draw } from '@/types';
import { motion } from 'framer-motion';
import { Trophy, Calendar, Users, DollarSign, Loader2, Sparkles } from 'lucide-react';
import { format } from 'date-fns';

export default function DrawsPage() {
  const [draws, setDraws] = useState<Draw[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    drawService.getLatest()
      .then(setDraws)
      .finally(() => setIsLoading(false));
  }, []);

  const latestDraw = draws[0];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <header className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              Monthly Rewards Results
            </div>
            <h1 className="text-5xl md:text-6xl font-bold font-outfit mb-6">Winners & <span className="gradient-text">Impact</span></h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Every month we reward our heroes. See the results of our latest draw and the impact made across our communities.
            </p>
          </motion.div>
        </header>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>
        ) : (
          <div className="space-y-12">
            {/* Featured Latest Draw */}
            {latestDraw && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative glass rounded-[40px] p-8 md:p-12 overflow-hidden border-primary/20"
              >
                <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 blur-[100px] -z-10" />
                
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <div className="flex items-center gap-3 text-primary font-bold mb-4 uppercase tracking-widest text-sm">
                      <Calendar className="w-4 h-4" />
                      Latest Draw: {format(new Date(latestDraw.draw_date), 'MMMM yyyy')}
                    </div>
                    <h2 className="text-4xl font-bold font-outfit mb-8">Winning Numbers</h2>
                    
                    <div className="flex flex-wrap gap-4 mb-10">
                      {latestDraw.winning_numbers.map((num, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: i * 0.1, type: 'spring' }}
                          className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white text-2xl md:text-3xl font-bold shadow-xl shadow-primary/30"
                        >
                          {num}
                        </motion.div>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="premium-card bg-white/5 p-4 rounded-2xl">
                        <div className="text-muted-foreground text-xs font-bold uppercase mb-1">Total Prize</div>
                        <div className="text-2xl font-bold text-white flex items-center gap-1">
                          <DollarSign className="w-5 h-5 text-emerald-400" />
                          {latestDraw.prize_pool.toLocaleString()}
                        </div>
                      </div>
                      <div className="premium-card bg-white/5 p-4 rounded-2xl">
                        <div className="text-muted-foreground text-xs font-bold uppercase mb-1">Winners</div>
                        <div className="text-2xl font-bold text-white flex items-center gap-1">
                          <Users className="w-5 h-5 text-blue-400" />
                          {latestDraw.winners_count || 0}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="hidden lg:block relative">
                    <div className="aspect-square bg-primary/20 rounded-full blur-[80px] absolute inset-0 -z-10" />
                    <Trophy className="w-full h-full text-primary/20 p-12" />
                  </div>
                </div>
              </motion.section>
            )}

            {/* Previous Draws Table */}
            <section className="premium-card">
              <h3 className="text-2xl font-bold font-outfit mb-8">Previous Draws</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="pb-4 font-bold text-muted-foreground text-sm uppercase tracking-wider">Date</th>
                      <th className="pb-4 font-bold text-muted-foreground text-sm uppercase tracking-wider">Winning Numbers</th>
                      <th className="pb-4 font-bold text-muted-foreground text-sm uppercase tracking-wider">Total Prize</th>
                      <th className="pb-4 font-bold text-muted-foreground text-sm uppercase tracking-wider">Winners</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {draws.slice(1).map((draw) => (
                      <tr key={draw.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-6 font-medium">{format(new Date(draw.draw_date), 'MMMM d, yyyy')}</td>
                        <td className="py-6">
                          <div className="flex gap-2">
                            {draw.winning_numbers.map((n, i) => (
                              <span key={i} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold">{n}</span>
                            ))}
                          </div>
                        </td>
                        <td className="py-6 font-bold text-emerald-400">${draw.prize_pool.toLocaleString()}</td>
                        <td className="py-6">{draw.winners_count || 0}</td>
                      </tr>
                    ))}
                    {draws.length <= 1 && (
                      <tr>
                        <td colSpan={4} className="py-12 text-center text-muted-foreground italic">No previous draws found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
