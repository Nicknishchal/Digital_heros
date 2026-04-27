'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '@/lib/axios';
import { Loader2, Plus, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const scoreSchema = z.object({
  score: z.number().min(1).max(45),
  date: z.string().nonempty('Date is required'),
});

type ScoreFormData = z.infer<typeof scoreSchema>;

export default function ScoreForm({ onSuccess }: { onSuccess: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ScoreFormData>({
    resolver: zodResolver(scoreSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0]
    }
  });

  const onSubmit = async (data: ScoreFormData) => {
    setIsLoading(true);
    try {
      await api.post('/scores/', data);
      toast.success('Score added successfully!');
      reset();
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to add score');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Stableford Score</label>
          <input
            type="number"
            {...register('score', { valueAsNumber: true })}
            placeholder="1-45"
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
          />
          {errors.score && <p className="text-xs text-rose-500">{errors.score.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Date Played</label>
          <div className="relative">
            <input
              type="date"
              {...register('date')}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none appearance-none"
            />
          </div>
          {errors.date && <p className="text-xs text-rose-500">{errors.date.message}</p>}
        </div>
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
        Submit Score
      </button>
    </form>
  );
}
