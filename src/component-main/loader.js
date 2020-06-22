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

class Loader {
  constructor(container) {

  }

  show() {

  }

  hide() {

  }
}

/*
variables

const
loader = [
  enclose these in a div
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
loaderCaptionCount = Math.floor(Math.random() * 3),
loaderMemeCount = Math.floor(Math.random() * 6),

functions

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
*/