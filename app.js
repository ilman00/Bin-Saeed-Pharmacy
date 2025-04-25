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



app.use(cors());
// Set view engine
app.set('view engine', 'ejs');

// Set views directory (optional, default is /views)
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Static files (CSS, JS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'yourSecret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: 'mongodb://127.0.0.1:27017/pharmacy', // or use your MongoDB Atlas URL
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












const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
