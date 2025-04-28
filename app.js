require('dotenv').config()
const express = require('express');
const path = require('path');
const app = express();
const session = require('express-session');
const passport = require('passport');
const mongoDB = require('./config/db')
const cors = require('cors')
const MongoStore = require('connect-mongo');

const dashboard = require('./routes/dashboard')
const add_products = require('./routes/add_products')
const sales = require('./routes/sales')
const searchMed = require('./routes/searchMed')
require('./config/passport');
const authRoutes = require('./routes/auth');
const edit_med = require('./routes/edit')
const profit = require('./routes/profitRoute')
const loss = require('./routes/lossRoute')
const lending = require('./routes/lendingRoute')
const history = require('./routes/historyRoute')
const deleteProduct = require('./routes/deleteProduct')
const todaySale = require('./routes/todaySaleRoute')

app.use(cors());
// Set view engine
app.set('view engine', 'ejs');

// Set views directory (optional, default is /views)
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Static files (CSS, JS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// const mongodb = 'mongodb://127.0.0.1:27017/pharmacy'
const mongodb = process.env.MONGODB_URI

app.use(session({
  secret: 'yourSecret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: mongodb, // or use your MongoDB Atlas URL
    ttl: 14 * 24 * 60 * 60, // Optional: session expiry in seconds (14 days)
  })
}));
app.use(passport.initialize());
app.use(passport.session());


app.use(dashboard)
app.use(add_products)
app.use(sales)
app.use(searchMed)
app.use(authRoutes);
app.use(edit_med)
app.use(profit)
app.use(loss)
app.use(lending)
app.use(history)
app.use(deleteProduct)
app.use(todaySale)


app.get('/', (req, res) => {
  const user = req.user
  res.render('landingPage', { user });
});






const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
