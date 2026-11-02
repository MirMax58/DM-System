import OverviewSection from './components/OverviewSection.jsx'
import OrdersSection from './components/OrdersSection.jsx'
import ProductsSection from './components/ProductsSection.jsx'
import UsersSection from './components/UsersSection.jsx'
import WorkspacePageIntro from './components/WorkspacePageIntro.jsx'
import WorkspaceSidebar from './components/WorkspaceSidebar.jsx'
import WorkspaceTopbar from './components/WorkspaceTopbar.jsx'
import useWorkspace from './hooks/useWorkspace.js'
import { Main, Page } from './styles/layout.styles.js'

function Workspace() {
  const workspace = useWorkspace()
  const {
    activeSection,
    role,
    feedback,
    visibleNavigation,
    currentSection,
    handleRoleChange,
    handleSectionChange,
    overview,
    products,
    orders,
    users,
  } = workspace

  return (
    <Page>
      <WorkspaceSidebar
        items={visibleNavigation}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />

      <Main>
        <WorkspaceTopbar role={role} onRoleChange={handleRoleChange} />

        <WorkspacePageIntro
          section={currentSection}
          activeSection={activeSection}
          role={role}
          onAddProduct={products.openNewProductForm}
          onNewOrder={orders.openOrderForm}
          onAddUser={users.openNewUserForm}
        />

        {activeSection === 'overview' && <OverviewSection {...overview} />}

        {activeSection === 'products' && (
          <ProductsSection
            {...products}
            role={role}
            feedback={feedback}
          />
        )}

        {activeSection === 'orders' && (
          <OrdersSection
            {...orders}
            products={products.products}
            role={role}
            feedback={feedback}
          />
        )}

        {activeSection === 'users' && role === 'ADMIN' && (
          <UsersSection {...users} feedback={feedback} />
        )}
      </Main>
    </Page>
  )
}

export default Workspace
