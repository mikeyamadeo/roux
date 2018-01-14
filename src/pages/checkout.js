import React from 'react'
import { connect } from 'react-redux'
import cc from 'create-react-class'
import pt from 'prop-types'
import {
  getDay,
  addDay,
  isToday,
  isBefore,
  startOfDay,
  subMinutes,
  addHours
} from 'date-fns'
import { injectStripe, Elements, CardElement } from 'react-stripe-elements'
import {
  Box,
  Flex,
  Text,
  Title,
  Button,
  settings,
  InputField,
  SelectField
} from '../UI'
import QuantityInput from './components/QuantityInput'
// import { selectors as orderSelectors } from 'App/views/PlaceOrder/state/order'
// import {
//   placeOrder,
//   updateConsumer,
//   createConsumer,
//   selectors,
//   listenForConsumerUpdates
// } from './state'
const runOnCondition = ({ fn, condition, interval }) => (function run () {
  if (condition()) {
    return fn()
  }
  window.setTimeout(run, interval)
})()

const { colors: clr } = settings
const toPrice = num => `$${num.toFixed(2)}`

const Fieldset = ({ label, children }) => (
  <Box pb={1}>
    <Box
      p={2}
      borderTopLeftRadius='5px'
      borderTopRightRadius='5px'
      bg='black'
      backgroundImage={`url("/static/roux-pattern-white.png")`}
      backgroundSize={`350px`}
    >
      <Title fontSize={4} onDark>{label}</Title>
    </Box>
    <Box px={1}>
      {children}
    </Box>
  </Box>
)

