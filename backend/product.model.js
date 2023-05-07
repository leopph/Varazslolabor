const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true, lowercase: true },
  packaged: { type: Boolean, required: true },
  rarity: { type: Number },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true }
}, { collection: 'products' });

productSchema.pre('save', function(next) {
  const product = this;

  if (!('rarity' in product) || product.rarity == null) {
    product.rarity = 1;
  }

  product.rarity = Math.min(Math.max(product.rarity, 1), 10);

  next();
});

mongoose.model('product', productSchema);
