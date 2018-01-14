import React from 'react'
import glamorous from 'glamorous'
import { fontSize, space } from 'styled-system'
import Base from '../Base'
import { fonts, colors } from '../settings'

const TextBase = glamorous(({ is = 'span', onDark, ...rest }) => (
  <Base {...rest} is={is} />
))(fontSize, space)

export const Text = glamorous(TextBase)(
  ({ onDark = false }) => onDark ? { color: 'white' } : undefined,
  // ({ error = false }) => error ? { color: colors.error } : undefined,
  // ({ success = false }) => success ? { color: colors.success } : undefined
  { fontFamily: fonts.primary, color: colors.textOnLight, transition: '.25s' }
)

export const Title = glamorous(Text)({
  fontWeight: 'bold',
  letterSpacing: '0.1'
})
