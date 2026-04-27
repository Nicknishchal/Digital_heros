'use client';

import { useEffect, useState, useCallback } from 'react';
import Navbar from '@/components/layout/Navbar';
import StatCard from '@/components/dashboard/StatCard';
import ScoreForm from '@/components/dashboard/ScoreForm';
import { useAuth } from '@/context/AuthContext';
import { Score, Charity } from '@/types';
import api from '@/lib/axios';
import { motion } from 'framer-motion';
import { Trophy, Heart, Calendar, CreditCard, ChevronRight, Activity, Plus } from 'lucide-react';
import { format } from 'date-fns';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [scores, setScores] = useState<Score[]>([]);
  const [charity, setCharity] = useState<Charity | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [scoresRes, charityRes] = await Promise.all([
        api.get('/scores/me'),
        user?.charity_id ? api.get(`/charities/${user.charity_id}`) : Promise.resolve({ data: null })
      ]);
      setScores(scoresRes.data);
      setCharity(charityRes.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        fetchData();
      } else {
        setIsLoading(false);
      }
    }
  }, [user, authLoading, fetchData]);

  if (authLoading || isLoading) return <div className="min-h-screen bg-background flex items-center justify-center font-outfit text-xl animate-pulse">Loading Hero Stats...</div>;

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 text-center">
        <div className="premium-card max-w-sm">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-muted-foreground mb-6">Please sign in to view your hero dashboard.</p>
          <a href="/login" className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold inline-block">Go to Login</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <header className="mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-bold font-outfit">Welcome back, <span className="text-primary">{user?.full_name?.split(' ')[0]}</span>!</h1>
            <p className="text-muted-foreground mt-2">You've helped raise <span className="text-white font-bold">$124.50</span> for {charity?.name || 'your chosen charity'} this month.</p>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard 
            label="Avg Score" 
            value={scores.length > 0 ? (scores.reduce((a, b) => a + b.score, 0) / scores.length).toFixed(1) : '0'} 
            icon={<Trophy className="w-5 h-5" />}
            trend="+2.4"
          />
          <StatCard 
            label="Charity Impact" 
            value={`$${(scores.length * 1.5).toFixed(2)}`} 
            icon={<Heart className="w-5 h-5" />}
          />
          <StatCard 
            label="Draw Entries" 
            value={scores.length} 
            icon={<Activity className="w-5 h-5" />}
          />
          <StatCard 
            label="Plan" 
            value={user?.subscription_status || 'Free'} 
            icon={<CreditCard className="w-5 h-5" />}
            className={user?.subscription_status === 'active' ? 'border-emerald-500/20 bg-emerald-500/5' : ''}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <section className="premium-card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold font-outfit flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Recent Performance
                </h2>
                <button className="text-sm text-primary font-bold flex items-center gap-1 hover:underline">
                  View All <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-4">
                {scores.length === 0 ? (
                  <p className="text-center py-12 text-muted-foreground bg-white/5 rounded-2xl border border-dashed border-white/10">No scores recorded yet. Time to hit the course!</p>
                ) : (
                  scores.slice(0, 5).map((score) => (
                    <div key={score.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                          {score.score}
                        </div>
                        <div>
                          <p className="font-bold">Stableford Round</p>
                          <p className="text-xs text-muted-foreground">{format(new Date(score.date), 'MMMM do, yyyy')}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Impact</p>
                        <p className="text-emerald-400 font-bold">+$1.50</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <section className="premium-card bg-primary/5 border-primary/20">
              <h2 className="text-xl font-bold font-outfit mb-6 flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                Add New Score
              </h2>
              <ScoreForm onSuccess={fetchData} />
            </section>

            <section className="premium-card relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-rose-500/20 transition-all duration-500" />
              
              <h2 className="text-xl font-bold font-outfit mb-6 flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500" />
                Supporting Charity
              </h2>
              
              {charity ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 text-2xl font-bold font-outfit">
                      {charity.name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-lg">{charity.name}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">{charity.description}</p>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center">
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Your Contribution</p>
                      <p className="text-xl font-bold text-primary font-outfit">{user?.charity_percentage}% <span className="text-xs text-muted-foreground font-normal">per entry</span></p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Donated</p>
                      <p className="text-xl font-bold text-emerald-400 font-outfit">${(scores.length * 1.5).toFixed(2)}</p>
                    </div>
                  </div>

                  <a 
                    href="/charities" 
                    className="w-full py-3 text-sm font-bold text-primary bg-primary/5 hover:bg-primary/10 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    Change Charity
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-white/20">
                    <Heart className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground mb-6">Choose a charity to start contributing 💙</p>
                  <a 
                    href="/charities" 
                    className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:opacity-90 transition-all inline-block"
                  >
                    Choose Your Charity
                  </a>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
