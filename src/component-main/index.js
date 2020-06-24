/**************************************************\
  component-main index.js
\**************************************************/

/** Non-js imports */
import style from './main.scss';

/** JS imports */
import Memes from './memes.js';
import Loader from './loader.js';

/** Class representing the main content page */
class Main {
  /**
   * Calls all initializing methods
   * @param {HTMLDivElement} root - Entry point for all components
   */
  constructor(root) {
    this.init();
    this.mount(root);
    this.setEventsAndObserves();
    this.setStyles();
    this.setContent();
  }

  /** Creates HTMLElements, instances of module objects, and Observers */
  init() {
    // HTMLElements
    this.container = document.createElement('main');
    this.hideButton = document.createElement('button');
    this.moreButton = document.createElement('button');
    this.memesContainer = document.createElement('div');
    this.initialDivision = document.createElement('hr');

    // Objects
    this.loader = new Loader(this.memesContainer);
    this.memes = new Memes(this.memesContainer);

    // IntersectionObservers
    this.initialDivisionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        (entry.isIntersecting) ? 
          this.hideButton.classList.remove(style.hideButtonOnScroll) :
          this.hideButton.classList.add(style.hideButtonOnScroll);
      });
    });
  }

  /**
   * Appends created HTMLElements to the HTML document
   * @param {HTMLDivElement} root - Entry point for all components
   */
  mount(root) {
    root.append(this.container);
    this.container.append(
      this.hideButton,
      this.memesContainer,
      this.moreButton
    );
  }

  /** Sets events whose call back is 'this' and observers to observe */
  setEventsAndObserves() {
    // Events
    this.hideButton.addEventListener('click', this);
    this.moreButton.addEventListener('click', this);
    this.memesContainer.addEventListener('AllMemeImagesFullyLoaded', this);
    this.memesContainer.addEventListener('ErrorFetchingMemes', this);

    // Observes
    this.initialDivisionObserver.observe(this.initialDivision);
  }

  /** Adds base classes to HTMLElements */
  setStyles() {
    this.container.className = style.container;
    this.hideButton.className = style.hideButton;
    this.moreButton.className = style.moreButton;
    this.memesContainer.className = style.memesContainer;
  }

  /** Sets textContent of HTMLElements */
  setContent() {
    this.hideButton.textContent = 'staph';
    this.moreButton.textContent = 'moar';
  }

  /** Shows this.container with a loader and then with memes */
  show() {
    // Adds and removes necessary HTMLElements and classNames
    this.memesContainer.append(this.initialDivision);
    this.container.classList.add(style.containerShow);
    this.moreButton.classList.remove(style.moreButtonShow);

    // Shows loader
    this.loader.append();

    // Shows memes and removes loader
    this.memes.append();
  }

  /** Hides this.container and cleans up memes and fetch errors */
  hide() {
    // Removes previously appended memes
    this.memes.remove();

    // Hides this.container
    this.container.classList.remove(style.containerShow);
    
    // Handles fetch error
    if (this.memes.fetchError) {
      this.moreButton.classList.remove(style.moreButtonShow);
      this.memes.fetchError = false;
    }
  }

  /**
   * Handles events whose callback is 'this'
   * @param {Event} e - Document triggered event
   */
  handleEvent(e) {
    if (e.target === this.hideButton && e.type === 'click') {
      this.hide();
      return;
    } 
    if (e.target === this.moreButton && e.type === 'click') {
      this.moreButton.classList.remove(style.moreButtonShow);
      this.loader.append();
      this.memes.append();
      return;
    }
    if (e.target === this.memesContainer && e.type === 'AllMemeImagesFullyLoaded') {
      this.moreButton.classList.add(style.moreButtonShow);
      this.loader.remove();
      return;
    }
    if (e.target === this.memesContainer && e.type === 'ErrorFetchingMemes') {
      this.loader.remove();
      return;
    }
  }
}

/** Exports Main class */
export default Main;