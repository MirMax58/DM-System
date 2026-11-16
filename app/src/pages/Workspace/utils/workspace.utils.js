import { formatDate, formatPrice, restoreOrderStock } from '@dm-system/core'
import { ORDER_STATUSES } from '../constants/workspace.constants.js'

export { formatDate, formatPrice, restoreOrderStock }

export function getOrderStatusLabel(status) {
  return ORDER_STATUSES[status]?.label || status
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