const Checkout = connect(state => ({}), (dispatch, props) => ({
  // placeOrder: details => dispatch(placeOrder(props.match.params)(details))
  placeOrder: () => ({})
}))(
  cc({
    propTypes: { tax: pt.number, subtotal: pt.number, total: pt.number },
    getInitialState () {
      return {
        phaseIndex: 0,
        name: '',
        phone: '',
        address: { zip: '', line1: '' },
        token: '',
        isProcessingOrder: false,
        transactionError: undefined,
        quantity: 1
      }
    },
    componentWillReceiveProps ({ placedOrder, match, history }) {
    },
    updateField (key) {
      return e => {
        let state = { [key]: e.target.value }
        this.setState(() => state)
      }
    },
    updateAddress (key) {
      return e => {
        let state = {
          address: { ...this.state.address, [key]: e.target.value }
        }
        this.setState(() => state)
      }
    },
    processOrder () {
      /**
       * TODO: What if the transaction hangs indefinitely? we should set a timeout to stop
       * the loading view and instruct the user
       */
      this.setState(
        prev => ({ isProcessingOrder: true, transactionError: undefined }),
        this.props.placeOrder({ token: this.state.token }, this.state)
      )
    },
    /**
     * 1. we can't process the order without a token. So we'll wait until we get
     * one by setting a timeout.
     */
    completeOrder () {
      runOnCondition({
        fn: this.processOrder,
        condition: () => this.state.token,
        interval: 100
      })
    },
    storeToken ({ token }) {
      this.setState(prev => ({ token }))
    },
    phaseForward () {
      this.changePhase(1)
    },
    phaseBack () {
      this.changePhase(-1)
    },
    changePhase (delta) {
      this.setState(prev => ({ phaseIndex: prev.phaseIndex + delta }))
    },
    getNextFriday () {
      let currentDay = getDay(new Date())
      return addDay(new Date(), 5 - currentDay)
    },
    getFirstTimeslot () {
      const nextFriday = this.getNextFriday()
      const standardStartTime = addHours(startOfDay(nextFriday), 18)
      if (!isToday(nextFriday)) {
        // 18hours + 12:00 should equal 6pm
        return standardStartTime
      } else {
      }
    },
    /**
     * 1. get friday. add a day (saturday). get the start of day timestamp of saturday
     * so we get a clean 12:00 rather than 11:59. subtract 30 minutes for 11:30 pm friday
     */
    getLastTimeslot () {
      return subMinutes(startOfDay(addDay(this.getNexFriday())), 30)
    },
    // getAvailableOrderTimes () {
    //   const friday = this.getNextFriday()
    //   let timeslot = 6
    //   let availableTimeslots = []
    //   isFriday(new Date())
    //   while (timeslot < 12) {
    //
    //   }
    //   return [ '' ]
    // },
    phaseConfig: [
      {
        onSubmitFnName: 'phaseForward',
        fieldsetLabel: 'Order Info',
        renderMain: context => (
          <Box>
            <Box mt={3} pb={3}>
              <QuantityInput
                label='How many orders do you want?'
                onChange={quantity => context.setState(prev => ({ quantity }))}
                quantity={context.state.quantity}
                inputSize={3}
              />
            </Box>
            <SelectField
              value={context.state.time}
              onChange={context.updateField('time')}
              label='When should we deliver this to you?'
            >
              {[ '', 20, 30, 45, 60 ].map((amount, i) => (
                <option value={amount} defaultValue={''} key={amount}>
                  {amount}
                </option>
                ))}
            </SelectField>
          </Box>
        ),
        renderFooter: context => (
          <Box>
            <Button type='submit'>
              Enter Contact Info
            </Button>
          </Box>
        )
      },
      {
        onSubmitFnName: 'phaseForward',
        fieldsetLabel: 'Contact Info',
        renderMain: context => (
          <Box>
            <InputField
              label='name'
              value={context.state.firstName}
              onChange={context.updateField('name')}
            />
            <InputField
              label='phone'
              mask='999 999 9999'
              maskChar=' '
              value={context.state.phone}
              onChange={context.updateField('phone')}
            />
            <InputField
              label='zip code'
              mask='99999'
              value={context.state.address.zip}
              onChange={context.updateAddress('zip')}
            />
            <InputField
              label='address'
              value={context.state.address.line1}
              onChange={context.updateAddress('line1')}
            />
          </Box>
        ),
        renderFooter: context => (
          <Box>
            <Button type='submit'>
              Go To Payment
            </Button>
            <Flex onClick={context.phaseBack} cursor='pointer' p={2}>
              <Text fontSize={2}>Back</Text>
            </Flex>
          </Box>
        )
      },
      {
        onSubmitFnName: 'completeOrder',
        fieldsetLabel: 'Payment',
        renderMain: context => (
          <Elements>
            <CardForm onTokenReception={context.storeToken} />
          </Elements>
        ),
        renderFooter: context => (
          <Box>
            <Box px={1}>
              {
                [ 'Total' ].map((cost, i) => (
                  <LineItem
                    key={cost}
                    bolded
                    label={cost}
                    value={toPrice(12)}
                    hasTopline={i > 0}
                  />
                ))
              }
            </Box>
            <Box>
              <Button type='submit'>
                Complete Order
              </Button>
              <Flex onClick={context.phaseBack} cursor='pointer' p={2}>
                <Text fontSize={2}>Back</Text>
              </Flex>
            </Box>
          </Box>
        )
      }
    ],
    render () {
      console.log(getDay(new Date()))
      return (
        <Box overflow='auto' height='100%'>
          <Box overflow='hidden'>
            <Box
              position='relative'
              width='300%'
              transform={
                `translateX(${(0 - this.state.phaseIndex) * 33.333333333}%)`
              }
              transition='.35s'
            >
              {[ 0, 1, 2 ].map(i => (
                <Form
                  onSubmit={this[this.phaseConfig[i].onSubmitFnName]}
                  verticalAlign='top'
                  key={i}
                  >
                  <Box w='100%' maxWidth='450px' margin='0 auto'>
                    <Fieldset label={this.phaseConfig[i].fieldsetLabel}>
                      {this.phaseConfig[i].renderMain(this)}
                    </Fieldset>
                    <Box mt={2}>
                      {this.phaseConfig[i].renderFooter(this)}
                    </Box>
                  </Box>
                </Form>
                ))}
            </Box>
          </Box>
        </Box>
      )
    }
  })
)
const Form = ({ onSubmit, ...rest }) => (
  <Box
    is='form'
    display='inline-block'
    py={3}
    w='33.3333333%'
    onSubmit={e => {
      e.preventDefault()
      onSubmit()
    }}
    {...rest}
  />
)

const _CardForm = cc({
  getInitialState () {
    return { errorMessage: '' }
  },
  createToken () {
    this.props.stripe
      .createToken()
      .then(payload => this.props.onTokenReception(payload))
  },
  onChange ({ complete, error }) {
    if (complete) {
      this.createToken()
    }

    this.setState(prev => ({ errorMessage: error ? error.message : '' }))
  },
  render () {
    return (
      <div>
        <Box is='label' bg='white' display='block' py={2} px={1}>
          <CardElement
            style={{ base: { fontSize: '18px' } }}
            onChange={this.onChange}
          />
        </Box>
        <Box py={2} px={1}>
          <Text error>{this.state.errorMessage}</Text>
        </Box>
      </div>
    )
  }
})
const CardForm = injectStripe(_CardForm)

const LineItem = ({ label, value, hasTopline, bolded }) => (
  <Flex
    justify='space-between'
    borderTop={`solid 1px ${hasTopline ? clr.lightBaseBorder : 'transparent'}`}
    py={1}
  >
    <Title>{label}</Title>
    <Title>
      {value}
    </Title>
  </Flex>
)

export default Checkout
