/*********************************************\ 
  imports
\*********************************************/
import sadPepe from './images/sad-pepe.png';
import loaderMeme1 from './images/loader-meme-1.jpg';
import loaderMeme2 from './images/loader-meme-2.jpg';
import loaderMeme3 from './images/loader-meme-3.jpg';
import loaderMeme4 from './images/loader-meme-4.jpg';
import loaderMeme5 from './images/loader-meme-5.jpg';
import loaderMeme6 from './images/loader-meme-6.jpg';

/*********************************************\ 
  variable declarations
\*********************************************/
const
main = document.querySelector('main'),
hideButton = main.querySelector('button:first-child'),
moreButton = main.querySelector('button:last-child'),
initialDivision = document.createElement('hr'),
memes = document.getElementById('memes'),
subreddits = [
  'memes',
  'dankmemes',
  'meirl',
  'wholesomememes',
  'comedyheaven',
  'pewdiepiesubmissions',
],
loader = [
  document.createElement('p'),
  document.createElement('span'),
  document.createElement('img'),
  document.createElement('hr'),
],
loaderCaptions = [
  'Memes hot off the press coming right up!',
  'Fetching some dank memes...',
  'Please wait a bit, the memes will be coming soon.',
],
loaderMemes = [
  loaderMeme1,
  loaderMeme2,
  loaderMeme3,
  loaderMeme4,
  loaderMeme5,
  loaderMeme6,
];

let
subredditCount = Math.floor(Math.random() * 6),
loaderCaptionCount = Math.floor(Math.random() * 3),
loaderMemeCount = Math.floor(Math.random() * 6),
fetchError = false,
loadedMemes = 0;

/*********************************************\ 
  functions
\*********************************************/
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

function showLoader() {
  moreButton.style.transform = 'scale(0)';

  function appendLoader() {
    loader[0].classList.add('p-loadercaption'); 
    loader[0].textContent = loaderCaptions[loaderCaptionCount];
    loader[1].classList.add('span-loaderball');
    loader[2].classList.add('img-loadermeme');
    loader[2].src = loaderMemes[loaderMemeCount];

    loader.forEach(part => {
      memes.append(part);
    });
  }

  if (loaderCaptionCount === 3 || loaderMemeCount === 6) {
    if (loaderCaptionCount === 3) loaderCaptionCount = 0;
    if (loaderMemeCount === 6) loaderMemeCount = 0;

    appendLoader();   
    
    loaderCaptionCount += 1;
    loaderMemeCount += 1;
  } else {
    appendLoader();

    loaderCaptionCount += 1;
    loaderMemeCount += 1;
  }
}

function removeLoader() {
  moreButton.style.transform = 'scale(1)';

  loader.forEach(part => {
    part.remove();
  });
}

function appendDivision() {
  const division = document.createElement('hr');

  memes.append(division);
}

/*********************************************\ 
  event listeners
\*********************************************/
hideButton.addEventListener('click', () => {
  main.style.transform = 'scale(0)';
  memes.innerHTML = '';

  if (fetchError) {
    moreButton.style.transform = 'scale(1)';
    fetchError = false;
  }
});

moreButton.addEventListener('click', shuffleSubreddits);

/*********************************************\ 
  intersection observers
\*********************************************/
const 
initialDivisionObserver = new IntersectionObserver((entries) => {
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