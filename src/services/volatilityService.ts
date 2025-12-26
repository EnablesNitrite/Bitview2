import type { Asset, VolatilityPoint } from '../types/core';
import { mockVolatilitySeries } from '../utils/mock';

export const fetchVolatilitySeries = async (
  asset: Asset,
  days: number
): Promise<VolatilityPoint[]> => {
  await new Promise((r) => setTimeout(r, 350));
  return mockVolatilitySeries(asset, days);
};
