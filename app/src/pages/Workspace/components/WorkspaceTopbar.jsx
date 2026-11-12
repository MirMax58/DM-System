import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { BackLink, Topbar, TopbarRight } from '../styles/layout.styles.js'

const Identity = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #5e6a82;
  font-size: 12px;
  flex-wrap: wrap;
`
const RoleBadge = styled.span`
  padding: 6px 10px;
  border-radius: 999px;
  background: ${({ $admin }) => ($admin ? '#eaf1ff' : '#e8f8ef')};
  color: ${({ $admin }) => ($admin ? '#2869c9' : '#218452')};
  font-size: 11px;
  font-weight: 750;
`
const LogoutButton = styled.button`
  min-height: 34px;
  padding: 7px 12px;
  border: 1px solid #dfe4f0;
  border-radius: 9px;
  background: #fff;
  color: #5d6880;
  font: inherit;
  font-size: 12px;
  cursor: pointer;
  &:hover { border-color: #b8c6dc; color: #24304a; }
`

export default function WorkspaceTopbar({ role, user, company, onLogout }) {
  const navigate = useNavigate()
  async function handleLogout() {
    await onLogout()
    navigate('/login', { replace: true })
  }
  return (
    <Topbar>
      <BackLink to="/">← Повернутися на головну</BackLink>
      <TopbarRight>
        <Identity>
          <strong>{company?.name || 'Компанія'}</strong>
          <span>{user?.name}</span>
          <RoleBadge $admin={role === 'ADMIN'}>{role === 'ADMIN' ? 'Адміністратор' : 'Дропшипер'}</RoleBadge>
        </Identity>
        <LogoutButton type="button" onClick={handleLogout}>Вийти</LogoutButton>
      </TopbarRight>
    </Topbar>
  )
}
