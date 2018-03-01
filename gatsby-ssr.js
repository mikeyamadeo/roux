import React from 'react'
import { Provider } from 'react-redux'
import { StripeProvider } from 'react-stripe-elements-universal'
import { renderToString } from 'react-dom/server'
import { configureStore } from './src/state/'
import inline from 'glamor-inline'

exports.replaceRenderer = ({ bodyComponent, replaceBodyHTMLString }) => {
  const bodyHTML = renderToString(
    <Provider store={configureStore()}>
      <StripeProvider apiKey={process.env.STRIPE_API_KEY}>
        {bodyComponent}
      </StripeProvider>
    </Provider>
  )
  const inlinedHTML = inline(bodyHTML)
  replaceBodyHTMLString(inlinedHTML)
}
