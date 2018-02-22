import React from 'react'
import { Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import { StripeProvider } from 'react-stripe-elements-universal'
import { configureStore } from './src/state/'

exports.replaceRouterComponent = ({ history }) => {
  const store = configureStore()
  console.log(store)

  const ConnectedRouterWrapper = ({ children }) => (
    <Provider store={store}>
      <StripeProvider apiKey={process.env.STRIPE_API_KEY}>
        <Router history={history}>{children}</Router>
      </StripeProvider>
    </Provider>
  )

  return ConnectedRouterWrapper
}
