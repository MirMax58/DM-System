import {
  BackLink,
  RoleSelect,
  Topbar,
  TopbarRight,
} from '../styles/layout.styles.js'

export default function WorkspaceTopbar({ role, onRoleChange }) {
  return (
    <Topbar>
      <BackLink to="/">← Повернутися на головну</BackLink>

      <TopbarRight>
        <RoleSelect
          aria-label="Роль інтерфейсу"
          value={role}
          onChange={onRoleChange}
        >
          <option value="ADMIN">Адміністратор</option>
          <option value="DROPSHIPPER">Дропшипер</option>
        </RoleSelect>
      </TopbarRight>
    </Topbar>
  )
}
