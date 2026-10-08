import express from 'express'

import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from '../controllers/productController.js'

import validateProduct from '../middleware/validateProduct.js'

const router = express.Router()

router.get('/',getProducts)
router.get('/:id',getProductById)
router.put('/:id',validateProduct,updateProduct)
router.delete('/:id',deleteProduct)
router.post('/',validateProduct,createProduct)

export default router