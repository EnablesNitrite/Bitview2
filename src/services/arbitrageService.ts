import type { ArbitrageOpportunity } from '../types/core';
import { mockArbitrageOpps } from '../utils/mock';

export const fetchArbitrageOpps = async (): Promise<ArbitrageOpportunity[]> => {
  await new Promise((r) => setTimeout(r, 350));
  return mockArbitrageOpps();
};
