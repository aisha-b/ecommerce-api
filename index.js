
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const userRoute = require('./routes/userRoutes');
const productRoute = require('./routes/productRoutes');
const orderRoute = require('./routes/orderRoutes');
const wishlistRoute = require('./routes/wishlistRoutes');
const cartRoute = require('./routes/cartRoutes');

const PORT = process.env.PORT || 4000;

dotenv.config();

mongoose.connect(process.env.DB_URI, 
	{useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('Connected to Database'));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/orders", orderRoute);
app.use("/api/wishlist", wishlistRoute);
app.use("/api/cart", cartRoute);

app.listen(PORT, () => console.log(`Server is running at port ${PORT}`))