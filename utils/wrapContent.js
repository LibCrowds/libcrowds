// Based on https://github.com/cferdinandi/nextUntil

export const wrapContent = (elem, selector, wrapper) => {
  let elemClone = wrapper.cloneNode()
  let wrapperClone = wrapper.cloneNode()

  // matches() polyfill
  if (!Element.prototype.matches) {
    Element.prototype.matches = (
      Element.prototype.msMatchesSelector ||
      Element.prototype.webkitMatchesSelector
    )
  }

  elem = elem.firstElementChild
  console.log(elem.nextElementSibling)

  while (elem) {
    console.log('matches', elem, selector, elem.matches(selector))

    if (elem.matches(selector)) {
      console.log('match', wrapperClone)

      elemClone.append(wrapperClone.cloneNode())
      wrapperClone = wrapper.cloneNode()
    }
    wrapperClone.append(elem)
    elem = elem.nextElementSibling
    console.log('next sibling', elem)
  }
  console.log(wrapperClone)
  elem = elemClone
  return elemClone
}
