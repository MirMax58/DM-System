import { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { useAuth } from '../../../auth/AuthContext.jsx'
import {
  COMPANY_QUERY,
  INVITATIONS_QUERY,
  ORDERS_QUERY,
  PRODUCTS_QUERY,
  UPDATE_COMPANY_MUTATION,
  USERS_QUERY,
} from '../../../graphql/operations.js'
import { SECTION_CONTENT, navigationItems } from '../constants/workspace.constants.js'
import useOrders from './useOrders.js'
import useProducts from './useProducts.js'
import useUsers from './useUsers.js'

export default function useWorkspace() {
  const { user, logout } = useAuth()
  const role = user?.role || 'DROPSHIPPER'
  const [activeSection, setActiveSection] = useState('overview')
  const [feedback, setFeedback] = useState(null)

  const productsQuery = useQuery(PRODUCTS_QUERY, { fetchPolicy: 'cache-and-network' })
  const ordersQuery = useQuery(ORDERS_QUERY, { fetchPolicy: 'cache-and-network' })
  const companyQuery = useQuery(COMPANY_QUERY, { fetchPolicy: 'cache-and-network' })
  const usersQuery = useQuery(USERS_QUERY, { skip: role !== 'ADMIN', fetchPolicy: 'cache-and-network' })
  const invitationsQuery = useQuery(INVITATIONS_QUERY, { skip: role !== 'ADMIN', fetchPolicy: 'cache-and-network' })
  const [updateCompany, { loading: savingCompany }] = useMutation(UPDATE_COMPANY_MUTATION)
  const products = productsQuery.data?.products || []
  const orders = ordersQuery.data?.orders || []
  const users = usersQuery.data?.users || []
  const invitations = invitationsQuery.data?.invitations || []
  const company = companyQuery.data?.company || user?.company || null
  const [companyName, setCompanyName] = useState(company?.name || '')

  const productManager = useProducts({
    products,
    refetchProducts: productsQuery.refetch,
    setActiveSection,
    setFeedback,
  })
  const orderManager = useOrders({
    orders,
    products,
    user,
    role,
    refetchOrders: ordersQuery.refetch,
    refetchProducts: productsQuery.refetch,
    setActiveSection,
    setFeedback,
  })
  const userManager = useUsers({
    users,
    invitations,
    currentUser: user,
    refetchUsers: usersQuery.refetch,
    refetchInvitations: invitationsQuery.refetch,
    setActiveSection,
    setFeedback,
  })

  const visibleNavigation = navigationItems.filter((item) => !item.adminOnly || role === 'ADMIN')
  const currentSection = SECTION_CONTENT[activeSection] || SECTION_CONTENT.overview

  function handleSectionChange(sectionId) {
    if (['users', 'company'].includes(sectionId) && role !== 'ADMIN') return
    setActiveSection(sectionId)
    setFeedback(null)
  }

  function openProducts() { setActiveSection('products'); setFeedback(null) }

  async function handleCompanySubmit(event) {
    event.preventDefault()
    const name = companyName.trim()
    if (name.length < 2 || name.length > 100) {
      setFeedback({ type: 'error', text: 'Назва компанії має містити від 2 до 100 символів.' })
      return
    }
    try {
      const { data } = await updateCompany({ variables: { name } })
      setCompanyName(data.updateCompany.name)
      await companyQuery.refetch()
      setFeedback({ type: 'success', text: 'Інформацію про компанію оновлено.' })
    } catch (error) {
      setFeedback({ type: 'error', text: error.message || 'Не вдалося оновити компанію.' })
    }
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

  const loading = productsQuery.loading || ordersQuery.loading || companyQuery.loading || (role === 'ADMIN' && (usersQuery.loading || invitationsQuery.loading))
  const error = productsQuery.error || ordersQuery.error || companyQuery.error || usersQuery.error || invitationsQuery.error

  return {
    activeSection, role, user, company, logout, feedback, setFeedback,
    visibleNavigation, currentSection, handleSectionChange, overview,
    products: productManager, orders: orderManager, users: userManager,
    loading, error,
    companySettings: { company, companyName, setCompanyName, handleCompanySubmit, savingCompany, feedback },
  }
}
