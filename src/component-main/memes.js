/**************************************************\
  component-main memes.js
\**************************************************/

// SCSS imports
import style from './main.scss';

// Image imports
import sadPepe from './images/sad-pepe.png';

/** Class representing the memes that get shown after the loader */
class Memes {
  /**
   * Initializes properties
   * @param {HTMLDivElement} memesContainer - Contains all Meme and Loader HTMLElements
   */
  constructor(memesContainer) {
    // Container
    this.container = memesContainer;

    // Subreddits
    this.subreddits = [
      'memes',
      'dankmemes',
      'meirl',
      'wholesomememes',
      'comedyheaven',
      'pewdiepiesubmissions',
    ];
    this.subredditsIndex = Math.floor(Math.random() * 6);

    // Number of...
    this.memeImagesLoaded = 0;
    this.memesToFetch = 10;

    // Fetch error
    this.fetchError = false;
  }

  /** Appends memes to the HTML document */
  async append() {
    // Checks if indexes are over the limit
    if (this.subredditsIndex >= 6) this.subredditsIndex = 0;

    // Tries to fetch memes
    try {
      // Fetches memes
      const res = await fetch(`https://meme-api.com/gimme/${this.subreddits[this.subredditsIndex]}/${this.memesToFetch}`);
      if (!res.ok) throw new Error('An error occured while fetching memes.');
      const data = await res.json();

      // Holds memeLinks whose corresponding memeImage have been fully loaded
      const memeLinkArray = [];

      // Structures data into a and img HTMLElements
      data.memes.forEach((meme, i) => {
        const memeLink = document.createElement('a');
        const memeImage = document.createElement('img');

        memeLink.href = meme.postLink;
        memeLink.target = '_blank';
        memeImage.src = meme.url;
        memeImage.alt = meme.title;
        memeLink.append(memeImage);

        // Preloads fetched meme images
        memeImage.onload = () => {
          memeImage.onload = null;
          memeLinkArray[i] = memeLink;
          this.memeImagesLoaded += 1;

          // Checks if all memes images have been fully loaded
          if (this.memeImagesLoaded === this.memesToFetch) {
            // Signals that all meme images have been fully loaded
            this.container.dispatchEvent(new Event('AllMemeImagesFullyLoaded'));

            // Shows memes
            for (let memeLink of memeLinkArray) {
              const memeDivision = document.createElement('hr');
              this.container.append(
                memeLink,
                memeDivision
              );
            }
            
            // Resets this.memeImagesLoaded for the next request
            this.memeImagesLoaded = 0;
          }
        }
      });
    } 

    // Handles if there is an error fetching memes
    catch (error) {
      // Signals that an error occured while fetching memes
      this.fetchError = true;
      this.container.dispatchEvent(new Event('ErrorFetchingMemes'));
      console.error(error);

      // Creates HTMLElements to hold error message
      const errorMessage = document.createElement('p');
      const errorImage = document.createElement('img');
      const errorDivision = document.createElement('hr');

      // Sets textContent, src, and base classes of created HTMLElements
      errorMessage.textContent = `
        Sorry.
        Something went wrong while getting the memes.
        Please try again later or refresh the page.`;
      errorMessage.className = style.fetchErrorMessage;
      errorImage.src = sadPepe;
      errorImage.className = style.fetchErrorImage;

      // Shows the error
      this.container.append(
        errorMessage,
        errorImage,
        errorDivision
      );
    }

    // Increments indexes for the next request
    this.subredditsIndex += 1;
  }

  /** Removes memes from the HTML document */
  remove() {
    this.container.innerHTML = '';
  }
}

// Exports Memes class
export default Memes;