import React, { Component } from "react"
import { connect } from "react-redux"
import { changeCurrentCurrency } from "../actions/CurrentCurrency"
import "../style/currencylist.style.css"
import PropTypes from "prop-types"

class CurrencyList extends Component {
  static propTypes = {
    currencies: PropTypes.array,
    dispatch: PropTypes.func,
    handleCloseCurMenu: PropTypes.func,
  }

  handleOnClick = (currency) => {
    this.props.dispatch(changeCurrentCurrency(currency))
    this.props.handleCloseCurMenu()
  }

  render() {
    // destructring currencies
    const { currencies } = this.props
    return (
      // currency list
      <ul className="currency-list">
        {currencies.map((currency) => (
          <li key={currency.label} onClick={() => this.handleOnClick(currency)}>
            {currency.symbol} {currency.label}
          </li>
        ))}
      </ul>
    )
  }
}

export default connect()(CurrencyList)
