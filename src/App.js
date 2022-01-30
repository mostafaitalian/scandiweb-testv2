import "./App.css"
import React, { Component } from "react"
import { Redirect, Route, Switch } from "react-router-dom"
import Category from "./components/Category"
import { connect } from "react-redux"
import { handleInitData } from "./actions/shared"
import ProductDetails from "./components/ProductDetails"
import TitleComponent from "./components/TitleComponent"
import Cart from "./components/Cart"
import PropTypes from "prop-types"

class App extends Component {
  // initial state
  state = {
    currency: { showCurrency: false, class: "hide" },
    car: { showCart: false, class: "hide" },
    title: "all",
  }
  static propTypes = {
    category: PropTypes.array,
    dispatch: PropTypes.func,
  }

  handleShowCurrency = () => {
    this.setState((prev) => {
      return {
        car: { showCart: false, class: "hide" },
        currency: {
          showCurrency: !prev.currency.showCurrency,
          class: prev.currency.class === "hide" ? "show" : "hide",
        },
      }
    })
  }

  handleShowCart = () => {
    this.setState((prev) => {
      return {
        currency: { showCurrency: false, class: "hide" },
        car: {
          showCart: !prev.car.showCart,
          class: prev.car.class === "hide" ? "show" : "hide",
        },
      }
    })
  }

  handleCloseCurMenu = () => {
    this.setState({ currency: { showCurrency: false, class: "hide" } })
  }
  handleCloseCarMenu = () => {
    this.setState({ car: { showCart: false, class: "hide" } })
  }

  componentDidMount() {
    // handle initial data and setup redux store
    this.props.dispatch(handleInitData())
  }

  changeInitialTitle = (t) => {
    this.setState({ title: t })
  }

  render() {
    return (
      <div className="App">
        {/* Navigation component */}
        <TitleComponent
          handleCloseCarMenu={this.handleCloseCarMenu}
          handleCloseCurMenu={this.handleCloseCurMenu}
          handleShowCart={this.handleShowCart}
          handleShowCurrency={this.handleShowCurrency}
          currency={this.state.currency}
          car={this.state.car}
          // cartt={this.state.cartt}
          initialTitle={this.state.title}
          changeInitialTitle={this.changeInitialTitle}
        />
        {/* Routes in app */}
        <Switch>
          <Route
            exact
            path="/cart"
            render={({ match, history }) => (
              <Cart
                match={match}
                history={history}
                changeInitialTitle={this.changeInitialTitle}
              />
            )}
          />
          <Route
            exact
            path="/:name"
            render={({ history, match }) => (
              <Category
                initialTitle={this.state.title}
                match={match}
                history={history}
                handleCloseCarMenu={this.handleCloseCarMenu}
                handleCloseCurMenu={this.handleCloseCurMenu}
                category={this.props.category}
                changeInitialTitle={this.changeInitialTitle}
              />
            )}
          />
          {/* redirect "/" path to "/all" */}
          <Route exact path="/" render={() => <Redirect to="/all" />} />
          <Route
            path="/products/:categoryName/:productId"
            render={({ match, history }) => (
              <ProductDetails
                handleCloseCarMenu={this.handleCloseCarMenu}
                handleCloseCurMenu={this.handleCloseCurMenu}
                match={match}
                history={history}
                changeInitialTitle={this.changeInitialTitle}
              />
            )}
          />
        </Switch>
      </div>
    )
  }
}

function mapStateToProps(state) {
  // get category by title
  const category = state.categories.filter((category) => category.name === state.title)
  return {
    category,
    currencies: state.currencies,
    currentCurrency: state.currentCurrency,
  }
}

export default connect(mapStateToProps)(App)
