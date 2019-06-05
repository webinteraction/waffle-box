import { Toggle } from './toggle'

// Dropdowns
const dropdowns = new Toggle({
  attr: 'data-dropdown',
  toggleContainer: '.dropdown',
  blur: true,
  single: true,
  keyControl: true,
})

// Modals
const modals = new Toggle({
  attr: 'data-modal',
  toggleContainer: '.modal',
  blur: true,
  single: true,
  onToggle: (btn, target, isToggled) => {
    document.body.classList[isToggled ? 'add' : 'remove']('has-modal')
  },
})
