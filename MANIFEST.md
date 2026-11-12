# Перелік файлів оновлення

## Додати

### Backend (`server-graphql/`)
- `.env.example`
- `config/database.js`
- `models/Company.js`
- `models/User.js`
- `models/Invitation.js`
- `models/Product.js`
- `models/Order.js`
- `utils/errors.js`
- `utils/security.js`

### Frontend (`app/src/`)
- `auth/AuthContext.jsx`
- `components/ProtectedRoute.jsx`
- `graphql/operations.js`
- `lib/apollo.js`
- `pages/Auth/AuthPage.jsx`
- `pages/Auth/AuthPage.css`
- `pages/Workspace/components/CompanySection.jsx`

## Замінити

### Backend
- `server-graphql/package.json`
- `server-graphql/index.js`
- `server-graphql/schema.js`
- `server-graphql/resolvers.js`
- `server-graphql/auth.js`
- `server-graphql/data.js` (позначено як застарілий модуль, активний API його не використовує)

### Frontend
- `app/package.json`
- `app/index.html`
- `app/index.html`
- `app/src/main.jsx`
- `app/src/App.jsx`
- `app/src/pages/Workspace/Workspace.jsx`
- `app/src/pages/Workspace/components/OrdersSection.jsx`
- `app/src/pages/Workspace/components/UsersSection.jsx`
- `app/src/pages/Workspace/components/WorkspacePageIntro.jsx`
- `app/src/pages/Workspace/components/WorkspaceTopbar.jsx`
- `app/src/pages/Workspace/constants/workspace.constants.js`
- `app/src/pages/Workspace/hooks/useWorkspace.js`
- `app/src/pages/Workspace/hooks/useProducts.js`
- `app/src/pages/Workspace/hooks/useOrders.js`
- `app/src/pages/Workspace/hooks/useUsers.js`
- `app/src/pages/Workspace/styles/users.styles.js`

## Не змінювати

- Публічні компоненти головної сторінки.
- Наявні стилі каталогу, замовлень, загального layout та sidebar.
- Наявні компоненти `ProductsSection`, `OverviewSection`, `WorkspaceSidebar` та утиліти.
- Старий REST-сервер `server/` — він більше не використовується вебклієнтом як основний API.

Після копіювання запусти `npm install` окремо в `server-graphql/` та `app/`, щоб оновити lock-файли відповідно до нових залежностей.
