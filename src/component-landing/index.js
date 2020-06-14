/**************************************************\
  component-landing index.js
\**************************************************/

/** Non-js imports */
import style from './main.scss';
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
    this.paragraph = document.createElement('p');
    this.catImage = document.createElement('img');
    this.showButton = document.createElement('button');
    this.sawInitialAnimationKey = 'landing: saw initial animation v2';
  }

  /**
   * Adds created elements to the HTML document
   * @param {HTMLDivElement} root - Entry point for all components
   */
  mount(root) {
    root.append(this.container);
    this.container.append(
      this.heading,
      this.paragraph,
      this.catImage,
      this.showButton
    );
  }

  /** Sets events whose call back is 'this' */
  setEvents() {
    window.addEventListener('load', this);
    window.addEventListener('resize', this);
  }

  /** Adds base style and pre-animation classes to elements */
  setStyles() {
    this.container.className = style.container;
    this.heading.className = style.heading;
    this.paragraph.className = style.paragraph;
    this.catImage.className = style.catImage;
    this.showButton.className = style.showButton;

    if (!localStorage.getItem(this.sawInitialAnimationKey)) {
      this.heading.classList.add(style.headingPreAnimate);
      this.paragraph.classList.add(style.paragraphPreAnimate);
      this.catImage.classList.add(style.catImagePreAnimate);
      this.showButton.classList.add(style.showButtonPreAnimate);
    }
  }

  /** Sets innerHTML, textContent, and alt text of elements */
  setContent() {
    this.setHeadingContent();
    this.paragraph.textContent = 'good memes rayt here';
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
      this.paragraph.classList.add(style.paragraphAnimate);
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
   * @param {Event} e - Document event triggered
   */
  handleEvent(e) {    
    if (e.target === document && e.type === 'load') this.setAnimation();
    if (e.target === window && e.type === 'resize') this.setHeadingContent();
  }
}

/** Exports Landing class */
export default Landing;