import { useMemo, useState } from 'react'
import { useMutation } from '@apollo/client'
import { CREATE_INVITATION_MUTATION, REVOKE_INVITATION_MUTATION, UPDATE_USER_STATUS_MUTATION } from '../../../graphql/operations.js'

export default function useUsers({ users, invitations, currentUser, refetchUsers, refetchInvitations, setActiveSection, setFeedback }) {
  const [userSearch, setUserSearch] = useState('')
  const [userRoleFilter, setUserRoleFilter] = useState('all')
  const [showUserForm, setShowUserForm] = useState(false)
  const [expiresInDays, setExpiresInDays] = useState('7')
  const [createdInvitationCode, setCreatedInvitationCode] = useState('')
  const [createInvitation, { loading: creatingInvitation }] = useMutation(CREATE_INVITATION_MUTATION)
  const [revokeInvitation] = useMutation(REVOKE_INVITATION_MUTATION)
  const [updateUserStatus] = useMutation(UPDATE_USER_STATUS_MUTATION)
  const filteredUsers = useMemo(() => users.filter((u) => userRoleFilter === 'all' || u.role === userRoleFilter).filter((u) => { const q = userSearch.trim().toLowerCase(); return !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) }), [users, userRoleFilter, userSearch])

  function openNewUserForm() { setActiveSection('users'); setExpiresInDays('7'); setCreatedInvitationCode(''); setShowUserForm(true); setFeedback(null) }
  async function handleUserSubmit(event) {
    event.preventDefault(); const days = Number(expiresInDays)
    if (!Number.isInteger(days) || days < 1 || days > 30) return setFeedback({ type: 'error', text: 'Термін дії запрошення має бути від 1 до 30 днів.' })
    try { const { data } = await createInvitation({ variables: { expiresInDays: days } }); setCreatedInvitationCode(data.createInvitation.code); await refetchInvitations(); setFeedback({ type: 'success', text: 'Запрошення створено. Скопіюй код і передай його дропшиперу.' }) }
    catch (error) { setFeedback({ type: 'error', text: error.message || 'Не вдалося створити запрошення.' }) }
  }
  async function handleUserStatusToggle(user) {
    if (user.id === currentUser?.id && user.isActive) return setFeedback({ type: 'error', text: 'Не можна деактивувати власний обліковий запис.' })
    const nextStatus = !user.isActive
    if (!window.confirm(`Дійсно ${nextStatus ? 'активувати' : 'деактивувати'} користувача «${user.name}»?`)) return
    try { await updateUserStatus({ variables: { id: user.id, isActive: nextStatus } }); await refetchUsers(); setFeedback({ type: 'success', text: `Обліковий запис користувача ${nextStatus ? 'активовано' : 'деактивовано'}.` }) }
    catch (error) { setFeedback({ type: 'error', text: error.message || 'Не вдалося змінити доступ користувача.' }) }
  }
  async function handleRevokeInvitation(invitation) {
    if (!window.confirm('Відкликати це запрошення?')) return
    try { await revokeInvitation({ variables: { id: invitation.id } }); await refetchInvitations(); setFeedback({ type: 'success', text: 'Запрошення відкликано.' }) }
    catch (error) { setFeedback({ type: 'error', text: error.message || 'Не вдалося відкликати запрошення.' }) }
  }
  async function copyInvitationCode() {
    try { await navigator.clipboard.writeText(createdInvitationCode); setFeedback({ type: 'success', text: 'Код запрошення скопійовано.' }) }
    catch { setFeedback({ type: 'error', text: 'Не вдалося скопіювати код. Виділи його та скопіюй вручну.' }) }
  }

  return { users, invitations, filteredUsers, userSearch, setUserSearch, userRoleFilter, setUserRoleFilter, showUserForm, expiresInDays, setExpiresInDays, createdInvitationCode, creatingInvitation, openNewUserForm, handleUserSubmit, handleUserStatusToggle, handleRevokeInvitation, copyInvitationCode, resetUserForm: () => { setShowUserForm(false); setCreatedInvitationCode('') } }
}
