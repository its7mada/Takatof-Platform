const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

const app = express();

const authRoute = require('./routes/Auth.route.js');
const productsRoute = require('./routes/Products.route.js');
const categoriesRoute = require('./routes/Categories.route.js');
const cartRoute = require('./routes/Cart.route.js');
const userRoute = require('./routes/User.route.js');
const ordersRoute = require('./routes/Orders.route.js');


app.use(express.static('./public'));

dotenv.config();


app.use(express.static(path.join(__dirname + '/public')));
app.use(cors());
app.use(bodyparser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const PORT = 5501;
const mongoURL = 'mongodb+srv://itstakatof:itstakatof@tkatof.j1lcb.mongodb.net/?retryWrites=true&w=majority&appName=tkatof'
mongoose.connect(mongoURL)
  .then(() => {
    console.log('Connected to database!');
    app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
  })
  .catch((err) => {
    console.error('Connection failed:', err);
  });


app.use('/api/auth', authRoute);
app.use('/api/products', productsRoute);
app.use('/api/categories', categoriesRoute);
app.use('/api/cart', cartRoute);
app.use('/api/user', userRoute);
app.use('/api/orders', ordersRoute);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, './index.html'));
});

app.all('*', (req, res) => {
  res.status(404).send('<h1>No contant</h1>');
});
