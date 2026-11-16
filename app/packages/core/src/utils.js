export function restoreOrderStock(products, order) {
  const quantities = new Map()
  for (const item of order?.items || []) {
    quantities.set(item.productId, (quantities.get(item.productId) || 0) + Number(item.quantity || 0))
  }

  return products.map((product) => {
    const quantity = quantities.get(product.id) || 0
    return quantity ? { ...product, stock: Number(product.stock || 0) + quantity } : product
  })
}

export function formatPrice(value) {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)
}

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

export function filterProducts(products, query = '', category = 'all') {
  const normalizedQuery = String(query).trim().toLocaleLowerCase('uk-UA')
  return sortByDateDescending(products.filter((product) => {
    const matchesQuery = !normalizedQuery
      || [product.name, product.sku, product.description]
        .some((value) => String(value ?? '').toLocaleLowerCase('uk-UA').includes(normalizedQuery))
    const matchesCategory = category === 'all' || product.category === category
    return matchesQuery && matchesCategory
  }))
}

export function filterOrders(orders, query = '', status = 'all') {
  const normalizedQuery = String(query).trim().toLocaleLowerCase('uk-UA')
  return sortByDateDescending(orders.filter((order) => {
    const matchesStatus = status === 'all' || order.status === status
    const searchable = [
      order.id,
      order.orderNumber,
      order.customerName,
      order.customerPhone,
      ...(order.items || []).flatMap((item) => [item.productName, item.sku]),
    ]
    const matchesQuery = !normalizedQuery
      || searchable.some((value) => String(value ?? '').toLocaleLowerCase('uk-UA').includes(normalizedQuery))
    return matchesStatus && matchesQuery
  }))
}

export function filterUsers(users, query = '', role = 'all') {
  const normalizedQuery = String(query).trim().toLocaleLowerCase('uk-UA')
  return users.filter((user) => {
    const matchesRole = role === 'all' || user.role === role
    const matchesQuery = !normalizedQuery
      || [user.name, user.email].some((value) =>
        String(value ?? '').toLocaleLowerCase('uk-UA').includes(normalizedQuery))
    return matchesRole && matchesQuery
  })
}

export function sortByDateDescending(items, dateKey = 'createdAt') {
  return [...items].sort((left, right) => {
    const leftTime = new Date(left?.[dateKey] ?? 0).getTime()
    const rightTime = new Date(right?.[dateKey] ?? 0).getTime()
    const safeLeft = Number.isNaN(leftTime) ? 0 : leftTime
    const safeRight = Number.isNaN(rightTime) ? 0 : rightTime
    return safeRight - safeLeft
  })
}
