const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');

const app = express();
//creating session so when page is refreshed items are kept in cart
app.use(
    session({
        secret: 'Jon@th@n',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000000
        }
    })
);

app.use(bodyParser.json());
app.use(cors());

//importing methods from controller

const { getInventory, addToCart, deductFromCart, deleteFromCart, checkout } = require('./controller');

//creating endpoints

app.get('/api/inventory', getInventory);
app.post('/api/postToCart', addToCart);
app.put('/api/reduce', deductFromCart);
app.delete('/api/:delete', deleteFromCart);
app.put('/api/checkout', checkout);

const port = 3005;

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'))
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})