'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import CharitySelectionModal from '@/components/charities/CharitySelectionModal';
import AddCharityModal from '@/components/admin/AddCharityModal';
import { charityService } from '@/services/charities';
import { Charity } from '@/types';
import { motion } from 'framer-motion';
import { Search, Heart, Globe, ArrowRight, Loader2, Info } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function CharitiesPage() {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { user, checkAuth } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedCharity, setSelectedCharity] = useState<Charity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchCharities = () => {
    charityService.getAll()
      .then(setCharities)
      .catch(() => toast.error('Failed to load charities'))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchCharities();
  }, []);

  const handleSelectCharity = (charity: Charity) => {
    if (!user) {
      toast.error('Please login to select a charity');
      return;
    }
    setSelectedCharity(charity);
    setIsModalOpen(true);
  };

  const handleConfirmSelection = async (charityId: string, percentage: number) => {
    setIsUpdating(true);
    try {
      await charityService.selectCharity(charityId, percentage);
      await checkAuth();
      toast.success('Charity selected successfully! 💙');
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Failed to select charity');
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredCharities = charities.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="max-w-3xl mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
              <h1 className="text-4xl md:text-5xl font-bold font-outfit">Support Our <span className="text-rose-500">Heroes</span></h1>
              {user?.is_superuser && (
                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-xl shadow-primary/20 w-fit"
                >
                  <Heart className="w-5 h-5 fill-current" />
                  Add New Charity
                </button>
              )}
            </div>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Every golf score you submit contributes to the charity you choose. Explore our vetted partners and find the cause that speaks to you.
            </p>
          </motion.div>
        </div>

        <div className="relative mb-12">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by charity name or cause..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCharities.map((charity, i) => (
                <motion.div
                  key={charity.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className={`premium-card flex flex-col group transition-all duration-300 hover:border-primary/50 ${user?.charity_id === charity.id ? 'border-primary/50 bg-primary/5 ring-1 ring-primary/20' : ''}`}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary text-3xl font-bold font-outfit">
                      {charity.name[0]}
                    </div>
                    {user?.charity_id === charity.id && (
                      <span className="bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-tighter px-3 py-1 rounded-full shadow-lg shadow-primary/20">Active Selection</span>
                    )}
                  </div>
                  
                  <h3 className="text-2xl font-bold font-outfit mb-3">{charity.name}</h3>
                  <p className="text-muted-foreground leading-relaxed flex-grow mb-6 line-clamp-3">
                    {charity.description}
                  </p>

                  <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Global Impact</span>
                      <span className="text-lg font-bold text-white">${(charity.total_contributions || 0).toLocaleString()}</span>
                    </div>
                    
                    <button 
                      onClick={() => handleSelectCharity(charity)}
                      className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                        user?.charity_id === charity.id 
                        ? 'bg-primary/10 text-primary hover:bg-primary/20' 
                        : 'bg-primary text-primary-foreground hover:opacity-90'
                      }`}
                    >
                      {user?.charity_id === charity.id ? 'Update' : 'Select'}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {filteredCharities.length === 0 && (
              <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                <p className="text-muted-foreground">No charities found matching your search.</p>
              </div>
            )}
          </>
        )}

        <CharitySelectionModal
          charity={selectedCharity}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmSelection}
          isLoading={isUpdating}
        />

        <AddCharityModal 
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={fetchCharities}
        />
      </main>
    </div>
  );
}
