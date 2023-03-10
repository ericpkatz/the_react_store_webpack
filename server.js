const Sequelize = require('sequelize');
const { STRING, UUID, UUIDV4, INTEGER } = Sequelize;
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/the_react_store_db');

const Product = conn.define('product', {
  id: {
    type: UUID,
    primaryKey: true,
    defaultValue: UUIDV4
  },
  name: {
    type: STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  rating: {
    type: INTEGER,
    defaultValue: 5,
    allowNull: false
  }
});



const express = require('express');
const app = express();
const path = require('path');
app.use(express.json());
app.use('/dist', express.static('dist'));

app.get('/', (req, res)=> {
  res.sendFile(path.join(__dirname, 'index.html'))
});

app.get('/api/products', async(req, res, next)=> {
  try {
    res.send(await Product.findAll());
  }
  catch(ex){
    next(ex);
  }
});

app.post('/api/products', async(req, res, next)=> {
  try {
    res.status(201).send(await Product.create(req.body));
  }
  catch(ex){
    next(ex);
  }
});

app.delete('/api/products/:id', async(req, res, next)=> {
  try {
    const product = await Product.findByPk(req.params.id);
    await product.destroy();
    res.sendStatus(204);
  }
  catch(ex){
    next(ex);
  }
});

app.put('/api/products/:id', async(req, res, next)=> {
  try {
    const product = await Product.findByPk(req.params.id);
    await product.update(req.body);
    res.send(product);
  }
  catch(ex){
    next(ex);
  }
});

app.use((err, req, res, next)=> {
  console.log(err);
  res.status(500).send({ error: err });
});

const port = process.env.PORT || 3000;

app.listen(port, async()=> {
  try {
    console.log(`listening on port ${port}`);
    await conn.sync({ force: true });
    await Promise.all(
      ['foo', 'bar', 'bazz'].map( name => Product.create({ name }))
    );
    console.log('data is seeded');
  }
  catch(ex){
    console.log(ex);
  }
});
