function validateProduct(req, res, next) {
    const { name, description, price, category, stock} = req.body

    if (
        typeof name !== 'string' ||
        !name.trim() ||
        typeof price !== 'number' ||
        price < 0 ||
        typeof category !== 'string' ||
        !category.trim() ||

        typeof stock !== "number" ||
        stock < 0 ||

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