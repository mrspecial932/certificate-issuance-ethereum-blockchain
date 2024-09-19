const express=require('express');
const app=express();
const morgan=require('morgan')
const mongoose=require()
require('dotenv/config');
const mongoose= require('mongoose')
const api= process.env.API_URL;
const bodyparser= require('body-parser');


app.use(bodyparser.json());
app.use(morgan('tiny'));


app.get(`${api}/products`, (req, res)=>{
    const product ={
        id:1,
        name:'hair dresser',
        image:'some_url',
    } 
    console.log(new product)
    res.send(products)
    
})
const product = mongoose.model('product',productschema)
app.get(`${api}/products`, async(req,res) =>{
    const productlist= await Product.find();
    if (!productList){
        res.status(500).json({sucess:false})
    }
    res.send(productList)
})

product.save().then((createdProduct =>{
    res.status(201).json(createdProduct)
})).catch((err) =>{
    res.status(500).json({
        error:err,
        success:false
    })
})
mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser:true,
    useUnifedTopology:true,
    dbname:'eshopdata'
})
.then(()=>{
    console.log('database connection is reeady')
})

app.post(`${api}/products`, (req, res)=>{
    const newproduct = req.body;
    console.log(new product)
    res.send('newproduct')
})

mongoose.connect();
app.listen(5000, ()=>{
    console.log('server is running http://localhost:5000');
})