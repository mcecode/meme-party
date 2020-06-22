/**************************************************\
  component-main index.js
\**************************************************/

/** Non-js imports */
import style from './main.scss';

/** JS imports */
import Meme from './meme.js';
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
    this.setEvents();
    this.setStyles();
    this.setContent();
  }

  /** Creates HTMLElements */
  init() {
    this.container = document.createElement('main');
    this.hideButton = document.createElement('button');
    this.moreButton = document.createElement('button');
    this.memesContainer = document.createElement('div');
    this.initialDivision = document.createElement('hr');
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

  /** Sets events whose call back is 'this' */
  setEvents() {
    this.hideButton.addEventListener('click', this);
    this.moreButton.addEventListener('click', this);
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

  /**
   * Handles events whose callback is 'this'
   * @param {Event} e - Document triggered event
   */
  handleEvent(e) {
    /*
    // TODO: use these to handle the events
    showButton.addEventListener('click', () => {
      memes.innerHTML = '';
      main.style.transform = 'scale(1)';
      memes.append(initialDivision);
      
      shuffleSubreddits();
    });

    hideButton.addEventListener('click', () => {
      main.style.transform = 'scale(0)';
      memes.innerHTML = '';

      if (fetchError) {
        moreButton.style.transform = 'scale(1)';
        fetchError = false;
      }
    });

    moreButton.addEventListener('click', shuffleSubreddits);
    */
    // TODO: put these in their own function
    if (e.target === this.hideButton && e.type === 'click') {
      this.container.style.transform = 'scale(0)';
      return;
    } 
    if (e.target === this.moreButton && e.type === 'click') {

      return;
    }
  }
}

/** Exports Main class */
export default Main;

/*
intersection observer

const 
initialDivisionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      hideButton.classList.remove('staph-onscroll');
    } else {
      hideButton.classList.add('staph-onscroll');
    }
  });
}, {
  rootMargin: '-150px 0px 0px 0px',
});
initialDivisionObserver.observe(initialDivision);
*/