'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import { adminService } from '@/services/admin';
import { drawService } from '@/services/draws';
import { User, Charity } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Users, Play, Heart, ShieldAlert, Loader2, Search, CheckCircle2, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import AddCharityModal from '@/components/admin/AddCharityModal';

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRunningDraw, setIsRunningDraw] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCharityModalOpen, setIsCharityModalOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !user.is_superuser)) {
      router.push('/dashboard');
    }
    if (user?.is_superuser) {
      adminService.getUsers()
        .then(setUsers)
        .finally(() => setIsLoading(false));
    }
  }, [user, loading, router]);

  const handleRunDraw = async () => {
    if (!confirm('Are you sure you want to run the monthly draw? This will generate winning numbers and notify winners.')) return;
    
    setIsRunningDraw(true);
    try {
      const result = await drawService.runDraw();
      toast.success(`Draw completed! Total Prize: $${result.prize_pool}`);
    } catch (error) {
      toast.error('Failed to run draw');
    } finally {
      setIsRunningDraw(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading || !user?.is_superuser) return <div className="min-h-screen bg-background flex items-center justify-center">Authenticating Admin...</div>;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold font-outfit flex items-center gap-3">
              <ShieldAlert className="w-8 h-8 text-primary" />
              Admin Control Center
            </h1>
            <p className="text-muted-foreground mt-2">Manage users, charities, and platform draws.</p>
          </div>
          
          <button 
            onClick={handleRunDraw}
            disabled={isRunningDraw}
            className="bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
          >
            {isRunningDraw ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
            Run Monthly Draw
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Quick Actions Sidebar */}
          <div className="space-y-6">
            <div className="premium-card">
              <h3 className="font-bold mb-4 uppercase tracking-wider text-xs text-muted-foreground">Statistics</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground">Total Users</div>
                  <div className="text-2xl font-bold">{users.length}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Active Subscriptions</div>
                  <div className="text-2xl font-bold text-emerald-400">{users.filter(u => u.subscription_status === 'active').length}</div>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setIsCharityModalOpen(true)}
              className="w-full glass p-4 rounded-2xl flex items-center gap-3 font-bold hover:bg-white/10 transition-all text-sm text-left"
            >
              <Heart className="w-5 h-5 text-rose-500" />
              Manage Charities
            </button>
          </div>

          {/* User Management Table */}
          <div className="lg:col-span-3">
            <section className="premium-card">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <h2 className="text-xl font-bold font-outfit flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  User Directory
                </h2>
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="pb-4 font-bold text-muted-foreground text-xs uppercase tracking-wider">User</th>
                      <th className="pb-4 font-bold text-muted-foreground text-xs uppercase tracking-wider">Status</th>
                      <th className="pb-4 font-bold text-muted-foreground text-xs uppercase tracking-wider">Plan</th>
                      <th className="pb-4 font-bold text-muted-foreground text-xs uppercase tracking-wider">Charity ID</th>
                      <th className="pb-4 font-bold text-muted-foreground text-xs uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {isLoading ? (
                      <tr><td colSpan={5} className="py-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></td></tr>
                    ) : filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-4">
                          <div className="font-bold">{u.full_name || 'No Name'}</div>
                          <div className="text-xs text-muted-foreground">{u.email}</div>
                        </td>
                        <td className="py-4">
                          {u.is_active ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3 h-3" /> Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-rose-400 bg-rose-400/10 px-2 py-0.5 rounded-full">
                              <XCircle className="w-3 h-3" /> Inactive
                            </span>
                          )}
                        </td>
                        <td className="py-4">
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${u.subscription_status === 'active' ? 'bg-blue-500/10 text-blue-400' : 'bg-white/5 text-muted-foreground'}`}>
                            {u.subscription_status}
                          </span>
                        </td>
                        <td className="py-4 font-mono text-xs">{u.charity_id || 'N/A'}</td>
                        <td className="py-4">
                          <button className="text-xs font-bold text-primary hover:underline">Edit</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      </main>

      <AddCharityModal 
        isOpen={isCharityModalOpen}
        onClose={() => setIsCharityModalOpen(false)}
        onSuccess={() => {
          // Could refresh charities list if we had one here
        }}
      />
    </div>
  );
}
