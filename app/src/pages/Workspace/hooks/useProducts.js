import { useState } from 'react'
import {
  DEMO_COMPANY_ID,
  EMPTY_PRODUCT_FORM,
  PRODUCT_CATEGORIES,
} from '../constants/workspace.constants.js'

export default function useProducts({
  products,
  setProducts,
  orders,
  setActiveSection,
  setFeedback,
}) {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProductId, setEditingProductId] = useState(null)
  const [productForm, setProductForm] = useState({ ...EMPTY_PRODUCT_FORM })

  const categories = [...new Set(products.map((product) => product.category))].sort()
  const totalStock = products.reduce(
    (sum, product) => sum + Number(product.stock || 0),
    0,
  )
  const lowStockCount = products.filter(
    (product) => Number(product.stock) < 10,
  ).length

  const normalizedSearch = search.trim().toLowerCase()
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      String(product.name || '').toLowerCase().includes(normalizedSearch) ||
      String(product.sku || '').toLowerCase().includes(normalizedSearch) ||
      String(product.description || '').toLowerCase().includes(normalizedSearch)
    const matchesCategory =
      categoryFilter === 'all' || product.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  function resetProductForm() {
    setProductForm({ ...EMPTY_PRODUCT_FORM })
    setEditingProductId(null)
    setShowProductForm(false)
  }

  function openNewProductForm() {
    setActiveSection('products')
    setProductForm({ ...EMPTY_PRODUCT_FORM })
    setEditingProductId(null)
    setFeedback(null)
    setShowProductForm(true)
  }

  function openEditProductForm(product) {
    setProductForm({
      name: product.name,
      sku: product.sku,
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
      description: product.description || '',
    })
    setEditingProductId(product.id)
    setFeedback(null)
    setShowProductForm(true)
  }

  function handleProductFormChange(event) {
    const { name, value } = event.target
    setProductForm((current) => ({ ...current, [name]: value }))
  }

  function handleProductSubmit(event) {
    event.preventDefault()

    const name = productForm.name.trim()
    const sku = productForm.sku.trim().toUpperCase()
    const category = productForm.category
    const description = productForm.description.trim()
    const price = Number(productForm.price)
    const stock = Number(productForm.stock)

    if (!name || !sku || !category) {
      setFeedback({
        type: 'error',
        text: 'Заповни назву товару, артикул і категорію.',
      })
      return
    }

    if (productForm.price === '' || !Number.isFinite(price) || price < 0) {
      setFeedback({
        type: 'error',
        text: 'Ціна має бути числом, що дорівнює нулю або більше.',
      })
      return
    }

    if (productForm.stock === '' || !Number.isInteger(stock) || stock < 0) {
      setFeedback({
        type: 'error',
        text: 'Залишок має бути цілим невід’ємним числом.',
      })
      return
    }

    const skuExists = products.some(
      (product) =>
        product.sku.toLowerCase() === sku.toLowerCase() &&
        product.id !== editingProductId,
    )

    if (skuExists) {
      setFeedback({
        type: 'error',
        text: 'Товар з таким артикулом уже існує в цій компанії.',
      })
      return
    }

    if (editingProductId) {
      setProducts((current) =>
        current.map((product) =>
          product.id === editingProductId
            ? { ...product, name, sku, category, description, price, stock }
            : product,
        ),
      )
      resetProductForm()
      setFeedback({ type: 'success', text: 'Дані товару оновлено.' })
      return
    }

    const newProduct = {
      id: `prod-${Date.now()}`,
      companyId: DEMO_COMPANY_ID,
      name,
      sku,
      category,
      description,
      price,
      stock,
    }

    setProducts((current) => [newProduct, ...current])
    resetProductForm()
    setFeedback({ type: 'success', text: 'Товар додано до каталогу.' })
  }

  function handleDeleteProduct(product) {
    const hasOpenOrder = orders.some(
      (order) =>
        order.stockDeducted &&
        ['NEW', 'PROCESSING'].includes(order.status) &&
        (order.items || []).some((item) => item.productId === product.id),
    )

    if (hasOpenOrder) {
      setFeedback({
        type: 'error',
        text: 'Товар є в активному замовленні. Спершу заверши або скасуй це замовлення.',
      })
      return
    }

    if (!window.confirm(`Видалити товар «${product.name}»?`)) return

    setProducts((current) => current.filter((item) => item.id !== product.id))
    setFeedback({
      type: 'success',
      text: `Товар «${product.name}» видалено.`,
    })

    if (editingProductId === product.id) {
      resetProductForm()
    }
  }

  function hideProductForm() {
    setShowProductForm(false)
  }

  return {
    products,
    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    categories,
    totalStock,
    lowStockCount,
    filteredProducts,
    showProductForm,
    editingProductId,
    productForm,
    handleProductFormChange,
    handleProductSubmit,
    resetProductForm,
    openNewProductForm,
    openEditProductForm,
    handleDeleteProduct,
    hideProductForm,
    productCategories: PRODUCT_CATEGORIES,
  }
}
