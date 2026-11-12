export const ORDER_STATUSES = {
  NEW: { label: 'Нове', background: '#eaf0ff', color: '#4353cc' },
  PROCESSING: { label: 'В обробці', background: '#fff1d9', color: '#a45b10' },
  COMPLETED: { label: 'Виконане', background: '#e5f8ed', color: '#237b4d' },
  CANCELLED: { label: 'Скасоване', background: '#ffebee', color: '#b7354d' },
}
export const ALLOWED_ORDER_TRANSITIONS = { NEW: ['PROCESSING', 'CANCELLED'], PROCESSING: ['COMPLETED', 'CANCELLED'], COMPLETED: [], CANCELLED: [] }
export const PRODUCT_CATEGORIES = ['Електроніка', 'Аксесуари', 'Для дому', 'Одяг']
export const EMPTY_PRODUCT_FORM = { name: '', sku: '', category: PRODUCT_CATEGORIES[0], price: '', stock: '', description: '' }
export const EMPTY_ORDER_FORM = { customerName: '', customerPhone: '', productId: '', quantity: '1' }
export const navigationItems = [
  { id: 'overview', label: 'Огляд', icon: '📊', tone: '#ecebff' },
  { id: 'products', label: 'Товари', icon: '📦', tone: '#e4f7eb' },
  { id: 'orders', label: 'Замовлення', icon: '🧾', tone: '#fff0dc' },
  { id: 'users', label: 'Користувачі', icon: '👥', tone: '#f2e7ff', adminOnly: true },
  { id: 'company', label: 'Компанія', icon: '🏢', tone: '#e7f1ff', adminOnly: true },
]
export const SECTION_CONTENT = {
  overview: { eyebrow: 'РОБОЧИЙ ПРОСТІР', title: 'Огляд системи', description: 'Основні показники каталогу та швидкий доступ до робочих розділів DM-System.' },
  products: { eyebrow: 'КАТАЛОГ', title: 'Товари', description: 'Каталог товарів компанії з артикулами, категоріями, цінами та залишками.' },
  orders: { eyebrow: 'ОБРОБКА ЗАМОВЛЕНЬ', title: 'Замовлення', description: 'Розділ для створення замовлень і контролю їхніх статусів.' },
  users: { eyebrow: 'АДМІНІСТРУВАННЯ', title: 'Користувачі', description: 'Учасники компанії, запрошення та керування доступом.' },
  company: { eyebrow: 'НАЛАШТУВАННЯ', title: 'Компанія', description: 'Основна інформація про компанію та її робочий простір.' },
}
