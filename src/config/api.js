// import firebase from 'firebase'
// import 'firebase/firestore'
import configureMiddleware from 'redux-firestore-middleware'
let config = {
  apiKey: 'AIzaSyC0PrG631OTi-N9L63T_VEwcxRBjqnUsEQ',
  authDomain: 'order.boostly.com',
  projectId: 'boostly-live'
}

// let _auth
// let firestoreInstance
// if (window) {
//   firebase.initializeApp(config)
//   _auth = firebase.auth()
//   firestoreInstance = firebase.firestore()
// }
//
// export const auth = _auth
const CALL_STORE = 'CALL_STORE'
export const callStore = config => ({ [CALL_STORE]: { ...config } })

export default store => next => action => {
  console.group(action.type)
  console.info('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  console.groupEnd(action.type)
  return result
}
