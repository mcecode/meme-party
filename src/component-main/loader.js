/**************************************************\
  component-main loader.js
\**************************************************/

/** Non-js imports */
import style from './main.scss';
import loaderMeme1 from './images/loader-meme-1.jpg';
import loaderMeme2 from './images/loader-meme-2.jpg';
import loaderMeme3 from './images/loader-meme-3.jpg';
import loaderMeme4 from './images/loader-meme-4.jpg';
import loaderMeme5 from './images/loader-meme-5.jpg';
import loaderMeme6 from './images/loader-meme-6.jpg';

/** Class representing the loader that appears while memes are loading */
class Loader {
  /**
   * Initializes properties and adds base classes to HTMLElement properties
   * @param {HTMLDivElement} memesContainer - Contains all Meme and Loader HTMLElements
   */
  constructor(memesContainer) {
    // Container
    this.container = memesContainer;

    // Message
    this.message = document.createElement('p');
    this.message.className = style.loaderMessage;
    this.messageContent = [
      'Memes hot off the press coming right up!',
      'Fetching some dank memes...',
      'Please wait a bit, the memes will be coming soon.'
    ];
    this.messageContentIndex = Math.floor(Math.random() * 3);

    // Ball
    this.ball = document.createElement('span');
    this.ball.className = style.loaderBall;

    // Meme image
    this.memeImage = document.createElement('img');
    this.memeImage.className = style.loaderMemeImage;
    this.memeImageSrc = [
      loaderMeme1,
      loaderMeme2,
      loaderMeme3,
      loaderMeme4,
      loaderMeme5,
      loaderMeme6
    ];
    this.memeImageSrcIndex = Math.floor(Math.random() * 6);

    // Division
    this.division = document.createElement('hr');
  }

  /** Appends Loader HTMLElements to the HTML document */
  append() {
    // Checks if indexes are over the limit
    if (this.messageContentIndex >= 3) this.messageContentIndex = 0;
    if (this.memeImageSrcIndex >= 6) this.memeImageSrcIndex = 0;

    // Assigns textContent and src image
    this.message.textContent = this.messageContent[this.messageContentIndex];
    this.memeImage.src = this.memeImageSrc[this.memeImageSrcIndex];

    // Shows loader
    this.container.append(
      this.message,
      this.ball,
      this.memeImage,
      this.division
    );

    // Increments indexes for the next request
    this.messageContentIndex += 1;
    this.memeImageSrcIndex += 1;
  }

  /** Removes Loader HTMLElements from the HTML document */
  remove() {
    this.message.remove();
    this.ball.remove();
    this.memeImage.remove();
    this.division.remove();
  }
}

/** Exports Loader class */
export default Loader;