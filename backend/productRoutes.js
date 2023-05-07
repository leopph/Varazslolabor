const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const productModel = mongoose.model('product');


router.get('/', async (_, res) => {
  try {
    const users = await productModel.find();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).send('Failed to get products. ' + error);
  }
});


router.get('/:name', async (req, res) => {
  try {
    const product = await productModel.findOne({name: req.params.name});

    if (!product) {
      return res.status(400).send('Failed to get product: product does not exist.');
    }

    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).send('Failed to get product. ' + error);
  }
})

router.post('/', async (req, res) => {
  if (!req.body.name) {
    return res.status(400).send('Failed to create product: missing name.');
  }

  if (!req.body.packaged) {
    return res.status(400).send('Failed to create product: missing packaged state.');
  }

  if (!req.body.price) {
    return res.status(400).send('Failed to create product: missing price.');
  }

  if (!req.body.quantity) {
    return res.status(400).send('Failed to create product: missing quantity.');
  }

  if (!req.body.unit) {
    return res.status(400).send('Failed to create product: missing unit.');
  }

  try {
    const product = await productModel.findOne({ name: req.body.name });

    if (product) {
      return res.status(400).send('Failed to create product: product already exists.');
    }

    const newProduct = new productModel({
      name: req.body.name,
      packaged: req.body.packaged,
      rarity: req.body.rarity,
      price: req.body.price,
      quantity: req.body.quantity,
      unit: req.body.unit
    });

    await newProduct.save();
    return res.status(200).send('Product was successfully created.');
  } catch (error) {
    return res.status(500).send('Failed to create product. ' + error);
  }
});


router.patch('/:name', async (req, res) => {
  try {
    const product = await productModel.findOne({ name: req.params.name });

    if (!product) {
      return res.status(400).send('Failed to update product: product does not exist.');
    }

    if (req.body.name) {
      product.name = req.body.name;
    }

    if (req.body.packaged) {
      product.packaged = req.body.packaged;
    }

    if (req.body.rarity) {
      product.rarity = req.body.rarity;
    }

    if (req.body.price) {
      product.price = req.body.price;
    }

    if (req.body.quantity) {
      product.quantity = req.body.quantity;
    }

    if (req.body.unit) {
      product.unit = req.body.unit;
    }

    await product.save();
    return res.status(200).send('Product was successfully updated.');
  } catch (error) {
    return res.status(500).send('Failed to update product. ' + error);
  }
});


router.delete('/:name', async (req, res) => {
  try {
    await productModel.deleteOne({ name: req.params.name });
    return res.status(200).send('Product was successfully deleted.');
  } catch (error) {
    return res.status(500).send('Failed to delete product. ' + error);
  }
})

module.exports = router;
