/* const load_template = async (url, container_id) => {
  const response = await fetch(url)
  const text = await response.text()
  const template = document.createElement('template')
  template.innerHTML = text.trim()
  const content = template.content.cloneNode(true)
  document.getElementById(container_id).appendChild(content)
}

// Load header and footer templates
document.addEventListener('DOMContentLoaded', () => {
  load_template('components/masthead.html', 'masthead-template')
}) */

const set_copyright = () => {
  const copyright_year_el = document.querySelector('#copyright-year')
  const current_year = new Date().getFullYear()
  copyright_year_el.textContent = current_year
}

const observe_mc_sections = () => {
  const logo_text = document.querySelector('#mercado-logo-text-tmpl')
  const logo_brandmark = document.querySelector('#mercado-logo-brandmark-tmpl')

  const mc_section_els = document.querySelectorAll('.mc-section')

  const callback = (entries, observer) => {
    entries.forEach((entry) => {
      const {
        target,
        isIntersecting,
        intersectionRatio,
        boundingClientRect,
      } = entry
      console.log('entry', target, boundingClientRect.top)

      if (
        boundingClientRect.top > 0 &&
        intersectionRatio >= 0.3 &&
        !target.classList.contains('mc-visible')
      ) {
        target.classList.add('mc-visible')
      }

      if (
        boundingClientRect.top > 0 &&
        intersectionRatio <= 0.3 &&
        target.classList.contains('mc-visible')
      ) {
        target.classList.remove('mc-visible')
      }

      if (
        boundingClientRect.top > 0 &&
        target.classList.contains('mc-change-theme-2')
      ) {
        document.body.classList.add('mc-theme-transition')

        if (intersectionRatio >= 0.5) {
          document.body.classList.remove('mc-theme-1')
          document.body.classList.add('mc-theme-2')
        } else {
          document.body.classList.remove('mc-theme-2')
          document.body.classList.add('mc-theme-1')
        }
      }

      // XXX: Just for now...
      if (
        boundingClientRect.top > 0 &&
        target.classList.contains('mc-change-theme-1')
      ) {
        document.body.classList.add('mc-theme-transition')

        if (intersectionRatio >= 0.5) {
          document.body.classList.remove('mc-theme-2')
          document.body.classList.add('mc-theme-1')
        } else {
          document.body.classList.remove('mc-theme-1')
          document.body.classList.add('mc-theme-2')
        }
      }

      // Handles page reloads where the user has already scrolled
      if (
        boundingClientRect.top <= 0 &&
        !target.classList.contains('mc-visible')
      ) {
        target.classList.add('mc-visible')
      }

      if (
        boundingClientRect.top <= 0 &&
        target.classList.contains('mc-change-theme-2')
      ) {
        console.log('AYYYYY')
        document.body.classList.remove('mc-theme-1')
        document.body.classList.add('mc-theme-2')
      }
    })
  }

  const options = {
    root: null,
    rootMargin: '0px',
    threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
  }

  const observer = new IntersectionObserver(callback, options)

  mc_section_els.forEach((mc_section_el) => {
    observer.observe(mc_section_el)
  })
}

const is_calendly_event = (event) => {
  return event.origin === 'https://calendly.com' && event.data.event && event.data.event.indexOf('calendly.') === 0;
};

const observe_calendly_messages = () => {
  window.addEventListener('message', (event) => {
    if(is_calendly_event(event)) {
      console.log("Calendly Event:", event.data.event);
      console.log("Calendly Event Payload:", event.data.payload);
    }
  });
}

const setup_calendly_widget = () => {
  Calendly.initInlineWidget({
    url: 'https://calendly.com/mercadogrowth/fit-call?hide_gdpr_banner=1',
    parentElement: document.querySelector('#calendly-inline-widget'),
    resize: true,
    prefill: {},
    utm: {},
  });
}

const handle_mc_scroller_on_scroll = (mc_scroll_more_el, last_scroll_top) => {
  if (!mc_scroll_more_el) return

  const curr_scroll_top = window.scrollY || document.documentElement.scrollTop

  if (
    curr_scroll_top <= 0 &&
    curr_scroll_top <= last_scroll_top
  ) {
    if (mc_scroll_more_el.classList.contains('hidden')) {
      mc_scroll_more_el.classList.remove('hidden')
    }
  } else if (curr_scroll_top > 0) {
    if (!mc_scroll_more_el.classList.contains('hidden')) {
      mc_scroll_more_el.classList.add('hidden')
    }
  }
}

const setup_mc_scroll_more_indicator = () => {
  const mc_scroll_more_el = document.querySelector('#mc-scroll-more-indicator')
  console.log('mc_scroll_more_el', mc_scroll_more_el)

  if (!mc_scroll_more_el) return

  let last_scroll_top = 0

  window.addEventListener('scroll', (event) => {
    handle_mc_scroller_on_scroll(mc_scroll_more_el, last_scroll_top)
    last_scroll_top = window.scrollY || document.documentElement.scrollTop
  })

  const paths_to_show_on = [
    '/',
  ]
  console.log('paths_to_show_on', paths_to_show_on)

  const { pathname } = window.location
  console.log('pathname', pathname)

  const should_show_scroller = paths_to_show_on.includes(pathname)
  console.log('should_show_scroller', should_show_scroller)

  if (
    should_show_scroller &&
    !mc_scroll_more_el.classList.contains('enabled')
  ) {
    mc_scroll_more_el.classList.add('enabled')
  }

  mc_scroll_more_el.addEventListener('click', (event) => {
    if (!mc_scroll_more_el.classList.contains('hidden')) {
      mc_scroll_more_el.classList.add('hidden')
    }

    window.scrollBy({
      // top: window.innerHeight * 1.25,
      top: 300,
      behavior: 'smooth'
    })
  })
}

