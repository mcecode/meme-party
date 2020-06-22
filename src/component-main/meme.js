/**************************************************\
  component-main meme.js
\**************************************************/

/** Non-js imports */
import style from './main.scss';
import sadPepe from './images/sad-pepe.png';

class Meme {
  constructor(container) {

  }
}

/*
variables

const
subreddits = [
  'memes',
  'dankmemes',
  'meirl',
  'wholesomememes',
  'comedyheaven',
  'pewdiepiesubmissions',
],

let
subredditCount = Math.floor(Math.random() * 6),
// make this fetchSuccess to be less ambigous
fetchError = false,
loadedMemes = 0;

functions

function shuffleSubreddits() {
  if (subredditCount === 6) {
    subredditCount = 0;
    getMemes(subreddits[subredditCount]);
  } else {
    getMemes(subreddits[subredditCount]);
    subredditCount += 1;
  }
}

async function getMemes(subreddit, numberOfMemes = 10) {
  showLoader();

  try {
    const res = await fetch(`https://meme-api.herokuapp.com/gimme/${subreddit}/${numberOfMemes}`);
    if (!res.ok) throw new Error('Error in fetching memes');
    const data = await res.json();
    
    preloadMemes(data, numberOfMemes);
  } catch (err) {
    handleFetchError(err);
  }
}

function preloadMemes(data, numberOfMemes) {
  const memesObject = {};

  data.memes.forEach((meme, i) => {
    const
    memeLink = document.createElement('a'),
    memeImg = document.createElement('img');

    memeLink.href = meme.postLink;
    memeLink.target = '_blank';
    memeImg.src = meme.url;
    memeImg.alt = meme.title;
    memeLink.append(memeImg);

    memeImg.onload = () => {
      memeImg.onload = null;
      memesObject[i] = memeLink;
      loadedMemes += 1;
      if (loadedMemes === numberOfMemes) {
        showMemes(memesObject);
        loadedMemes = 0;
      }
    }
  });
}

function showMemes(memesObject) {
  removeLoader();

  // use for...of instead
  let memeLink;
  for (memeLink in memesObject) {
    memes.append(memesObject[memeLink]);
    appendDivision();
  }
}

function handleFetchError(err) {
  const 
  errorMessage = document.createElement('p'),
  errorImg = document.createElement('img');

  console.error(err);
  errorMessage.textContent = `
    Sorry.
    Something went wrong while getting the memes.
    Please try again later or refresh the page.`;
  errorMessage.classList.add('p-fetcherror');
  errorImg.src = sadPepe;
  moreButton.style.transform = 'scale(0)';
  memes.append(errorMessage);
  memes.append(errorImg);
  appendDivision();
  fetchError = true;
}

function appendDivision() {
  const division = document.createElement('hr');

  memes.append(division);
}
*/