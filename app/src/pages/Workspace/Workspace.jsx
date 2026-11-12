import CompanySection from './components/CompanySection.jsx'
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
  const { activeSection, role, user, company, logout, feedback, visibleNavigation, currentSection, handleSectionChange, overview, products, orders, users, loading, error, companySettings } = workspace

  if (loading) return <div className="app-loading">Завантаження робочого простору…</div>
  if (error && !products.products.length && !orders.orders.length) {
    return <div className="app-loading"><div><p>Не вдалося завантажити робочий простір.</p><p>{error.message}</p><button onClick={() => window.location.reload()}>Спробувати ще раз</button></div></div>
  }

  return (
    <Page>
      <WorkspaceSidebar items={visibleNavigation} activeSection={activeSection} onSectionChange={handleSectionChange} />
      <Main>
        <WorkspaceTopbar role={role} user={user} company={company} onLogout={logout} />
        {error && <div role="alert" style={{ marginBottom: 16, padding: '10px 13px', borderRadius: 9, background: '#fff4f4', color: '#a72d3d', fontSize: 12 }}>{error.message}</div>}
        <WorkspacePageIntro section={currentSection} activeSection={activeSection} role={role} onAddProduct={products.openNewProductForm} onNewOrder={orders.openOrderForm} onAddUser={users.openNewUserForm} />
        {activeSection === 'overview' && <OverviewSection {...overview} />}
        {activeSection === 'products' && <ProductsSection {...products} role={role} feedback={feedback} />}
        {activeSection === 'orders' && <OrdersSection {...orders} products={products.products} role={role} feedback={feedback} />}
        {activeSection === 'users' && role === 'ADMIN' && <UsersSection {...users} feedback={feedback} />}
        {activeSection === 'company' && role === 'ADMIN' && <CompanySection {...companySettings} />}
      </Main>
    </Page>
  )
}

export default Workspace
