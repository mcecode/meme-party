# Meme Party

A fun site that shows random memes from Reddit.

![A demo of Meme Party loading with animations and showing memes from Reddit.](assets/demo.webp)

The site is live at <https://mcecode.github.io/meme-party/>.

This was supposed to be a short local project, but after a while, I decided that it would be a good avenue to try to use and learn Git, webpack, GitHub, and SCSS, among other technologies. As such, I now plan to update/refactor the code and add features whenever I can (see [Todo](#todo) section below).

## Usage

You're going to need node and npm for this project, to check if you have them just type `node -v` and/or `npm -v` in your command line, if you see it respond with a version (e.g. `v12.18.0`) then you should be good to go.

If you don't have them yet, npm comes with node, so you can just download node at [nodejs.org](https://nodejs.org/) or use something like [nvm](https://github.com/nvm-sh/nvm) or [nvm-windows](https://github.com/coreybutler/nvm-windows), depending on your system.

Once you have that, fork, download, or clone this repo and choose what you want to do with it.

### To Rebuild

Just run the following commands in the project directory:

```bash
  # install dependencies
  $ npm install

  # to build for development
  $ npm run build:dev

  # to build for production
  $ npm run build:prod
```

then, you can just open _./build-dev/index.html_ or _./build-prod/index.html_ in your browser.

### To Develop

It's often useful to have a dev server in development, so I set this project up with [webpack-dev-server](https://github.com/webpack/webpack-dev-server). If you want to use HTTPS or set a custom port, you'll have to create a _.env_ file in the project's root directory to load up the HTTPS dev certs and/or your other preferences.

If you want to specify a custom port, just put the following in your _.env_ file:

```text
  PORT=your port number preference
```

To use your own local dev cert, just add:

```text
  SSL_KEY=/path/to/your.key
  SSL_CRT=/path/to/your.crt
  SSL_PEM=/path/to/your.pem
```

If you don't have one, you can create a cert using [mkcert](https://github.com/FiloSottile/mkcert).

If you don't want to generate a cert yourself but would still like to use HTTPS then just put:

```text
  SSL=true
```

and webpack-dev-server will generate one for you, though that might cause some problems because the generated certificate is a self-signed one.

Finally, if you don't want to mess with all of that, you don't have to, the dev server will just default to HTTP and port 5000.

Once you finish tinkering with that, just run the following commands:

```bash
  # install dependencies
  $ npm install

  # run dev server
  $ npm start
```

it'll tell you where your local server is running so you can open it in your browser.

I also enabled Hot Module Replacement (HMR) so you can use that too. If you don't have a clue what that is, as I did, please refer to the [official guide](https://webpack.js.org/concepts/hot-module-replacement/).

### To Reuse

If you like my webpack settings and would just like to reuse them for your own project, you can do that too.

For your reference, here are some pertinent defaults that I set in the configs which are not mentioned above:

- main entry point is _./src/main.js_
- template for emitted index.html is _./src/ejs-template/index.ejs_
- title tag text content are set in [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin#options) options
- only SCSS files can be used for styling
- [file-loader](https://github.com/webpack-contrib/file-loader) is only set to process and emit PNG, JPG, WOFF, and WOFF2 files

Other details can be seen by looking at the configs themselves at _./webpack.config.js_ or by running the following commands:

```bash
  # view configs during production builds
  $ npm run log:prod

  # view configs during development builds
  $ npm run log:dev

  # view configs when running dev server
  $ npm run log:serve
```

Of course, you can extend, modify, and build on top of the configs I set here if you want to.

## Todo

A tentative list of things I'd like to implement to better the project (though I'm not quite sure how to do some of them).

### Fix

- UI/UX
  - [ ] fix stiff scrolling and layout problems seen in iPhone Safari version <=12

### Refactoring

- General
  - [x] add and maintain docs style / guiding / delimiting comments in source code and configs
  - [ ] use a formatter and/or linter
- JS
  - [x] break up _./src/main.js_ into modules
  - [x] use a class-based, event-driven approach
  - [x] create HTML components with js instead of with ejs
  - [x] use css-modules with css-loader to assign classes to HTMLElements
- SCSS
  - [x] break up _./src/main.scss_ into modules
  - [ ] reduce media query use
- webpack
  - [x] follow the DRY principle in configs

### Features

- Performance
  - [ ] for browsers that need them, dynamically insert and load web API polyfills from polyfill-library
  - [ ] create two JS bundles:
    - untranspiled/unpolyfilled, to be loaded by newer browsers
    - transpiled/polyfilled, to be loaded by older browsers
- UI/UX
  - [x] make `Main.hideButton` and `Main.moreButton` circular with larger horizontal writing
  - [ ] use simplebar for scrollbar styling
  - [ ] make it look more consistent across browsers and devices
    - create a _./src/scss-global/\_reset.scss_ file
    - make bigger screen experience more similar with standard screen experience
    - make landing page feel less cramped in smaller devices
  - [ ] Put guiding messages wherever appropriate
- Pages
  - [ ] use client-side routing for per page URLs and history navigation
  - [ ] create a custom 404 page
  - [ ] add SEO meta tags and repo image
  - [ ] add credits and GitHub link
- Accessibility
  - [ ] make keyboard-only navigation experience better
    - put the focus on the right HTMLElements at the right time
    - transfer focus to next meme loaded instead of keeping it on `Main.moreButton`
- Functionality
  - [ ] allow users to choose the subreddit where memes come from
  - [ ] allow users to choose how many memes to load at a time
  - [ ] add NSFW and spoiler indications to memes

### Experiment

- SCSS
  - [ ] use CSS grid and/or flexbox for layout
  - [ ] use autoprefixer autoplacement for CSS grid polyfill
  - [ ] create two CSS files:
    - unpolyfilled/unprefixed, to be loaded by newer browsers
    - polyfilled/unprefixed, to be loaded by older browsers
- JS
  - [ ] use @babel/plugin-proposal-class-properties to allow:
    - making internal methods and properties private with `#`
    - creating a getter for private properties
    - creating public methods using the class fields' syntax, `method = () => {}`, to bind `this`

## Licenses and 3rd Party Assets

### Code

- The code in this project is licensed under the terms of the MIT license (see [LICENSE](LICENSE) file).
- npm packages used are under their own licenses.

### Memes

- Memes from Reddit are provided by the awesome [Meme API](https://github.com/R3l3ntl3ss/Meme_Api).

### Fonts

Fonts were downloaded from [Google Fonts](https://fonts.google.com/) using [google-webfonts-helper](https://google-webfonts-helper.herokuapp.com/fonts).

- [Zilla Slab Highlight](https://fonts.google.com/specimen/Zilla+Slab+Highlight) is licensed under [SIL Open Font License (OFL)](https://scripts.sil.org/cms/scripts/page.php?site_id=nrsi&id=OFL).

### Images

Images were processed using [Meme-Creator](https://meme-creator.com/) and [TinyJPG](https://tinyjpg.com/).

- [sad-pepe.png](https://www.pngkey.com/detail/u2q8q8o0t4u2r5y3_stickpng-rare-pepe-sad-frog-sad-pepe/) is licensed under personal use.
- [doge.png](https://www.pngkey.com/detail/u2a9o0y3o0e6r5o0_doge-fluffy-artwork-doge-png/) is licensed under personal use.
- [green-mnm.png](https://www.iconfinder.com/icons/312566/chocolate_color_colour_green_m%26m_icon) is licensed under [Creative Commons (Attribution 3.0 Unported)](https://creativecommons.org/licenses/by/3.0/).
- Other images taken from the internet are used and edited under [Fair use](https://www.copyright.gov/title17/92chap1.html#107).

## Thanks

That's it! Thanks for reading. Feel free to fork or reach out with an issue or a pull request, though I am still learning how those work.
