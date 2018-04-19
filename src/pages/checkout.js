import React from 'react'
import { connect } from 'react-redux'
import cc from 'create-react-class'
import pt from 'prop-types'
import {
  getDay,
  addDays,
  isToday,
  isBefore,
  isAfter,
  startOfDay,
  subMinutes,
  addHours,
  differenceInMinutes,
  addMinutes,
  format
} from 'date-fns'
import {
  injectStripe,
  Elements,
  CardElement
} from 'react-stripe-elements-universal'
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
import QuantityInput from '../components/QuantityInput'
import { pick } from '../utils'
// import { selectors as orderSelectors } from 'App/views/PlaceOrder/state/order'
import {
  placeOrder,
  // updateConsumer,
  // createConsumer,
  // listenForConsumerUpdates
  selectors
} from '../appstate'
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
      backgroundImage={
        `url("https://firebasestorage.googleapis.com/v0/b/roux-live.appspot.com/o/assets%2Froux-pattern-white.png?alt=media&token=cf378882-9c5a-48cd-9717-fd65202411bf")`
      }
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
  placeOrder: details => dispatch(placeOrder(props.match.params)(details))
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
      this.props.placeOrder(pick([ 'token' ], this.state))
    },
    /**
     * 1. we can't process the order without a token. So we'll wait until we get
     * one by setting a timeout.
     */
    completeOrder () {
      this.setState(
        prev => ({ isProcessingOrder: true, transactionError: undefined }),
        () =>
          runOnCondition({
            fn: this.processOrder,
            condition: () => this.state.token,
            interval: 100
          })
      )
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
      return addDays(new Date(), 5 - currentDay)
    },
    getFirstTimeslot () {
      const nextFriday = this.getNextFriday()
      // 18hours + 12:00 should equal 6pm
      const standardStartTime = addHours(startOfDay(nextFriday), 18)
      if (!isToday(nextFriday)) {
        return standardStartTime
      } else {
        // get current time
        const now = new Date()
        if (isAfter(now, standardStartTime)) {
          // if time is after standardStartTime
          // round up to next available timeslot from current time
          const minDiff = differenceInMinutes(standardStartTime, now)
          const hours = minDiff / 60
          const minutes = minDiff % 60
          let bufferHours = 1
          if (minutes >= 30) {
            bufferHours = 1.5
          }
          return addHours(standardStartTime, hours + bufferHours)
        } else {
          return standardStartTime
        }
      }
    },
    /**
     * 1. get friday. add a day (saturday). get the start of day timestamp of saturday
     * so we get a clean 12:00 rather than 11:59. subtract 30 minutes for 11:30 pm friday
     */
    getLastTimeslot () {
      return subMinutes(startOfDay(addDays(this.getNextFriday(), 1)), 30)
    },
    getAvailableOrderTimes () {
      let timeslot = this.getFirstTimeslot()
      const end = this.getLastTimeslot()
      let timeslots = []
      while (isBefore(timeslot, end)) {
        timeslots.push(timeslot)
        timeslot = addMinutes(timeslot, 30)
      }
      return timeslots
    },
    phaseConfig: [
      {
        onSubmitFnName: 'phaseForward',
        fieldsetLabel: 'Order Info',
        renderMain: context => {
          const times = context.getAvailableOrderTimes()
          return (
            <Box>
              <Box mt={3} pb={3}>
                <QuantityInput
                  label='How many orders do you want?'
                  onChange={
                    quantity => context.setState(prev => ({ quantity }))
                  }
                  quantity={context.state.quantity}
                  inputSize={3}
                />
              </Box>
              <SelectField
                value={context.state.time}
                onChange={context.updateField('time')}
                label={
                  `When should we deliver this to you on ${format(
                    times[0],
                    'Do'
                  )}?`
                }
              >
                <option defaultValue={''} />
                {times.map((timestamp, i) => {
                  const timespan = `${format(timestamp, 'ddd')} ${format(
                      timestamp,
                      'h:mm a'
                    )} - ${format(addMinutes(timestamp, 15), 'h:mm a')}`
                  return (
                    <option value={timespan} defaultValue={''} key={i}>
                      {timespan}
                    </option>
                  )
                })}
              </SelectField>
            </Box>
          )
        },
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
              value={context.state.name}
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
          <Box>
            <Elements>
              <CardForm onTokenReception={context.storeToken} />
            </Elements>
          </Box>
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
              <Button type='submit' disabled={!context.state.token}>
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
      // console.log(getDay(new Date()), this.getAvailableOrderTimes())
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
