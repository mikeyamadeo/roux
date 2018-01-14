import React from 'react'
import cc from 'create-react-class'
import pt from 'prop-types'
import { NoSelect, Flex, Box, Text, settings as s } from '../../../UI'

const Paddle = ({ size, onClick, children, hide }) => (
  <Flex
    onClick={onClick}
    justify='center'
    align='center'
    border={`solid 1px ${s.colors.textOnLight}`}
    borderRadius='50%'
    w={32}
    height={32}
    cursor='pointer'
    opacity={hide ? 0 : 1}
  >
    <Box is='span' fontSize={size + 2} fontFamily='system-ui'>
      {children}
    </Box>
  </Flex>
)
const QuantityInput = cc({
  propTypes: {
    label: pt.string,
    onChange: pt.func,
    quantity: pt.number,
    minimum: pt.number,
    inputSize: pt.oneOf([ 1, 2, 3 ])
  },
  getDefaultProps () {
    return { minimum: 1, inputSize: 2 }
  },
  incrementQuantity () {
    this.props.onChange(this.props.quantity + 1)
  },
  decrementQuantity () {
    if (this.props.quantity <= this.props.minimum) return
    this.props.onChange(this.props.quantity - 1)
  },
  render () {
    const { label, quantity, minimum, inputSize } = this.props
    return (
      <NoSelect>
        <Flex column>
          {label && (
          <Box
            is='span'
            paddingLeft='1rem'
            fontSize={inputSize}
            fontFamily='system-ui'
                >
            {label}
          </Box>
              )}
          <Flex align='center' mt={label ? 2 : 1}>
            <Paddle
              size={inputSize}
              onClick={this.decrementQuantity}
              hide={!(quantity > minimum)}
            >
              <Box mt='-2px'>
                -
              </Box>
            </Paddle>
            <Flex
              justify='center'
              align='center'
              w={`${inputSize * 1.5 + 50}px`}
            >
              <Box
                is='span'
                paddingLeft='1rem'
                fontSize={inputSize + 3}
                fontFamily='system-ui'
                mr='18px'
              >
                {quantity}
              </Box>
            </Flex>
            <Paddle size={inputSize} onClick={this.incrementQuantity}>
              +
            </Paddle>
          </Flex>
        </Flex>
      </NoSelect>
    )
  }
})

export default QuantityInput
