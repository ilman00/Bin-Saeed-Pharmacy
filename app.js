const express = require('express');
const path = require('path');
const app = express();
const session = require('express-session');
const passport = require('passport');
const mongoDB = require('./config/db')

const dashboard = require('./routes/dashboard')
const add_products = require('./routes/add_products')
const sales = require('./routes/sales')
const searchMed = require('./routes/searchMed')
require('./config/passport');
const authRoutes = require('./routes/auth');


// Set view engine
app.set('view engine', 'ejs');

// Set views directory (optional, default is /views)
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Static files (CSS, JS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'secretmedstorekey',
    resave: false,
    saveUninitialized: false
  }));
  app.use(passport.initialize());
  app.use(passport.session());


app.use(dashboard)
app.use(add_products)
app.use(sales)
app.use(searchMed)
app.use(authRoutes);














const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
