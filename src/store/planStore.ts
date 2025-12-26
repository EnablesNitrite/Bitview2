import { create } from 'zustand';
import type { Plan } from '../types/core';

interface PlanState {
  plan: Plan;
  setPlan: (plan: Plan) => void;
  togglePlan: () => void;
}

export const usePlanStore = create<PlanState>((set) => ({
  plan: 'basic',
  setPlan: (plan) => set({ plan }),
  togglePlan: () =>
    set((state) => ({ plan: state.plan === 'basic' ? 'pro' : 'basic' }))
}));
