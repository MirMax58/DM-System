import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import cubeLogo from '../../assets/DM-System_cube_logo_transparent.png'

const PRODUCTS_STORAGE_KEY = 'dm-system-products-v1'
const ORDERS_STORAGE_KEY = 'dm-system-orders-v1'
const USERS_STORAGE_KEY = 'dm-system-users-v1'
const DEMO_COMPANY_ID = 'company-demo'
const DEMO_DROPSHIPPER_ID = 'user-demo-dropshipper'

const ORDER_STATUSES = {
  NEW: { label: 'Нове', background: '#eaf0ff', color: '#4353cc' },
  PROCESSING: { label: 'В обробці', background: '#fff1d9', color: '#a45b10' },
  COMPLETED: { label: 'Виконане', background: '#e5f8ed', color: '#237b4d' },
  CANCELLED: { label: 'Скасоване', background: '#ffebee', color: '#b7354d' },
}

const ALLOWED_ORDER_TRANSITIONS = {
  NEW: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: [],
}

const PRODUCT_CATEGORIES = [
  'Електроніка',
  'Аксесуари',
  'Для дому',
  'Одяг',
]

const INITIAL_PRODUCTS = [
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

const INITIAL_ORDERS = [
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

const INITIAL_USERS = [
  { id: 'user-demo-admin', name: 'Олександр Коваленко', email: 'admin@dm-system.test', role: 'ADMIN', companyId: DEMO_COMPANY_ID, companyName: 'DM Company' },
  { id: DEMO_DROPSHIPPER_ID, name: 'Андрій Шевченко', email: 'andrii@dm-system.test', role: 'DROPSHIPPER', companyId: DEMO_COMPANY_ID, companyName: 'DM Company' },
  { id: 'user-demo-dropper-2', name: 'Ірина Бондар', email: 'iryna@dm-system.test', role: 'DROPSHIPPER', companyId: DEMO_COMPANY_ID, companyName: 'DM Company' },
]

const EMPTY_PRODUCT_FORM = {
  name: '',
  sku: '',
  category: PRODUCT_CATEGORIES[0],
  price: '',
  stock: '',
  description: '',
}

const EMPTY_ORDER_FORM = {
  customerName: '',
  customerPhone: '',
  productId: '',
  quantity: '1',
}

const EMPTY_USER_FORM = {
  name: '',
  email: '',
  role: 'DROPSHIPPER',
}

function loadProducts() {
  try {
    const savedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY)

    if (savedProducts === null) {
      return INITIAL_PRODUCTS
    }

    const parsedProducts = JSON.parse(savedProducts)
    return Array.isArray(parsedProducts) ? parsedProducts : INITIAL_PRODUCTS
  } catch {
    return INITIAL_PRODUCTS
  }
}

function loadOrders() {
  try {
    const savedOrders = localStorage.getItem(ORDERS_STORAGE_KEY)
    if (savedOrders === null) return INITIAL_ORDERS
    const parsedOrders = JSON.parse(savedOrders)
    return Array.isArray(parsedOrders) ? parsedOrders : INITIAL_ORDERS
  } catch {
    return INITIAL_ORDERS
  }
}

function loadUsers() {
  try {
    const savedUsers = localStorage.getItem(USERS_STORAGE_KEY)
    if (savedUsers === null) return INITIAL_USERS
    const parsedUsers = JSON.parse(savedUsers)
    return Array.isArray(parsedUsers) ? parsedUsers : INITIAL_USERS
  } catch {
    return INITIAL_USERS
  }
}

function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('uk-UA', { day: '2-digit', month: 'short', year: 'numeric' }).format(date)
}

function getOrderStatusLabel(status) {
  return ORDER_STATUSES[status]?.label || status
}

function formatPrice(value) {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)
}

function getCategorySymbol(category) {
  const symbols = {
    Електроніка: '🎧',
    Аксесуари: '💻',
    'Для дому': '🏠',
    Одяг: '👕',
  }

  return symbols[category] || '📦'
}

