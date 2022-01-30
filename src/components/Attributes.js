import React, { Component } from "react"
import "../style/attributes.style.css"
import PropTypes from "prop-types"

class Attributes extends Component {
  constructor(props) {
    super(props)
    this.state = {
      x: "",
    }
  }

  static propTypes = {
    attributes: PropTypes.array,
    resetFlag: PropTypes.func,
    handleAddSelectedAttrs: PropTypes.func,
    handleOnSelect: PropTypes.func,
    items: PropTypes.object,
  }

  handleSelect = (e, attr) => {
    this.props.resetFlag()
    this.props.handleOnSelect(e, attr)
  }

  render() {
    // destructing attributes from props
    let attributes
    if (this.props.attributes !== undefined) {
      attributes = this.props.attributes
    }

    return (
      <div>
        {attributes &&
          attributes.map((attribute) => {
            let items
            if (attribute.items && attribute.items.length !== 0) {
              items = attribute.items
            }

            return (
              <div className="attr-container" key={attribute.name}>
                <div className="attr-title">{attribute.name}:</div>
                {attribute.type !== "swatch" ? (
                  <div className="items-container">
                    {items !== undefined &&
                      this.props.items &&
                      items.map((item) => {
                        let v,
                          x = ""
                        if (
                          this.props.items[attribute.name] !== undefined &&
                          Object.keys(this.props.items).length !== 0
                        ) {
                          v = item.value
                          x = this.props.items[attribute.name]
                        }

                        return (
                          <div
                            ref={this.divRef}
                            data-g={`${item.value}`}
                            className={
                              x !== undefined && v !== undefined ? `${x[v].class}` : ""
                            }
                            onClick={(e) =>
                              this.handleSelect(e, {
                                attrName: attribute.name,
                                selectedItem: {
                                  id: item.id,
                                  value: item.value,
                                  displayValue: item.displayValue,
                                },
                              })
                            }
                            key={item.value}
                          >
                            {item.value}
                          </div>
                        )
                      })}
                  </div>
                ) : (
                  <div className="sitems-container">
                    {items !== undefined &&
                      items.map((item) => {
                        let v,
                          x = ""
                        if (
                          this.props.items[attribute.name] !== undefined &&
                          Object.keys(this.props.items).length !== 0
                        ) {
                          v = item.value
                          x = this.props.items[attribute.name]
                        }

                        return (
                          <div
                            style={{ backgroundColor: `${item.value}` }}
                            ref={this.divRef}
                            data-g={`${item.value}`}
                            className={
                              x !== undefined && v !== undefined ? `${x[v].class}` : ""
                            }
                            onClick={(e) =>
                              this.handleSelect(e, {
                                attrName: attribute.name,
                                selectedItem: {
                                  id: item.id,
                                  value: item.value,
                                  displayValue: item.displayValue,
                                },
                              })
                            }
                            key={item.value}
                          ></div>
                        )
                      })}
                  </div>
                )}
              </div>
            )
          })}
      </div>
    )
  }
}
export default Attributes
