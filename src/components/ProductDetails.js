import React, { Component, Fragment } from "react"
import { connect } from "react-redux"
import { checkAllAttributesSelected, getPrice } from "../utils/index"
import Attributes from "./Attributes"
import {
  addProductCart,
  incProductQuantity,
  incProductQuantityNoAttr,
} from "../actions/Cart"
import { arrayInArrays } from "../utils"
import "../style/productdetail.style.css"
import PropTypes from "prop-types"
import sanitizeHtml from "sanitize-html"

class ProductDetails extends Component {
  state = {
    items: {},
    defaultItems: {},
    product: {},
    loading: true,
    mainSrc: "",
    subSrc: "",
    selectedAttrs: {},
    flag: false,
    btnClass: "",
  }

  static propTypes = {
    handleCloseCarMenu: PropTypes.func,
    handleCloseCurMenu: PropTypes.func,
    changeInitialTitle: PropTypes.func,
    match: PropTypes.object,
    currentCurrency: PropTypes.object,
    cart: PropTypes.arrayOf(Object),
    history: PropTypes.object,
    dispatch: PropTypes.func,
    category: PropTypes.object,
  }

  componentDidMount() {
    this.props.handleCloseCarMenu()
    this.props.handleCloseCurMenu()
    this.props.changeInitialTitle(this.props.match.params.categoryName)
    let product, items, defaultItems
    const { productId } = this.props.match.params
    if (this.props.category !== undefined) {
      product = this.props.category.products.find((product) => product.id === productId)
      const { attributes } = product
      let h = {}
      // i should use here for---of
      attributes.map((att) => {
        if (att.items.length !== 0) {
          att.items.map((item) => {
            h = {
              ...h,
              [att.name]: {
                ...h[att.name],
                ...{ [item.value]: { class: "", value: item.value, selected: false } },
              },
            }
            // {[item.value]:{class:''}}
            return h
          })
        }
        return h
      })
      // put the reshaped attributes in state
      this.setState({ items: h, defaultItems: h }, () => {
        this.setState(
          {
            product,
            mainSrc: product.gallery[0],
          },
          () => {
            localStorage.setItem("product", JSON.stringify(this.state.product))
            localStorage.setItem("items", JSON.stringify(this.state.items))
            localStorage.setItem("defaultItems", JSON.stringify(this.state.defaultItems))
          }
        )
      })

      if (Object.keys(this.props.currentCurrency).length !== 0) {
        localStorage.setItem(
          "currentCurrency",
          JSON.stringify(this.props.currentCurrency)
        )
      }
    } else {
      product = JSON.parse(localStorage.getItem("product"))
      items = JSON.parse(localStorage.getItem("items"))
      defaultItems = JSON.parse(localStorage.getItem("defaultItems"))

      this.setState({
        product,
        mainSrc: product.gallery[0],
        items,
        defaultItems,
      })
    }
  }

