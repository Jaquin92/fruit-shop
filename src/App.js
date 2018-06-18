import React, { Component } from 'react';
//importing axios to make requests to server
import axios from 'axios';

import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      inventory: null,
      cart: []
    }
  }
  componentDidMount() {
    axios.get('/api/inventory').then(response => {
      this.setState({
        inventory: response.data.inventory,
        cart: response.data.cart

      });
    });
  };
  addToCart(item) {
    axios.post('/api/postToCart', item).then(response => {
      this.setState({ cart: response.data })
    })
  };

  deductFromCart(item) {
    axios.put('/api/reduce', item).then(response => {
      console.log(response)
      this.setState({ cart: response.data })
    })
  };

  deleteFromCart(name) {
    axios.delete(`/api/${name}`).then(response => {
      this.setState({ cart: response.data })
    })
  };

  checkout() {
    axios.put('/api/checkout').then(response => {
      this.setState({ cart: response.data.cart, inventory: response.data.inventory })
    })
  }

  items() {
    let inventory = this.state.inventory;
    if (inventory) {
      return inventory.map((item, index) => {
        return <div id="item-card" key={index} >
          <img src={item.imgSrc} alt="" />
          <span id="item-name" >{item.itemName.charAt(0).toUpperCase() + item.itemName.slice(1)}</span>
          <span>${item.price}</span>
          <span>{item.quantityRemaining} In Stock</span>
          <button id="add-to-cart" onClick={() => this.addToCart(item)} >Add to Cart</button>
        </div>
      })
    }
  };

  numberInCart() {
    if (this.state.cart) {
      return (<div><span>{this.state.cart.length} items</span>
      </div>)
    }
  };
  itemsInCart() {
    if (this.state.cart) {
      return this.state.cart.map((item, index) => {
        return <div key={index} id="cart-card" >
          <div id="cart-thumb" > <img src={item.imgSrc} alt="" />
            <span>  <button onClick={() => this.deductFromCart(item)} >-</button> <span>{item.inCart}</span> <button onClick={() => this.addToCart(item)} >+</button> </span>
          </div>
          <div id="cart-price" > <span>@ ${item.price} each =  <span>${item.inCart * item.price}</span> </span> <p onClick={() => this.deleteFromCart(item.itemName)} >Delete</p> </div>
        </div>
      }
      )
    }
  };

  cartTotal() {
    let total = 0;

    this.state.cart.map(i => {
      return total += (i.inCart * i.price)
    });

    return total
  }




  render() {

    return (
      <div  >
        <header><h1>Fruit</h1></header>
        <div id="app-body" >
          <div id="items" >{this.items()}</div>
          <div id="cart" >
            <h2>Shopping Cart</h2>
            {this.numberInCart()}
            {this.itemsInCart()}
            <div id="checkout" >  {this.state.cart.length >= 1 ? <div>Total:${this.cartTotal()} <br /> <button onClick={() => this.checkout()} >Confirm Purchase</button> </div> : <div>Empty Cart</div>}  </div>

          </div>
        </div>

      </div>
    );
  }
}

export default App;
