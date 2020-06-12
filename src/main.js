// imports
import './scss-global/index.scss';
import Landing from './component-landing/index.js';
import Meme from './component-meme/index.js';

const root = document.getElementById('root');
let landing = new Landing(root);
let meme = new Meme();

if (module.hot) {
  module.hot.accept('./component-landing/index.js', () => {
    landing.container.remove();
    landing = new Landing(root);
  });
  module.hot.accept('./component-meme/index.js', () => {
    // add remove here
    meme = new Meme();
    // add append here
  });
}