import {
  ActionGroup, DangerButton, EmptyState, EmptySymbol, Feedback, Field, FieldLabel,
  FilterSelect, FormActions, FormHeader, FormHint, FormPanel, FormTitle,
  Panel, PanelHeader, PanelSubtitle, PanelTitle, PrimaryButton, ProductTable,
  SearchInput, SearchWrap, SecondaryButton, Section, TableScroll, Toolbar,
} from '../styles/common.styles.js'
import { RoleBadge, UserNameCell } from '../styles/users.styles.js'

function formatDate(value) {
  return value ? new Date(value).toLocaleDateString('uk-UA') : '—'
}

export default function UsersSection({
  users, invitations, filteredUsers, userSearch, setUserSearch, userRoleFilter,
  setUserRoleFilter, feedback, showUserForm, expiresInDays, setExpiresInDays,
  createdInvitationCode, creatingInvitation, openNewUserForm, handleUserSubmit,
  handleUserStatusToggle, handleRevokeInvitation, copyInvitationCode, resetUserForm,
}) {
  return (
    <Section>
      <div style={{ display: 'grid', gap: 18 }}>
      <Panel>
        <PanelHeader>
          <div>
            <PanelTitle>Користувачі компанії</PanelTitle>
            <PanelSubtitle>Учасники робочого простору та запрошення для нових дропшиперів.</PanelSubtitle>
          </div>
        </PanelHeader>

        {feedback && <Feedback $type={feedback.type} role="status">{feedback.text}</Feedback>}

        {showUserForm && (
          <FormPanel>
            <FormHeader>
              <div>
                <FormTitle>Запрошення дропшипера</FormTitle>
                <FormHint>Код можна використати один раз. Передай його людині, яку потрібно додати до компанії.</FormHint>
              </div>
              <SecondaryButton type="button" onClick={resetUserForm}>Закрити</SecondaryButton>
            </FormHeader>
            <form onSubmit={handleUserSubmit}>
              <Field>
                <FieldLabel htmlFor="invitation-days">Термін дії запрошення</FieldLabel>
                <FilterSelect id="invitation-days" value={expiresInDays} onChange={(event) => setExpiresInDays(event.target.value)}>
                  <option value="1">1 день</option>
                  <option value="3">3 дні</option>
                  <option value="7">7 днів</option>
                  <option value="14">14 днів</option>
                  <option value="30">30 днів</option>
                </FilterSelect>
              </Field>
              <FormActions>
                <SecondaryButton type="button" onClick={resetUserForm}>Скасувати</SecondaryButton>
                <PrimaryButton type="submit" disabled={creatingInvitation}>{creatingInvitation ? 'Створення…' : 'Згенерувати код'}</PrimaryButton>
              </FormActions>
            </form>
            {createdInvitationCode && (
              <div style={{ marginTop: 16, padding: 16, border: '1px solid #b9d5ff', borderRadius: 12, background: '#f3f8ff' }}>
                <strong style={{ display: 'block', marginBottom: 7, color: '#245ca9', fontSize: 12 }}>Код запрошення — збережи його зараз</strong>
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                  <code style={{ fontSize: 20, fontWeight: 800, letterSpacing: 2, color: '#183e78' }}>{createdInvitationCode}</code>
                  <SecondaryButton type="button" onClick={copyInvitationCode}>Скопіювати</SecondaryButton>
                </div>
                <p style={{ margin: '8px 0 0', color: '#6f7d93', fontSize: 11 }}>Після закриття цієї форми повний код більше не буде показаний.</p>
              </div>
            )}
          </FormPanel>
        )}

        <Toolbar>
          <SearchWrap>
            <span aria-hidden="true">🔎</span>
            <SearchInput type="search" value={userSearch} onChange={(event) => setUserSearch(event.target.value)} placeholder="Пошук за ім’ям або email…" aria-label="Пошук користувачів" />
          </SearchWrap>
          <FilterSelect value={userRoleFilter} onChange={(event) => setUserRoleFilter(event.target.value)} aria-label="Фільтр за роллю">
            <option value="all">Усі ролі</option>
            <option value="ADMIN">Адміністратори</option>
            <option value="DROPSHIPPER">Дропшипери</option>
          </FilterSelect>
        </Toolbar>

        {filteredUsers.length === 0 ? (
          <EmptyState><EmptySymbol>👥</EmptySymbol><strong>Користувачів не знайдено</strong><p>Зміни пошук або фільтр ролі.</p></EmptyState>
        ) : (
          <TableScroll>
            <ProductTable>
              <thead><tr><th>Користувач</th><th>Роль</th><th>Статус</th><th>Дата реєстрації</th><th>Дії</th></tr></thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td><UserNameCell><span>👤</span><div><strong>{user.name}</strong><small>{user.email}</small></div></UserNameCell></td>
                    <td><RoleBadge $role={user.role}>{user.role === 'ADMIN' ? 'Адміністратор' : 'Дропшипер'}</RoleBadge></td>
                    <td><RoleBadge $role={user.isActive ? 'ACTIVE' : 'INACTIVE'}>{user.isActive ? 'Активний' : 'Деактивований'}</RoleBadge></td>
                    <td>{formatDate(user.createdAt)}</td>
                    <td><ActionGroup><SecondaryButton type="button" onClick={() => handleUserStatusToggle(user)}>{user.isActive ? 'Деактивувати' : 'Активувати'}</SecondaryButton></ActionGroup></td>
                  </tr>
                ))}
              </tbody>
            </ProductTable>
          </TableScroll>
        )}
      </Panel>

      <Panel>
        <PanelHeader><div><PanelTitle>Запрошення</PanelTitle><PanelSubtitle>Кожен код діє один раз і має обмежений термін дії.</PanelSubtitle></div></PanelHeader>
        {invitations.length === 0 ? (
          <EmptyState><EmptySymbol>✉️</EmptySymbol><strong>Активних запрошень немає</strong><p>Створи код, щоб запросити дропшипера до компанії.</p></EmptyState>
        ) : (
          <TableScroll>
            <ProductTable>
              <thead><tr><th>Створено</th><th>Дійсне до</th><th>Використання</th><th>Статус</th><th>Дії</th></tr></thead>
              <tbody>
                {invitations.map((invitation) => (
                  <tr key={invitation.id}>
                    <td>{formatDate(invitation.createdAt)}</td>
                    <td>{formatDate(invitation.expiresAt)}</td>
                    <td>{invitation.usesCount ? 'Використане' : 'Не використане'}</td>
                    <td><RoleBadge $role={invitation.isUsable ? 'ACTIVE' : 'INACTIVE'}>{invitation.isUsable ? 'Активне' : invitation.revokedAt ? 'Відкликане' : 'Недійсне'}</RoleBadge></td>
                    <td><ActionGroup>{invitation.isUsable && <DangerButton type="button" onClick={() => handleRevokeInvitation(invitation)}>Відкликати</DangerButton>}</ActionGroup></td>
                  </tr>
                ))}
              </tbody>
            </ProductTable>
          </TableScroll>
        )}
      </Panel>
      </div>
    </Section>
  )
}
