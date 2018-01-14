import React from 'react'
import { css } from 'glamor'
import { colors, fonts } from '../settings'
import { lightening as l, pxToEm } from '../utils'

const base = css({ cursor: 'pointer', border: 'none', outline: 'none' })
const main = css({
  fontFamily: fonts.primary,
  color: colors.textOnDark,
  transition: '.25s',
  fontWeight: 'bold',
  fontSize: '1.2em',
  padding: '12px 0',
  width: '100%',
  // border: `solid 1px ${colors.lightBaseHighlight}`,
  letterSpacing: '.2'
})

const themes = {
  primary: css({
    backgroundColor: colors.text,
    ':hover': { backgroundColor: l(colors.text, -10) }
  }),
  secondary: css({
    backgroundColor: colors.tertiary,
    ':hover': { backgroundColor: l(colors.tertiary, -10) }
  }),
  disabled: css({ backgroundColor: 'grey' })
}

const Button = ({ children, disabled, theme = 'primary', ...props }) => (
  <button
    {...props}
    {...base}
    {...main}
    {...themes[disabled ? 'disabled' : theme]}
    disabled={disabled}
  >
    {children}
  </button>
)

export default Button
