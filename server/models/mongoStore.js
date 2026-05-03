const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB Atlas');
    // Seed DB if empty
    try {
      const productCount = await mongoose.connection.collection('products').countDocuments();
      if (productCount === 0) {
        console.log('🌱 Seeding Products...');
        const fs = require('fs');
        const path = require('path');
        const productsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/products.json'), 'utf-8'));
        await Product.insertMany(productsData);
      }
      
      const userCount = await mongoose.connection.collection('users').countDocuments();
      if (userCount === 0) {
        console.log('🌱 Seeding Users...');
        const fs = require('fs');
        const path = require('path');
        const usersData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/users.json'), 'utf-8'));
        await User.insertMany(usersData);
      }
    } catch (e) {
      console.error('Error during seeding:', e);
    }
  })
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// ===== Schemas =====
const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  unit: { type: String, required: true },
  description: String,
  image: String,
  modelUrl: String,
  rating: { type: Number, default: 4.0 },
  inStock: { type: Boolean, default: true },
});

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  avatar: { type: String, default: '👤' },
  createdAt: { type: Date, default: Date.now },
});

const orderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  items: [{
    productId: String,
    name: String,
    price: Number,
    unit: String,
    image: String,
    quantity: Number,
    subtotal: Number
  }],
  total: { type: Number, required: true },
  status: { type: String, default: 'confirmed' },
  createdAt: { type: Date, default: Date.now },
});

// ===== Models =====
const Product = mongoose.model('Product', productSchema);
const User = mongoose.model('User', userSchema);
const Order = mongoose.model('Order', orderSchema);

class MongoStore {
  // ===== Users =====
  async authenticateUser(identifier, password) {
    const idStr = identifier.toLowerCase().trim();
    // Search by email or phone
    const user = await User.findOne({
      $or: [{ email: idStr }, { phone: idStr }],
      password: password
    });
    return user ? user.toObject() : null;
  }

  async getUserById(id) {
    const user = await User.findOne({ id });
    return user ? user.toObject() : null;
  }

  async getUserByEmail(email) {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    return user ? user.toObject() : null;
  }

  async getUserByPhone(phone) {
    const user = await User.findOne({ phone: phone.trim() });
    return user ? user.toObject() : null;
  }

  async createUser(name, email, phone, password, role = 'user') {
    const count = await User.countDocuments();
    const newUser = new User({
      id: 'u' + String(count + 1).padStart(3, '0'),
      name: name.trim(),
      email: email ? email.toLowerCase().trim() : '',
      phone: phone ? phone.trim() : '',
      password,
      role,
      avatar: role === 'admin' ? '👨‍💼' : '👤'
    });
    await newUser.save();
    return newUser.toObject();
  }

  // ===== Products =====
  async getAllProducts({ category, search } = {}) {
    let query = {};
    if (category) {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }
    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [{ name: regex }, { description: regex }];
    }
    const products = await Product.find(query);
    return products.map(p => p.toObject());
  }

  async getProductById(id) {
    const product = await Product.findOne({ id });
    return product ? product.toObject() : null;
  }

  async getCategories() {
    const categories = await Product.distinct('category');
    return categories.sort();
  }

  async addProduct(data) {
    const count = await Product.countDocuments();
    const newProduct = new Product({
      id: 'p' + String(count + 1).padStart(3, '0'),
      ...data,
      inStock: true,
      rating: 4.0
    });
    await newProduct.save();
    return newProduct.toObject();
  }

  async updateProduct(id, updates) {
    const product = await Product.findOneAndUpdate({ id }, updates, { new: true });
    return product ? product.toObject() : null;
  }

  async deleteProduct(id) {
    const result = await Product.deleteOne({ id });
    return result.deletedCount > 0;
  }

  async toggleProductStock(id) {
    const product = await Product.findOne({ id });
    if (!product) return null;
    product.inStock = !product.inStock;
    await product.save();
    return product.toObject();
  }

  // ===== Orders & Cart =====
  async validateCart(items) {
    const validated = [];
    let valid = true;

    for (const item of items) {
      const product = await this.getProductById(item.productId);
      if (!product) {
        validated.push({ ...item, error: 'Product not found' });
        valid = false;
        continue;
      }
      if (!product.inStock) {
        validated.push({ ...item, error: 'Out of stock', product });
        valid = false;
        continue;
      }
      validated.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        unit: product.unit,
        image: product.image,
        quantity: item.quantity,
        subtotal: +(product.price * item.quantity).toFixed(2),
      });
    }

    const total = validated.reduce((sum, i) => sum + (i.subtotal || 0), 0);
    return { valid, items: validated, total: +total.toFixed(2) };
  }

  async createOrder(cartItems) {
    const validation = await this.validateCart(cartItems);
    if (!validation.valid) {
      return { success: false, error: 'Some items are invalid', validation };
    }

    const { v4: uuidv4 } = require('uuid');
    const newOrder = new Order({
      id: uuidv4(),
      items: validation.items,
      total: validation.total,
      status: 'confirmed'
    });
    
    await newOrder.save();
    return { success: true, order: newOrder.toObject() };
  }

  async getOrder(id) {
    const order = await Order.findOne({ id });
    return order ? order.toObject() : null;
  }

  async getAllOrders() {
    const orders = await Order.find().sort({ createdAt: -1 });
    return orders.map(o => o.toObject());
  }
}

module.exports = new MongoStore();
