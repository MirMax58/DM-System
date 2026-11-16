export const ORDER_STATUSES = Object.freeze({
  NEW: 'NEW',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
})

export const ALLOWED_ORDER_TRANSITIONS = Object.freeze({
  NEW: Object.freeze(['PROCESSING', 'CANCELLED']),
  PROCESSING: Object.freeze(['COMPLETED', 'CANCELLED']),
  COMPLETED: Object.freeze([]),
  CANCELLED: Object.freeze([]),
})

export const PRODUCT_LIMITS = Object.freeze({
  nameMin: 2,
  nameMax: 140,
  skuMax: 40,
  categoryMax: 60,
  descriptionMax: 2000,
  priceMin: 0,
  stockMin: 0,
})

export const ORDER_LIMITS = Object.freeze({
  customerNameMax: 120,
  customerPhoneMax: 30,
  itemQuantityMin: 1,
  itemsMax: 30,
  companyNameMin: 2,
  companyNameMax: 100,
})
