import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Card, Transaction, Route, Ticket } from '../lib/types';
import { MOCK_CARDS, MOCK_TRANSACTIONS, MOCK_ROUTES } from '../lib/mockData';

interface TransportStore {
  cards: Card[];
  transactions: Transaction[];
  routes: Route[];
  tickets: Ticket[];
  
  // Actions
  addCard: (name: string) => Card;
  topUpCard: (cardId: string, amount: number) => void;
  processFare: (
    cardId: string,
    fare: number,
    busNumber: string,
    location: string,
    routeId?: string
  ) => boolean;
  sellTicket: (routeId: string) => void;
  
  // Simulation Helpers
  getCard: (id: string) => Card | undefined;
  getTransactionsByCard: (cardId: string) => Transaction[];
  getTotalRevenue: () => number;
  getTotalPassengers: () => number;
}

export const useStore = create<TransportStore>()(
  persist(
    (set, get) => ({
      cards: MOCK_CARDS,
      transactions: MOCK_TRANSACTIONS,
      routes: MOCK_ROUTES,
      tickets: [],

      addCard: (name: string) => {
        const newCard: Card = {
          id: `ZW-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          holderName: name,
          balance: 0,
          status: 'active',
          createdAt: Date.now(),
        };
        set((state) => ({ cards: [...state.cards, newCard] }));
        return newCard;
      },

      topUpCard: (cardId: string, amount: number) => {
        if (!Number.isFinite(amount) || amount <= 0) return;
        set((state) => ({
          cards: state.cards.map((c) =>
            c.id === cardId ? { ...c, balance: c.balance + amount } : c
          ),
          transactions: [
            {
              id: crypto.randomUUID(),
              cardId,
              amount,
              type: 'topup',
              location: 'Hub Terminal',
              timestamp: Date.now(),
            },
            ...state.transactions,
          ],
        }));
      },

      processFare: (cardId, fare, busNumber, location, routeId) => {
        const card = get().cards.find((c) => c.id === cardId);
        if (!card || card.status !== 'active' || !Number.isFinite(fare) || fare <= 0) return false;
        if (card.balance < fare) return false;

        set((state) => ({
          cards: state.cards.map((c) =>
            c.id === cardId ? { ...c, balance: c.balance - fare } : c
          ),
          transactions: [
            {
              id: crypto.randomUUID(),
              cardId,
              amount: fare,
              type: 'fare',
              location,
              busNumber,
              routeId,
              timestamp: Date.now(),
            },
            ...state.transactions,
          ],
        }));
        return true;
      },

      sellTicket: (routeId: string) => {
        const route = get().routes.find(r => r.id === routeId);
        if (!route) return;

        const newTicket: Ticket = {
          id: `T-${crypto.randomUUID().substr(0, 8).toUpperCase()}`,
          routeId,
          price: route.fare,
          issuedAt: Date.now(),
          expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        };

        set((state) => ({
          tickets: [...state.tickets, newTicket],
          transactions: [
            {
              id: crypto.randomUUID(),
              cardId: 'CASH-PASSENGER',
              amount: route.fare,
              type: 'ticket',
              location: 'Hub Station',
              routeId,
              timestamp: Date.now(),
            },
            ...state.transactions,
          ]
        }));
      },

      getCard: (id: string) => get().cards.find(c => c.id === id),
      getTransactionsByCard: (cardId: string) => get().transactions.filter(t => t.cardId === cardId),
      getTotalRevenue: () => get().transactions.reduce((sum, t) => t.type !== 'topup' ? sum + t.amount : sum, 0),
      getTotalPassengers: () => get().transactions.filter(t => t.type === 'fare' || t.type === 'ticket').length,
    }),
    {
      name: 'smart-bus-storage',
    }
  )
);