  handleClickimage = (e) => {
    const src = e.target.currentSrc
    const mainSrc = this.state.mainSrc
    e.target.attributes[0].nodeValue = mainSrc
    this.setState({ mainSrc: src })
  }
  // resetSelectedAttributes
  handleAddToCart = () => {
    this.props.handleCloseCarMenu()
    this.props.handleCloseCurMenu()
    const product = this.props.category.products.filter(
      (product) => product.id === this.props.match.params.productId
    )[0]
    const sameProductsInCart = this.props.cart.filter(
      (cartItem) => cartItem.product.id === product.id
    )
    let a = [product.id]
    let b = []
    // if user didnot select any attribute for a product ex size or color
    if (
      Object.keys(this.state.selectedAttrs).length === 0 &&
      product.attributes.length !== 0
    ) {
      this.setState({ btnClass: "btn-no-attr", flag: true }, () => {
        setTimeout(() => this.setState({ btnClass: "" }), 500)
      })
    } else if (
      Object.keys(this.state.selectedAttrs).length === 0 &&
      product.attributes.length === 0
    ) {
      let cartProductIds = []
      for (const sProduct of this.props.cart) {
        cartProductIds.push(sProduct.product.id)
      }
      if (cartProductIds.includes(product.id)) {
        this.props.dispatch(incProductQuantityNoAttr(product.id))
        // this.props.history.push(`/${product.category}`)
      } else {
        this.props.dispatch(addProductCart(product, 1, this.state.selectedAttrs))
        // this.props.history.push(`/${product.category}`)
      }
    } else if (!checkAllAttributesSelected(this.state.selectedAttrs)) {
      this.setState({ btnClass: "btn-no-attr", flag: true }, () => {
        setTimeout(() => this.setState({ btnClass: "" }), 500)
      })
    } else {
      const sAttributes = this.state.selectedAttrs["attr"]
      for (const att of Object.keys(sAttributes)) {
        for (const attItem of Object.keys(sAttributes[att])) {
          if (sAttributes[att][attItem].selected === true) {
            a.push(attItem)
          }
        }
      }
      for (const sProduct of sameProductsInCart) {
        let c = [sProduct.product.id]
        const attributes = sProduct.selectedAttrs["attr"]
        for (const att of Object.keys(attributes)) {
          for (const attItem of Object.keys(attributes[att])) {
            if (attributes[att][attItem].selected === true) {
              c.push(attItem)
            }
          }
        }
        b.push(c)
      }

      // if user select an item with attributes exists already in the cart
      // this means that we only need to increase the quantity of that item
      if (arrayInArrays(a, b)) {
        this.props.dispatch(incProductQuantity(product.id, a))
      }
      // add new item in the cart
      else {
        this.props.dispatch(addProductCart(product, 1, this.state.selectedAttrs))
      }
    }
    this.setState({
      items: this.state.defaultItems,
      selectedAttrs: {},
    })
  }
  handleAddSelectedAttrs = (attr) => {
    this.setState((prev) => ({ selectedAttrs: { ...prev.selectedAttrs, attr } }))
  }
  resetFlag = () => {
    this.setState({ flag: false })
  }
  handleOnSelect = (e, attr) => {
    // first put state to default value
    this.setState((prev) => ({
      items: { ...prev.items, [attr.attrName]: this.state.defaultItems[attr.attrName] },
    }))
    // change the selected attribute totrue depending on dataset of the target
    this.setState(
      (prev) => ({
        items: {
          ...prev.items,
          [attr.attrName]: {
            ...prev.items[attr.attrName],
            [e.target.dataset.g]: {
              ...prev.items[attr.attrName][e.target.dataset.g],
              class: attr.attrName !== "Color" ? "selected" : "selected colo",
              selected: true,
            },
          },
        },
      }),
      () => {
        this.handleAddSelectedAttrs(this.state.items)
      }
    )
  }
  render() {
    const { mainSrc } = this.state
    let items
    if (Object.keys(this.state.items) !== 0) {
      items = this.state.items
    }
    const { category, match } = this.props
    let currentCurrency = this.props.currentCurrency
    const product =
      category !== undefined
        ? category.products.filter((product) => product.id === match.params.productId)[0]
        : JSON.parse(localStorage.getItem("product"))
    if (Object.keys(currentCurrency).length === 0) {
      currentCurrency = JSON.parse(localStorage.getItem("currentCurrency"))
    }

    const pricing = getPrice(currentCurrency, product)
    const dangerousHtmlFrom = `
        ${product.description}`
    const clean = sanitizeHtml(dangerousHtmlFrom, {
      allowedAttributes: {
        ul: ["class"],
      },
      transformTags: {
        ul: sanitizeHtml.simpleTransform("ul", { class: "list-pullit" }),
      },
    })
    return (
      <div
        className="product-container"
        onClick={() => {
          this.props.handleCloseCarMenu()
          this.props.handleCloseCurMenu()
        }}
      >
        <div className="product-image-collection">
          <div className="product-other-images">
            {product.gallery.slice(1).map((img) => (
              <img
                src={img}
                key={img}
                onClick={(e) => this.handleClickimage(e)}
                alt="product collection"
              />
            ))}
          </div>
          {product.inStock ? (
            <div className="product-main-image">
              <img src={mainSrc} alt="product collection" />
            </div>
          ) : (
            <Fragment>
              {/* <Link to={`/products/${product.productId}`}></Link> */}
              <div className="product-main-image-details">
                <div className="out-of-stock-details">Out of Stock</div>

                <img src={mainSrc} alt="product collection" />
              </div>
            </Fragment>
          )}
        </div>
        <div className="product-info">
          <div className="product-header">
            <h2>{product.name}</h2>
            <h3>{product.brand}</h3>
          </div>
          <div className="attrs-container">
            <Attributes
              resetFlag={this.resetFlag}
              attributes={product.attributes}
              inStock={product.inStock}
              handleAddSelectedAttrs={this.handleAddSelectedAttrs}
              items={items}
              defaultItems={this.state.defaultItems}
              handleOnSelect={this.handleOnSelect}
            />
          </div>
          <div className="price-container">
            <h5>PRICES:</h5>
            <div>
              <h4>
                {pricing.symbol} {pricing.amount}
              </h4>
            </div>
          </div>
          <div className="button-container">
            <button
              className={
                product.inStock
                  ? `btn-available ${this.state.btnClass}`
                  : "btn-unavailable"
              }
              disabled={!product.inStock}
              onClick={() => this.handleAddToCart()}
            >
              Add To Cart
            </button>
          </div>
          {this.state.flag && (
            <div className="text-danger">*you have to select from attributes</div>
          )}

          <div
            className="product-description"
            dangerouslySetInnerHTML={{ __html: clean }}
          ></div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state, props) {
  // console.log("mapstate", state, props, state.currentCurrency)
  return {
    category:
      state.categories.filter(
        (category) => category.name === props.match.params.categoryName
      )[0] ||
      state.categories.filter((category) => category.name === "all")[0] ||
      JSON.parse(localStorage.getItem("category")),
    currentCurrency: state.currentCurrency,
    cart: state.cart,
  }
}

export default connect(mapStateToProps)(ProductDetails)
