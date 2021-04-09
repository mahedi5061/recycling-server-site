const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectId=require('mongodb').ObjectId;
const cors =require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const port = process.env.PORT ||7070;
 app.use(cors());
 app.use(bodyParser.json())
 app.use = bodyParser.urlencoded({ extended: false })

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.taqt5.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
 
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("recycling").collection("products");
  const orderCollection = client.db("recycling").collection("order");

  //product collection pages

   app.post('/addProduct',(req, res) => {
       const newProduct =req.body;
        productCollection.insertOne(newProduct)
        .then(result => {
            res.redirect('/')
        })
   })

   app.get('/products', (req, res)=>{
    productCollection.find({})
    .toArray((err,items) => {
      res.send(items)
    })
   })

   app.get('/product/:id',(req, res)=>{
    productCollection.find({_id:ObjectId(req.params.id)})
    .toArray((err,items ) => {
        res.send(items)
    })
   })

   app.delete('/productDelete/:id',(req, res)=>{
    productCollection.findOneAndDelete({_id:ObjectId(req.params.id)})
    .then(document=>{
      res.send(document.value)
    })
   })

//order collection pages

   app.post('/addOrder',(req, res) => {
    const newOrder =req.body;
    orderCollection.insertOne(newOrder)
     .then(result => {
         res.send(result.insertedCount > 0)
     })
})

app.get('/orderReview',(req, res)=>{
  orderCollection.find({email:req.query.email})
  .toArray((err,items ) => {
       res.send(items)
  })
 })
   
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})