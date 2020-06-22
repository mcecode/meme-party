/**************************************************\
  js-state index.js
\**************************************************/

/** Class that controls and connects global state through events */
class GlobalState {
  /**
   * Creates local instances of component objects and sets events to control global state
   * @param {Object} landing - Landing instance
   * @param {Object} main - Main instance
   */
  constructor(landing, main) {
    this.landing = landing;
    this.main = main;

    this.landing.showButton.addEventListener('click', this);
  }

  /**
   * Handles events whose callback is 'this'
   * @param {Event} e - Document triggered event
   */
  handleEvent(e) {
    if (e.target === this.landing.showButton && e.type === 'click') {
      this.main.show();
      return;
    }
  }
}

/** Exports GlobalState class */
export default GlobalState;