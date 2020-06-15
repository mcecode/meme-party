/**************************************************\
  component-meme index.js
\**************************************************/

/** Non-js imports */
import style from './main.scss';
import sadPepe from './images/sad-pepe.png';
import loaderMeme1 from './images/loader-meme-1.jpg';
import loaderMeme2 from './images/loader-meme-2.jpg';
import loaderMeme3 from './images/loader-meme-3.jpg';
import loaderMeme4 from './images/loader-meme-4.jpg';
import loaderMeme5 from './images/loader-meme-5.jpg';
import loaderMeme6 from './images/loader-meme-6.jpg';

/** Class representing the main content page */
class Meme {
  /**
   * Calls all initializing methods
   * @param {HTMLDivElement} root - Entry point for all components
   * @param {HTMLButtonElement} landingShowButton - Shows main content page using event listener
   */
  constructor(root, landingShowButton) {
    this.init(landingShowButton);
    this.mount(root);
    this.setEvents();
    this.setStyles();
    this.setContent();
  }

  /** 
   * Creates and assigns HTMLElements
   * @param {HTMLButtonElement} landingShowButton - Shows main content page using event listener
   */
  init(landingShowButton) {
    this.container = document.createElement('main');
    this.hideButton = document.createElement('button');
    this.moreButton = document.createElement('button');
    this.memesContainer = document.createElement('div');
    this.initialDivision = document.createElement('hr');
    this.landingShowButton = landingShowButton;
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
    this.landingShowButton.addEventListener('click', this);
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
    if (e.target === this.landingShowButton && e.type === 'click') {
      this.container.style.transform = 'scale(1)';
    }
    if (e.target === this.hideButton && e.type === 'click') {
      this.container.style.transform = 'scale(0)';
    }
    if (e.target === this.moreButton && e.type === 'click') console.log('this.moreButton clicked');
  }
}

/** Exports Meme class */
export default Meme;