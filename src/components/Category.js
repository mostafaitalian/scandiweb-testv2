import React, { Component } from "react"
import { connect } from "react-redux"
import { getCategory } from "../utils"
import ProductItem from "./ProductItem"
import "../style/category.style.css"
import PropTypes from "prop-types"
import { addCategory } from "../actions/Categories"
import Spin from "react-cssfx-loading/lib/CircularProgress"

class Category extends Component {
  state = {
    name: "",
    category: {},
  }
  static propTypes = {
    handleCloseCarMenu: PropTypes.func,
    handleCloseCurMenu: PropTypes.func,
    match: PropTypes.object,
    category: PropTypes.object,
    dispatch: PropTypes.func,
  }
  componentDidMount() {
    getCategory(this.props.match.params.name).then((result) => {
      if (result.loading === false) {
        this.setState({ category: result.data.category }, () => {
          this.props.dispatch(addCategory(this.state.category))
          localStorage.setItem("category", JSON.stringify(this.state.category))
        })
      }
    })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.name !== this.props.match.params.name) {
      getCategory(this.props.match.params.name).then((result) => {
        if (result.loading === false) {
          this.setState({ category: result.data.category }, () => {
            this.props.dispatch(addCategory(this.state.category))
            localStorage.setItem("category", JSON.stringify(this.state.category))
          })
        }
      })
    }
  }
  render() {
    const title = this.props.match.params.name
    if (
      this.state.category === undefined ||
      Object.keys(this.state.category).length === 0
    ) {
      return (
        <div className="loading-container">
          <Spin color="#5ECE7B" />
        </div>
      )
    }
    return (
      <div
        onClick={() => {
          this.props.handleCloseCarMenu()
          this.props.handleCloseCurMenu()
        }}
      >
        <div className="category-title">
          {this.props.category && this.props.category.name.toUpperCase()}
        </div>
        <div className="product-list-container">
          {this.props.category !== undefined &&
            this.props.category.products.map((product) => (
              <ProductItem product={product} title={title} key={product.id} />
            ))}
        </div>
      </div>
    )
  }
}

function mapStateToProps(state, props) {
  return {
    category: state.categories.filter(
      (category) => category.name === props.match.params.name
    )[0],
    currentCurrency: state.currentCurrency,
  }
}
export default connect(mapStateToProps)(Category)
