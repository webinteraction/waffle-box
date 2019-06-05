export class Toggle {
  // New toggle instance
  constructor (options) {
    // Configure component
    this.config = Object.assign({
      attr: 'data-toggle',
      toggleContainer: '.toggle',
      toggleClass: 'active',
      single: false,
      singleContainer: undefined,
      expandOnly: false,
      blur: false,
      onToggle: (btn, target, isToggled) => {},
    }, options)

    // Initialize component
    this.init()

    return this
  }

  // Initialize component
  init () {
    // Add listeners
    document.addEventListener('click', e => this.toggle(e))
    document.addEventListener('click', e => this.blur(e))
  }

  /**
   * Toggle a target element
   * @param {MouseEvent} e - Click event
   */
  toggle (e) {
    // Not a toggle button
    if (!e.target.matches(`[${this.config.attr}], [${this.config.attr}] *`)) return

    // Prevent default click
    e.preventDefault()

    // Get the button
    const btn = e.target.closest(`[${this.config.attr}]`)

    // Get the toggle target
    const target = btn.closest(this.config.toggleContainer).querySelector(btn.getAttribute(this.config.attr))

    // Is toggled?
    const isToggled = !target.classList.contains(this.config.toggleClass)

    // Expand only
    if (this.config.expandOnly && !isToggled && !this.collapsingSingleSiblings) return

    // Toggle the target
    target.classList.toggle(this.config.toggleClass)

    // Collapse siblings if possible
    if (isToggled && this.config.single) {
      // Get single container
      let singleContainer = document
      if (this.config.singleContainer) singleContainer = btn.closest(this.config.singleContainer)

      // Collapse siblings within single container
      singleContainer.querySelectorAll(`[${this.config.attr}][aria-expanded="true"]`)
        .forEach(activeBtn => {
          this.collapsingSingleSiblings = true
          activeBtn.click()
          this.collapsingSingleSiblings = false
        })
    }

    // Set button [aria-expanded]
    btn.setAttribute('aria-expanded', isToggled)

    // Fire onToggle event
    this.config.onToggle(btn, target, isToggled)
  }

  /**
   * Blur on click-away
   * @param {MouseEvent} e - Click event
   */
  blur (e) {
    // Blur not enabled
    if (!this.config.blur) return

    // Blur active toggle buttons
    document.querySelectorAll(`[${this.config.attr}][aria-expanded="true"]`).forEach(activeBtn => {
      // Get toggle container
      const activeContainer = activeBtn.closest(this.config.toggleContainer)

      // Blur if click target isn't inside the container
      if (!activeContainer.contains(e.target)) activeBtn.click()
    })
  }
}
