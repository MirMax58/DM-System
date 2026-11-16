import {
  ALLOWED_ORDER_TRANSITIONS,
  ORDER_LIMITS,
  ORDER_STATUSES,
  PRODUCT_LIMITS,
} from './constants.js'

const invalid = (error) => ({ valid: false, error })
const valid = () => ({ valid: true, error: null })

export function validateProduct(product, { products = [], editingProductId = null } = {}) {
  if (!product || typeof product !== 'object' || Array.isArray(product)) {
    return invalid('Некоректні дані товару.')
  }

  const name = String(product.name ?? '').trim()
  const sku = String(product.sku ?? '').trim()
  const category = String(product.category ?? '').trim()
  const description = String(product.description ?? '').trim()
  const price = Number(product.price)
  const stock = Number(product.stock)

  if (name.length < PRODUCT_LIMITS.nameMin || name.length > PRODUCT_LIMITS.nameMax) {
    return invalid(`Назва товару має містити від ${PRODUCT_LIMITS.nameMin} до ${PRODUCT_LIMITS.nameMax} символів.`)
  }
  if (!sku || sku.length > PRODUCT_LIMITS.skuMax) {
    return invalid(`Артикул має містити від 1 до ${PRODUCT_LIMITS.skuMax} символів.`)
  }
  if (!category || category.length > PRODUCT_LIMITS.categoryMax) {
    return invalid(`Категорія має містити від 1 до ${PRODUCT_LIMITS.categoryMax} символів.`)
  }
  if (description.length > PRODUCT_LIMITS.descriptionMax) {
    return invalid(`Опис не повинен перевищувати ${PRODUCT_LIMITS.descriptionMax} символів.`)
  }
  if (String(product.price ?? '').trim() === ''
    || !Number.isFinite(price) || price < PRODUCT_LIMITS.priceMin) {
    return invalid('Ціна має бути невід’ємним числом.')
  }
  if (String(product.stock ?? '').trim() === ''
    || !Number.isInteger(stock) || stock < PRODUCT_LIMITS.stockMin) {
    return invalid('Залишок має бути цілим невід’ємним числом.')
  }

  const duplicateSku = products.some((item) =>
    String(item.sku ?? '').trim().toLowerCase() === sku.toLowerCase()
    && item.id !== editingProductId,
  )
  if (duplicateSku) return invalid('Товар з таким артикулом уже є в каталозі.')

  return valid()
}

export function validateOrder(order, products = []) {
  if (!order || typeof order !== 'object' || Array.isArray(order)) {
    return invalid('Некоректні дані замовлення.')
  }

  const customerName = String(order.customerName ?? '').trim()
  const customerPhone = String(order.customerPhone ?? '').trim()
  const items = Array.isArray(order.items) ? order.items : []

  if (!customerName) return invalid('Заповни ім’я клієнта.')
  if (customerName.length > ORDER_LIMITS.customerNameMax) {
    return invalid(`Ім’я клієнта не повинно перевищувати ${ORDER_LIMITS.customerNameMax} символів.`)
  }
  if (!customerPhone) return invalid('Заповни ім’я та телефон клієнта.')
  if (customerPhone.length > ORDER_LIMITS.customerPhoneMax) {
    return invalid(`Телефон клієнта не повинен перевищувати ${ORDER_LIMITS.customerPhoneMax} символів.`)
  }
  if (items.length === 0) return invalid('Додай хоча б один товар до замовлення.')
  if (items.length > ORDER_LIMITS.itemsMax) {
    return invalid(`В одному замовленні може бути не більше ${ORDER_LIMITS.itemsMax} позицій.`)
  }

  const normalizedItems = []
  const requestedByProduct = new Map()

  for (const item of items) {
    const product = products.find((candidate) => candidate.id === item.productId)
    if (!product) return invalid('Обери товар для кожної позиції.')

    const quantity = Number(item.quantity)
    if (!Number.isInteger(quantity) || quantity < ORDER_LIMITS.itemQuantityMin) {
      return invalid('Кількість має бути цілим числом від 1.')
    }

    requestedByProduct.set(
      product.id,
      (requestedByProduct.get(product.id) || 0) + quantity,
    )
    normalizedItems.push({ productId: product.id, quantity })
  }

  for (const [productId, requestedQuantity] of requestedByProduct) {
    const product = products.find((candidate) => candidate.id === productId)
    if (requestedQuantity > Number(product.stock)) {
      return invalid(`Недостатньо залишку товару «${product.name}».`)
    }
  }

  return { valid: true, error: null, items: normalizedItems }
}

export function validateCompanyName(value) {
  const name = String(value ?? '').trim()
  if (name.length < ORDER_LIMITS.companyNameMin || name.length > ORDER_LIMITS.companyNameMax) {
    return invalid(`Назва компанії має містити від ${ORDER_LIMITS.companyNameMin} до ${ORDER_LIMITS.companyNameMax} символів.`)
  }
  return valid()
}

export function canChangeOrderStatus(currentStatus, nextStatus) {
  if (!Object.values(ORDER_STATUSES).includes(currentStatus)) return false
  return ALLOWED_ORDER_TRANSITIONS[currentStatus].includes(nextStatus)
}
