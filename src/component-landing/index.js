import style from './main.scss';
import heavyBreathingCat from './images/heavy-breathing-cat.jpg';

class Landing {
  constructor() {
    this.container = document.createElement('header');
    this.heading = document.createElement('h1');
    this.paragraph = document.createElement('p');
    this.catImage = document.createElement('img');
    this.showButton = document.createElement('button');
    this.init();
  }

  init() {
    this.mount();
    this.addEvents();
    this.addStyles();
    this.setContent();
  }

  mount() {
    this.container.append(
      this.heading,
      this.paragraph,
      this.catImage,
      this.showButton
    );
  }

  addEvents() {
    window.addEventListener('load', this);
    window.addEventListener('resize', this);
  }

  addStyles() {
    this.container.className = style.container;
    this.heading.className = style.heading;
    this.paragraph.className = style.paragraph;
    this.catImage.className = style.catImage;
    this.showButton.className = style.showButton;
  }

  setContent() {
    this.setHeadingContent();
    this.paragraph.textContent = 'good memes rayt here';
    this.catImage.src = heavyBreathingCat;
    this.catImage.alt = 'Heavy breathing cat meme';
    this.showButton.textContent = 'dank memes hur';
  }

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

  setAnimation() {
    if (!localStorage.getItem('saw landing animation'))  {
      this.paragraph.style.transform = 'translateY(-100vh)';
      this.catImage.style.transform = 'scale(0)';
      this.showButton.style.transform = 'translateY(100vh)';

      this.heading.classList.add('headingAnimate');
      setTimeout(() => {this.paragraph.classList.add('paragraphAnimate');}, 750);
      setTimeout(() => {this.catImage.classList.add('catImageAnimate');}, 750*2);
      setTimeout(() => {this.showButton.style.transform = 'scale(1)';}, 750*3)
      setTimeout(() => {this.showButton.classList.add('showButtonAnimate');}, 750*4);

      localStorage.setItem('saw landing animation', true);
    } else {
      this.showButton.classList.add('showButtonAnimate');
    }
    window.removeEventListener('load', this);
  }

  handleEvent(e) {    
    if (e.target === document && e.type === 'load') this.setAnimation();
    if (e.target === window && e.type === 'resize') this.setHeadingContent();
  }
}

export default Landing;