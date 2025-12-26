import { useEffect, useState } from 'react';
import type { FundingSnapshot } from '../types/core';
import { fetchLiveFunding } from '../services/fundingService';

export const useLiveFunding = () => {
  const [data, setData] = useState<FundingSnapshot[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetchLiveFunding();
        if (mounted) setData(res);
      } catch (e) {
        if (mounted) setError('Failed to load funding snapshot');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    const id = setInterval(load, 10_000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  return { data, loading, error };
};
