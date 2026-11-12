import { useMemo, useState } from 'react'
import { useMutation } from '@apollo/client'
import { CREATE_PRODUCT_MUTATION, DELETE_PRODUCT_MUTATION, UPDATE_PRODUCT_MUTATION } from '../../../graphql/operations.js'
import { EMPTY_PRODUCT_FORM, PRODUCT_CATEGORIES } from '../constants/workspace.constants.js'

export default function useProducts({ products, refetchProducts, setActiveSection, setFeedback }) {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProductId, setEditingProductId] = useState(null)
  const [productForm, setProductForm] = useState({ ...EMPTY_PRODUCT_FORM })
  const [createProduct, { loading: creating }] = useMutation(CREATE_PRODUCT_MUTATION)
  const [updateProduct, { loading: updating }] = useMutation(UPDATE_PRODUCT_MUTATION)
  const [deleteProduct] = useMutation(DELETE_PRODUCT_MUTATION)
  const categories = useMemo(() => [...new Set([...PRODUCT_CATEGORIES, ...products.map((p) => p.category).filter(Boolean)])].sort(), [products])
  const totalStock = products.reduce((sum, product) => sum + Number(product.stock || 0), 0)
  const lowStockCount = products.filter((product) => Number(product.stock) < 10).length
  const query = search.trim().toLowerCase()
  const filteredProducts = products.filter((p) => [p.name, p.sku, p.description].some((v) => String(v || '').toLowerCase().includes(query)) && (categoryFilter === 'all' || p.category === categoryFilter))

  function resetProductForm() { setProductForm({ ...EMPTY_PRODUCT_FORM }); setEditingProductId(null); setShowProductForm(false) }
  function openNewProductForm() { setActiveSection('products'); setProductForm({ ...EMPTY_PRODUCT_FORM }); setEditingProductId(null); setFeedback(null); setShowProductForm(true) }
  function openEditProductForm(product) {
    setProductForm({ name: product.name, sku: product.sku, category: product.category, price: String(product.price), stock: String(product.stock), description: product.description || '' })
    setEditingProductId(product.id); setFeedback(null); setShowProductForm(true)
  }
  function handleProductFormChange(event) { const { name, value } = event.target; setProductForm((current) => ({ ...current, [name]: value })) }

  async function handleProductSubmit(event) {
    event.preventDefault()
    const input = { name: productForm.name.trim(), sku: productForm.sku.trim().toUpperCase(), category: productForm.category, description: productForm.description.trim(), price: Number(productForm.price), stock: Number(productForm.stock) }
    if (!input.name || !input.sku || !input.category) return setFeedback({ type: 'error', text: 'Заповни назву товару, артикул і категорію.' })
    if (productForm.price === '' || !Number.isFinite(input.price) || input.price < 0) return setFeedback({ type: 'error', text: 'Ціна має бути невід’ємним числом.' })
    if (productForm.stock === '' || !Number.isInteger(input.stock) || input.stock < 0) return setFeedback({ type: 'error', text: 'Залишок має бути цілим невід’ємним числом.' })
    if (products.some((p) => p.sku.toLowerCase() === input.sku.toLowerCase() && p.id !== editingProductId)) return setFeedback({ type: 'error', text: 'Товар з таким артикулом уже є в каталозі.' })
    const wasEditing = Boolean(editingProductId)
    try {
      if (wasEditing) await updateProduct({ variables: { id: editingProductId, input } })
      else await createProduct({ variables: { input } })
      await refetchProducts(); resetProductForm()
      setFeedback({ type: 'success', text: wasEditing ? 'Дані товару оновлено.' : 'Товар додано до каталогу.' })
    } catch (error) { setFeedback({ type: 'error', text: error.message || 'Не вдалося зберегти товар.' }) }
  }

  async function handleDeleteProduct(product) {
    if (!window.confirm(`Видалити товар «${product.name}»?`)) return
    try { await deleteProduct({ variables: { id: product.id } }); await refetchProducts(); if (editingProductId === product.id) resetProductForm(); setFeedback({ type: 'success', text: `Товар «${product.name}» видалено.` }) }
    catch (error) { setFeedback({ type: 'error', text: error.message || 'Не вдалося видалити товар.' }) }
  }

  return { products, search, setSearch, categoryFilter, setCategoryFilter, categories, totalStock, lowStockCount, filteredProducts, showProductForm, editingProductId, productForm, handleProductFormChange, handleProductSubmit, resetProductForm, openNewProductForm, openEditProductForm, handleDeleteProduct, hideProductForm: () => setShowProductForm(false), productCategories: categories, savingProduct: creating || updating }
}
