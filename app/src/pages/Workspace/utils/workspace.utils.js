import { ORDER_STATUSES } from '../constants/workspace.constants.js'

export function formatDate(value) {
  if (!value) return '—'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'

  return new Intl.DateTimeFormat('uk-UA', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export function getOrderStatusLabel(status) {
  return ORDER_STATUSES[status]?.label || status
}

export function formatPrice(value) {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)
}

export function getCategorySymbol(category) {
  const symbols = {
    Електроніка: '🎧',
    Аксесуари: '💻',
    'Для дому': '🏠',
    Одяг: '👕',
  }

  return symbols[category] || '📦'
}

export function restoreOrderStock(products, order) {
  const quantitiesByProduct = (order.items || []).reduce((quantities, item) => {
    const currentQuantity = quantities.get(item.productId) || 0
    quantities.set(item.productId, currentQuantity + Number(item.quantity || 0))
    return quantities
  }, new Map())

  return products.map((product) => {
    const quantityToRestore = quantitiesByProduct.get(product.id) || 0

    if (!quantityToRestore) return product

    return {
      ...product,
      stock: Number(product.stock || 0) + quantityToRestore,
    }
  })
}
