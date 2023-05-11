const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use(express.json());

mongoose.connect('mongodb+srv://razaqakevin:Kevinrazaqa03@product.5ztkbvk.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const productSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  username: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  description: { type: String },
  category: { type: String },
});

const Product = mongoose.model('Product', productSchema);

// Create a new product
app.post('/products/create', async (req, res) => {
  try {
    const { id, username, name, price, stock, description, category } = req.body;

    const product = new Product({
      id,
      username,
      name,
      price,
      stock,
      description,
      category,
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a product

app.put('/products/update/:id', async (req, res) => {
    try {
      const { username, name, price, stock, description, category } = req.body;
      const productId = mongoose.Types.ObjectId(req.params.id); // Convert id to ObjectId
  
      const product = await Product.findByIdAndUpdate(
        productId,
        { username, name, price, stock, description, category },
        { new: true }
      );
  
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      res.json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  

// Get all products
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get a single product by ID
app.get('/products/:id', async (req, res) => {
    try {
      const productId = req.params.id;
      const product = await Product.findOne({ id: productId });
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  });
  

// Delete a product
app.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(204).end();
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
