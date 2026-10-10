import Product from '../models/Product.js'

//пошук всіх товарів
//READ
export async function getProducts(req, res) {
    try {
        const products = await Product.find()

        res.status(200).json(products)
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

//пошук конкретного товару
//READ
export async function getProductById(req,res){
    try{
        const product = await Product.findById(req.params.id)

        if(!product){
            return res.status(404).json({
                message:"Товар не знайдено"
            })
        }

        res.status(200).json(product)
    } catch (error){
        res.status(500).json({
            message:error.message
        })
    }
}

//створення нового товару(через POST)
//CREATE
export async function createProduct(req,res){
    try{
        const {name, sku, description, price, category, stock, companyId} = req.body

        const product = await Product.create({
            name,
            sku,
            description,
            price,
            category,
            stock,
            companyId
        })

        res.status(201).json(product)
    }catch(error){
        res.status(500).json({
            message: error.message
        })
    }
}


//UPDATE
export async function updateProduct(req,res){
    try{
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new:true,
                runValidators:true
            }
        )

        if(!product){
            return res.status(404).json({
                message:"Товар не знайдено"
            })
        }
        res.status(200).json(product)
    }catch(error){
        res.status(500).json({
            message: error.message
        })
    }
}

//DELETE
export async function deleteProduct(req,res){
    try{
        const product = await Product.findBy``IdAndDelete(req.params.id)

        if(!product){
            return res.status(404).json({
                message:"Товар не знайдено"
            })
        }

        res.status(200).json({
            message:"Товар видалено"
        })
    }catch(error){
        res.status(500).json({
            message:error.message
        })
    }
}