const Page = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 248px minmax(0, 1fr);
  background: var(--bg, #f5f7fb);
  color: #17213b;

  * {
    box-sizing: border-box;
  }

  @media (max-width: 760px) {
    grid-template-columns: minmax(0, 1fr);
  }
`

const Sidebar = styled.aside`
  min-height: 100vh;
  padding: 26px 16px;
  background: #14264d;
  color: #fff;
  display: flex;
  flex-direction: column;

  @media (max-width: 760px) {
    min-height: 0;
    padding: 14px 14px 12px;
  }
`

const Brand = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 48px;
  margin: 0 8px 34px;
  color: #fff;
  text-decoration: none;
  font-size: 18px;
  letter-spacing: -0.4px;

  strong {
    font-weight: 750;
  }

  @media (max-width: 760px) {
    margin: 0 4px 16px;
  }
`

const BrandLogo = styled.img`
  width: 39px;
  height: 39px;
  flex: 0 0 auto;
  object-fit: contain;
  border-radius: 10px;
  background: #fff;
  padding: 3px;
`

const SidebarCaption = styled.p`
  margin: 0 10px 12px;
  color: #aebde1;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.4px;

  @media (max-width: 760px) {
    margin-bottom: 8px;
  }
`

const Navigation = styled.nav`
  display: grid;
  gap: 6px;

  @media (max-width: 760px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 6px;
  }

  @media (max-width: 430px) {
    grid-template-columns: minmax(0, 1fr);
  }
`

const NavigationButton = styled.button`
  display: flex;
  align-items: center;
  gap: 11px;
  width: 100%;
  min-height: 46px;
  padding: 10px 12px;
  border: 1px solid ${({ $active }) => ($active ? '#6b72ff' : 'transparent')};
  border-radius: 11px;
  background: ${({ $active }) => ($active ? '#5b5cf0' : 'transparent')};
  color: ${({ $active }) => ($active ? '#fff' : '#d6def3')};
  font-size: 13px;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  text-align: left;
  cursor: pointer;
  transition: background 160ms ease, border-color 160ms ease;

  &:hover {
    background: ${({ $active }) => ($active ? '#5b5cf0' : '#203966')};
  }

  &:focus-visible {
    outline: 2px solid #b8bbff;
    outline-offset: 2px;
  }
`

const NavigationMark = styled.span`
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  flex: 0 0 auto;
  border-radius: 9px;
  background: ${({ $tone }) => $tone || '#eef0ff'};
  color: #26314a;
  font-size: 16px;
`

const Main = styled.main`
  min-width: 0;
  padding: 28px clamp(16px, 3vw, 42px) 48px;

  @media (max-width: 760px) {
    padding-top: 20px;
  }
`

const Topbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  padding-bottom: 22px;
  margin-bottom: 30px;
  border-bottom: 1px solid #e7eaf3;
`

const BackLink = styled(Link)`
  color: #68728a;
  font-size: 12px;
  text-decoration: none;

  &:hover {
    color: var(--primary, #5b5cf0);
  }
`

const TopbarRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 10px;
`

const RoleSelect = styled.select`
  max-width: 100%;
  min-height: 34px;
  padding: 7px 10px;
  border: 1px solid #dfe4f0;
  border-radius: 9px;
  background: #fff;
  color: #24304a;
  font: inherit;
  font-size: 12px;
`

const PageIntro = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 18px;
  flex-wrap: wrap;
  margin-bottom: 24px;
`

const IntroText = styled.div`
  min-width: 0;
`

const Eyebrow = styled.p`
  margin: 0 0 9px;
  color: var(--primary, #5b5cf0);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.35px;
`

const PageTitle = styled.h1`
  margin: 0 0 9px;
  color: #17213b;
  font-size: clamp(25px, 3vw, 34px);
  font-weight: 750;
  line-height: 1.2;
  letter-spacing: -0.8px;
`

const PageDescription = styled.p`
  max-width: 690px;
  margin: 0;
  color: #727d94;
  font-size: 13px;
  line-height: 1.7;
`

const Section = styled.section`
  min-width: 0;
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 24px;

  @media (max-width: 1050px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 430px) {
    grid-template-columns: minmax(0, 1fr);
  }
`

const StatCard = styled.div`
  min-width: 0;
  padding: 19px 18px;
  border: 1px solid #e7eaf2;
  border-radius: 15px;
  background: #fff;
  box-shadow: 0 5px 18px rgba(22, 37, 77, 0.025);
`

const StatTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-bottom: 17px;
`

const StatLabel = styled.p`
  margin: 0;
  color: #737e94;
  font-size: 11px;
  line-height: 1.4;
`

const StatIcon = styled.span`
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  flex: 0 0 auto;
  border-radius: 11px;
  background: ${({ $tone }) => $tone || '#efefff'};
  font-size: 17px;
`

const StatValue = styled.p`
  margin: 0;
  color: #17213b;
  font-size: clamp(22px, 2.5vw, 29px);
  font-weight: 750;
  letter-spacing: -0.6px;
`

const Panel = styled.div`
  min-width: 0;
  border: 1px solid #e7eaf2;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 5px 18px rgba(22, 37, 77, 0.025);
`

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  padding: 20px 22px;
  border-bottom: 1px solid #edf0f6;
`

const PanelTitle = styled.h2`
  margin: 0;
  color: #202b45;
  font-size: 15px;
  font-weight: 750;
`

const PanelSubtitle = styled.p`
  margin: 5px 0 0;
  color: #7b859a;
  font-size: 11px;
  line-height: 1.6;
`

const PrimaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 39px;
  padding: 10px 14px;
  border: 1px solid var(--primary, #5b5cf0);
  border-radius: 10px;
  background: var(--primary, #5b5cf0);
  color: #fff;
  font: inherit;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: background 160ms ease, transform 160ms ease;

  &:hover {
    background: var(--primary-hover, #4647d9);
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 2px solid #b8bbff;
    outline-offset: 2px;
  }
`

const SecondaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  min-height: 36px;
  padding: 8px 12px;
  border: 1px solid #dfe4f0;
  border-radius: 9px;
  background: #fff;
  color: #45516b;
  font: inherit;
  font-size: 11px;
  font-weight: 650;
  cursor: pointer;

  &:hover {
    border-color: #c4c8ff;
    background: #f7f7ff;
  }
`

const DangerButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 32px;
  padding: 6px 9px;
  border: 1px solid #f6d8dc;
  border-radius: 8px;
  background: #fff7f8;
  color: #c83e55;
  font: inherit;
  font-size: 11px;
  font-weight: 650;
  cursor: pointer;

  &:hover {
    background: #ffecef;
    border-color: #efb9c2;
  }
`

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  padding: 16px 18px;
  border-bottom: 1px solid #edf0f6;
`

const SearchWrap = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1 1 240px;
  min-height: 40px;
  padding: 0 12px;
  border: 1px solid #e0e5f0;
  border-radius: 10px;
  background: #fff;
  color: #7c879c;

  &:focus-within {
    border-color: #a9abff;
    box-shadow: 0 0 0 3px rgba(91, 92, 240, 0.08);
  }
`

const SearchInput = styled.input`
  width: 100%;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  color: #24304a;
  font: inherit;
  font-size: 12px;

  &::placeholder {
    color: #9aa3b5;
  }
`

const FilterSelect = styled.select`
  min-height: 40px;
  max-width: 100%;
  padding: 0 12px;
  border: 1px solid #e0e5f0;
  border-radius: 10px;
  background: #fff;
  color: #4b5770;
  font: inherit;
  font-size: 12px;
`

const TableScroll = styled.div`
  width: 100%;
  overflow-x: auto;
`

const ProductTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  white-space: nowrap;

  th {
    padding: 13px 16px;
    background: #fafbfe;
    color: #7e899e;
    font-size: 10px;
    font-weight: 750;
    letter-spacing: 0.55px;
    text-align: left;
    text-transform: uppercase;
  }

  td {
    padding: 14px 16px;
    border-top: 1px solid #edf0f6;
    color: #46516a;
    font-size: 12px;
    vertical-align: middle;
  }

  tbody tr:hover {
    background: #fcfcff;
  }
`

const ProductCell = styled.div`
  display: flex;
  align-items: center;
  gap: 11px;
  min-width: 215px;
`

const ProductIcon = styled.span`
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  flex: 0 0 auto;
  border: 1px solid ${({ $category }) => ({
    Електроніка: '#d9e8ff',
    Аксесуари: '#d8f3e4',
    'Для дому': '#ffe8d3',
    Одяг: '#f2dcff',
  }[$category] || '#e6e7ff')};
  border-radius: 12px;
  background: ${({ $category }) => ({
    Електроніка: '#edf5ff',
    Аксесуари: '#eafaf1',
    'Для дому': '#fff5e9',
    Одяг: '#f9efff',
  }[$category] || '#f0f0ff')};
  font-size: 21px;
`

const ProductName = styled.div`
  color: #26314a;
  font-size: 12px;
  font-weight: 750;
  white-space: normal;
`

const ProductDescription = styled.div`
  max-width: 270px;
  margin-top: 4px;
  color: #8a94a7;
  font-size: 10px;
  line-height: 1.5;
  white-space: normal;
`

const Sku = styled.span`
  color: #7e88a0;
  font-size: 11px;
  font-weight: 650;
  letter-spacing: 0.2px;
`

const CategoryBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 6px 9px;
  border-radius: 999px;
  background: #f0f1ff;
  color: #5556ce;
  font-size: 10px;
  font-weight: 700;
`

const StockBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 9px;
  border-radius: 999px;
  background: ${({ $low }) => ($low ? '#fff3e7' : '#eaf8f0')};
  color: ${({ $low }) => ($low ? '#b86a17' : '#238455')};
  font-size: 10px;
  font-weight: 750;
`

const ActionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
`

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 15px;
  padding: 18px;

  @media (max-width: 1150px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 650px) {
    grid-template-columns: minmax(0, 1fr);
    padding: 12px;
  }
`

const ProductCard = styled.article`
  min-width: 0;
  padding: 17px;
  border: 1px solid #e7eaf2;
  border-radius: 14px;
  background: #fff;
  transition: border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease;

  &:hover {
    border-color: #cfd0ff;
    box-shadow: 0 8px 24px rgba(47, 53, 130, 0.07);
    transform: translateY(-2px);
  }
`

const ProductCardTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 14px;
`

const ProductCardPrice = styled.p`
  margin: 16px 0 7px;
  color: #242f4a;
  font-size: 21px;
  font-weight: 800;
  letter-spacing: -0.6px;
`

const ProductCardMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 9px;
  padding-top: 12px;
  border-top: 1px solid #edf0f6;
  color: #7a859b;
  font-size: 11px;
`

const FormPanel = styled.div`
  margin: 16px 18px 0;
  padding: 20px;
  border: 1px solid #dfe2ff;
  border-radius: 14px;
  background: #fbfbff;

  @media (max-width: 650px) {
    margin: 12px;
    padding: 15px;
  }
`

const FormHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
`

const FormTitle = styled.h3`
  margin: 0;
  color: #26314a;
  font-size: 14px;
`

const FormHint = styled.p`
  margin: 6px 0 0;
  color: #78839a;
  font-size: 11px;
  line-height: 1.6;
`

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 600px) {
    grid-template-columns: minmax(0, 1fr);
  }
`

const Field = styled.div`
  min-width: 0;
  display: grid;
  gap: 7px;
`

const FullWidthField = styled(Field)`
  grid-column: 1 / -1;
`

const FieldLabel = styled.label`
  color: #515d76;
  font-size: 11px;
  font-weight: 700;
`

const TextInput = styled.input`
  width: 100%;
  min-height: 41px;
  padding: 10px 12px;
  border: 1px solid #dfe4f0;
  border-radius: 9px;
  background: #fff;
  color: #25304a;
  font: inherit;
  font-size: 12px;

  &:focus {
    outline: none;
    border-color: #a4a6ff;
    box-shadow: 0 0 0 3px rgba(91, 92, 240, 0.08);
  }
`

const TextArea = styled.textarea`
  width: 100%;
  min-height: 78px;
  padding: 10px 12px;
  resize: vertical;
  border: 1px solid #dfe4f0;
  border-radius: 9px;
  background: #fff;
  color: #25304a;
  font: inherit;
  font-size: 12px;

  &:focus {
    outline: none;
    border-color: #a4a6ff;
    box-shadow: 0 0 0 3px rgba(91, 92, 240, 0.08);
  }
`

const FormActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 9px;
  margin-top: 17px;
`

const Feedback = styled.p`
  margin: 16px 18px 0;
  padding: 11px 13px;
  border: 1px solid ${({ $type }) => ($type === 'error' ? '#f4cbd1' : '#cdeedb')};
  border-radius: 10px;
  background: ${({ $type }) => ($type === 'error' ? '#fff5f6' : '#f0fbf5')};
  color: ${({ $type }) => ($type === 'error' ? '#b82f49' : '#207c4e')};
  font-size: 12px;
  line-height: 1.6;
`

const EmptyState = styled.div`
  display: grid;
  justify-items: center;
  gap: 9px;
  padding: 44px 20px;
  text-align: center;

  strong {
    color: #3d4962;
    font-size: 14px;
  }

  p {
    max-width: 360px;
    margin: 0;
    color: #7f899d;
    font-size: 12px;
    line-height: 1.7;
  }
`

const EmptySymbol = styled.span`
  display: grid;
  place-items: center;
  width: 47px;
  height: 47px;
  border-radius: 15px;
  background: #f0f1ff;
  color: var(--primary, #5b5cf0);
  font-size: 23px;
`

const QuickActions = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
`

const SimpleRows = styled.div`
  padding: 3px 20px 8px;
`

const SimpleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 13px 0;
  border-bottom: 1px solid #edf0f6;

  &:last-child {
    border-bottom: none;
  }
`

const SimpleRowText = styled.div`
  min-width: 0;

  strong {
    display: block;
    overflow: hidden;
    color: #34405a;
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  span {
    display: block;
    margin-top: 4px;
    color: #8a94a7;
    font-size: 10px;
  }
`

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 10px;
  border-radius: 999px;
  background: ${({ $status }) => ORDER_STATUSES[$status]?.background || '#f0f1f5'};
  color: ${({ $status }) => ORDER_STATUSES[$status]?.color || '#4b5563'};
  font-size: 11px;
  font-weight: 750;
  white-space: nowrap;
`

const OrderMeta = styled.div`
  display: grid;
  gap: 5px;
  min-width: 0;

  strong {
    color: #28334d;
    font-size: 12px;
  }

  span {
    color: #858fa3;
    font-size: 10px;
    line-height: 1.5;
  }
`

const RoleBadge = styled.span`
  display: inline-flex;
  padding: 6px 9px;
  border-radius: 999px;
  background: ${({ $role }) => $role === 'ADMIN' ? '#efefff' : '#e8f7ef'};
  color: ${({ $role }) => $role === 'ADMIN' ? '#5655c8' : '#24794d'};
  font-size: 10px;
  font-weight: 750;
`

const InlineTotal = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 15px;
  padding: 13px 15px;
  border-radius: 11px;
  background: #f0f1ff;
  color: #4d50bd;

  span {
    font-size: 12px;
    font-weight: 650;
  }

  strong {
    font-size: 18px;
    font-weight: 800;
  }
`

const UserNameCell = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  > span:first-child {
    display: grid;
    place-items: center;
    width: 35px;
    height: 35px;
    border-radius: 11px;
    background: #f0eaff;
    font-size: 17px;
  }

  strong {
    display: block;
    color: #28334d;
    font-size: 12px;
  }

  small {
    display: block;
    margin-top: 4px;
    color: #8992a5;
    font-size: 10px;
  }
`

const StatusSelect = styled.select`
  min-height: 34px;
  max-width: 160px;
  padding: 6px 9px;
  border: 1px solid #dfe4f0;
  border-radius: 9px;
  background: #fff;
  color: #47516b;
  font: inherit;
  font-size: 11px;
`

const navigationItems = [
  { id: 'overview', label: 'Огляд', icon: '📊', tone: '#ecebff' },
  { id: 'products', label: 'Товари', icon: '📦', tone: '#e4f7eb' },
  { id: 'orders', label: 'Замовлення', icon: '🧾', tone: '#fff0dc' },
  { id: 'users', label: 'Користувачі', icon: '👥', tone: '#f2e7ff', adminOnly: true },
]

const SECTION_CONTENT = {
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

function Workspace() {
  const [activeSection, setActiveSection] = useState('overview')
  const [role, setRole] = useState('ADMIN')
  const [products, setProducts] = useState(loadProducts)
  const [orders, setOrders] = useState(loadOrders)
  const [users, setUsers] = useState(loadUsers)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProductId, setEditingProductId] = useState(null)
  const [productForm, setProductForm] = useState({ ...EMPTY_PRODUCT_FORM })
  const [feedback, setFeedback] = useState(null)
  const [orderSearch, setOrderSearch] = useState('')
  const [orderStatusFilter, setOrderStatusFilter] = useState('all')
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [orderForm, setOrderForm] = useState({ ...EMPTY_ORDER_FORM, productId: INITIAL_PRODUCTS[0]?.id || '' })
  const [userSearch, setUserSearch] = useState('')
  const [userRoleFilter, setUserRoleFilter] = useState('all')
  const [showUserForm, setShowUserForm] = useState(false)
  const [editingUserId, setEditingUserId] = useState(null)
  const [userForm, setUserForm] = useState({ ...EMPTY_USER_FORM })

  useEffect(() => {
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products))
    } catch {
      // Дані залишаються в стані React, якщо localStorage недоступний.
    }
  }, [products])

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders))
    } catch {
      // Стан застосунку продовжує працювати без локального сховища.
    }
  }, [orders])

  useEffect(() => {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
    } catch {
      // Стан застосунку продовжує працювати без локального сховища.
    }
  }, [users])

  const visibleNavigation = navigationItems.filter(
    (item) => !item.adminOnly || role === 'ADMIN',
  )

  const currentSection = SECTION_CONTENT[activeSection]
  const categories = [...new Set(products.map((product) => product.category))].sort()
  const totalStock = products.reduce((sum, product) => sum + Number(product.stock || 0), 0)
  const lowStockCount = products.filter((product) => Number(product.stock) < 10).length

  const normalizedSearch = search.trim().toLowerCase()
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(normalizedSearch) ||
      product.sku.toLowerCase().includes(normalizedSearch) ||
      product.description.toLowerCase().includes(normalizedSearch)
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  const visibleOrders = orders
    .filter((order) => role === 'ADMIN' || order.createdBy === DEMO_DROPSHIPPER_ID)
    .filter((order) => orderStatusFilter === 'all' || order.status === orderStatusFilter)
    .filter((order) => {
      const query = orderSearch.trim().toLowerCase()
      if (!query) return true
      return (
        order.id.toLowerCase().includes(query) ||
        order.customerName.toLowerCase().includes(query) ||
        order.customerPhone.toLowerCase().includes(query) ||
        order.items.some((item) => item.productName.toLowerCase().includes(query) || item.sku.toLowerCase().includes(query))
      )
    })

  const orderTotals = {
    total: orders.filter((order) => role === 'ADMIN' || order.createdBy === DEMO_DROPSHIPPER_ID).length,
    new: orders.filter((order) => (role === 'ADMIN' || order.createdBy === DEMO_DROPSHIPPER_ID) && order.status === 'NEW').length,
    processing: orders.filter((order) => (role === 'ADMIN' || order.createdBy === DEMO_DROPSHIPPER_ID) && order.status === 'PROCESSING').length,
    completed: orders.filter((order) => (role === 'ADMIN' || order.createdBy === DEMO_DROPSHIPPER_ID) && order.status === 'COMPLETED').length,
  }

  const selectedOrderProduct = products.find((product) => product.id === orderForm.productId)
  const orderFormTotal = selectedOrderProduct
    ? selectedOrderProduct.price * Math.max(0, Number(orderForm.quantity) || 0)
    : 0

  const filteredUsers = users
    .filter((user) => userRoleFilter === 'all' || user.role === userRoleFilter)
    .filter((user) => {
      const query = userSearch.trim().toLowerCase()
      return !query || user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query)
    })

  function resetProductForm() {
    setProductForm({ ...EMPTY_PRODUCT_FORM })
    setEditingProductId(null)
    setShowProductForm(false)
  }

  function openNewProductForm() {
    setActiveSection('products')
    setProductForm({ ...EMPTY_PRODUCT_FORM })
    setEditingProductId(null)
    setFeedback(null)
    setShowProductForm(true)
  }

  function openEditProductForm(product) {
    setProductForm({
      name: product.name,
      sku: product.sku,
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
      description: product.description || '',
    })
    setEditingProductId(product.id)
    setFeedback(null)
    setShowProductForm(true)
  }

  function handleProductFormChange(event) {
    const { name, value } = event.target
    setProductForm((current) => ({ ...current, [name]: value }))
  }

  function handleProductSubmit(event) {
    event.preventDefault()

    const name = productForm.name.trim()
    const sku = productForm.sku.trim().toUpperCase()
    const category = productForm.category
    const description = productForm.description.trim()
    const price = Number(productForm.price)
    const stock = Number(productForm.stock)

    if (!name || !sku || !category) {
      setFeedback({ type: 'error', text: 'Заповни назву товару, артикул і категорію.' })
      return
    }

    if (productForm.price === '' || !Number.isFinite(price) || price < 0) {
      setFeedback({ type: 'error', text: 'Ціна має бути числом, що дорівнює нулю або більше.' })
      return
    }

    if (productForm.stock === '' || !Number.isInteger(stock) || stock < 0) {
      setFeedback({ type: 'error', text: 'Залишок має бути цілим невід’ємним числом.' })
      return
    }

    const skuExists = products.some(
      (product) => product.sku.toLowerCase() === sku.toLowerCase() && product.id !== editingProductId,
    )

    if (skuExists) {
      setFeedback({ type: 'error', text: 'Товар з таким артикулом уже існує в цій компанії.' })
      return
    }

    if (editingProductId) {
      setProducts((current) =>
        current.map((product) =>
          product.id === editingProductId
            ? { ...product, name, sku, category, description, price, stock }
            : product,
        ),
      )
      resetProductForm()
      setFeedback({ type: 'success', text: 'Дані товару оновлено.' })
      return
    }

    const newProduct = {
      id: `prod-${Date.now()}`,
      companyId: DEMO_COMPANY_ID,
      name,
      sku,
      category,
      description,
      price,
      stock,
    }

    setProducts((current) => [newProduct, ...current])
    resetProductForm()
    setFeedback({ type: 'success', text: 'Товар додано до каталогу.' })
  }

  function handleDeleteProduct(product) {
    const hasOpenOrder = orders.some(
      (order) => order.stockDeducted && ['NEW', 'PROCESSING'].includes(order.status) && order.items.some((item) => item.productId === product.id),
    )

    if (hasOpenOrder) {
      setFeedback({ type: 'error', text: 'Товар є в активному замовленні. Спершу заверши або скасуй це замовлення.' })
      return
    }

    const confirmed = window.confirm(`Видалити товар «${product.name}»?`)

    if (!confirmed) {
      return
    }

    setProducts((current) => current.filter((item) => item.id !== product.id))
    setFeedback({ type: 'success', text: `Товар «${product.name}» видалено.` })

    if (editingProductId === product.id) {
      resetProductForm()
    }
  }

  function openOrderForm() {
    const firstAvailableProduct = products.find((product) => Number(product.stock) > 0)
    setActiveSection('orders')
    setOrderForm({
      ...EMPTY_ORDER_FORM,
      productId: firstAvailableProduct?.id || '',
      quantity: '1',
    })
    setShowOrderForm(true)
    setFeedback(null)
  }

  function resetOrderForm() {
    setOrderForm({ ...EMPTY_ORDER_FORM, productId: products.find((product) => Number(product.stock) > 0)?.id || '' })
    setShowOrderForm(false)
  }

  function handleOrderFormChange(event) {
    const { name, value } = event.target
    setOrderForm((current) => ({ ...current, [name]: value }))
  }

  function handleOrderSubmit(event) {
    event.preventDefault()

    const customerName = orderForm.customerName.trim()
    const customerPhone = orderForm.customerPhone.trim()
    const quantity = Number(orderForm.quantity)
    const product = products.find((item) => item.id === orderForm.productId)

    if (!customerName || !customerPhone || !orderForm.productId) {
      setFeedback({ type: 'error', text: 'Заповни ім’я клієнта, телефон і вибери товар.' })
      return
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      setFeedback({ type: 'error', text: 'Кількість має бути цілим числом від 1.' })
      return
    }

    if (!product || Number(product.stock) < quantity) {
      setFeedback({ type: 'error', text: 'Недостатньо товару на складі для цієї кількості.' })
      return
    }

    const demoUser = users.find((user) => user.id === DEMO_DROPSHIPPER_ID)
    const newOrder = {
      id: `ORD-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
      companyId: DEMO_COMPANY_ID,
      createdBy: DEMO_DROPSHIPPER_ID,
      createdByName: demoUser?.name || 'Дропшипер',
      customerName,
      customerPhone,
      items: [{
        productId: product.id,
        sku: product.sku,
        productName: product.name,
        quantity,
        unitPrice: Number(product.price),
      }],
      total: Number(product.price) * quantity,
      status: 'NEW',
      createdAt: new Date().toISOString(),
      stockDeducted: true,
    }

    setOrders((current) => [newOrder, ...current])
    setProducts((current) => current.map((item) =>
      item.id === product.id ? { ...item, stock: Number(item.stock) - quantity } : item,
    ))
    setOrderStatusFilter('all')
    setOrderSearch('')
    resetOrderForm()
    setFeedback({ type: 'success', text: `Замовлення ${newOrder.id} створено.` })
  }

  function handleOrderStatusChange(orderId, nextStatus) {
    if (role !== 'ADMIN') return

    const order = orders.find((item) => item.id === orderId)
    if (!order || !ALLOWED_ORDER_TRANSITIONS[order.status]?.includes(nextStatus)) return

    if (nextStatus === 'CANCELLED' && order.stockDeducted) {
      setProducts((current) => current.map((product) => {
        const item = order.items.find((orderItem) => orderItem.productId === product.id)
        return item ? { ...product, stock: Number(product.stock) + item.quantity } : product
      }))
    }

    setOrders((current) => current.map((item) => item.id === orderId
      ? { ...item, status: nextStatus, stockDeducted: nextStatus === 'CANCELLED' ? false : item.stockDeducted }
      : item,
    ))
    setFeedback({ type: 'success', text: `Статус замовлення ${orderId} змінено: ${getOrderStatusLabel(nextStatus).toLowerCase()}.` })
  }

  function openNewUserForm() {
    setActiveSection('users')
    setUserForm({ ...EMPTY_USER_FORM })
    setEditingUserId(null)
    setShowUserForm(true)
    setFeedback(null)
  }

  function openEditUserForm(user) {
    setUserForm({ name: user.name, email: user.email, role: user.role })
    setEditingUserId(user.id)
    setShowUserForm(true)
    setFeedback(null)
  }

  function resetUserForm() {
    setUserForm({ ...EMPTY_USER_FORM })
    setEditingUserId(null)
    setShowUserForm(false)
  }

  function handleUserFormChange(event) {
    const { name, value } = event.target
    setUserForm((current) => ({ ...current, [name]: value }))
  }

  function handleUserSubmit(event) {
    event.preventDefault()
    const name = userForm.name.trim()
    const email = userForm.email.trim().toLowerCase()

    if (!name || !email || !email.includes('@')) {
      setFeedback({ type: 'error', text: 'Вкажи ім’я користувача та коректну електронну адресу.' })
      return
    }

    const duplicateEmail = users.some((user) => user.email.toLowerCase() === email && user.id !== editingUserId)
    if (duplicateEmail) {
      setFeedback({ type: 'error', text: 'Користувач із такою електронною адресою вже існує.' })
      return
    }

    if (editingUserId) {
      const userBeingEdited = users.find((user) => user.id === editingUserId)
      const adminCount = users.filter((user) => user.role === 'ADMIN').length
      if (userBeingEdited?.role === 'ADMIN' && userForm.role !== 'ADMIN' && adminCount <= 1) {
        setFeedback({ type: 'error', text: 'У компанії має залишитися щонайменше один адміністратор.' })
        return
      }

      setUsers((current) => current.map((user) => user.id === editingUserId
        ? { ...user, name, email, role: userForm.role }
        : user,
      ))
      if (editingUserId === DEMO_DROPSHIPPER_ID) {
        setOrders((current) => current.map((order) => order.createdBy === DEMO_DROPSHIPPER_ID
          ? { ...order, createdByName: name }
          : order,
        ))
      }
      resetUserForm()
      setFeedback({ type: 'success', text: 'Дані користувача оновлено.' })
      return
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      role: userForm.role,
      companyId: DEMO_COMPANY_ID,
      companyName: 'DM Company',
    }
    setUsers((current) => [newUser, ...current])
    resetUserForm()
    setFeedback({ type: 'success', text: 'Користувача додано.' })
  }

  function handleDeleteUser(user) {
    if (user.role === 'ADMIN' && users.filter((item) => item.role === 'ADMIN').length <= 1) {
      setFeedback({ type: 'error', text: 'У компанії має залишитися щонайменше один адміністратор.' })
      return
    }

    if (user.id === DEMO_DROPSHIPPER_ID) {
      setFeedback({ type: 'error', text: 'Цей профіль потрібний для перевірки сценарію дропшипера.' })
      return
    }

    const hasOrders = orders.some((order) => order.createdBy === user.id)
    if (hasOrders) {
      setFeedback({ type: 'error', text: 'Не можна видалити користувача, за яким збережено замовлення.' })
      return
    }

    if (!window.confirm(`Видалити користувача «${user.name}»?`)) return

    setUsers((current) => current.filter((item) => item.id !== user.id))
    if (editingUserId === user.id) resetUserForm()
    setFeedback({ type: 'success', text: `Користувача «${user.name}» видалено.` })
  }

  function handleRoleChange(event) {
    const nextRole = event.target.value
    setRole(nextRole)
    setShowProductForm(false)
    setShowOrderForm(false)
    setShowUserForm(false)
    setFeedback(null)

    if (nextRole !== 'ADMIN' && activeSection === 'users') {
      setActiveSection('orders')
      setShowUserForm(false)
    }

    setFeedback(null)
  }

  function openProducts() {
    setActiveSection('products')
    setFeedback(null)
  }

  return (
    <Page>
      <Sidebar>
        <Brand to="/" aria-label="DM System — на головну">
          <BrandLogo src={cubeLogo} alt="" />
          <span>
            DM <strong>System</strong>
          </span>
        </Brand>

        <SidebarCaption>РОБОЧИЙ ПРОСТІР</SidebarCaption>

        <Navigation aria-label="Навігація робочого простору">
          {visibleNavigation.map((item) => (
            <NavigationButton
              key={item.id}
              type="button"
              $active={activeSection === item.id}
              onClick={() => {
                setActiveSection(item.id)
                setFeedback(null)
              }}
            >
              <NavigationMark $active={activeSection === item.id} $tone={item.tone}>{item.icon}</NavigationMark>
              {item.label}
            </NavigationButton>
          ))}
        </Navigation>

      </Sidebar>

      <Main>
        <Topbar>
          <BackLink to="/">← Повернутися на головну</BackLink>
          <TopbarRight>
            <RoleSelect
              aria-label="Роль інтерфейсу"
              value={role}
              onChange={handleRoleChange}
            >
              <option value="ADMIN">Адміністратор</option>
              <option value="DROPSHIPPER">Дропшипер</option>
            </RoleSelect>
          </TopbarRight>
        </Topbar>

        <PageIntro>
          <IntroText>
            <Eyebrow>{currentSection.eyebrow}</Eyebrow>
            <PageTitle>{currentSection.title}</PageTitle>
            <PageDescription>{currentSection.description}</PageDescription>
          </IntroText>

          {activeSection === 'products' && role === 'ADMIN' && (
            <PrimaryButton type="button" onClick={openNewProductForm}>
              <span aria-hidden="true">➕</span> Додати товар
            </PrimaryButton>
          )}

          {activeSection === 'orders' && role === 'DROPSHIPPER' && (
            <PrimaryButton type="button" onClick={openOrderForm}>
              ➕ Нове замовлення
            </PrimaryButton>
          )}

          {activeSection === 'users' && role === 'ADMIN' && (
            <PrimaryButton type="button" onClick={openNewUserForm}>
              ➕ Додати користувача
            </PrimaryButton>
          )}
        </PageIntro>

        {activeSection === 'overview' && (
          <Section>
            <StatsGrid>
              <StatCard>
                <StatTop>
                  <StatLabel>Товарів у каталозі</StatLabel>
                  <StatIcon $tone="#e4f7eb">📦</StatIcon>
                </StatTop>
                <StatValue>{products.length}</StatValue>
              </StatCard>
              <StatCard>
                <StatTop>
                  <StatLabel>Одиниць на складі</StatLabel>
                  <StatIcon $tone="#e7f1ff">🏬</StatIcon>
                </StatTop>
                <StatValue>{totalStock}</StatValue>
              </StatCard>
              <StatCard>
                <StatTop>
                  <StatLabel>Малий залишок (менше 10)</StatLabel>
                  <StatIcon $tone="#fff0dc">⚠️</StatIcon>
                </StatTop>
                <StatValue>{lowStockCount}</StatValue>
              </StatCard>
              <StatCard>
                <StatTop>
                  <StatLabel>Категорій у каталозі</StatLabel>
                  <StatIcon $tone="#f2e7ff">🏷️</StatIcon>
                </StatTop>
                <StatValue>{categories.length}</StatValue>
              </StatCard>
            </StatsGrid>

            <Panel>
              <PanelHeader>
                <div>
                  <PanelTitle>Товари в каталозі</PanelTitle>
                  <PanelSubtitle>Актуальний перелік товарів.</PanelSubtitle>
                </div>
                <SecondaryButton type="button" onClick={openProducts}>
                  Відкрити каталог →
                </SecondaryButton>
              </PanelHeader>
              {products.length === 0 ? (
                <EmptyState>
                  <EmptySymbol>📦</EmptySymbol>
                  <strong>Каталог поки порожній</strong>
                  <p>Додай перший товар, щоб він відображався в цьому огляді.</p>
                </EmptyState>
              ) : (
                <SimpleRows>
                  {products.slice(0, 4).map((product) => (
                    <SimpleRow key={product.id}>
                      <ProductCell>
                        <ProductIcon $category={product.category}>{getCategorySymbol(product.category)}</ProductIcon>
                        <SimpleRowText>
                          <strong>{product.name}</strong>
                          <span>{product.sku} · {product.category}</span>
                        </SimpleRowText>
                      </ProductCell>
                      <SimpleRowText>
                        <strong>{formatPrice(product.price)}</strong>
                        <span>Залишок: {product.stock}</span>
                      </SimpleRowText>
                    </SimpleRow>
                  ))}
                </SimpleRows>
              )}
            </Panel>

            <QuickActions>
              {role === 'ADMIN' && (
                <PrimaryButton type="button" onClick={openNewProductForm}>
                  ➕ Додати товар
                </PrimaryButton>
              )}
              <SecondaryButton type="button" onClick={openProducts}>
                Переглянути всі товари
              </SecondaryButton>
            </QuickActions>
          </Section>
        )}

        {activeSection === 'products' && (
          <Section>
            <Panel>
              <Toolbar>
                <SearchWrap>
                  <span aria-hidden="true">🔎</span>
                  <SearchInput
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Пошук за назвою, артикулом або описом..."
                    aria-label="Пошук товарів"
                  />
                </SearchWrap>

                <FilterSelect
                  value={categoryFilter}
                  onChange={(event) => setCategoryFilter(event.target.value)}
                  aria-label="Фільтр за категорією"
                >
                  <option value="all">Усі категорії</option>
                  {categories.map((category) => (
                    <option value={category} key={category}>{category}</option>
                  ))}
                </FilterSelect>
              </Toolbar>

              {feedback && (
                <Feedback $type={feedback.type} role="status">
                  {feedback.text}
                </Feedback>
              )}

              {showProductForm && role === 'ADMIN' && (
                <FormPanel>
                  <FormHeader>
                    <div>
                      <FormTitle>{editingProductId ? 'Редагування товару' : 'Новий товар'}</FormTitle>
                      <FormHint>Заповни дані каталогу. Артикул має бути унікальним у межах компанії.</FormHint>
                    </div>
                    <SecondaryButton type="button" onClick={resetProductForm}>
                      Закрити
                    </SecondaryButton>
                  </FormHeader>

                  <form onSubmit={handleProductSubmit}>
                    <FormGrid>
                      <Field>
                        <FieldLabel htmlFor="product-name">Назва товару *</FieldLabel>
                        <TextInput
                          id="product-name"
                          name="name"
                          value={productForm.name}
                          onChange={handleProductFormChange}
                          placeholder="Наприклад, бездротові навушники"
                        />
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="product-sku">Артикул (SKU) *</FieldLabel>
                        <TextInput
                          id="product-sku"
                          name="sku"
                          value={productForm.sku}
                          onChange={handleProductFormChange}
                          placeholder="DM-1005"
                        />
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="product-category">Категорія *</FieldLabel>
                        <FilterSelect
                          id="product-category"
                          name="category"
                          value={productForm.category}
                          onChange={handleProductFormChange}
                        >
                          {PRODUCT_CATEGORIES.map((category) => (
                            <option value={category} key={category}>{category}</option>
                          ))}
                        </FilterSelect>
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="product-price">Ціна, грн *</FieldLabel>
                        <TextInput
                          id="product-price"
                          name="price"
                          type="number"
                          min="0"
                          step="0.01"
                          value={productForm.price}
                          onChange={handleProductFormChange}
                          placeholder="1299"
                        />
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="product-stock">Залишок на складі *</FieldLabel>
                        <TextInput
                          id="product-stock"
                          name="stock"
                          type="number"
                          min="0"
                          step="1"
                          value={productForm.stock}
                          onChange={handleProductFormChange}
                          placeholder="25"
                        />
                      </Field>

                      <FullWidthField>
                        <FieldLabel htmlFor="product-description">Опис товару</FieldLabel>
                        <TextArea
                          id="product-description"
                          name="description"
                          value={productForm.description}
                          onChange={handleProductFormChange}
                          placeholder="Коротко опиши товар та його особливості"
                        />
                      </FullWidthField>
                    </FormGrid>

                    <FormActions>
                      <SecondaryButton type="button" onClick={resetProductForm}>
                        Скасувати
                      </SecondaryButton>
                      <PrimaryButton type="submit">
                        {editingProductId ? 'Зберегти зміни' : 'Додати до каталогу'}
                      </PrimaryButton>
                    </FormActions>
                  </form>
                </FormPanel>
              )}

              {filteredProducts.length === 0 ? (
                <EmptyState>
                  <EmptySymbol>🔎</EmptySymbol>
                  <strong>Товарів не знайдено</strong>
                  <p>Зміни пошуковий запит або вибери іншу категорію.</p>
                  {search || categoryFilter !== 'all' ? (
                    <SecondaryButton
                      type="button"
                      onClick={() => {
                        setSearch('')
                        setCategoryFilter('all')
                      }}
                    >
                      Скинути фільтри
                    </SecondaryButton>
                  ) : null}
                </EmptyState>
              ) : role === 'ADMIN' ? (
                <TableScroll>
                  <ProductTable>
                    <thead>
                      <tr>
                        <th>Товар</th>
                        <th>Артикул</th>
                        <th>Категорія</th>
                        <th>Ціна</th>
                        <th>Залишок</th>
                        <th>Дії</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product) => (
                        <tr key={product.id}>
                          <td>
                            <ProductCell>
                              <ProductIcon $category={product.category}>{getCategorySymbol(product.category)}</ProductIcon>
                              <div>
                                <ProductName>{product.name}</ProductName>
                                <ProductDescription>{product.description || 'Опис не додано'}</ProductDescription>
                              </div>
                            </ProductCell>
                          </td>
                          <td><Sku>{product.sku}</Sku></td>
                          <td><CategoryBadge>{product.category}</CategoryBadge></td>
                          <td><strong>{formatPrice(product.price)}</strong></td>
                          <td>
                            <StockBadge $low={Number(product.stock) < 10}>
                              {product.stock} шт.
                            </StockBadge>
                          </td>
                          <td>
                            <ActionGroup>
                              <SecondaryButton type="button" onClick={() => openEditProductForm(product)}>
                                ✏️ Редагувати
                              </SecondaryButton>
                              <DangerButton type="button" onClick={() => handleDeleteProduct(product)}>
                                🗑️ Видалити
                              </DangerButton>
                            </ActionGroup>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </ProductTable>
                </TableScroll>
              ) : (
                <ProductsGrid>
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id}>
                      <ProductCardTop>
                        <ProductIcon $category={product.category}>{getCategorySymbol(product.category)}</ProductIcon>
                        <CategoryBadge>{product.category}</CategoryBadge>
                      </ProductCardTop>
                      <ProductName>{product.name}</ProductName>
                      <ProductDescription>{product.description || 'Опис не додано'}</ProductDescription>
                      <ProductCardPrice>{formatPrice(product.price)}</ProductCardPrice>
                      <ProductCardMeta>
                        <Sku>{product.sku}</Sku>
                        <StockBadge $low={Number(product.stock) < 10}>
                          {Number(product.stock) > 0 ? `${product.stock} шт. в наявності` : 'Немає в наявності'}
                        </StockBadge>
                      </ProductCardMeta>
                    </ProductCard>
                  ))}
                </ProductsGrid>
              )}

            </Panel>
          </Section>
        )}

        {activeSection === 'orders' && (
          <Section>
            <StatsGrid>
              <StatCard>
                <StatTop><StatLabel>Усього замовлень</StatLabel><StatIcon $tone="#e7f1ff">🧾</StatIcon></StatTop>
                <StatValue>{orderTotals.total}</StatValue>
              </StatCard>
              <StatCard>
                <StatTop><StatLabel>Нові</StatLabel><StatIcon $tone="#ecebff">🆕</StatIcon></StatTop>
                <StatValue>{orderTotals.new}</StatValue>
              </StatCard>
              <StatCard>
                <StatTop><StatLabel>В обробці</StatLabel><StatIcon $tone="#fff0dc">⚙️</StatIcon></StatTop>
                <StatValue>{orderTotals.processing}</StatValue>
              </StatCard>
              <StatCard>
                <StatTop><StatLabel>Виконані</StatLabel><StatIcon $tone="#e4f7eb">✅</StatIcon></StatTop>
                <StatValue>{orderTotals.completed}</StatValue>
              </StatCard>
            </StatsGrid>

            <Panel>
              <PanelHeader>
                <div>
                  <PanelTitle>{role === 'ADMIN' ? 'Усі замовлення' : 'Мої замовлення'}</PanelTitle>
                  <PanelSubtitle>{role === 'ADMIN' ? 'Перегляд замовлень компанії та керування їхніми статусами.' : 'Перегляд і створення власних замовлень.'}</PanelSubtitle>
                </div>
              </PanelHeader>

              <Toolbar>
                <SearchWrap>
                  <span aria-hidden="true">🔎</span>
                  <SearchInput
                    type="search"
                    value={orderSearch}
                    onChange={(event) => setOrderSearch(event.target.value)}
                    placeholder="Пошук за номером, клієнтом або товаром..."
                    aria-label="Пошук замовлень"
                  />
                </SearchWrap>
                <FilterSelect
                  value={orderStatusFilter}
                  onChange={(event) => setOrderStatusFilter(event.target.value)}
                  aria-label="Фільтр за статусом замовлення"
                >
                  <option value="all">Усі статуси</option>
                  {Object.entries(ORDER_STATUSES).map(([status, meta]) => (
                    <option value={status} key={status}>{meta.label}</option>
                  ))}
                </FilterSelect>
              </Toolbar>

              {feedback && <Feedback $type={feedback.type} role="status">{feedback.text}</Feedback>}

              {showOrderForm && role === 'DROPSHIPPER' && (
                <FormPanel>
                  <FormHeader>
                    <div>
                      <FormTitle>Нове замовлення</FormTitle>
                      <FormHint>Вкажи дані клієнта, товар і кількість.</FormHint>
                    </div>
                    <SecondaryButton type="button" onClick={resetOrderForm}>Закрити</SecondaryButton>
                  </FormHeader>
                  <form onSubmit={handleOrderSubmit}>
                    <FormGrid>
                      <Field>
                        <FieldLabel htmlFor="order-customer-name">Ім’я клієнта *</FieldLabel>
                        <TextInput id="order-customer-name" name="customerName" value={orderForm.customerName} onChange={handleOrderFormChange} placeholder="Наприклад, Марія Сидоренко" required />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="order-customer-phone">Телефон клієнта *</FieldLabel>
                        <TextInput id="order-customer-phone" name="customerPhone" type="tel" value={orderForm.customerPhone} onChange={handleOrderFormChange} placeholder="+380 ..." required />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="order-product">Товар *</FieldLabel>
                        <FilterSelect id="order-product" name="productId" value={orderForm.productId} onChange={handleOrderFormChange} required>
                          <option value="">Обери товар</option>
                          {products.filter((product) => Number(product.stock) > 0).map((product) => (
                            <option value={product.id} key={product.id}>
                              {product.name} · {product.stock} шт. · {formatPrice(product.price)}
                            </option>
                          ))}
                        </FilterSelect>
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="order-quantity">Кількість *</FieldLabel>
                        <TextInput id="order-quantity" name="quantity" type="number" min="1" step="1" max={selectedOrderProduct?.stock || undefined} value={orderForm.quantity} onChange={handleOrderFormChange} required />
                      </Field>
                    </FormGrid>
                    <InlineTotal>
                      <span>Сума замовлення</span>
                      <strong>{formatPrice(orderFormTotal)}</strong>
                    </InlineTotal>
                    <FormActions>
                      <SecondaryButton type="button" onClick={resetOrderForm}>Скасувати</SecondaryButton>
                      <PrimaryButton type="submit" disabled={!products.some((product) => Number(product.stock) > 0)}>Створити замовлення</PrimaryButton>
                    </FormActions>
                  </form>
                </FormPanel>
              )}

              {visibleOrders.length === 0 ? (
                <EmptyState>
                  <EmptySymbol>🧾</EmptySymbol>
                  <strong>Замовлень не знайдено</strong>
                  <p>{orderSearch || orderStatusFilter !== 'all' ? 'Зміни пошук або фільтр статусу.' : 'Тут відображатимуться створені замовлення.'}</p>
                  {(orderSearch || orderStatusFilter !== 'all') && (
                    <SecondaryButton type="button" onClick={() => { setOrderSearch(''); setOrderStatusFilter('all') }}>Скинути фільтри</SecondaryButton>
                  )}
                </EmptyState>
              ) : (
                <TableScroll>
                  <ProductTable>
                    <thead>
                      <tr>
                        <th>Замовлення</th>
                        <th>Клієнт</th>
                        <th>Товар</th>
                        <th>Сума</th>
                        <th>Дата</th>
                        <th>Статус</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleOrders.map((order) => (
                        <tr key={order.id}>
                          <td><OrderMeta><strong>{order.id}</strong><span>{order.createdByName || 'Дропшипер'}</span></OrderMeta></td>
                          <td><OrderMeta><strong>{order.customerName}</strong><span>{order.customerPhone}</span></OrderMeta></td>
                          <td><OrderMeta><strong>{order.items.map((item) => item.productName).join(', ')}</strong><span>{order.items.map((item) => `${item.quantity} × ${formatPrice(item.unitPrice)}`).join(' · ')}</span></OrderMeta></td>
                          <td><strong>{formatPrice(order.total)}</strong></td>
                          <td>{formatDate(order.createdAt)}</td>
                          <td>
                            {role === 'ADMIN' && ALLOWED_ORDER_TRANSITIONS[order.status]?.length > 0 ? (
                              <StatusSelect value={order.status} onChange={(event) => handleOrderStatusChange(order.id, event.target.value)} aria-label={`Змінити статус ${order.id}`}>
                                <option value={order.status}>{getOrderStatusLabel(order.status)}</option>
                                {ALLOWED_ORDER_TRANSITIONS[order.status].map((status) => <option value={status} key={status}>{getOrderStatusLabel(status)}</option>)}
                              </StatusSelect>
                            ) : (
                              <StatusBadge $status={order.status}>{order.status === 'COMPLETED' ? '✅ ' : order.status === 'CANCELLED' ? '⛔ ' : order.status === 'PROCESSING' ? '🟠 ' : '🔵 '}{getOrderStatusLabel(order.status)}</StatusBadge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </ProductTable>
                </TableScroll>
              )}
            </Panel>
          </Section>
        )}

        {activeSection === 'users' && role === 'ADMIN' && (
          <Section>
            <Panel>
              <PanelHeader>
                <div>
                  <PanelTitle>Користувачі компанії</PanelTitle>
                  <PanelSubtitle>Облікові записи, ролі та належність до компанії.</PanelSubtitle>
                </div>
              </PanelHeader>

              <Toolbar>
                <SearchWrap>
                  <span aria-hidden="true">🔎</span>
                  <SearchInput type="search" value={userSearch} onChange={(event) => setUserSearch(event.target.value)} placeholder="Пошук за ім’ям або email..." aria-label="Пошук користувачів" />
                </SearchWrap>
                <FilterSelect value={userRoleFilter} onChange={(event) => setUserRoleFilter(event.target.value)} aria-label="Фільтр за роллю">
                  <option value="all">Усі ролі</option>
                  <option value="ADMIN">Адміністратори</option>
                  <option value="DROPSHIPPER">Дропшипери</option>
                </FilterSelect>
              </Toolbar>

              {feedback && <Feedback $type={feedback.type} role="status">{feedback.text}</Feedback>}

              {showUserForm && (
                <FormPanel>
                  <FormHeader>
                    <div>
                      <FormTitle>{editingUserId ? 'Редагування користувача' : 'Новий користувач'}</FormTitle>
                      <FormHint>Заповни основні дані та признач роль у компанії.</FormHint>
                    </div>
                    <SecondaryButton type="button" onClick={resetUserForm}>Закрити</SecondaryButton>
                  </FormHeader>
                  <form onSubmit={handleUserSubmit}>
                    <FormGrid>
                      <Field>
                        <FieldLabel htmlFor="user-name">Ім’я та прізвище *</FieldLabel>
                        <TextInput id="user-name" name="name" value={userForm.name} onChange={handleUserFormChange} placeholder="Ім’я користувача" required />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="user-email">Email *</FieldLabel>
                        <TextInput id="user-email" name="email" type="email" value={userForm.email} onChange={handleUserFormChange} placeholder="name@example.com" required />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="user-role">Роль *</FieldLabel>
                        <FilterSelect id="user-role" name="role" value={userForm.role} onChange={handleUserFormChange}>
                          <option value="DROPSHIPPER">Дропшипер</option>
                          <option value="ADMIN">Адміністратор</option>
                        </FilterSelect>
                      </Field>
                    </FormGrid>
                    <FormActions>
                      <SecondaryButton type="button" onClick={resetUserForm}>Скасувати</SecondaryButton>
                      <PrimaryButton type="submit">{editingUserId ? 'Зберегти зміни' : 'Додати користувача'}</PrimaryButton>
                    </FormActions>
                  </form>
                </FormPanel>
              )}

              {filteredUsers.length === 0 ? (
                <EmptyState>
                  <EmptySymbol>👥</EmptySymbol>
                  <strong>Користувачів не знайдено</strong>
                  <p>Зміни пошук або вибери іншу роль.</p>
                </EmptyState>
              ) : (
                <TableScroll>
                  <ProductTable>
                    <thead><tr><th>Користувач</th><th>Роль</th><th>Компанія</th><th>Дії</th></tr></thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id}>
                          <td>
                            <UserNameCell>
                              <span>👤</span>
                              <div><strong>{user.name}</strong><small>{user.email}</small></div>
                            </UserNameCell>
                          </td>
                          <td><RoleBadge $role={user.role}>{user.role === 'ADMIN' ? 'Адміністратор' : 'Дропшипер'}</RoleBadge></td>
                          <td>{user.companyName || 'DM Company'}</td>
                          <td>
                            <ActionGroup>
                              <SecondaryButton type="button" onClick={() => openEditUserForm(user)}>✏️ Редагувати</SecondaryButton>
                              <DangerButton type="button" onClick={() => handleDeleteUser(user)}>🗑️ Видалити</DangerButton>
                            </ActionGroup>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </ProductTable>
                </TableScroll>
              )}
            </Panel>
          </Section>
        )}
      </Main>
    </Page>
  )
}

export default Workspace
