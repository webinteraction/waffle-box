import { Toggle } from './toggle'

// Dropdowns
const dropdowns = new Toggle({
  attr: 'data-dropdown',
  toggleContainer: '.dropdown',
  blur: true,
  single: true,
})

// Toggle menu
const toggleMenu = new Toggle({
  attr: 'data-menu-toggle',
  toggleContainer: '.menu-toggle',
  toggleClass: 'active-sm',
})
