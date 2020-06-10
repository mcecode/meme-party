import style from './main.scss';
import heavyBreathingCat from './images/heavy-breathing-cat.jpg';

class Landing {
  constructor() {
    this.container = document.createElement('header');
    this.h1 = document.createElement('h1');
    this.par = document.createElement('p');
    this.img = document.createElement('img');
    this.button = document.createElement('button');
    this.mount();
    this.setContent();
  }

  /**
   * TODO:
   * - set setContent
   * - set h1
   * - add events tp be handled by handle event
   */

  mount() {
    this.container.append(
      this.h1,
      this.par,
      this.img,
      this.button
    )
  }

  setContent() {

  }

  setH1Content() {

  }

  handleEvent(event) {

  }
}

export default Landing;