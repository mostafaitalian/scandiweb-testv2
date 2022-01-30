import React, { Component } from "react"
import { withRouter } from "react-router-dom"
import { connect } from "react-redux"
import {
  incProductQuantity,
  decProductQuantity,
  removeProductCart,
} from "../actions/Cart"
import { getSelectedAtt } from "../utils"
import "../style/cart.style.css"
import PropTypes from "prop-types"

class Cart extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    cart: PropTypes.arrayOf(Object),
    currentCurrency: PropTypes.object,
    total: PropTypes.number,
    history: PropTypes.object,
  }
  // handle increase the product quantity the + button
  handleInc = (id, selectedAttrs) => {
    this.props.dispatch(incProductQuantity(id, getSelectedAtt(id, selectedAttrs)))
  }

  // handle decrease the product quantity the - button
  handleDec = (id, selectedAttrs) => {
    this.props.dispatch(decProductQuantity(id, getSelectedAtt(id, selectedAttrs)))
  }

  // handle remove the product with selected attributes from cart the X button
  handleRemoveCartProduct = (producId, selectedAttrs) => {
    this.props.dispatch(
      removeProductCart(producId, getSelectedAtt(producId, selectedAttrs))
    )
  }

  handleNavigateToCart = () => {
    this.props.history.push(`/all`)
  }
  render() {
    return (
      <div className="cart-container">
        <div className="cart-header">Cart</div>
        {this.props.cart.map((cartItem) => {
          const { product, selectedAttrs, quantity } = cartItem
          return (
            <div
              className="cart-Item"
              key={`${product.id}${quantity}${JSON.stringify(selectedAttrs)}`}
            >
              <div key={1} className="cart-item-info">
                <div className="cart-item-header" key={1}>
                  <div>{product.name}</div>
                  <div>{product.brand}</div>
                </div>
                <div key={2}>
                  {this.props.currentCurrency.symbol}
                  {product.prices
                    .filter(
                      (price) => price.currency.label === this.props.currentCurrency.label
                    )[0]
                    .amount.toFixed(2)}
                </div>
                <div className="cart-item-attrs" key={3}>
                  {Object.prototype.hasOwnProperty.call(selectedAttrs, "attr") &&
                    Object.keys(selectedAttrs["attr"]).length !== 0 &&
                    Object.keys(selectedAttrs["attr"]).map((attrt) => {
                      if (attrt === "Color") {
                        return (
                          <div className="cart-item-attrs-attr-container" key={attrt}>
                            <div className="mini-cart-item-attrs-header">{attrt}</div>
                            <div className="cart-item-attrs-attr" key={attrt}>
                              {Object.keys(selectedAttrs["attr"][attrt]).map((item) => {
                                if (
                                  selectedAttrs["attr"][attrt][item].selected === true
                                ) {
                                  return (
                                    <div
                                      key={selectedAttrs["attr"][attrt][item].value}
                                      className="selected sele-border"
                                      style={{
                                        backgroundColor:
                                          selectedAttrs["attr"][attrt][item].value,
                                      }}
                                    ></div>
                                  )
                                } else {
                                  return (
                                    <div
                                      key={selectedAttrs["attr"][attrt][item].value}
                                      style={{
                                        backgroundColor:
                                          selectedAttrs["attr"][attrt][item].value,
                                      }}
                                    ></div>
                                  )
                                }
                              })}
                            </div>
                          </div>
                        )
                      }
                      return (
                        <div className="cart-item-attrs-attr-container" key={attrt}>
                          <div className="mini-cart-item-attrs-header">{attrt}</div>
                          <div className="cart-item-attrs-attr" key={attrt}>
                            {Object.keys(selectedAttrs["attr"][attrt]).map((item) => {
                              if (selectedAttrs["attr"][attrt][item].selected === true) {
                                return (
                                  <div
                                    key={selectedAttrs["attr"][attrt][item].value}
                                    className="selected"
                                  >
                                    {selectedAttrs["attr"][attrt][item].value}
                                  </div>
                                )
                              } else {
                                return (
                                  <div key={selectedAttrs["attr"][attrt][item].value}>
                                    {selectedAttrs["attr"][attrt][item].value}
                                  </div>
                                )
                              }
                            })}
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>
              <div key={2} className="cart-item-qimg">
                <div className="dec-inc-product">
                  <button
                    disabled={quantity > 10}
                    onClick={() => this.handleInc(product.id, selectedAttrs)}
                  >
                    +
                  </button>
                  <div>{quantity}</div>
                  <button
                    disabled={quantity < 2}
                    onClick={() => this.handleDec(product.id, selectedAttrs)}
                  >
                    -
                  </button>
                </div>
                <div className="cart-img">
                  <img src={product.gallery[0]} alt="product overview" />
                  <div
                    onClick={() =>
                      this.handleRemoveCartProduct(product.id, selectedAttrs)
                    }
                    className="cart-img-x"
                  >
                    <div>X</div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
        <div className="mini-cart-total">
          <div key={1}>
            <h3>Total</h3>
          </div>
          <div key={2}>
            {this.props.currentCurrency.symbol} {this.props.total.toFixed(2)}
            {/* {(this.props.cart.length !== 0 && this.props.cart !== undefined && this.props.cart.product !== undefined && this.props.currentCurrency) && this.totalCost(this.props.cart,this.props.currentCurrency)} */}
          </div>
        </div>
        <div className="cart-btns">
          <button onClick={() => this.handleNavigateToCart()} key={1}>
            Add New Items
          </button>
          <button key={2}>Checkout</button>
        </div>
      </div>
    )
  }
}
function mapStateToProps(state) {
  let total = 0
  let totalItems = 0
  // calculate the total items number and total price
  if (state.cart.length !== 0) {
    for (const cartItem of state.cart) {
      const quantity = cartItem.quantity
      const price = cartItem.product.prices.filter(
        (price) => price.currency.label === state.currentCurrency.label
      )[0].amount
      const cartItemPrice = price * quantity
      total += cartItemPrice
      totalItems += quantity
    }
  }

  return {
    currentCurrency: state.currentCurrency,
    cart: state.cart,
    total,
    totalItems,
  }
}

export default connect(mapStateToProps)(withRouter(Cart))
