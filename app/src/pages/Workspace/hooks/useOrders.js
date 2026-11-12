import { useMemo, useState } from 'react'
import { useMutation } from '@apollo/client'
import { CREATE_ORDER_MUTATION, DELETE_ORDER_MUTATION, UPDATE_ORDER_STATUS_MUTATION } from '../../../graphql/operations.js'
import { ALLOWED_ORDER_TRANSITIONS, ORDER_STATUSES } from '../constants/workspace.constants.js'
import { getOrderStatusLabel } from '../utils/workspace.utils.js'

const makeEmptyForm = (products) => ({
  customerName: '',
  customerPhone: '',
  items: [{ productId: products.find((p) => Number(p.stock) > 0)?.id || '', quantity: '1' }],
})

export default function useOrders({ orders, products, user, role, refetchOrders, refetchProducts, setActiveSection, setFeedback }) {
  const [orderSearch, setOrderSearch] = useState('')
  const [orderStatusFilter, setOrderStatusFilter] = useState('all')
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [orderForm, setOrderForm] = useState(() => makeEmptyForm(products))
  const [createOrder, { loading: creatingOrder }] = useMutation(CREATE_ORDER_MUTATION)
  const [updateOrderStatus] = useMutation(UPDATE_ORDER_STATUS_MUTATION)
  const [deleteOrder] = useMutation(DELETE_ORDER_MUTATION)
  const visibleOrdersForRole = orders.filter((o) => role === 'ADMIN' || o.createdBy === user?.id)
  const query = orderSearch.trim().toLowerCase()
  const visibleOrders = visibleOrdersForRole
    .filter((o) => orderStatusFilter === 'all' || o.status === orderStatusFilter)
    .filter((o) => !query || [o.id, o.orderNumber, o.customerName, o.customerPhone, ...(o.items || []).flatMap((i) => [i.productName, i.sku])].some((v) => String(v || '').toLowerCase().includes(query)))
  const orderTotals = useMemo(() => ({
    total: visibleOrdersForRole.length,
    new: visibleOrdersForRole.filter((o) => o.status === 'NEW').length,
    processing: visibleOrdersForRole.filter((o) => o.status === 'PROCESSING').length,
    completed: visibleOrdersForRole.filter((o) => o.status === 'COMPLETED').length,
  }), [visibleOrdersForRole])
  const orderFormTotal = (orderForm.items || []).reduce((sum, row) => {
    const product = products.find((p) => p.id === row.productId)
    return sum + (product ? product.price * Math.max(0, Number(row.quantity) || 0) : 0)
  }, 0)

  function openOrderForm() {
    setActiveSection('orders')
    setOrderForm(makeEmptyForm(products))
    setShowOrderForm(true)
    setFeedback(null)
  }
  function resetOrderForm() { setOrderForm(makeEmptyForm(products)); setShowOrderForm(false) }
  function handleOrderFormChange(event) {
    const { name, value } = event.target
    setOrderForm((current) => ({ ...current, [name]: value }))
  }
  function handleOrderItemChange(index, field, value) {
    setOrderForm((current) => ({
      ...current,
      items: current.items.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item),
    }))
  }
  function addOrderItem() {
    const selectedIds = new Set(orderForm.items.map((item) => item.productId))
    const available = products.find((product) => Number(product.stock) > 0 && !selectedIds.has(product.id))
    if (orderForm.items.length >= 30) return setFeedback({ type: 'error', text: 'В одному замовленні може бути не більше 30 позицій.' })
    if (!available) return setFeedback({ type: 'error', text: 'Немає інших доступних товарів для додавання.' })
    setOrderForm((current) => ({ ...current, items: [...current.items, { productId: available.id, quantity: '1' }] }))
  }
  function removeOrderItem(index) {
    setOrderForm((current) => ({ ...current, items: current.items.filter((_, itemIndex) => itemIndex !== index) }))
  }

  async function handleOrderSubmit(event) {
    event.preventDefault()
    const customerName = orderForm.customerName.trim()
    const customerPhone = orderForm.customerPhone.trim()
    if (!customerName || !customerPhone) return setFeedback({ type: 'error', text: 'Заповни ім’я та телефон клієнта.' })
    if (!orderForm.items.length) return setFeedback({ type: 'error', text: 'Додай хоча б один товар до замовлення.' })
    const items = []
    for (const row of orderForm.items) {
      const product = products.find((p) => p.id === row.productId)
      const quantity = Number(row.quantity)
      if (!product) return setFeedback({ type: 'error', text: 'Обери товар для кожної позиції.' })
      if (!Number.isInteger(quantity) || quantity < 1) return setFeedback({ type: 'error', text: 'Кількість має бути цілим числом від 1.' })
      if (quantity > Number(product.stock)) return setFeedback({ type: 'error', text: `Недостатньо залишку товару «${product.name}».` })
      items.push({ productId: product.id, quantity })
    }
    try {
      const { data } = await createOrder({ variables: { input: { customerName, customerPhone, items } } })
      await Promise.all([refetchOrders(), refetchProducts()])
      setOrderStatusFilter('all')
      setOrderSearch('')
      resetOrderForm()
      setFeedback({ type: 'success', text: `Замовлення ${data.createOrder.orderNumber} створено.` })
    } catch (error) { setFeedback({ type: 'error', text: error.message || 'Не вдалося створити замовлення.' }) }
  }

  async function handleOrderStatusChange(orderId, nextStatus) {
    if (role !== 'ADMIN') return
    const order = orders.find((o) => o.id === orderId)
    if (!order || !ALLOWED_ORDER_TRANSITIONS[order.status]?.includes(nextStatus)) return
    try {
      await updateOrderStatus({ variables: { id: orderId, status: nextStatus } })
      await Promise.all([refetchOrders(), refetchProducts()])
      setFeedback({ type: 'success', text: `Статус замовлення ${order.orderNumber} змінено: ${getOrderStatusLabel(nextStatus).toLowerCase()}.` })
    } catch (error) { setFeedback({ type: 'error', text: error.message || 'Не вдалося змінити статус замовлення.' }) }
  }

  async function handleDeleteOrder(order) {
    if (role !== 'ADMIN' || !window.confirm(`Видалити замовлення ${order.orderNumber}?`)) return
    try {
      await deleteOrder({ variables: { id: order.id } })
      await Promise.all([refetchOrders(), refetchProducts()])
      setFeedback({ type: 'success', text: `Замовлення ${order.orderNumber} видалено.` })
    } catch (error) { setFeedback({ type: 'error', text: error.message || 'Не вдалося видалити замовлення.' }) }
  }

  return {
    orders, visibleOrders, orderTotals, orderSearch, setOrderSearch,
    orderStatusFilter, setOrderStatusFilter, showOrderForm, orderForm,
    orderFormTotal, orderStatuses: ORDER_STATUSES, allowedOrderTransitions: ALLOWED_ORDER_TRANSITIONS,
    openOrderForm, resetOrderForm, handleOrderFormChange, handleOrderItemChange,
    addOrderItem, removeOrderItem, handleOrderSubmit, creatingOrder, handleOrderStatusChange,
    handleDeleteOrder, hideOrderForm: () => setShowOrderForm(false),
  }
}
