/**************************************************\
  component-landing index.js
\**************************************************/

// SCSS imports
import style from './main.scss';

// Image imports
import heavyBreathingCat from './images/heavy-breathing-cat.jpg';

/** Class representing the landing page */
class Landing {
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

  /** Creates HTMLElements and localStorage keys */
  init() {
    this.container = document.createElement('header');
    this.heading = document.createElement('h1');
    this.tagLine = document.createElement('p');
    this.catImage = document.createElement('img');
    this.showButton = document.createElement('button');
    this.sawInitialAnimationKey = 'landing: saw initial animation v2.0.0';
  }

  /**
   * Appends created HTMLElements to the HTML document
   * @param {HTMLDivElement} root - Entry point for all components
   */
  mount(root) {
    root.append(this.container);
    this.container.append(
      this.heading,
      this.tagLine,
      this.catImage,
      this.showButton
    );
  }

  /** Sets events whose call back is 'this' */
  setEvents() {
    window.addEventListener('load', this);
    window.addEventListener('resize', this);
  }

  /** Adds base and pre-animation classes to HTMLElements */
  setStyles() {
    this.container.className = style.container;
    this.heading.className = style.heading;
    this.tagLine.className = style.tagLine;
    this.catImage.className = style.catImage;
    this.showButton.className = style.showButton;

    if (!localStorage.getItem(this.sawInitialAnimationKey)) {
      this.heading.classList.add(style.headingPreAnimate);
      this.tagLine.classList.add(style.tagLinePreAnimate);
      this.catImage.classList.add(style.catImagePreAnimate);
      this.showButton.classList.add(style.showButtonPreAnimate);
    }
  }

  /** Sets innerHTML, textContent, and alt text of HTMLElements */
  setContent() {
    this.setHeadingContent();
    this.tagLine.textContent = 'good memes rayt here';
    this.catImage.src = heavyBreathingCat;
    this.catImage.alt = 'heavy breathing cat meme';
    this.showButton.textContent = 'dank memes hur';
  }

  /** Sets this.heading's innerHTML based on screen orientation */
  setHeadingContent() {
    const height = window.innerHeight;
    const width = window.innerWidth;
    
    if (height > width) {
      this.heading.innerHTML = `
        <pre> Memes </pre>
        <pre> Purr </pre>
        <pre> You </pre>`;
    } else {
      this.heading.innerHTML = `
        <pre> Memes Purr You </pre>`;
    }    
  }

  /** Adds animation classes and removes event listener that triggers it */
  setAnimation() {
    if (!localStorage.getItem(this.sawInitialAnimationKey))  {
      this.heading.classList.add(style.headingAnimate);
      this.tagLine.classList.add(style.tagLineAnimate);
      this.catImage.classList.add(style.catImageAnimate);
      this.showButton.classList.add(style.showButtonAnimate);

      localStorage.setItem(this.sawInitialAnimationKey, true);
    } else {
      this.showButton.classList.add(style.showButtonRippleAnimate);
    }

    window.removeEventListener('load', this);
  }

  /**
   * Handles events whose callback is 'this'
   * @param {Event} e - Document triggered event
   */
  handleEvent(e) {    
    if (e.target === document && e.type === 'load') {
      this.setAnimation();
      return;
    } 
    if (e.target === window && e.type === 'resize') {
      this.setHeadingContent();
      return;
    }
  }
}

// Exports Landing class
export default Landing;