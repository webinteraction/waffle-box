import { Toggle } from './toggle'

// Dropdowns
const dropdowns = new Toggle({
  attr: 'data-dropdown',
  blur: true,
  keyControl: true,
  single: true,
  toggleContainer: '.dropdown',
})

// Modals
const modals = new Toggle({
  attr: 'data-modal',
  blur: true,
  keyControl: true,
  keyNavigation: false,
  single: true,
  toggleContainer: '.modal',
  trapFocus: true,
  onToggle: (btn, target, isToggled) => {
    document.body.classList[isToggled ? 'add' : 'remove']('has-modal')
  },
})