const rotate_text = (mc_words, current_word_index) => {
  const max_word_index = mc_words.length - 1
  mc_words[current_word_index].style.opacity = '1'

  const current_word = mc_words[current_word_index]
  const next_word =
    current_word_index === max_word_index ? mc_words[0] : mc_words[current_word_index + 1]

  // rotate out letters of current word
  Array.from(current_word.children).forEach((mc_letter, i) => {
    setTimeout(() => {
      mc_letter.className = 'mc-letter out'
    }, i * 80)
  })

  // reveal and rotate in letters of next word
  next_word.style.opacity = '1'

  Array.from(next_word.children).forEach((mc_letter, i) => {
    mc_letter.className = 'mc-letter behind'
    setTimeout(() => {
      mc_letter.className = 'mc-letter in'
    }, 340 + i * 80)
  })

  if (current_word_index === max_word_index) {
    return 0
  } else {
    const next_word_index = current_word_index + 1
    return next_word_index
  }
}

const setup_mc_cycles = () => {
  const mc_words = document.querySelectorAll('.mc-word')

  mc_words.forEach((mc_word) => {
    const mc_letters = mc_word.textContent.split('')
    mc_word.textContent = '';

    mc_letters.forEach((mc_letter) => {
      const span = document.createElement('span')
      span.textContent = mc_letter
      span.className = 'mc-letter'
      mc_word.append(span)
    })
  })

  let current_word_index = 0
  current_word_index = rotate_text(mc_words, current_word_index)

  const repeat_interval = 3000
  setInterval(() => {
    current_word_index = rotate_text(mc_words, current_word_index)
  }, repeat_interval)
}

const mc_handle_sidebar_toggle_click = (event) => {
  const mc_layout = document.querySelector('#mc-layout')
  const mc_sidebar = document.querySelector('#mc-sidebar')
  const mc_sidebar_toggle_icon = document.querySelector('#mc-sidebar-toggle-icon')

  if (mc_sidebar_toggle_icon.classList.contains('mc-pulse')) {
    mc_sidebar_toggle_icon.classList.remove('mc-pulse')
  }

  if (!mc_sidebar.classList.contains('mc-visible')) {
    mc_layout.classList.add('mc-backdrop')
    mc_sidebar.classList.add('mc-visible')
    mc_sidebar_toggle_icon.classList.add('mc-open')
  } else {
    mc_dismiss_sidebar()
  }
}

const mc_dismiss_sidebar = () => {
  const mc_layout = document.querySelector('#mc-layout')
  const mc_sidebar = document.querySelector('#mc-sidebar')
  const mc_sidebar_toggle_icon = document.querySelector('#mc-sidebar-toggle-icon')

  mc_layout.classList.remove('mc-backdrop')
  mc_sidebar.classList.remove('mc-visible')
  mc_sidebar_toggle_icon.classList.remove('mc-open')
}

const setup_mc_sidebar_toggles = () => {
  const mc_sidebar_toggles = document.querySelectorAll('.mc-sidebar-toggle')
  const mc_sidebar_dismisses = document.querySelectorAll('.mc-sidebar-dismiss')

  mc_sidebar_toggles.forEach((mc_sidebar_toggle) => {
    mc_sidebar_toggle.addEventListener('click', mc_handle_sidebar_toggle_click)
  })

  mc_sidebar_dismisses.forEach((mc_sidebar_dismiss) => {
    mc_sidebar_dismiss.addEventListener('click', mc_dismiss_sidebar)
  })

  document.addEventListener('scroll', (event) => {
    const mc_layout = document.querySelector('#mc-layout')
    const mc_sidebar = document.querySelector('#mc-sidebar')
    const mc_sidebar_toggle_icon = document.querySelector('#mc-sidebar-toggle-icon')

    mc_layout.classList.remove('mc-backdrop')
    mc_sidebar.classList.remove('mc-visible')
    mc_sidebar_toggle_icon.classList.remove('mc-open')
  })
}

const mc_track_newsletter_subscribe = () => {
  console.log('mc_track_newsletter_subscribe')
  gtag('event', 'mc_newsletter_subscribe')
}

const setup_brevo_form_deps = () => {
  window.REQUIRED_CODE_ERROR_MESSAGE = 'Please choose a country code'
  window.LOCALE = 'en'
  window.EMAIL_INVALID_MESSAGE = window.SMS_INVALID_MESSAGE = "The information provided is invalid. Please review the field format and try again."
  window.REQUIRED_ERROR_MESSAGE = "This field cannot be left blank. "
  window.GENERIC_INVALID_MESSAGE = "The information provided is invalid. Please review the field format and try again."
  window.translation = {
    common: {
      selectedList: '{quantity} list selected',
      selectedLists: '{quantity} lists selected'
    }
  }
  var AUTOHIDE = Boolean(0)
}

const setup_brevo_form = () => {
  const subscribe_form = document.querySelector('#sib-form')

  if (!subscribe_form) return

  setup_brevo_form_deps()

  const script = document.createElement('script')
  script.src = 'https://sibforms.com/forms/end-form/build/main.js'
  script.defer = true
  document.body.appendChild(script)

  subscribe_form.addEventListener('submit', (event) => {
    console.log('event', event)

    event.preventDefault()
    mc_track_newsletter_subscribe()
  })
}

document.addEventListener('DOMContentLoaded', () => {
  set_copyright()
  setup_calendly_widget()
  setup_brevo_form()

  setup_mc_cycles()
  setup_mc_scroll_more_indicator()

  setup_mc_sidebar_toggles()

  observe_mc_sections()
  observe_calendly_messages()
})
