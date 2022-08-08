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
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({
    extended: true,
    limit: '100mb'
}));

app.set('view engine', 'ejs');
app.set('views', './src/views');


app.use(express.static('public'));

const routes = require('./routes/routes');
app.use('/', routes);

const PORT = process.env.PORT || 3000;
console.log({PORT});
app.listen(PORT, () => console.log(`Server iniciado na porta ${PORT}`));