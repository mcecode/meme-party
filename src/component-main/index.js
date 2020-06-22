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
    this.setEventsAndObserve();
    this.setStyles();
    this.setContent();
  }

  /** Creates HTMLElements, Objects, and Observers */
  init() {
    this.container = document.createElement('main');
    this.hideButton = document.createElement('button');
    this.moreButton = document.createElement('button');
    this.memesContainer = document.createElement('div');
    this.initialDivision = document.createElement('hr');

    this.memes = new Memes(this.memesContainer, this.moreButton);
    this.loader = new Loader(this.memesContainer, this.moreButton);

    // const 
    // initialDivisionObserver = new IntersectionObserver(entries => {
    //   entries.forEach(entry => {
    //     if (entry.isIntersecting) {
    //       hideButton.classList.remove('staph-onscroll');
    //     } else {
    //       hideButton.classList.add('staph-onscroll');
    //     }
    //   });
    // }, {
    //   rootMargin: '-150px 0px 0px 0px',
    // });
  }

  /**
   * Adds created elements to the HTML document
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
  setEventsAndObserve() {
    this.hideButton.addEventListener('click', this);
    this.moreButton.addEventListener('click', this);
    // initialDivisionObserver.observe(initialDivision);
  }

  /** Adds base style classes to elements */
  setStyles() {
    this.container.className = style.container;
    this.hideButton.className = style.hideButton;
    this.moreButton.className = style.moreButton;
    this.memesContainer.className = style.memesContainer;
  }

  /** Sets textContent of elements */
  setContent() {
    this.hideButton.textContent = 'staph';
    this.moreButton.textContent = 'moar';
  }

  /** Shows this.container */
  show() {
    this.memesContainer.innerHTML = '';
    this.container.style.transform = 'scale(1)';
    this.memesContainer.append(this.initialDivision);

    this.loader.append();
    // this.meme.start();
  }

  /** Hides this.container */
  hide() {
    this.memesContainer.innerHTML = '';
    this.container.style.transform = 'scale(0)';

    // if (fetchError) {
    //   moreButton.style.transform = 'scale(1)';
    //   fetchError = false;
    // }
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
      // this.meme.start();
      return;
    }
  }
}

/** Exports Main class */
export default Main;