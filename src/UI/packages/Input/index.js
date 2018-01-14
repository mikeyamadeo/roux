import React from 'react'
import { css } from 'glamor'
import cc from 'create-react-class'
import InputMask from 'react-input-mask'
import { colors as clr, fonts } from '../settings'
import { pxToEm, opacity, createPlaceholderStyles } from '../utils'

const transition = 'all 0.125s cubic-bezier(0.2, 0, 0.03, 1)'
const styledInput = css({
  width: '100%',
  margin: '2.5rem 0 1rem',
  position: 'relative'
})
const label = css({
  color: clr.text,
  padding: '1rem',
  position: 'absolute',
  top: 0,
  left: 0,
  transition,
  pointerEvents: 'none',
  fontSize: '1.2em',
  opacity: 0.5,
  fontFamily: 'system-ui'
})
const labelMovement = {
  fontSize: '1.2em',
  color: clr.text,
  top: '-2.5rem',
  transition,
  opacity: 0.8
}
const input = css({
  padding: '1rem 1rem',
  border: `solid 1px black`,
  width: '100%',
  fontSize: '1.2rem',
  transition: '.25s',
  fontFamily: 'system-ui',
  [`& ~ span`]: {
    display: 'block',
    width: 0,
    height: '3px',
    background: clr.text,
    position: 'absolute',
    bottom: 0,
    left: 0,
    transition
  },
  ':focus': { outline: 0, border: `solid 1px transparent` },
  [`:focus ~ span`]: { width: '100%', transition },
  [`.not-empty ~ span`]: { width: '100%', transition },
  [`:focus ~ label`]: { ...labelMovement },
  [`.not-empty ~ label`]: { ...labelMovement },
  [`.not-empty`]: { border: `solid 1px transparent` }
})
export const InputField = ({ baseRef = _ => _, ...rest, label: l }) => (
  <div {...styledInput}>
    <InputMask
      {...input}
      {...rest}
      ref={baseRef}
      className={rest.value ? 'not-empty' : ''}
    />
    <label {...label}>{l}</label>
    <span />
  </div>
)

export const Input = ({ baseRef = _ => _, ...rest }) => (
  <InputMask {...rest} {...base} {...font} {...border} ref={baseRef} />
)

export const Textarea = (
  { baseRef = _ => _, height = pxToEm(100), ...rest }
) => (
  <textarea
    {...css({ height })}
    {...rest}
    {...base}
    {...font}
    {...border}
    {...textarea}
    ref={baseRef}
  />
)

export const SelectField = ({ ...rest, label: l, baseRef }) => (
  <div {...styledInput}>
    <select
      {...input}
      {...rest}
      style={{ height: '55px', backgroundColor: 'white' }}
      ref={baseRef}
      className={rest.value ? 'not-empty' : ''}
    />
    <label {...label}>{l}</label>
    <span />
  </div>
)

const textarea = css({ resize: 'vertical' })
const base = css({
  width: '100%',
  height: pxToEm(40),
  transition: '.25s',
  ...createPlaceholderStyles({ opacity: 0.5 }),
  ':focus': { backgroundColor: 'white', color: 'black' }
})

const font = css({
  fontFamily: fonts.primary,
  fontSize: pxToEm(15),
  color: 'black',
  textIndent: pxToEm(10),
  fontWeight: 300
})

const border = css({
  border: `solid 1px ${clr.primary}`,
  ':focus': {
    outline: `none`,
    boxShadow: `0px 1px 5px ${opacity('black', 0.4)}`
  }
})
