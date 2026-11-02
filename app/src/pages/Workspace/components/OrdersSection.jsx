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
  StatCard,
  StatIcon,
  StatLabel,
  StatTop,
  StatValue,
  StatsGrid,
  TableScroll,
  TextInput,
  Toolbar,
} from '../styles/common.styles.js'
import {
  InlineTotal,
  OrderMeta,
  StatusBadge,
  StatusSelect,
} from '../styles/orders.styles.js'
import { formatDate, formatPrice, getOrderStatusLabel } from '../utils/workspace.utils.js'

export default function OrdersSection({
  role,
  products,
  visibleOrders,
  orderTotals,
  orderSearch,
  setOrderSearch,
  orderStatusFilter,
  setOrderStatusFilter,
  orderStatuses,
  allowedOrderTransitions,
  feedback,
  showOrderForm,
  orderForm,
  selectedOrderProduct,
  orderFormTotal,
  resetOrderForm,
  handleOrderFormChange,
  handleOrderSubmit,
  handleOrderStatusChange,
  handleDeleteOrder,
}) {
  function clearFilters() {
    setOrderSearch('')
    setOrderStatusFilter('all')
  }

  return (
    <Section>
      <StatsGrid>
        <StatCard>
          <StatTop>
            <StatLabel>Усього замовлень</StatLabel>
            <StatIcon $tone="#e7f1ff">🧾</StatIcon>
          </StatTop>
          <StatValue>{orderTotals.total}</StatValue>
        </StatCard>

        <StatCard>
          <StatTop>
            <StatLabel>Нові</StatLabel>
            <StatIcon $tone="#ecebff">🆕</StatIcon>
          </StatTop>
          <StatValue>{orderTotals.new}</StatValue>
        </StatCard>

        <StatCard>
          <StatTop>
            <StatLabel>В обробці</StatLabel>
            <StatIcon $tone="#fff0dc">⚙️</StatIcon>
          </StatTop>
          <StatValue>{orderTotals.processing}</StatValue>
        </StatCard>

        <StatCard>
          <StatTop>
            <StatLabel>Виконані</StatLabel>
            <StatIcon $tone="#e4f7eb">✅</StatIcon>
          </StatTop>
          <StatValue>{orderTotals.completed}</StatValue>
        </StatCard>
      </StatsGrid>

      <Panel>
        <PanelHeader>
          <div>
            <PanelTitle>
              {role === 'ADMIN' ? 'Усі замовлення' : 'Мої замовлення'}
            </PanelTitle>
            <PanelSubtitle>
              {role === 'ADMIN'
                ? 'Перегляд замовлень компанії та керування їхніми статусами.'
                : 'Перегляд і створення власних замовлень.'}
            </PanelSubtitle>
          </div>
        </PanelHeader>

        <Toolbar>
          <SearchWrap>
            <span aria-hidden="true">🔎</span>
            <SearchInput
              type="search"
              value={orderSearch}
              onChange={(event) => setOrderSearch(event.target.value)}
              placeholder="Пошук за номером, клієнтом або товаром..."
              aria-label="Пошук замовлень"
            />
          </SearchWrap>

          <FilterSelect
            value={orderStatusFilter}
            onChange={(event) => setOrderStatusFilter(event.target.value)}
            aria-label="Фільтр за статусом замовлення"
          >
            <option value="all">Усі статуси</option>
            {Object.entries(orderStatuses).map(([status, meta]) => (
              <option value={status} key={status}>
                {meta.label}
              </option>
            ))}
          </FilterSelect>
        </Toolbar>

        {feedback && (
          <Feedback $type={feedback.type} role="status">
            {feedback.text}
          </Feedback>
        )}

        {showOrderForm && role === 'DROPSHIPPER' && (
          <FormPanel>
            <FormHeader>
              <div>
                <FormTitle>Нове замовлення</FormTitle>
                <FormHint>Вкажи дані клієнта, товар і кількість.</FormHint>
              </div>
              <SecondaryButton type="button" onClick={resetOrderForm}>
                Закрити
              </SecondaryButton>
            </FormHeader>

            <form onSubmit={handleOrderSubmit}>
              <FormGrid>
                <Field>
                  <FieldLabel htmlFor="order-customer-name">
                    Ім’я клієнта *
                  </FieldLabel>
                  <TextInput
                    id="order-customer-name"
                    name="customerName"
                    value={orderForm.customerName}
                    onChange={handleOrderFormChange}
                    placeholder="Наприклад, Марія Сидоренко"
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="order-customer-phone">
                    Телефон клієнта *
                  </FieldLabel>
                  <TextInput
                    id="order-customer-phone"
                    name="customerPhone"
                    type="tel"
                    value={orderForm.customerPhone}
                    onChange={handleOrderFormChange}
                    placeholder="+380 ..."
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="order-product">Товар *</FieldLabel>
                  <FilterSelect
                    id="order-product"
                    name="productId"
                    value={orderForm.productId}
                    onChange={handleOrderFormChange}
                    required
                  >
                    <option value="">Обери товар</option>
                    {products
                      .filter((product) => Number(product.stock) > 0)
                      .map((product) => (
                        <option value={product.id} key={product.id}>
                          {product.name} · {product.stock} шт. · {formatPrice(product.price)}
                        </option>
                      ))}
                  </FilterSelect>
                </Field>

                <Field>
                  <FieldLabel htmlFor="order-quantity">Кількість *</FieldLabel>
                  <TextInput
                    id="order-quantity"
                    name="quantity"
                    type="number"
                    min="1"
                    step="1"
                    max={selectedOrderProduct?.stock || undefined}
                    value={orderForm.quantity}
                    onChange={handleOrderFormChange}
                    required
                  />
                </Field>
              </FormGrid>

              <InlineTotal>
                <span>Сума замовлення</span>
                <strong>{formatPrice(orderFormTotal)}</strong>
              </InlineTotal>

              <FormActions>
                <SecondaryButton type="button" onClick={resetOrderForm}>
                  Скасувати
                </SecondaryButton>
                <PrimaryButton
                  type="submit"
                  disabled={!products.some((product) => Number(product.stock) > 0)}
                >
                  Створити замовлення
                </PrimaryButton>
              </FormActions>
            </form>
          </FormPanel>
        )}

        {visibleOrders.length === 0 ? (
          <EmptyState>
            <EmptySymbol>🧾</EmptySymbol>
            <strong>Замовлень не знайдено</strong>
            <p>
              {orderSearch || orderStatusFilter !== 'all'
                ? 'Зміни пошук або фільтр статусу.'
                : 'Тут відображатимуться створені замовлення.'}
            </p>
            {(orderSearch || orderStatusFilter !== 'all') && (
              <SecondaryButton type="button" onClick={clearFilters}>
                Скинути фільтри
              </SecondaryButton>
            )}
          </EmptyState>
        ) : (
          <TableScroll>
            <ProductTable>
              <thead>
                <tr>
                  <th>Замовлення</th>
                  <th>Клієнт</th>
                  <th>Товар</th>
                  <th>Сума</th>
                  <th>Дата</th>
                  <th>Статус</th>
                  {role === 'ADMIN' && <th>Дії</th>}
                </tr>
              </thead>

              <tbody>
                {visibleOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <OrderMeta>
                        <strong>{order.id}</strong>
                        <span>{order.createdByName || 'Дропшипер'}</span>
                      </OrderMeta>
                    </td>
                    <td>
                      <OrderMeta>
                        <strong>{order.customerName}</strong>
                        <span>{order.customerPhone}</span>
                      </OrderMeta>
                    </td>
                    <td>
                      <OrderMeta>
                        <strong>
                          {(order.items || [])
                            .map((item) => item.productName)
                            .join(', ')}
                        </strong>
                        <span>
                          {(order.items || [])
                            .map(
                              (item) =>
                                `${item.quantity} × ${formatPrice(item.unitPrice)}`,
                            )
                            .join(' · ')}
                        </span>
                      </OrderMeta>
                    </td>
                    <td><strong>{formatPrice(order.total)}</strong></td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>
                      {role === 'ADMIN' &&
                      allowedOrderTransitions[order.status]?.length > 0 ? (
                        <StatusSelect
                          value={order.status}
                          onChange={(event) =>
                            handleOrderStatusChange(order.id, event.target.value)
                          }
                          aria-label={`Змінити статус ${order.id}`}
                        >
                          <option value={order.status}>
                            {getOrderStatusLabel(order.status)}
                          </option>
                          {allowedOrderTransitions[order.status].map((status) => (
                            <option value={status} key={status}>
                              {getOrderStatusLabel(status)}
                            </option>
                          ))}
                        </StatusSelect>
                      ) : (
                        <StatusBadge $status={order.status}>
                          {order.status === 'COMPLETED'
                            ? '✅ '
                            : order.status === 'CANCELLED'
                              ? '⛔ '
                              : order.status === 'PROCESSING'
                                ? '🟠 '
                                : '🔵 '}
                          {getOrderStatusLabel(order.status)}
                        </StatusBadge>
                      )}
                    </td>

                    {role === 'ADMIN' && (
                      <td>
                        <ActionGroup>
                          <DangerButton
                            type="button"
                            onClick={() => handleDeleteOrder(order)}
                          >
                            🗑️ Видалити
                          </DangerButton>
                        </ActionGroup>
                      </td>
                    )}
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
