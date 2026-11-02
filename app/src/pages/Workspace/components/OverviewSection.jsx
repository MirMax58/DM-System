import {
  EmptyState,
  EmptySymbol,
  Panel,
  PanelHeader,
  PanelSubtitle,
  PanelTitle,
  PrimaryButton,
  SecondaryButton,
  Section,
  StatCard,
  StatIcon,
  StatLabel,
  StatTop,
  StatValue,
  StatsGrid,
} from '../styles/common.styles.js'
import {
  ProductCell,
  ProductIcon,
} from '../styles/products.styles.js'
import {
  QuickActions,
  SimpleRow,
  SimpleRows,
  SimpleRowText,
} from '../styles/overview.styles.js'
import { formatPrice, getCategorySymbol } from '../utils/workspace.utils.js'

export default function OverviewSection({
  products,
  totalStock,
  lowStockCount,
  categories,
  role,
  onOpenProducts,
  onAddProduct,
}) {
  return (
    <Section>
      <StatsGrid>
        <StatCard>
          <StatTop>
            <StatLabel>Товарів у каталозі</StatLabel>
            <StatIcon $tone="#e4f7eb">📦</StatIcon>
          </StatTop>
          <StatValue>{products.length}</StatValue>
        </StatCard>

        <StatCard>
          <StatTop>
            <StatLabel>Одиниць на складі</StatLabel>
            <StatIcon $tone="#e7f1ff">🏬</StatIcon>
          </StatTop>
          <StatValue>{totalStock}</StatValue>
        </StatCard>

        <StatCard>
          <StatTop>
            <StatLabel>Малий залишок (менше 10)</StatLabel>
            <StatIcon $tone="#fff0dc">⚠️</StatIcon>
          </StatTop>
          <StatValue>{lowStockCount}</StatValue>
        </StatCard>

        <StatCard>
          <StatTop>
            <StatLabel>Категорій у каталозі</StatLabel>
            <StatIcon $tone="#f2e7ff">🏷️</StatIcon>
          </StatTop>
          <StatValue>{categories.length}</StatValue>
        </StatCard>
      </StatsGrid>

      <Panel>
        <PanelHeader>
          <div>
            <PanelTitle>Товари в каталозі</PanelTitle>
            <PanelSubtitle>Актуальний перелік товарів.</PanelSubtitle>
          </div>
          <SecondaryButton type="button" onClick={onOpenProducts}>
            Відкрити каталог →
          </SecondaryButton>
        </PanelHeader>

        {products.length === 0 ? (
          <EmptyState>
            <EmptySymbol>📦</EmptySymbol>
            <strong>Каталог поки порожній</strong>
            <p>Додай перший товар, щоб він відображався в цьому огляді.</p>
          </EmptyState>
        ) : (
          <SimpleRows>
            {products.slice(0, 4).map((product) => (
              <SimpleRow key={product.id}>
                <ProductCell>
                  <ProductIcon $category={product.category}>
                    {getCategorySymbol(product.category)}
                  </ProductIcon>
                  <SimpleRowText>
                    <strong>{product.name}</strong>
                    <span>
                      {product.sku} · {product.category}
                    </span>
                  </SimpleRowText>
                </ProductCell>

                <SimpleRowText>
                  <strong>{formatPrice(product.price)}</strong>
                  <span>Залишок: {product.stock}</span>
                </SimpleRowText>
              </SimpleRow>
            ))}
          </SimpleRows>
        )}
      </Panel>

      <QuickActions>
        {role === 'ADMIN' && (
          <PrimaryButton type="button" onClick={onAddProduct}>
            ➕ Додати товар
          </PrimaryButton>
        )}
        <SecondaryButton type="button" onClick={onOpenProducts}>
          Переглянути всі товари
        </SecondaryButton>
      </QuickActions>
    </Section>
  )
}
