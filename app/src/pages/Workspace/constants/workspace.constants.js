export const PRODUCTS_STORAGE_KEY = 'dm-system-products-v1'
export const ORDERS_STORAGE_KEY = 'dm-system-orders-v1'
export const USERS_STORAGE_KEY = 'dm-system-users-v1'
export const DEMO_COMPANY_ID = 'company-demo'
export const DEMO_DROPSHIPPER_ID = 'user-demo-dropshipper'

export const ORDER_STATUSES = {
  NEW: { label: 'Нове', background: '#eaf0ff', color: '#4353cc' },
  PROCESSING: { label: 'В обробці', background: '#fff1d9', color: '#a45b10' },
  COMPLETED: { label: 'Виконане', background: '#e5f8ed', color: '#237b4d' },
  CANCELLED: { label: 'Скасоване', background: '#ffebee', color: '#b7354d' },
}

export const ALLOWED_ORDER_TRANSITIONS = {
  NEW: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: [],
}

export const PRODUCT_CATEGORIES = [
  'Електроніка',
  'Аксесуари',
  'Для дому',
  'Одяг',
]

export const INITIAL_PRODUCTS = [
  {
    id: 'prod-1001',
    companyId: DEMO_COMPANY_ID,
    sku: 'DM-1001',
    name: 'Бездротові навушники',
    description: 'Компактні навушники для щоденного використання.',
    category: 'Електроніка',
    price: 1299,
    stock: 25,
  },
  {
    id: 'prod-1002',
    companyId: DEMO_COMPANY_ID,
    sku: 'DM-1002',
    name: 'Портативна зарядна станція',
    description: 'Портативне живлення для смартфонів та аксесуарів.',
    category: 'Електроніка',
    price: 12499,
    stock: 8,
  },
  {
    id: 'prod-1003',
    companyId: DEMO_COMPANY_ID,
    sku: 'DM-1003',
    name: 'Підставка для ноутбука',
    description: 'Регульована підставка для комфортної роботи.',
    category: 'Аксесуари',
    price: 3999,
    stock: 12,
  },
  {
    id: 'prod-1004',
    companyId: DEMO_COMPANY_ID,
    sku: 'DM-1004',
    name: 'Органайзер для робочого столу',
    description: 'Допомагає зберігати робоче місце впорядкованим.',
    category: 'Для дому',
    price: 2499,
    stock: 18,
  },
]

export const INITIAL_ORDERS = [
  {
    id: 'ORD-2026-014',
    companyId: DEMO_COMPANY_ID,
    createdBy: DEMO_DROPSHIPPER_ID,
    createdByName: 'Андрій Шевченко',
    customerName: 'Марія Сидоренко',
    customerPhone: '+380 67 123 45 67',
    items: [{ productId: 'prod-1001', sku: 'DM-1001', productName: 'Бездротові навушники', quantity: 2, unitPrice: 1299 }],
    total: 2598,
    status: 'NEW',
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    stockDeducted: false,
  },
  {
    id: 'ORD-2026-013',
    companyId: DEMO_COMPANY_ID,
    createdBy: 'user-demo-dropper-2',
    createdByName: 'Ірина Бондар',
    customerName: 'Олег Кравчук',
    customerPhone: '+380 93 222 11 44',
    items: [{ productId: 'prod-1003', sku: 'DM-1003', productName: 'Підставка для ноутбука', quantity: 1, unitPrice: 3999 }],
    total: 3999,
    status: 'PROCESSING',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    stockDeducted: false,
  },
  {
    id: 'ORD-2026-012',
    companyId: DEMO_COMPANY_ID,
    createdBy: DEMO_DROPSHIPPER_ID,
    createdByName: 'Андрій Шевченко',
    customerName: 'Олена Мельник',
    customerPhone: '+380 50 444 33 22',
    items: [{ productId: 'prod-1004', sku: 'DM-1004', productName: 'Органайзер для робочого столу', quantity: 3, unitPrice: 2499 }],
    total: 7497,
    status: 'COMPLETED',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    stockDeducted: false,
  },
]

export const INITIAL_USERS = [
  { id: 'user-demo-admin', name: 'Олександр Коваленко', email: 'admin@dm-system.test', role: 'ADMIN', companyId: DEMO_COMPANY_ID, companyName: 'DM Company' },
  { id: DEMO_DROPSHIPPER_ID, name: 'Андрій Шевченко', email: 'andrii@dm-system.test', role: 'DROPSHIPPER', companyId: DEMO_COMPANY_ID, companyName: 'DM Company' },
  { id: 'user-demo-dropper-2', name: 'Ірина Бондар', email: 'iryna@dm-system.test', role: 'DROPSHIPPER', companyId: DEMO_COMPANY_ID, companyName: 'DM Company' },
]

export const EMPTY_PRODUCT_FORM = {
  name: '',
  sku: '',
  category: PRODUCT_CATEGORIES[0],
  price: '',
  stock: '',
  description: '',
}

export const EMPTY_ORDER_FORM = {
  customerName: '',
  customerPhone: '',
  productId: '',
  quantity: '1',
}

export const EMPTY_USER_FORM = {
  name: '',
  email: '',
  role: 'DROPSHIPPER',
}

export const navigationItems = [
  { id: 'overview', label: 'Огляд', icon: '📊', tone: '#ecebff' },
  { id: 'products', label: 'Товари', icon: '📦', tone: '#e4f7eb' },
  { id: 'orders', label: 'Замовлення', icon: '🧾', tone: '#fff0dc' },
  { id: 'users', label: 'Користувачі', icon: '👥', tone: '#f2e7ff', adminOnly: true },
]

export const SECTION_CONTENT = {
  overview: {
    eyebrow: 'РОБОЧИЙ ПРОСТІР',
    title: 'Огляд системи',
    description: 'Основні показники каталогу та швидкий доступ до робочих розділів DM System.',
  },
  products: {
    eyebrow: 'КАТАЛОГ',
    title: 'Товари',
    description: 'Каталог товарів компанії з артикулами, категоріями, цінами та залишками.',
  },
  orders: {
    eyebrow: 'ОБРОБКА ЗАМОВЛЕНЬ',
    title: 'Замовлення',
    description: 'Розділ для створення замовлень і контролю їхніх статусів.',
  },
  users: {
    eyebrow: 'АДМІНІСТРУВАННЯ',
    title: 'Користувачі',
    description: 'Розділ адміністратора для перегляду користувачів і керування їхніми даними.',
  },
}
