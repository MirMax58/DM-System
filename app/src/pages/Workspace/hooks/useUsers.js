import { useState } from 'react'
import {
  DEMO_COMPANY_ID,
  DEMO_DROPSHIPPER_ID,
  EMPTY_USER_FORM,
} from '../constants/workspace.constants.js'

export default function useUsers({
  users,
  setUsers,
  orders,
  setOrders,
  setActiveSection,
  setFeedback,
}) {
  const [userSearch, setUserSearch] = useState('')
  const [userRoleFilter, setUserRoleFilter] = useState('all')
  const [showUserForm, setShowUserForm] = useState(false)
  const [editingUserId, setEditingUserId] = useState(null)
  const [userForm, setUserForm] = useState({ ...EMPTY_USER_FORM })

  const filteredUsers = users
    .filter((user) => userRoleFilter === 'all' || user.role === userRoleFilter)
    .filter((user) => {
      const query = userSearch.trim().toLowerCase()
      return (
        !query ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
      )
    })

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
      setFeedback({
        type: 'error',
        text: 'Вкажи ім’я користувача та коректну електронну адресу.',
      })
      return
    }

    const duplicateEmail = users.some(
      (user) =>
        user.email.toLowerCase() === email && user.id !== editingUserId,
    )

    if (duplicateEmail) {
      setFeedback({
        type: 'error',
        text: 'Користувач із такою електронною адресою вже існує.',
      })
      return
    }

    if (editingUserId) {
      const userBeingEdited = users.find((user) => user.id === editingUserId)
      const adminCount = users.filter((user) => user.role === 'ADMIN').length

      if (
        userBeingEdited?.role === 'ADMIN' &&
        userForm.role !== 'ADMIN' &&
        adminCount <= 1
      ) {
        setFeedback({
          type: 'error',
          text: 'У компанії має залишитися щонайменше один адміністратор.',
        })
        return
      }

      setUsers((current) =>
        current.map((user) =>
          user.id === editingUserId
            ? { ...user, name, email, role: userForm.role }
            : user,
        ),
      )

      if (editingUserId === DEMO_DROPSHIPPER_ID) {
        setOrders((current) =>
          current.map((order) =>
            order.createdBy === DEMO_DROPSHIPPER_ID
              ? { ...order, createdByName: name }
              : order,
          ),
        )
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
    if (
      user.role === 'ADMIN' &&
      users.filter((item) => item.role === 'ADMIN').length <= 1
    ) {
      setFeedback({
        type: 'error',
        text: 'У компанії має залишитися щонайменше один адміністратор.',
      })
      return
    }

    if (user.id === DEMO_DROPSHIPPER_ID) {
      setFeedback({
        type: 'error',
        text: 'Цей профіль потрібний для перевірки сценарію дропшипера.',
      })
      return
    }

    const hasOrders = orders.some((order) => order.createdBy === user.id)
    if (hasOrders) {
      setFeedback({
        type: 'error',
        text: 'Не можна видалити користувача, за яким збережено замовлення.',
      })
      return
    }

    if (!window.confirm(`Видалити користувача «${user.name}»?`)) return

    setUsers((current) => current.filter((item) => item.id !== user.id))
    if (editingUserId === user.id) resetUserForm()
    setFeedback({
      type: 'success',
      text: `Користувача «${user.name}» видалено.`,
    })
  }

  function hideUserForm() {
    setShowUserForm(false)
  }

  return {
    users,
    filteredUsers,
    userSearch,
    setUserSearch,
    userRoleFilter,
    setUserRoleFilter,
    showUserForm,
    editingUserId,
    userForm,
    openNewUserForm,
    openEditUserForm,
    resetUserForm,
    handleUserFormChange,
    handleUserSubmit,
    handleDeleteUser,
    hideUserForm,
  }
}
