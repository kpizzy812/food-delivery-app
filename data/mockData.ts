import { Restaurant, Category, Dish, Address, PaymentMethod } from '@/types';

// Категории кухонь
export const categories: Category[] = [
  { id: '1', name: 'Пицца', emoji: '🍕' },
  { id: '2', name: 'Бургеры', emoji: '🍔' },
  { id: '3', name: 'Суши', emoji: '🍣' },
  { id: '4', name: 'Паста', emoji: '🍝' },
  { id: '5', name: 'Десерты', emoji: '🍰' },
  { id: '6', name: 'Напитки', emoji: '🥤' },
  { id: '7', name: 'Салаты', emoji: '🥗' },
  { id: '8', name: 'Супы', emoji: '🍲' },
];

// Рестораны
export const restaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Bella Italia',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    rating: 4.8,
    deliveryTime: '25-35 мин',
    deliveryFee: 150,
    minOrder: 500,
    cuisineType: ['Итальянская', 'Пицца', 'Паста'],
    promoted: true,
    promo: {
      code: 'ITALY20',
      discount: 20,
    },
  },
  {
    id: '2',
    name: 'Sushi Master',
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800',
    rating: 4.9,
    deliveryTime: '30-40 мин',
    deliveryFee: 200,
    minOrder: 800,
    cuisineType: ['Японская', 'Суши'],
    promoted: true,
  },
  {
    id: '3',
    name: 'Burger House',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800',
    rating: 4.7,
    deliveryTime: '20-30 мин',
    deliveryFee: 100,
    minOrder: 400,
    cuisineType: ['Американская', 'Бургеры'],
    promo: {
      code: 'BURGER15',
      discount: 15,
    },
  },
  {
    id: '4',
    name: 'Green Garden',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
    rating: 4.6,
    deliveryTime: '15-25 мин',
    deliveryFee: 120,
    minOrder: 350,
    cuisineType: ['Здоровое питание', 'Салаты'],
  },
];

// Блюда для Bella Italia
export const bellaitaliaDishes: Dish[] = [
  {
    id: '1',
    restaurantId: '1',
    name: 'Маргарита',
    description: 'Классическая пицца с томатами и моцареллой',
    ingredients: 'Томаты, моцарелла, базилик, оливковое масло',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800',
    price: 550,
    category: 'Пицца',
    popular: true,
    sizes: [
      { id: 's1', name: 'Маленькая 25см', price: 0 },
      { id: 's2', name: 'Средняя 30см', price: 200 },
      { id: 's3', name: 'Большая 35см', price: 350 },
    ],
    options: [
      { id: 'o1', name: 'Дополнительный сыр', price: 100 },
      { id: 'o2', name: 'Грибы', price: 80 },
      { id: 'o3', name: 'Оливки', price: 70 },
    ],
  },
  {
    id: '2',
    restaurantId: '1',
    name: 'Пепперони',
    description: 'Острая пицца с колбасой пепперони',
    ingredients: 'Колбаса пепперони, моцарелла, томатный соус, орегано',
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800',
    price: 650,
    category: 'Пицца',
    popular: true,
    sizes: [
      { id: 's1', name: 'Маленькая 25см', price: 0 },
      { id: 's2', name: 'Средняя 30см', price: 200 },
      { id: 's3', name: 'Большая 35см', price: 350 },
    ],
  },
  {
    id: '3',
    restaurantId: '1',
    name: 'Карбонара',
    description: 'Классическая паста с беконом и сливочным соусом',
    ingredients: 'Спагетти, бекон, яйцо, пармезан, сливки',
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800',
    price: 480,
    category: 'Паста',
    popular: true,
  },
  {
    id: '4',
    restaurantId: '1',
    name: 'Капрезе',
    description: 'Свежий салат с томатами и моцареллой',
    ingredients: 'Томаты, моцарелла, базилик, бальзамический уксус',
    image: 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=800',
    price: 380,
    category: 'Салаты',
  },
  {
    id: '5',
    restaurantId: '1',
    name: 'Тирамису',
    description: 'Классический итальянский десерт',
    ingredients: 'Маскарпоне, кофе, савоярди, какао',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800',
    price: 320,
    category: 'Десерты',
  },
];

// Блюда для Sushi Master
export const sushiMasterDishes: Dish[] = [
  {
    id: '6',
    restaurantId: '2',
    name: 'Филадельфия',
    description: 'Ролл с лососем и сливочным сыром',
    ingredients: 'Лосось, сливочный сыр, огурец, рис, нори',
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800',
    price: 480,
    category: 'Роллы',
    popular: true,
  },
  {
    id: '7',
    restaurantId: '2',
    name: 'Калифорния',
    description: 'Классический ролл с крабом и авокадо',
    ingredients: 'Краб, авокадо, огурец, икра тобико, рис',
    image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=800',
    price: 420,
    category: 'Роллы',
  },
  {
    id: '8',
    restaurantId: '2',
    name: 'Сет "Ассорти"',
    description: 'Набор из популярных роллов',
    ingredients: '32 шт: Филадельфия, Калифорния, Унаги',
    image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=800',
    price: 1450,
    category: 'Сеты',
    popular: true,
  },
];

// Адреса доставки
export const addresses: Address[] = [
  {
    id: 'a1',
    label: 'Дом',
    street: 'ул. Ленина',
    building: '25',
    apartment: '42',
    floor: '5',
    instructions: 'Домофон работает, позвоните за 5 минут',
  },
  {
    id: 'a2',
    label: 'Работа',
    street: 'пр. Мира',
    building: '100',
    apartment: 'офис 305',
    floor: '3',
    instructions: 'Вход со двора, синяя дверь',
  },
];

// Способы оплаты
export const paymentMethods: PaymentMethod[] = [
  {
    id: 'p1',
    type: 'card',
    label: 'Карта **** 4242',
    last4: '4242',
    icon: '💳',
  },
  {
    id: 'p2',
    type: 'cash',
    label: 'Наличные',
    icon: '💵',
  },
  {
    id: 'p3',
    type: 'apple_pay',
    label: 'Apple Pay',
    icon: '',
  },
];

// Все блюда
export const allDishes = [...bellaitaliaDishes, ...sushiMasterDishes];
