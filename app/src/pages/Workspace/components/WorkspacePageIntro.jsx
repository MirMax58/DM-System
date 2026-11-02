import {
  Eyebrow,
  PageDescription,
  PageIntro,
  PageTitle,
  IntroText,
} from '../styles/layout.styles.js'
import { PrimaryButton } from '../styles/common.styles.js'

export default function WorkspacePageIntro({
  section,
  activeSection,
  role,
  onAddProduct,
  onNewOrder,
  onAddUser,
}) {
  return (
    <PageIntro>
      <IntroText>
        <Eyebrow>{section.eyebrow}</Eyebrow>
        <PageTitle>{section.title}</PageTitle>
        <PageDescription>{section.description}</PageDescription>
      </IntroText>

      {activeSection === 'products' && role === 'ADMIN' && (
        <PrimaryButton type="button" onClick={onAddProduct}>
          <span aria-hidden="true">➕</span> Додати товар
        </PrimaryButton>
      )}

      {activeSection === 'orders' && role === 'DROPSHIPPER' && (
        <PrimaryButton type="button" onClick={onNewOrder}>
          ➕ Нове замовлення
        </PrimaryButton>
      )}

      {activeSection === 'users' && role === 'ADMIN' && (
        <PrimaryButton type="button" onClick={onAddUser}>
          ➕ Додати користувача
        </PrimaryButton>
      )}
    </PageIntro>
  )
}
