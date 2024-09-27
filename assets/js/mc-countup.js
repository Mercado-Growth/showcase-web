// How long you want the animation to take, in ms
const animation_duration = 600

// Calculate how long each ‘frame’ should last if we want to update the animation 60 times per second
const frame_duration = 1000 / 60

// Use that to calculate how many frames we need to complete the animation
const total_frames = Math.round(animation_duration / frame_duration)

// Default easing
const mc_easing_default = (time) => {
  return time
}

// An ease-out function that slows the count as it progresses
const ease_out_quad = (time) => {
  return time * (2 - time)
}

// The animation function, which takes an Element
const mc_count_up = ({
  el, 
  easing_func = mc_easing_default, 
  transform_func = mc_transform_default,
}) => {
  let frame = 0

  const mc_countup_target = el.dataset.mcCountupTarget
  console.log('mc_countup_target', mc_countup_target)

  const count_to = parseInt( mc_countup_target, 10 )
  console.log('count_to', count_to)

  // Start the animation running 60 times per second
  const counter = setInterval(() => {
    frame++
    // Calculate our progress as a value between 0 and 1
    // Pass that value to our easing function to get our progress on a curve
    const progress = easing_func(frame / total_frames)
    console.log('progress', progress)

    // Use the progress value to calculate the current count
    const current_count = Math.round(count_to * progress)
    console.log('current_count', current_count)

    const transformed_count = transform_func(current_count)
    console.log('transformed_count', transformed_count)

    // If the current count has changed, update the element
    if (parseInt(el.innerHTML, 10) !== current_count) {
      el.innerHTML = transformed_count
    }

    // If we’ve reached our last frame, stop the animation
    if (frame === total_frames) {
      clearInterval(counter)
      console.log('Done!')
    }
  }, frame_duration)
}

const mc_transform_default = (value) => {
  return value
}

const mc_transform_currency = (integer) => {
  const transformed = integer.toLocaleString()
  console.log('transformed', transformed)
  return `$${transformed}`
}