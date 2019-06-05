/**
 * Toggle component
 */
export class Toggle {
  /**
   * Instantiate a new toggle
   * @param {Options} options - Component configuration options
   * @return {Toggle}
   */
  constructor (options) {
    /**
     * Toggle component configuration
     * @type {Options}
     */
    this.config = Object.assign({
      attr: 'data-toggle',
      blur: false,
      dismiss: true,
      dismissAttr: 'data-dismiss',
      expandOnly: false,
      keyControl: false,
      keyEscape: true,
      keyNavigation: true,
      onToggle: (btn, target, isToggled) => {},
      single: false,
      singleContainer: undefined,
      toggleClass: 'active',
      toggleContainer: '.toggle',
    }, options)

    // Initialize component
    this.init()

    return this
  }

  /**
   * Initialize component
   * @return {void}
   */
  init () {
    // Add listeners
    document.addEventListener('click', e => this.toggleClick(e))
    document.addEventListener('click', e => this.blurClick(e))
    document.addEventListener('keydown', e => this.keydown(e))
  }

  /**
   * Find toggle target from given toggle button
   * @param {HTMLElement} btn - Toggle button from which to begin traversal
   * @return {HTMLElement}
   */
  getTarget (btn) {
    // Get container
    const container = btn.closest(this.config.toggleContainer)
    if (!container) return null

    // Get toggle target
    return container.querySelector(btn.getAttribute(this.config.attr))
  }

  /**
   * Get active toggle buttons within given container
   * @param {HTMLElement} container - Element container in which to search for active buttons
   * @return {NodeListOf<HTMLElement>}
   */
  getActiveButtons (container = document) {
    return container.querySelectorAll(`[${this.config.attr}][aria-expanded="true"]`)
  }

  /**
   * Get focusables and focus index within given container
   * @param {HTMLElement} container - Container in which to query for focusables
   * @param {HTMLElement} currentFocus - Currently focused element
   * @return {FocusData}
   */
  getFocusables (container, currentFocus) {
    // Get focusables in container
    const focusables = container.querySelectorAll('button, [href]')

    // Get current focus index
    let focusIndex = 0
    for (let i = 0; i < focusables.length; i++) {
      if (focusables[i] === currentFocus) {
        focusIndex = i
        break
      }
    }

    // Focus data
    return {
      focusables,
      focusIndex,
    }
  }

  /**
   * Dismiss all sibling toggles
   * @param {HTMLElement} btn - Sibling toggle button
   * @return {void}
   */
  dismissSiblings (btn) {
    // Get single container
    let singleContainer = document
    if (this.config.singleContainer) singleContainer = btn.closest(this.config.singleContainer)

    // Collapse siblings within single container
    this.getActiveButtons(singleContainer).forEach(activeBtn => {
      this.setState(activeBtn, this.getTarget(activeBtn), false)
    })
  }

  /**
   * Set toggle state
   * @param {HTMLElement} btn - Toggle button
   * @param {HTMLElement} target - Toggle target
   * @param {boolean} isToggled - New toggle state
   */
  setState (btn, target, isToggled) {
    // Button state
    if (btn) btn.setAttribute('aria-expanded', isToggled)

    // Target state
    if (target) target.classList[isToggled ? 'add' : 'remove'](this.config.toggleClass)
  }

  /**
   * Toggle the state of given button
   * @param {HTMLElement} btn - Toggle button
   * @return {void}
   */
  toggle (btn) {
    // Get the toggle target
    const target = this.getTarget(btn)

    // Get current state
    const isToggled = !target.classList.contains(this.config.toggleClass)

    // Expand only
    if (this.config.expandOnly && !isToggled) return

    // Single
    if (this.config.single && isToggled) this.dismissSiblings(btn)

    // Set toggle state
    this.setState(btn, target, isToggled)

    // Fire onToggle event
    this.config.onToggle(btn, target, isToggled)
  }

  /**
   * Toggle button click listener
   * @param {MouseEvent} e - Click event
   * @return {void}
   */
  toggleClick (e) {
    // Not a toggle button
    if (!e.target.matches(`[${this.config.attr}], [${this.config.attr}] *`)) return

    // Prevent default click
    e.preventDefault()

    // Get the button
    const btn = e.target.closest(`[${this.config.attr}]`)

    // Toggle the button
    this.toggle(btn)
  }

  /**
   * Blur click listener
   * @param {MouseEvent} e - Blur click event
   * @return {void}
   */
  blurClick (e) {
    // Dismiss click?
    const dismissClick = this.config.dismiss && e.target.matches(`[${this.config.dismissAttr}], [${this.config.dismissAttr}] *`)

    // Blur not enabled
    if (!this.config.blur && !dismissClick) return

    // Blur active toggle buttons
    this.getActiveButtons().forEach(activeBtn => {
      // Dismiss click
      if (dismissClick) return this.toggle(activeBtn)

      // Get toggle container
      const activeContainer = activeBtn.closest(this.config.toggleContainer)

      // Blur if click target isn't inside the container
      if (!activeContainer.contains(e.target)) this.toggle(activeBtn)
    })
  }

  /**
   * Keydown listener
   * @param {KeyboardEvent} e - Keydown event
   * @return {void}
   */
  keydown (e) {
    // Key control not enabled
    if (!this.config.keyControl) return

    // Get closest toggle container
    const toggleContainer = e.target.closest(this.config.toggleContainer)
    if (!toggleContainer) return

    // Dismiss on escape
    if (this.config.keyEscape && e.key === 'Escape') {
      e.preventDefault()
      this.getActiveButtons(toggleContainer).forEach(activeBtn => activeBtn.click())
    }

    // Navigate on arrow keys
    else if (this.config.keyNavigation && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
      e.preventDefault()

      // Get focus data
      const focusData = this.getFocusables(toggleContainer, e.target)

      // Focusable navigation
      const nextFocusIndex = focusData.focusIndex + (e.key === 'ArrowUp' ? -1 : 1)
      if (nextFocusIndex >= 0 && nextFocusIndex < focusData.focusables.length) {
        focusData.focusables[nextFocusIndex].focus()
      }
    }
  }
}

/**
 * Component configuration options
 * @typedef {Object} Options
 * @property {string} attr - Toggle button attribute name
 * @property {boolean} blur - Enable click-away blurring
 * @property {boolean} dismiss - Enable dismiss buttons
 * @property {string} dismissAttr - Dismiss button attribute name
 * @property {boolean} expandOnly - Disable collapsing of expanded targets
 * @property {boolean} keyControl - Enable keyboard control
 * @property {boolean} keyEscape - Enable keyboard toggle escape
 * @property {boolean} keyNavigation - Enable keyboard focusable navigation
 * @property {OnToggle} onToggle - Called on each toggle
 * @property {boolean} single - Allow only a single toggle target to be expanded at any given time
 * @property {string} singleContainer - Selector for closest container that wraps all sibling toggles
 * @property {string} toggleClass - CSS class that is toggled on the target element
 * @property {string} toggleContainer - Selector for closest container that wraps both the toggle button and target
 */

/**
 * onToggle callback function
 * @callback OnToggle
 * @param {HTMLElement} btn - Toggle button
 * @param {HTMLElement} target - Toggle target
 * @param {boolean} isToggled - Current toggle state
 */

/**
 * Focus data
 * @typedef {Object} FocusData
 * @property {NodeListOf<HTMLElement>} focusables - Focusable elements
 * @property {number} focusIndex - Current focus index
 */
