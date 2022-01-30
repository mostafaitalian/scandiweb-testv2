import { client } from "../index"
import { gql } from "@apollo/client"

// check if 2 arrays are equals all items in first array are the same as the second
export function checkArraysEqual(a, b) {
  if (a === b) return true
  if (a.length !== b.length) return false
  if (a == null || b == null) return false
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false
  }
  return true
}

// check if an array are existing in an array of arrays
export function arrayInArrays(arr, arrs) {
  for (const a of arrs) {
    if (checkArraysEqual(arr, a)) return true
  }
  return false
}

// get an array of product id and all selectedattributes values
export function getSelectedAtt(productId, attrs) {
  const sAttributes = attrs["attr"]
  let a = [productId]
  if (Object.keys(attrs).length !== 0) {
    for (const att of Object.keys(sAttributes)) {
      for (const attItem of Object.keys(sAttributes[att])) {
        if (sAttributes[att][attItem].selected === true) {
          a.push(attItem)
        }
      }
    }
  }

  return a
}
export const checkAllAttributesSelected = (attrs) => {
  const attributes = attrs["attr"]
  let selectedA = 0
  for (const keyAtt in attributes) {
    for (const keyA in attributes[keyAtt]) {
      const s = attributes[keyAtt][keyA].selected
      if (s) {
        selectedA += 1
      }
    }
  }
  if (selectedA === Object.keys(attributes).length) {
    return true
  } else {
    return false
  }
}
export function reshapeAttributes(attributes) {
  let h = {}
  for (const att of attributes) {
    if (att.items.length !== 0) {
      for (let item of att.items) {
        h = {
          ...h,
          [att.name]: {
            ...h[att.name],
            ...{ [item.value]: { class: "", value: item.value, selected: false } },
          },
        }
      }
    }
  }
  return h
}

// get the price of the product depending on the currentcurrency used
export function getPrice(curCurrency, product) {
  let amount, symbol
  if (curCurrency !== undefined && Object.keys(curCurrency)) {
    const a = product.prices.filter((price) => price.currency.label === curCurrency.label)
    const p = a[0]
    if (p !== undefined) {
      amount = p.amount
      symbol = p.currency.symbol
      return {
        amount,
        symbol,
      }
    }
    // console.log(p.amount)
  }
}

// get all currencies from database
export function getAllCurrencies() {
  const currencies = gql`
    query CurrenciesQuery {
      currencies {
        label
        symbol
      }
    }
  `
  return client.query({
    query: currencies,
  })
}

// get all categories from database
export function getCategory(title) {
  const category = gql`
    query Category($input: CategoryInput) {
      category(input: $input) {
        name
        products {
          id
          name
          inStock
          gallery
          description
          category
          attributes {
            id
            name
            type
            items {
              displayValue
              value
              id
            }
          }
          prices {
            currency {
              label
              symbol
            }
            amount
          }
          brand
        }
      }
    }
  `
  return client.query({
    query: category,
    variables: {
      input: { title },
    },
  })
}
export function getAllCategories() {
  const categories = gql`
    query CategoriesQuery {
      categories {
        name
        products {
          name
          inStock
          gallery
          description
          category
          attributes {
            name
            type
            items {
              value
              displayValue
            }
          }
          prices {
            currency {
              symbol
              label
            }
            amount
          }
          brand
          id
        }
      }
    }
  `
  return client.query({
    query: categories,
  })
}
