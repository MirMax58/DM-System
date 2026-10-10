import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    sku:{
        type:String,
        required:true,
        trim:true,
        uppercase:true
    },

    description:{
      type:String,
      trim:true
    },

    price: {
        type: Number,
        required: true,
        min: 0
    },

    category: {
        type: String,
        required: true,
        trim: true
    },

    stock:{
        type:Number,
        required:true,
        min:0
    },

    companyId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Company',
        required:true,
        immutable:true
    }
}, {
    timestamps: true
})

productSchema.index(
    {companyId: 1, sku:1},
    {unique:true}
)

const Product = mongoose.model('Product', productSchema)

export default Product