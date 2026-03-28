export const MOCK_ROUTES = [
  { id: '1', name: 'Harare to Chitungwiza', fare: 2.50 },
  { id: '2', name: 'CBD to Mabvuku', fare: 1.50 },
  { id: '3', name: 'Avondale to Westgate', fare: 1.00 },
];

export const MOCK_CARDS = [
  {
    id: 'ZW-TEST-1',
    holderName: 'Sample Commuter',
    balance: 15.00,
    status: 'active',
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
  }
];

export const MOCK_TRANSACTIONS = [
  {
    id: 'TXN-1',
    cardId: 'ZW-TEST-1',
    amount: 10.00,
    type: 'topup',
    location: 'Hub Station',
    timestamp: Date.now() - 1000 * 60 * 60 * 2,
  },
  {
    id: 'TXN-2',
    cardId: 'ZW-TEST-1',
    amount: 2.50,
    type: 'fare',
    location: 'Harare-Chitown Route',
    busNumber: 'ZUPCO-HRE-102',
    routeId: '1',
    timestamp: Date.now() - 1000 * 60 * 30,
  }
];