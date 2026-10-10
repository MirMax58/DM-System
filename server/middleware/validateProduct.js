import mongoose from 'mongoose'

function validateProduct(req, res, next) {
    const {
        name,
        sku,
        description,
        price,
        category,
        stock,
        companyId
    } = req.body

    if (
        typeof name !== 'string' ||
        !name.trim() ||

        typeof sku !== 'string' ||
        !sku.trim() ||

        typeof price !== 'number' ||
        price < 0 ||

        typeof category !== 'string' ||
        !category.trim() ||

        typeof stock !== 'number' ||
        stock < 0 ||

        !mongoose.Types.ObjectId.isValid(companyId) ||

        (description !== undefined &&
            typeof description !== 'string')
    ) {
        return res.status(400).json({
            message: 'Некоректні дані товару'
        })
    }

    next()
}

export default validateProduct