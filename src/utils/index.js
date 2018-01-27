export const pick = (keys, map) => {
  let newObj = {}

  keys.forEach(key => {
    if (typeof map[key] !== 'undefined') newObj[key] = map[key]
  })

  return newObj
}

export const pluck = (keys, map) => {
  let newObj = { ...map }

  keys.forEach(key => delete newObj[key])

  return newObj
}

export const capitalize = string =>
  string
    .split(' ')
    .map(str => str.charAt(0).toUpperCase() + str.slice(1))
    .join(' ')

export const flatten = collection =>
  collection.reduce((prev, next) => ({ ...prev, ...next }), {})

export const trimUrl = url =>
  url.charAt(url.length - 1) === '/' ? url.slice(0, url.length - 1) : url

export const debounce = (func, wait, immediate) => {
  let timeout
  return () => {
    let context = this
    let args = arguments
    var later = function () {
      timeout = null
      if (!immediate) func.apply(context, args)
    }
    var callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
}
