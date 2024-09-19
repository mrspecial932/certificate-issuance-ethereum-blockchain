const mongoose= require('mongoose')

const productSchema=mongoose.Schema({
    name:string,
    image:string,
    countInstock: {
        type: Number,
        required: true
    }
})
exports.Product= mongoose.model('Product', productSchema)