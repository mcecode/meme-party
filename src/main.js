// imports
import './scss-global/index.scss';
import Landing from './component-landing/index.js';
import Meme from './component-meme/index.js';

const root = document.getElementById('root');
let landing = new Landing();
let meme = new Meme();

root.append(
  landing.container,
  // meme.container
)

if (module.hot) {
  module.hot.accept('./component-landing/index.js', () => {
    landing = new Landing();
  });
  module.hot.accept('./component-meme/index.js', () => {
    meme = new Meme();
  });
}