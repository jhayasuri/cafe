import { MenuItem, Category, User, TransactionType } from './types';

export const MOCK_MENU: MenuItem[] = [
  {
    id: '1',
    name: 'Caramel Macchiato',
    description: 'Freshly steamed milk with vanilla-flavored syrup marked with espresso and topped with a caramel drizzle.',
    price: 5.50,
    category: Category.DRINKS,
    image: 'https://picsum.photos/id/425/400/400',
    available: true,
    calories: 250
  },
  {
    id: '2',
    name: 'Avocado Toast',
    description: 'Sourdough toast topped with smashed avocado, chili flakes, and olive oil.',
    price: 8.00,
    category: Category.SNACKS,
    image: 'https://picsum.photos/id/493/400/400',
    available: true,
    calories: 320
  },
  {
    id: '3',
    name: 'Morning Combo',
    description: 'Any medium coffee plus a croissant.',
    price: 9.50,
    category: Category.COMBOS,
    image: 'https://picsum.photos/id/1060/400/400',
    available: true,
    calories: 450
  },
  {
    id: '4',
    name: 'Matcha Latte',
    description: 'Smooth and creamy matcha sweetened just right and served with steamed milk.',
    price: 6.00,
    category: Category.DRINKS,
    image: 'https://picsum.photos/id/431/400/400',
    available: true,
    calories: 210
  },
  {
    id: '5',
    name: 'Berry Smoothie',
    description: 'Blend of strawberries, blueberries, raspberries and yogurt.',
    price: 7.50,
    category: Category.SPECIALS,
    image: 'https://picsum.photos/id/1080/400/400',
    available: true,
    calories: 180
  },
  {
    id: '6',
    name: 'Chocolate Croissant',
    description: 'Buttery, flaky croissant filled with rich chocolate.',
    price: 4.50,
    category: Category.SNACKS,
    image: 'https://picsum.photos/id/292/400/400',
    available: true,
    calories: 340
  }
];

export const INITIAL_USER: User = {
  id: 'user_123',
  name: 'Alex Doe',
  email: 'alex@example.com',
  role: 'customer', // Default to customer, can switch to admin in UI
  wallet: {
    balance: 50.00,
    transactions: [
      {
        id: 'tx_1',
        type: TransactionType.DEPOSIT,
        amount: 50.00,
        date: new Date().toISOString(),
        description: 'Initial Deposit'
      }
    ]
  }
};