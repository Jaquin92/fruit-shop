let inventory = [
    {
        "itemName": "banana",
        "imgSrc": "https://tinyurl.com/zcdrymz",
        "price": 1.25,
        "quantityRemaining": 10
    },
    {
        "itemName": "apple",
        "imgSrc": "https://tinyurl.com/lg5rj5z",
        "price": 2.50,
        "quantityRemaining": 5
    },
    {
        "itemName": "raspberry",
        "imgSrc": "https://tinyurl.com/mhoedwl",
        "price": 4.00,
        "quantityRemaining": 2
    },
    {
        "itemName": "kiwi",
        "imgSrc": "https://tinyurl.com/mdm9kho",
        "price": 3.33,
        "quantityRemaining": 15
    },
    {
        "itemName": "very delicious pineapple with a long name",
        "imgSrc": "https://tinyurl.com/k2oq2to",
        "price": 4.75,
        "quantityRemaining": 1
    },
    {
        "itemName": "strawberries",
        "imgSrc": "https://tinyurl.com/nyy33hf",
        "price": 2.05,
        "quantityRemaining": 3
    }
];

let cart = []
//on component mount this method will send inventory to the ui
const getInventory = (req, res) => {

    let data
    if (!req.session.cart) {
        req.session.cart = {
            cart: cart
        };
        data = {
            inventory: inventory,
            cart: req.session.cart.cart
        }
    } else {
        cart = req.session.cart
        data = {
            inventory: inventory,
            cart: req.session.cart
        }
    };


    res.status(200).send(data);

};
// this method will add items to cart if item already lives in cart it will increment the incart amount or if inventory is 0 it will not add item to cart
const addToCart = (req, res) => {
    let newItem = {
        "itemName": req.body.itemName,
        "imgSrc": req.body.imgSrc,
        "price": req.body.price,
        "quantityRemaining": req.body.quantityRemaining,
        "inCart": 1
    };
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].itemName === newItem.itemName) {
            cart[i].inCart = (cart[i].inCart + 1)

            if (cart[i].inCart > cart[i].quantityRemaining || cart[i].quantityRemaining === 0) {
                return
            }
            req.session.cart = cart;
            res.status(200).send(req.session.cart);
            return
        }
    }

    cart.push(newItem);
    req.session.cart = cart;
    res.status(200).send(req.session.cart);
};

//this method will reduce an items incount amount till it reaches 0
const deductFromCart = (req, res) => {

    for (let i = 0; i < cart.length; i++) {
        if (cart[i].itemName === req.body.itemName) {

            if (cart[i].inCart === 0) {
                return
            }
            cart[i].inCart = (cart[i].inCart - 1)
            req.session.cart = cart;
            res.status(200).send(req.session.cart);
            return
        }
    }
};
//this method will remove an item from the cart

const deleteFromCart = (req, res) => {
    let item = req.params.delete;
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].itemName === item) {
            cart.splice(i, 1)
        }
    }
    req.session.cart = cart;
    res.status(200).send(cart);
}
//this method will update inventory after checkout
const checkout = (req, res) => {

    for (let i = 0; i < inventory.length; i++) {
        for (let j = 0; j < req.session.cart.length; j++) {
            if (inventory[i].itemName === req.session.cart[j].itemName) {
                inventory[i].quantityRemaining = (inventory[i].quantityRemaining - req.session.cart[j].inCart)
            }
        }
    };

    req.session.cart = []

    let data = {
        inventory: inventory,
        cart: req.session.cart
    }
    res.status(200).send(data)

}

module.exports = {
    getInventory: getInventory,
    addToCart: addToCart,
    deductFromCart: deductFromCart,
    deleteFromCart: deleteFromCart,
    checkout: checkout
}