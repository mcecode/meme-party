/**************************************************\
  component-main memes.js
\**************************************************/

/** Non-js imports */
import style from './main.scss';
import sadPepe from './images/sad-pepe.png';

class Memes {
  constructor(memesContainer, moreButton) {
    this.container = memesContainer;
    this.moreButton = moreButton;
    this.subreddits = [
      'memes',
      'dankmemes',
      'meirl',
      'wholesomememes',
      'comedyheaven',
      'pewdiepiesubmissions',
    ];
    this.subredditsIndex = Math.floor(Math.random() * 6);
    this.fetchError = false;
    this.memesLoaded = 0;
    this.memeCount = 10;
  }

  async getAndShowMemes() {
    if (this.subredditsIndex === 6) this.subredditsIndex = 0;

    try {
      const res = await fetch(`https://meme-api.herokuapp.com/gimme/${this.subreddits[this.subredditsIndex]}/${this.memeCount}`);
      if (!res.ok) throw new Error('An error occured while fetching memes.');
      const data = await res.json();
      const memesObject = {};

      data.memes.forEach((meme, i) => {
        const memeLink = document.createElement('a');
        const memeImage = document.createElement('img');
    
        memeLink.href = meme.postLink;
        memeLink.target = '_blank';
        memeImage.src = meme.url;
        memeImage.alt = meme.title;
        memeLink.append(memeImage);
    
        memeImage.onload = () => {
          memeImage.onload = null;
          memesObject[i] = memeLink;
          this.memesLoaded += 1;

          if (this.memesLoaded === this.memeCount) {
            for (let meme in memesObject) {
                const memeDivision = document.createElement('hr');
                this.container.append(
                memesObject[meme],
                memeDivision
              );
            }
            this.memesLoaded = 0;
          }
        }
      });

    } catch (error) {
      const errorMessage = document.createElement('p');
      const errorImage = document.createElement('img');
      const errorDivision = document.createElement('hr');

      console.error(error);
      errorMessage.textContent = `
        Sorry.
        Something went wrong while getting the memes.
        Please try again later or refresh the page.`;
      errorMessage.classList.add(style.memeFetchError);
      errorImage.src = sadPepe;
      this.moreButton.style.transform = 'scale(0)';
      memes.append(
        errorMessage,
        errorImage,
        errorDivision
      );
      this.fetchError = true;
    }

    this.subredditsIndex += 1;
  }
}

/** Exports Memes class */
export default Memes;