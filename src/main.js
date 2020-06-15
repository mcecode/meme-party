/**************************************************\
  main.js
\**************************************************/

/** Non-js imports */
import './scss-global/index.scss';

/** Class imports */
import Landing from './component-landing/index.js';
import Meme from './component-meme/index.js';

/** Entry point for all components */
const root = document.getElementById('root');

/** Landing instance */
let landing = new Landing(root);

/** Meme instance */
let meme = new Meme(root, landing.showButton);

/** Hot Module Replacement */
if (module.hot) {
  module.hot.accept([
    './component-landing/index.js',
    './component-meme/index.js'
  ], () => {
    landing.container.remove();
    window.removeEventListener('resize', landing);
    landing = new Landing(root);
    window.removeEventListener('load', landing);
    meme.container.remove();
    meme = new Meme(root, landing.showButton);
  });
}