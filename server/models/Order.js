import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },

    quantity: {
        type: Number,
        required: true,
        min: 1
    },

    price:{
        type:Number,
        required:true,
        min:0
    }
}, {
    _id: false
})

const orderSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
        immutable: true
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        immutable: true
    },

    items: {
        type: [orderItemSchema],
        required: true,
        validate: {
            validator: items =>
                Array.isArray(items) && items.length > 0,
            message: 'Замовлення повинно містити хоча б один товар'
        }
    },

    status: {
        type: String,
        default: 'NEW',
        trim: true,
        enum:['NEW','PROCESSING','COMPLETED','CANCELLED']
    }
}, {
    timestamps: true
})

const Order = mongoose.model('Order', orderSchema)

export default Order