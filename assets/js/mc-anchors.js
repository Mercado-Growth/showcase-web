const mc_scroll_to_element = (element_id) => {
  const element = document.getElementById(element_id)
  console.log('element', element)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

const mc_handle_anchor_click = (event) => {
  const { target } = event
  console.log('mc_handle_anchor_click', event.target, event.target.hash, event)
  if (
    target.tagName.toLowerCase() === 'a' &&
    target.hasAttribute('href') &&
    target.hash
  ) {
    const { hash } = target
    if (hash.startsWith('#')) {
      event.preventDefault() // Prevent default behavior (page refresh)
      const element_id = hash.slice(1)
      console.log('element_id', element_id)
      mc_scroll_to_element(element_id)
    }
  }
}

const mc_setup_anchor_listeners = () => {
  document.addEventListener('click', mc_handle_anchor_click)
  // const anchors = document.querySelectorAll('a')
  // anchors.forEach((anchor) => {
  //   anchor.addEventListener('click', mc_handle_anchor_click)
  // })
}

document.addEventListener('DOMContentLoaded', () => {
  mc_setup_anchor_listeners()
})