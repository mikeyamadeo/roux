import { combineReducers } from 'redux'
import { createReducer, createAsyncActions as aa } from '../../state/utils'
// export const callStore = require('config/api').callStore

// export const callStore = require('../../config/api').callStore
const PLACING_ORDER_ACTIONS = aa('PLACING_ORDER')
const PLACED_ORDER_ID_RECEIVED = 'PLACED_ORDER_ID_RECEIVED'
const PLACED_ORDER_UPDATE_ACTIONS = aa('PLACED_ORDER_UPDATE')

export const placeOrder = ({ orgId, menuId }) =>
  transactionDetails => (dispatch, getState) => {
    const state = getState()
    let order = {
      status: 'awaitingValidation',
      org: orgId,
      menu: menuId,
      consumer: state.consumer.id,
      // timing,
      // items: state.order.map(item => ({
      //   ...pluck([ 'selectionValues' ], item),
      //   selections: item.selectionValues
      // })),
      // ...getTimestampProps(state)
      chargeSource: transactionDetails.token.id
    }
    dispatch(
      callStore({
        types: PLACING_ORDER_ACTIONS,
        query: { method: 'add', collection: 'orders', data: order }
      })
    ).then(({ id }) => {
      dispatch({ type: PLACED_ORDER_ID_RECEIVED, payload: { id } })
      dispatch(
        callStore({
          types: PLACED_ORDER_UPDATE_ACTIONS,
          schema: { name: 'orders' },
          query: { method: 'onSnapshot', collection: 'orders', doc: id }
        })
      )
    })
  }

export const selectors = {
  getPlacedOrder: ({ entities, placedOrderId }) =>
    entities.orders[placedOrderId]
}

export default combineReducers({
  placedOrderId: createReducer('', {
    [PLACED_ORDER_ID_RECEIVED]: (state, { payload }) => payload.id
  })
})
