// Mock data for CampusFind app (VIT Pune)

export interface Item {
  id: string;
  title: string;
  description: string;
  category: ItemCategory;
  type: 'lost' | 'found';
  status: 'available' | 'claimed' | 'resolved';
  location: string;
  date: string;
  imageUrl: string;
  postedBy: string;
  secretQuestion: string;
  secretAnswer: string;

  // 📍 GPS for campus map
  lat: number;
  lng: number;
}

export type ItemCategory =
  | 'electronics'
  | 'books'
  | 'clothing'
  | 'keys'
  | 'id-cards'
  | 'accessories'
  | 'bags'
  | 'other';

export const categoryConfig: Record<ItemCategory, { label: string; icon: string }> = {
  electronics: { label: 'Electronics', icon: 'Smartphone' },
  books: { label: 'Books', icon: 'BookOpen' },
  clothing: { label: 'Clothing', icon: 'Shirt' },
  keys: { label: 'Keys', icon: 'Key' },
  'id-cards': { label: 'ID Cards', icon: 'CreditCard' },
  accessories: { label: 'Accessories', icon: 'Watch' },
  bags: { label: 'Bags', icon: 'Briefcase' },
  other: { label: 'Other', icon: 'Package' },
};

export let mockItems: Item[] = [
  {
    id: '1',
    title: 'MacBook Pro Charger',
    description: 'White 67W USB-C charger found in the library study room on the 3rd floor.',
    category: 'electronics',
    type: 'found',
    status: 'available',
    location: 'Main Library, 3rd Floor',
    date: '2026-01-10',
    imageUrl: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=300&fit=crop',
    postedBy: 'user1',
    secretQuestion: 'What brand is the charger?',
    secretAnswer: 'apple',
    lat: 18.4645,
    lng: 73.8695,
  },
  {
    id: '2',
    title: 'Blue Water Bottle',
    description: 'Hydro Flask water bottle, blue color with stickers on it.',
    category: 'accessories',
    type: 'lost',
    status: 'available',
    location: 'Science Building, Room 201',
    date: '2026-01-09',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop',
    postedBy: 'user2',
    secretQuestion: 'What stickers are on the bottle?',
    secretAnswer: 'hiking',
    lat: 18.4639,
    lng: 73.8687,
  },
  {
    id: '3',
    title: 'Student ID Card',
    description: 'Found a student ID card near the cafeteria entrance.',
    category: 'id-cards',
    type: 'found',
    status: 'claimed',
    location: 'Cafeteria',
    date: '2026-01-08',
    imageUrl: 'https://images.unsplash.com/photo-1578670812003-60745e2c2ea9?w=400&h=300&fit=crop',
    postedBy: 'user3',
    secretQuestion: 'What is the first name on the card?',
    secretAnswer: 'jordan',
    lat: 18.4632,
    lng: 73.8689,
  },
  {
    id: '4',
    title: 'AirPods Pro Case',
    description: 'White AirPods Pro case found in the gym locker room.',
    category: 'electronics',
    type: 'found',
    status: 'available',
    location: 'Recreation Center',
    date: '2026-01-10',
    imageUrl: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400&h=300&fit=crop',
    postedBy: 'user1',
    secretQuestion: 'What generation AirPods are these?',
    secretAnswer: 'pro',
    lat: 18.4651,
    lng: 73.8698,
  },
  {
    id: '5',
    title: 'Black Umbrella',
    description: 'Compact black umbrella left at the bus stop outside the engineering building.',
    category: 'accessories',
    type: 'found',
    status: 'available',
    location: 'Engineering Building Bus Stop',
    date: '2026-01-09',
    imageUrl: 'https://images.unsplash.com/photo-1534309466160-70b22cc6252c?w=400&h=300&fit=crop',
    postedBy: 'user4',
    secretQuestion: 'What brand is the umbrella?',
    secretAnswer: 'totes',
    lat: 18.4640,
    lng: 73.8705,
  },
  {
    id: '6',
    title: 'Car Keys with Keychain',
    description: 'Toyota car keys with a red keychain found in parking lot B.',
    category: 'keys',
    type: 'found',
    status: 'available',
    location: 'Parking Lot B',
    date: '2026-01-08',
    imageUrl: 'https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?w=400&h=300&fit=crop',
    postedBy: 'user5',
    secretQuestion: 'What color is the keychain?',
    secretAnswer: 'red',
    lat: 18.4628,
    lng: 73.8679,
  },
  {
    id: '7',
    title: 'Calculus Textbook',
    description: 'Lost my calculus textbook somewhere around the math building.',
    category: 'books',
    type: 'lost',
    status: 'available',
    location: 'Math Building',
    date: '2026-01-07',
    imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop',
    postedBy: 'user6',
    secretQuestion: 'What edition is the textbook?',
    secretAnswer: '8th',
    lat: 18.4636,
    lng: 73.8683,
  },
  {
    id: '8',
    title: 'Denim Jacket',
    description: 'Blue denim jacket left behind after the outdoor concert.',
    category: 'clothing',
    type: 'found',
    status: 'resolved',
    location: 'Outdoor Amphitheater',
    date: '2026-01-06',
    imageUrl: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400&h=300&fit=crop',
    postedBy: 'user7',
    secretQuestion: 'What size is the jacket?',
    secretAnswer: 'medium',
    lat: 18.4658,
    lng: 73.8712,
  },
  {
    id: '9',
    title: 'Laptop Backpack',
    description: 'Gray Jansport backpack with laptop compartment found in lecture hall.',
    category: 'bags',
    type: 'found',
    status: 'available',
    location: 'Lecture Hall A',
    date: '2026-01-10',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop',
    postedBy: 'user8',
    secretQuestion: 'What brand is the backpack?',
    secretAnswer: 'jansport',
    lat: 18.4643,
    lng: 73.8691,
  },
  {
    id: '10',
    title: 'Prescription Glasses',
    description: 'Black frame prescription glasses found in the computer lab.',
    category: 'accessories',
    type: 'found',
    status: 'available',
    location: 'Computer Lab, Tech Building',
    date: '2026-01-09',
    imageUrl: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=300&fit=crop',
    postedBy: 'user9',
    secretQuestion: 'What shape are the frames?',
    secretAnswer: 'rectangular',
    lat: 18.4637,
    lng: 73.8686,
  },
];

export interface UserActivity {
  id: string;
  type: 'posted' | 'claimed' | 'resolved';
  itemTitle: string;
  timestamp: string;
}

export const mockActivities: UserActivity[] = [
  { id: '1', type: 'posted', itemTitle: 'MacBook Pro Charger', timestamp: '2 hours ago' },
  { id: '2', type: 'claimed', itemTitle: 'Student ID Card', timestamp: '1 day ago' },
  { id: '3', type: 'resolved', itemTitle: 'Denim Jacket', timestamp: '3 days ago' },
  { id: '4', type: 'posted', itemTitle: 'AirPods Pro Case', timestamp: '5 days ago' },
];

export interface UserStats {
  itemsPosted: number;
  activeClaims: number;
  returnedItems: number;
  successRate: number;
}

export const mockUserStats: UserStats = {
  itemsPosted: 4,
  activeClaims: 1,
  returnedItems: 3,
  successRate: 75,
};

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export const mockUser: User = {
  id: 'user1',
  name: 'Alex Johnson',
  email: 'alex.johnson@university.edu',
  avatar: '',
};

// Platform stats
export const platformStats = {
  itemsReturned: 1247,
  activeListings: 89,
  successRate: 94,
};

export function addMockItem(item: any) {
  mockItems.push(item);
};
