'use client';

import Navbar from '@/components/layout/Navbar';
import { motion } from 'framer-motion';
import { Heart, Trophy, Users, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-primary mb-6">
                <Star className="w-3 h-3 fill-primary" />
                Empowering Communities Through Sport
              </span>
              <h1 className="text-5xl md:text-7xl font-bold font-outfit tracking-tight mb-6 leading-tight">
                Play Golf. <span className="gradient-text">Make an Impact.</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                The ultimate platform where your golf performance translates directly into charitable contributions. Compete, win, and help heroes every day.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link 
                  href="/signup" 
                  className="w-full sm:w-auto bg-primary text-primary-foreground px-8 py-4 rounded-full text-lg font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
                >
                  Join the Movement
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                  href="/charities" 
                  className="w-full sm:w-auto glass px-8 py-4 rounded-full text-lg font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                >
                  View Charities
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white/[0.02]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Heart className="w-8 h-8 text-rose-500" />,
                  title: "Charity-First Approach",
                  description: "Every score you post contributes to a charity of your choice. We believe in giving back while playing the game you love."
                },
                {
                  icon: <Trophy className="w-8 h-8 text-amber-500" />,
                  title: "Monthly Prize Draws",
                  description: "Your participation enters you into our monthly draws. Win premium rewards while supporting great causes."
                },
                {
                  icon: <Users className="w-8 h-8 text-blue-500" />,
                  title: "Vibrant Community",
                  description: "Join thousands of golfers who are making a real-world difference. Track rankings and impact together."
                }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="premium-card"
                >
                  <div className="bg-white/5 w-14 h-14 rounded-xl flex items-center justify-center mb-6 border border-white/10">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 font-outfit">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats / Impact Section */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="glass rounded-[32px] p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 translate-x-1/4" />
              <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold font-outfit mb-6">Real impact, measured in heroes.</h2>
                  <p className="text-lg text-muted-foreground mb-8">
                    Since our launch, our community has raised significant funds for over 50 local charities, helping those who need it most.
                  </p>
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <div className="text-4xl font-bold text-primary mb-1">$250k+</div>
                      <div className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Raised for Charity</div>
                    </div>
                    <div>
                      <div className="text-4xl font-bold text-primary mb-1">12,400+</div>
                      <div className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Active Heroes</div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4 pt-8">
                    <div className="aspect-square rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-6 text-center italic text-sm">"This platform changed how I view my weekend rounds."</div>
                    <div className="aspect-square rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center p-6 text-center italic text-sm font-bold">Helping heroes, one hole at a time.</div>
                  </div>
                  <div className="space-y-4">
                    <div className="aspect-square rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center p-6 text-center italic text-sm font-bold">Premium Experience. Massive Impact.</div>
                    <div className="aspect-square rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-6 text-center italic text-sm">"The most rewarding golf app I've ever used."</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-white/5 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Trophy className="w-5 h-5 text-primary" />
            <span className="text-lg font-bold font-outfit">DigitalHeroes</span>
          </div>
          <p className="text-muted-foreground text-sm">
            © 2026 Digital Heroes. Playing for a better tomorrow.
          </p>
        </div>
      </footer>
    </div>
  );
}
