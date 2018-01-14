import React from 'react'
import { Provider } from 'react-redux'
import { StripeProvider } from 'react-stripe-elements'
import { renderToString } from 'react-dom/server'
import { configureStore } from './src/state/'

exports.replaceRenderer = ({ bodyComponent, replaceBodyHTMLString }) => {
  const store = configureStore()
  const ConnectedBody = () => (
    <Provider store={store}>
      {bodyComponent}
    </Provider>
  )
  replaceBodyHTMLString(renderToString(<ConnectedBody />))
}
