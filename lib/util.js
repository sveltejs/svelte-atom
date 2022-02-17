'use babel'

export const debounce = (delay, fn) => {
  let timeout
  return () => {
    clearTimeout(timeout)
    timeout = setTimeout(fn, delay)
  }
}
