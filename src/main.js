/**************************************************\
  main.js
\**************************************************/

/** Non-js imports */
import './scss-global/index.scss';

/** JS imports */
import Landing from './component-landing/index.js';
import Main from './component-main/index.js';
import GlobalState from './js-state/index.js';

/** Entry point for all components */
const root = document.getElementById('root');

/** Landing instance */
let landing = new Landing(root);

/** Main instance */
let main = new Main(root);

/** GlobalState instance */
let globalState = new GlobalState(landing, main);

/** Hot Module Replacement */
if (module.hot) {
  module.hot.accept('./component-landing/index.js', () => {
    landing.container.remove();
    window.removeEventListener('resize', landing);
    landing = new Landing(root);
    window.removeEventListener('load', landing);
    globalState = new GlobalState(landing, main);
  });

  module.hot.accept('./component-main/index.js', () => {
    main.container.remove();
    main = new Main(root);
    globalState = new GlobalState(landing, main);
  });

  module.hot.accept('./js-state/index.js', () => {
    globalState = new GlobalState(landing, main);
  });
}