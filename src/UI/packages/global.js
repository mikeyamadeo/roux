import { css } from 'glamor'
import WebFont from 'webfontloader'
import { baseFontSize, fonts } from './settings'

css.global('html', { fontSize: baseFontSize, fontFamily: fonts.primary })

WebFont.load({ google: { families: [ 'Playfair+Display:400,700', 'serif' ] } })
