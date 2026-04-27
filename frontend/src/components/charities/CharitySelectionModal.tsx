'use client';

import { Charity } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  percentage: z.number().min(10, 'Minimum contribution is 10%').max(100, 'Maximum contribution is 100%'),
});

type FormData = z.infer<typeof schema>;

interface CharitySelectionModalProps {
  charity: Charity | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (charityId: string, percentage: number) => Promise<void>;
  isLoading: boolean;
}

export default function CharitySelectionModal({ 
  charity, 
  isOpen, 
  onClose, 
  onConfirm,
  isLoading 
}: CharitySelectionModalProps) {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      percentage: 10,
    }
  });

  const percentage = watch('percentage');

  if (!charity) return null;

  const onSubmit = async (data: FormData) => {
    await onConfirm(charity.id, data.percentage);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg premium-card bg-background border-white/10 shadow-2xl overflow-hidden"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/5 transition-colors text-muted-foreground"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 text-3xl font-bold font-outfit">
                  {charity.name[0]}
                </div>
                <div>
                  <h2 className="text-2xl font-bold font-outfit">Select Charity</h2>
                  <p className="text-muted-foreground">{charity.name}</p>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                      <Heart className="w-4 h-4 text-rose-500" />
                      Contribution Percentage
                    </label>
                    <span className="text-3xl font-bold text-primary font-outfit">{percentage}%</span>
                  </div>
                  
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    {...register('percentage', { valueAsNumber: true })}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  
                  <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                    <span>Min 10%</span>
                    <span>100% Max</span>
                  </div>

                  {errors.percentage && (
                    <p className="text-rose-500 text-xs flex items-center gap-1 mt-2">
                      <AlertCircle className="w-3 h-3" />
                      {errors.percentage.message}
                    </p>
                  )}
                </div>

                <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-3">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold">Safe & Verified</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Your contribution is automatically calculated from your golf performance and sent directly to {charity.name}.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-4 px-6 rounded-2xl font-bold border border-white/10 hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-2 bg-primary text-primary-foreground py-4 px-8 rounded-2xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Confirm Selection'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
