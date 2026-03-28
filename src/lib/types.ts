export interface Card {
  id: string;
  holderName: string;
  balance: number;
  status: 'active' | 'blocked';
  createdAt: number;
}

export interface Transaction {
  id: string;
  cardId: string;
  amount: number;
  type: 'topup' | 'fare' | 'ticket';
  location: string;
  timestamp: number;
  conductorId?: string;
  busNumber?: string;
  /** Set for fares and cash tickets so analytics can attribute route usage */
  routeId?: string;
}

export interface Route {
  id: string;
  name: string;
  fare: number;
}

export interface Ticket {
  id: string;
  routeId: string;
  price: number;
  issuedAt: number;
  expiresAt: number;
}