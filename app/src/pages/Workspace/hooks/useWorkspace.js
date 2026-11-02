import { useState } from 'react'
import {
  INITIAL_ORDERS,
  INITIAL_PRODUCTS,
  INITIAL_USERS,
  ORDERS_STORAGE_KEY,
  PRODUCTS_STORAGE_KEY,
  SECTION_CONTENT,
  USERS_STORAGE_KEY,
  navigationItems,
} from '../constants/workspace.constants.js'
import useLocalStorageState from './useLocalStorageState.js'
import useOrders from './useOrders.js'
import useProducts from './useProducts.js'
import useUsers from './useUsers.js'

export default function useWorkspace() {
  const [activeSection, setActiveSection] = useState('overview')
  const [role, setRole] = useState('ADMIN')
  const [feedback, setFeedback] = useState(null)

  const [products, setProducts] = useLocalStorageState(
    PRODUCTS_STORAGE_KEY,
    INITIAL_PRODUCTS,
  )
  const [orders, setOrders] = useLocalStorageState(
    ORDERS_STORAGE_KEY,
    INITIAL_ORDERS,
  )
  const [users, setUsers] = useLocalStorageState(USERS_STORAGE_KEY, INITIAL_USERS)

  const productManager = useProducts({
    products,
    setProducts,
    orders,
    setActiveSection,
    setFeedback,
  })

  const orderManager = useOrders({
    orders,
    setOrders,
    products,
    setProducts,
    users,
    role,
    setActiveSection,
    setFeedback,
  })

  const userManager = useUsers({
    users,
    setUsers,
    orders,
    setOrders,
    setActiveSection,
    setFeedback,
  })

  const visibleNavigation = navigationItems.filter(
    (item) => !item.adminOnly || role === 'ADMIN',
  )

  const currentSection = SECTION_CONTENT[activeSection]

  function handleRoleChange(event) {
    const nextRole = event.target.value

    setRole(nextRole)
    productManager.hideProductForm()
    orderManager.hideOrderForm()
    userManager.hideUserForm()
    setFeedback(null)

    if (nextRole !== 'ADMIN' && activeSection === 'users') {
      setActiveSection('orders')
    }
  }

  function handleSectionChange(sectionId) {
    setActiveSection(sectionId)
    setFeedback(null)
  }

  function openProducts() {
    setActiveSection('products')
    setFeedback(null)
  }

  const overview = {
    products,
    totalStock: productManager.totalStock,
    lowStockCount: productManager.lowStockCount,
    categories: productManager.categories,
    role,
    onOpenProducts: openProducts,
    onAddProduct: productManager.openNewProductForm,
  }

  return {
    activeSection,
    setActiveSection,
    role,
    feedback,
    visibleNavigation,
    currentSection,
    handleRoleChange,
    handleSectionChange,
    openProducts,
    overview,
    products: productManager,
    orders: orderManager,
    users: userManager,
  }
}
