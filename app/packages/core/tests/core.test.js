import test from 'node:test'
import assert from 'node:assert/strict'
import {
  validateProduct, validateOrder, validateCompanyName, canChangeOrderStatus,
  restoreOrderStock, formatPrice, formatDate, filterProducts, filterOrders, filterUsers, sortByDateDescending,
  createMemoryStorageAdapter, createStorageService,
} from '../src/index.js'

test('valid product passes', () => assert.equal(validateProduct({name:'Mouse',sku:'M1',category:'Електроніка',price:100,stock:3}).valid, true))
test('empty product name fails', () => assert.equal(validateProduct({name:'',sku:'M1',category:'Електроніка',price:100,stock:3}).valid, false))
test('empty product sku fails', () => assert.equal(validateProduct({name:'Mouse',sku:'',category:'Електроніка',price:100,stock:3}).valid, false))
test('negative product price fails', () => assert.equal(validateProduct({name:'Mouse',sku:'M1',category:'Електроніка',price:-1,stock:3}).valid, false))
test('negative stock fails', () => assert.equal(validateProduct({name:'Mouse',sku:'M1',category:'Електроніка',price:100,stock:-1}).valid, false))
test('valid order passes', () => assert.equal(validateOrder({customerName:'Max',customerPhone:'123',items:[{productId:'p1',quantity:2}]},[{id:'p1',stock:3}]).valid, true))
test('order without customer fails', () => assert.equal(validateOrder({customerName:'',customerPhone:'123',items:[{productId:'p1',quantity:2}]},[{id:'p1',stock:3}]).valid, false))
test('order without product fails', () => assert.equal(validateOrder({customerName:'Max',customerPhone:'123',items:[{productId:'missing',quantity:2}]},[]).valid, false))
test('zero quantity fails', () => assert.equal(validateOrder({customerName:'Max',customerPhone:'123',items:[{productId:'p1',quantity:0}]},[{id:'p1',stock:3}]).valid, false))
test('NEW can move to PROCESSING', () => assert.equal(canChangeOrderStatus('NEW','PROCESSING'), true))
test('COMPLETED cannot move to NEW', () => assert.equal(canChangeOrderStatus('COMPLETED','NEW'), false))
test('unknown status cannot change', () => assert.equal(canChangeOrderStatus('UNKNOWN','NEW'), false))
test('restore stock', () => assert.deepEqual(restoreOrderStock([{id:'p1',stock:2}],{items:[{productId:'p1',quantity:3}]}),[{id:'p1',stock:5}]))
test('format price returns string', () => assert.equal(typeof formatPrice(100), 'string'))
test('invalid date returns dash', () => assert.equal(formatDate('bad-date'), '—'))
test('memory adapter stores and reads data', async () => { const a=createMemoryStorageAdapter(); await a.set('x',1); assert.equal(await a.get('x'),1) })
test('storage service removes data', async () => { const s=createStorageService(createMemoryStorageAdapter()); await s.set('x',1); await s.remove('x'); assert.equal(await s.get('x'),null) })
test('storage service rejects invalid adapter', () => assert.throws(() => createStorageService({}), TypeError))

test('zero product price is allowed by the GraphQL domain', () => {
  assert.equal(validateProduct({ name: 'Free sample', sku: 'FREE', category: 'Other', price: 0, stock: 0 }).valid, true)
})
test('duplicate product SKU is rejected except for the edited product', () => {
  const products = [{ id: 'p1', sku: 'ABC' }]
  assert.equal(validateProduct({ id: 'p2', name: 'Mouse', sku: 'abc', category: 'Tech', price: 10, stock: 1 }, { products }).valid, false)
  assert.equal(validateProduct({ id: 'p1', name: 'Mouse', sku: 'ABC', category: 'Tech', price: 10, stock: 1 }, { products, editingProductId: 'p1' }).valid, true)
})
test('product description maximum is enforced', () => {
  assert.equal(validateProduct({ name: 'Mouse', sku: 'M1', category: 'Tech', price: 1, stock: 0, description: 'x'.repeat(2001) }).valid, false)
})
test('order cannot exceed available stock', () => {
  const result = validateOrder({ customerName: 'Max', customerPhone: '123', items: [{ productId: 'p1', quantity: 4 }] }, [{ id: 'p1', name: 'Mouse', stock: 3 }])
  assert.equal(result.valid, false)
  assert.match(result.error, /Недостатньо залишку/)
})
test('company name length is validated', () => {
  assert.equal(validateCompanyName('DM-System').valid, true)
  assert.equal(validateCompanyName('x').valid, false)
})
test('filterProducts searches by name, sku and category', () => {
  const products = [{ name: 'Mouse', sku: 'M-1', category: 'Tech' }, { name: 'Cable', sku: 'C-1', category: 'Accessories' }]
  assert.deepEqual(filterProducts(products, 'm-1').map((item) => item.name), ['Mouse'])
  assert.deepEqual(filterProducts(products, '', 'Accessories').map((item) => item.name), ['Cable'])
})
test('filterOrders searches customer and respects status', () => {
  const orders = [{ customerName: 'Olena', status: 'NEW' }, { customerName: 'Max', status: 'COMPLETED' }]
  assert.deepEqual(filterOrders(orders, 'max', 'COMPLETED'), [orders[1]])
})
test('storage service forwards values to the adapter', async () => {
  const service = createStorageService(createMemoryStorageAdapter())
  await service.set('settings', { section: 'orders' })
  assert.deepEqual(await service.get('settings'), { section: 'orders' })
})

test('filterUsers searches by name and applies role filter', () => {
  const users = [{ name: 'Olena', email: 'olena@example.com', role: 'ADMIN' }, { name: 'Max', email: 'max@example.com', role: 'DROPSHIPPER' }]
  assert.deepEqual(filterUsers(users, 'MAX', 'DROPSHIPPER'), [users[1]])
})

test('order validation aggregates repeated product quantities', () => {
  const result = validateOrder({
    customerName: 'Max',
    customerPhone: '123',
    items: [{ productId: 'p1', quantity: 2 }, { productId: 'p1', quantity: 2 }],
  }, [{ id: 'p1', name: 'Mouse', stock: 3 }])
  assert.equal(result.valid, false)
})
test('date sorting returns a new array with newest items first', () => {
  const items = [{ createdAt: '2026-01-01' }, { createdAt: '2026-02-01' }]
  const sorted = sortByDateDescending(items)
  assert.equal(sorted[0].createdAt, '2026-02-01')
  assert.notEqual(sorted, items)
  assert.equal(items[0].createdAt, '2026-01-01')
})
