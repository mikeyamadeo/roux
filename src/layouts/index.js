import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'

import './index.css'
import { settings as s } from '../UI'

const TemplateWrapper = ({ children }) => (
  <div style={{ height: '100%' }}>
    <Helmet
      title='Roni Provo'
      meta={
      [
          { name: 'description', content: 'Sample' },
          { name: 'keywords', content: 'sample, something' }
      ]
      }
      script={[ { src: 'https://js.stripe.com/v3/' } ]}
    />
    <div style={{ height: '100%', backgroundColor: s.colors.bg }}>
      {children()}
    </div>
  </div>
)

TemplateWrapper.propTypes = { children: PropTypes.func }

export default TemplateWrapper
