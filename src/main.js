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
    landing.container.remove();
    landing = new Landing();
    // change to prepend when meme.container is set
    root.append(landing.container);
  });
  module.hot.accept('./component-meme/index.js', () => {
    // add remove here
    meme = new Meme();
    // add append here
  });
}