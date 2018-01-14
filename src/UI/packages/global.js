import { css } from 'glamor'
import { baseFontSize, fonts } from './settings'

css.global('html', { fontSize: baseFontSize, fontFamily: fonts.primary })

if (window) {
  const WebFont = require('webfontloader')
  WebFont.load({
    google: { families: [ 'Playfair+Display:400,700', 'serif' ] }
  })
}
