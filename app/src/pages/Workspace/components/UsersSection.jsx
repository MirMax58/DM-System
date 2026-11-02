import {
  ActionGroup,
  DangerButton,
  EmptyState,
  EmptySymbol,
  Feedback,
  Field,
  FieldLabel,
  FilterSelect,
  FormActions,
  FormGrid,
  FormHeader,
  FormHint,
  FormPanel,
  FormTitle,
  Panel,
  PanelHeader,
  PanelSubtitle,
  PanelTitle,
  PrimaryButton,
  ProductTable,
  SearchInput,
  SearchWrap,
  SecondaryButton,
  Section,
  TableScroll,
  TextInput,
  Toolbar,
} from '../styles/common.styles.js'
import { RoleBadge, UserNameCell } from '../styles/users.styles.js'

export default function UsersSection({
  filteredUsers,
  userSearch,
  setUserSearch,
  userRoleFilter,
  setUserRoleFilter,
  feedback,
  showUserForm,
  editingUserId,
  userForm,
  openEditUserForm,
  resetUserForm,
  handleUserFormChange,
  handleUserSubmit,
  handleDeleteUser,
}) {
  return (
    <Section>
      <Panel>
        <PanelHeader>
          <div>
            <PanelTitle>Користувачі компанії</PanelTitle>
            <PanelSubtitle>
              Облікові записи, ролі та належність до компанії.
            </PanelSubtitle>
          </div>
        </PanelHeader>

        <Toolbar>
          <SearchWrap>
            <span aria-hidden="true">🔎</span>
            <SearchInput
              type="search"
              value={userSearch}
              onChange={(event) => setUserSearch(event.target.value)}
              placeholder="Пошук за ім’ям або email..."
              aria-label="Пошук користувачів"
            />
          </SearchWrap>

          <FilterSelect
            value={userRoleFilter}
            onChange={(event) => setUserRoleFilter(event.target.value)}
            aria-label="Фільтр за роллю"
          >
            <option value="all">Усі ролі</option>
            <option value="ADMIN">Адміністратори</option>
            <option value="DROPSHIPPER">Дропшипери</option>
          </FilterSelect>
        </Toolbar>

        {feedback && (
          <Feedback $type={feedback.type} role="status">
            {feedback.text}
          </Feedback>
        )}

        {showUserForm && (
          <FormPanel>
            <FormHeader>
              <div>
                <FormTitle>
                  {editingUserId ? 'Редагування користувача' : 'Новий користувач'}
                </FormTitle>
                <FormHint>
                  Заповни основні дані та признач роль у компанії.
                </FormHint>
              </div>
              <SecondaryButton type="button" onClick={resetUserForm}>
                Закрити
              </SecondaryButton>
            </FormHeader>

            <form onSubmit={handleUserSubmit}>
              <FormGrid>
                <Field>
                  <FieldLabel htmlFor="user-name">Ім’я та прізвище *</FieldLabel>
                  <TextInput
                    id="user-name"
                    name="name"
                    value={userForm.name}
                    onChange={handleUserFormChange}
                    placeholder="Ім’я користувача"
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="user-email">Email *</FieldLabel>
                  <TextInput
                    id="user-email"
                    name="email"
                    type="email"
                    value={userForm.email}
                    onChange={handleUserFormChange}
                    placeholder="name@example.com"
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="user-role">Роль *</FieldLabel>
                  <FilterSelect
                    id="user-role"
                    name="role"
                    value={userForm.role}
                    onChange={handleUserFormChange}
                  >
                    <option value="DROPSHIPPER">Дропшипер</option>
                    <option value="ADMIN">Адміністратор</option>
                  </FilterSelect>
                </Field>
              </FormGrid>

              <FormActions>
                <SecondaryButton type="button" onClick={resetUserForm}>
                  Скасувати
                </SecondaryButton>
                <PrimaryButton type="submit">
                  {editingUserId ? 'Зберегти зміни' : 'Додати користувача'}
                </PrimaryButton>
              </FormActions>
            </form>
          </FormPanel>
        )}

        {filteredUsers.length === 0 ? (
          <EmptyState>
            <EmptySymbol>👥</EmptySymbol>
            <strong>Користувачів не знайдено</strong>
            <p>Зміни пошук або вибери іншу роль.</p>
          </EmptyState>
        ) : (
          <TableScroll>
            <ProductTable>
              <thead>
                <tr>
                  <th>Користувач</th>
                  <th>Роль</th>
                  <th>Компанія</th>
                  <th>Дії</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <UserNameCell>
                        <span>👤</span>
                        <div>
                          <strong>{user.name}</strong>
                          <small>{user.email}</small>
                        </div>
                      </UserNameCell>
                    </td>
                    <td>
                      <RoleBadge $role={user.role}>
                        {user.role === 'ADMIN' ? 'Адміністратор' : 'Дропшипер'}
                      </RoleBadge>
                    </td>
                    <td>{user.companyName || 'DM Company'}</td>
                    <td>
                      <ActionGroup>
                        <SecondaryButton
                          type="button"
                          onClick={() => openEditUserForm(user)}
                        >
                          ✏️ Редагувати
                        </SecondaryButton>
                        <DangerButton
                          type="button"
                          onClick={() => handleDeleteUser(user)}
                        >
                          🗑️ Видалити
                        </DangerButton>
                      </ActionGroup>
                    </td>
                  </tr>
                ))}
              </tbody>
            </ProductTable>
          </TableScroll>
        )}
      </Panel>
    </Section>
  )
}
