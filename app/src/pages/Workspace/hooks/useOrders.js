import { useState } from 'react'
import {
  ALLOWED_ORDER_TRANSITIONS,
  DEMO_COMPANY_ID,
  DEMO_DROPSHIPPER_ID,
  EMPTY_ORDER_FORM,
  ORDER_STATUSES,
} from '../constants/workspace.constants.js'
import { getOrderStatusLabel, restoreOrderStock } from '../utils/workspace.utils.js'

export default function useOrders({
  orders,
  setOrders,
  products,
  setProducts,
  users,
  role,
  setActiveSection,
  setFeedback,
}) {
  const [orderSearch, setOrderSearch] = useState('')
  const [orderStatusFilter, setOrderStatusFilter] = useState('all')
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [orderForm, setOrderForm] = useState({
    ...EMPTY_ORDER_FORM,
    productId: products[0]?.id || '',
  })

  const visibleOrders = orders
    .filter((order) => role === 'ADMIN' || order.createdBy === DEMO_DROPSHIPPER_ID)
    .filter(
      (order) =>
        orderStatusFilter === 'all' || order.status === orderStatusFilter,
    )
    .filter((order) => {
      const query = orderSearch.trim().toLowerCase()
      if (!query) return true

      return (
        String(order.id || '').toLowerCase().includes(query) ||
        String(order.customerName || '').toLowerCase().includes(query) ||
        String(order.customerPhone || '').toLowerCase().includes(query) ||
        (order.items || []).some(
          (item) =>
            String(item.productName || '').toLowerCase().includes(query) ||
            String(item.sku || '').toLowerCase().includes(query),
        )
      )
    })

  const visibleOrdersForRole = orders.filter(
    (order) => role === 'ADMIN' || order.createdBy === DEMO_DROPSHIPPER_ID,
  )

  const orderTotals = {
    total: visibleOrdersForRole.length,
    new: visibleOrdersForRole.filter((order) => order.status === 'NEW').length,
    processing: visibleOrdersForRole.filter(
      (order) => order.status === 'PROCESSING',
    ).length,
    completed: visibleOrdersForRole.filter(
      (order) => order.status === 'COMPLETED',
    ).length,
  }

  const selectedOrderProduct = products.find(
    (product) => product.id === orderForm.productId,
  )
  const orderFormTotal = selectedOrderProduct
    ? selectedOrderProduct.price * Math.max(0, Number(orderForm.quantity) || 0)
    : 0

  function openOrderForm() {
    const firstAvailableProduct = products.find(
      (product) => Number(product.stock) > 0,
    )

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
    setOrderForm({
      ...EMPTY_ORDER_FORM,
      productId:
        products.find((product) => Number(product.stock) > 0)?.id || '',
    })
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
      setFeedback({
        type: 'error',
        text: 'Заповни ім’я клієнта, телефон і вибери товар.',
      })
      return
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      setFeedback({
        type: 'error',
        text: 'Кількість має бути цілим числом від 1.',
      })
      return
    }

    if (!product || Number(product.stock) < quantity) {
      setFeedback({
        type: 'error',
        text: 'Недостатньо товару на складі для цієї кількості.',
      })
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
      items: [
        {
          productId: product.id,
          sku: product.sku,
          productName: product.name,
          quantity,
          unitPrice: Number(product.price),
        },
      ],
      total: Number(product.price) * quantity,
      status: 'NEW',
      createdAt: new Date().toISOString(),
      stockDeducted: true,
    }

    setOrders((current) => [newOrder, ...current])
    setProducts((current) =>
      current.map((item) =>
        item.id === product.id
          ? { ...item, stock: Number(item.stock) - quantity }
          : item,
      ),
    )
    const nextAvailableProduct = products.find((item) => {
      const remainingStock =
        Number(item.stock) - (item.id === product.id ? quantity : 0)
      return remainingStock > 0
    })

    setOrderStatusFilter('all')
    setOrderSearch('')
    setShowOrderForm(false)
    setOrderForm({
      ...EMPTY_ORDER_FORM,
      productId: nextAvailableProduct?.id || '',
    })
    setFeedback({
      type: 'success',
      text: `Замовлення ${newOrder.id} створено.`,
    })
  }

  function handleOrderStatusChange(orderId, nextStatus) {
    if (role !== 'ADMIN') return

    const order = orders.find((item) => item.id === orderId)
    if (!order || !ALLOWED_ORDER_TRANSITIONS[order.status]?.includes(nextStatus)) {
      return
    }

    if (nextStatus === 'CANCELLED' && order.stockDeducted) {
      setProducts((current) => restoreOrderStock(current, order))
    }

    setOrders((current) =>
      current.map((item) =>
        item.id === orderId
          ? {
              ...item,
              status: nextStatus,
              stockDeducted:
                nextStatus === 'CANCELLED' ? false : item.stockDeducted,
            }
          : item,
      ),
    )

    setFeedback({
      type: 'success',
      text: `Статус замовлення ${orderId} змінено: ${getOrderStatusLabel(nextStatus).toLowerCase()}.`,
    })
  }

  function handleDeleteOrder(order) {
    if (role !== 'ADMIN') return

    if (!window.confirm(`Видалити замовлення ${order.id}?`)) return

    const shouldRestoreStock =
      order.stockDeducted &&
      ['NEW', 'PROCESSING'].includes(order.status)

    if (shouldRestoreStock) {
      setProducts((current) => restoreOrderStock(current, order))
    }

    setOrders((current) =>
      current.filter((item) => item.id !== order.id),
    )
    setFeedback({
      type: 'success',
      text: `Замовлення ${order.id} видалено.`,
    })
  }

  function hideOrderForm() {
    setShowOrderForm(false)
  }

  return {
    orders,
    visibleOrders,
    orderTotals,
    orderSearch,
    setOrderSearch,
    orderStatusFilter,
    setOrderStatusFilter,
    showOrderForm,
    orderForm,
    selectedOrderProduct,
    orderFormTotal,
    orderStatuses: ORDER_STATUSES,
    allowedOrderTransitions: ALLOWED_ORDER_TRANSITIONS,
    openOrderForm,
    resetOrderForm,
    handleOrderFormChange,
    handleOrderSubmit,
    handleOrderStatusChange,
    handleDeleteOrder,
    hideOrderForm,
  }
}
