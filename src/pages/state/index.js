import { combineReducers } from 'redux'
import { createReducer } from '../../state/utils'
export const callStore = require('../../config/api').callStore

export default combineReducers({ tada: createReducer('tada', {}) })
