const express = require('express');
const app = express();

const setup = require('./models/orm-setup');

const session = require('express-session');
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

app.use(express.urlencoded({
    extended: true,
}));

app.set('view engine', 'ejs');
app.set('views', './src/views');

app.use(express.static('public'));

const routes = require('./routes/routes');
app.use('/', routes);

app.listen(3000, () => {
    console.log('Listening at 3000');
})