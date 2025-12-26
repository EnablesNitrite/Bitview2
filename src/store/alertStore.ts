import { create } from 'zustand';
import type { Alert, BasicAlertType, Asset, Exchange, AlertDelivery } from '../types/core';

interface AlertsState {
  alerts: Alert[];
  addBasicAlert: (params: {
    type: BasicAlertType;
    asset: Asset;
    exchange?: Exchange;
    threshold?: number;
    delivery: AlertDelivery;
  }) => void;
  removeAlert: (id: string) => void;
}

let idCounter = 1;

export const useAlertsStore = create<AlertsState>((set) => ({
  alerts: [],
  addBasicAlert: ({ type, asset, exchange, threshold, delivery }) =>
    set((state) => ({
      alerts: [
        ...state.alerts,
        {
          id: `a-${idCounter++}`,
          plan: 'basic',
          type,
          asset,
          exchange,
          threshold,
          delivery,
          active: true,
          createdAt: new Date().toISOString()
        }
      ]
    })),
  removeAlert: (id) =>
    set((state) => ({
      alerts: state.alerts.filter((a) => a.id !== id)
    }))
}));
