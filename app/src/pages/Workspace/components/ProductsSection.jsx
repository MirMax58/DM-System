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
  FullWidthField,
  Panel,
  PrimaryButton,
  ProductTable,
  SearchInput,
  SearchWrap,
  SecondaryButton,
  Section,
  TableScroll,
  TextArea,
  TextInput,
  Toolbar,
} from '../styles/common.styles.js'
import {
  CategoryBadge,
  ProductCard,
  ProductCardMeta,
  ProductCardPrice,
  ProductCardTop,
  ProductDescription,
  ProductIcon,
  ProductName,
  ProductsGrid,
  ProductCell,
  Sku,
  StockBadge,
} from '../styles/products.styles.js'
import { formatPrice, getCategorySymbol } from '../utils/workspace.utils.js'

export default function ProductsSection({
  role,
  filteredProducts,
  categories,
  productCategories,
  search,
  setSearch,
  categoryFilter,
  setCategoryFilter,
  feedback,
  showProductForm,
  editingProductId,
  productForm,
  handleProductFormChange,
  handleProductSubmit,
  resetProductForm,
  openEditProductForm,
  handleDeleteProduct,
}) {
  function clearFilters() {
    setSearch('')
    setCategoryFilter('all')
  }

  return (
    <Section>
      <Panel>
        <Toolbar>
          <SearchWrap>
            <span aria-hidden="true">🔎</span>
            <SearchInput
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Пошук за назвою, артикулом або описом..."
              aria-label="Пошук товарів"
            />
          </SearchWrap>

          <FilterSelect
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            aria-label="Фільтр за категорією"
          >
            <option value="all">Усі категорії</option>
            {categories.map((category) => (
              <option value={category} key={category}>
                {category}
              </option>
            ))}
          </FilterSelect>
        </Toolbar>

        {feedback && (
          <Feedback $type={feedback.type} role="status">
            {feedback.text}
          </Feedback>
        )}

        {showProductForm && role === 'ADMIN' && (
          <FormPanel>
            <FormHeader>
              <div>
                <FormTitle>
                  {editingProductId ? 'Редагування товару' : 'Новий товар'}
                </FormTitle>
                <FormHint>
                  Заповни дані каталогу. Артикул має бути унікальним у межах компанії.
                </FormHint>
              </div>
              <SecondaryButton type="button" onClick={resetProductForm}>
                Закрити
              </SecondaryButton>
            </FormHeader>

            <form onSubmit={handleProductSubmit}>
              <FormGrid>
                <Field>
                  <FieldLabel htmlFor="product-name">Назва товару *</FieldLabel>
                  <TextInput
                    id="product-name"
                    name="name"
                    value={productForm.name}
                    onChange={handleProductFormChange}
                    placeholder="Наприклад, бездротові навушники"
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="product-sku">Артикул (SKU) *</FieldLabel>
                  <TextInput
                    id="product-sku"
                    name="sku"
                    value={productForm.sku}
                    onChange={handleProductFormChange}
                    placeholder="DM-1005"
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="product-category">Категорія *</FieldLabel>
                  <FilterSelect
                    id="product-category"
                    name="category"
                    value={productForm.category}
                    onChange={handleProductFormChange}
                  >
                    {productCategories.map((category) => (
                      <option value={category} key={category}>
                        {category}
                      </option>
                    ))}
                  </FilterSelect>
                </Field>

                <Field>
                  <FieldLabel htmlFor="product-price">Ціна, грн *</FieldLabel>
                  <TextInput
                    id="product-price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={productForm.price}
                    onChange={handleProductFormChange}
                    placeholder="1299"
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="product-stock">Залишок на складі *</FieldLabel>
                  <TextInput
                    id="product-stock"
                    name="stock"
                    type="number"
                    min="0"
                    step="1"
                    value={productForm.stock}
                    onChange={handleProductFormChange}
                    placeholder="25"
                  />
                </Field>

                <FullWidthField>
                  <FieldLabel htmlFor="product-description">Опис товару</FieldLabel>
                  <TextArea
                    id="product-description"
                    name="description"
                    value={productForm.description}
                    onChange={handleProductFormChange}
                    placeholder="Коротко опиши товар та його особливості"
                  />
                </FullWidthField>
              </FormGrid>

              <FormActions>
                <SecondaryButton type="button" onClick={resetProductForm}>
                  Скасувати
                </SecondaryButton>
                <PrimaryButton type="submit">
                  {editingProductId ? 'Зберегти зміни' : 'Додати до каталогу'}
                </PrimaryButton>
              </FormActions>
            </form>
          </FormPanel>
        )}

        {filteredProducts.length === 0 ? (
          <EmptyState>
            <EmptySymbol>🔎</EmptySymbol>
            <strong>Товарів не знайдено</strong>
            <p>Зміни пошуковий запит або вибери іншу категорію.</p>
            {(search || categoryFilter !== 'all') && (
              <SecondaryButton type="button" onClick={clearFilters}>
                Скинути фільтри
              </SecondaryButton>
            )}
          </EmptyState>
        ) : role === 'ADMIN' ? (
          <TableScroll>
            <ProductTable>
              <thead>
                <tr>
                  <th>Товар</th>
                  <th>Артикул</th>
                  <th>Категорія</th>
                  <th>Ціна</th>
                  <th>Залишок</th>
                  <th>Дії</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <ProductCell>
                        <ProductIcon $category={product.category}>
                          {getCategorySymbol(product.category)}
                        </ProductIcon>
                        <div>
                          <ProductName>{product.name}</ProductName>
                          <ProductDescription>
                            {product.description || 'Опис не додано'}
                          </ProductDescription>
                        </div>
                      </ProductCell>
                    </td>
                    <td><Sku>{product.sku}</Sku></td>
                    <td><CategoryBadge>{product.category}</CategoryBadge></td>
                    <td><strong>{formatPrice(product.price)}</strong></td>
                    <td>
                      <StockBadge $low={Number(product.stock) < 10}>
                        {product.stock} шт.
                      </StockBadge>
                    </td>
                    <td>
                      <ActionGroup>
                        <SecondaryButton
                          type="button"
                          onClick={() => openEditProductForm(product)}
                        >
                          ✏️ Редагувати
                        </SecondaryButton>
                        <DangerButton
                          type="button"
                          onClick={() => handleDeleteProduct(product)}
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
        ) : (
          <ProductsGrid>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id}>
                <ProductCardTop>
                  <ProductIcon $category={product.category}>
                    {getCategorySymbol(product.category)}
                  </ProductIcon>
                  <CategoryBadge>{product.category}</CategoryBadge>
                </ProductCardTop>
                <ProductName>{product.name}</ProductName>
                <ProductDescription>
                  {product.description || 'Опис не додано'}
                </ProductDescription>
                <ProductCardPrice>{formatPrice(product.price)}</ProductCardPrice>
                <ProductCardMeta>
                  <Sku>{product.sku}</Sku>
                  <StockBadge $low={Number(product.stock) < 10}>
                    {Number(product.stock) > 0
                      ? `${product.stock} шт. в наявності`
                      : 'Немає в наявності'}
                  </StockBadge>
                </ProductCardMeta>
              </ProductCard>
            ))}
          </ProductsGrid>
        )}
      </Panel>
    </Section>
  )
}
