# Meme Party

> A simple test site that shows memes from reddit.
>
> Site is live at <https://mcecode.github.io/meme-party/>.

This was supposed to be a short local project, but after a while I decided that it would be a good avenue to try to use and learn git, webpack, github, scss, among other technologies. As such, the code is still fairly raw at the moment but I do plan to clean it up (see [Refactoring](#refactoring) section below).

## Usage

You're going to need node and npm for this project, to check if you have them just type `node -v` and/or `npm -v` in your command line and if you see it respond with a version (e.g. v12.18.0) then you should be good to go.

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

then, you can just open index.html from the build folder in your browser.

### To Develop

It's often useful to have a dev server in development, so I set this project up with [webpack-dev-server](https://github.com/webpack/webpack-dev-server). To utilize it, you'll have to create a _.env_ file in the project's root directory, because I set it up with https.

To use your own local dev cert, just put the following info in the _.env_ file:

```text
  SSL_KEY=C:/path/to/your.key
  SSL_CRT=C:/path/to/your.crt
  SSL_PEM=C:/path/to/your.pem
```

if you don't have one, you can create a cert using [mkcert](https://github.com/FiloSottile/mkcert).

If you don't want to generate a cert yourself but would still like to use https then just put:

```text
  SSL=true
```

and webpack-dev-server will generate one for you, though that might cause some problems because the generated certificate is a self-signed one.

Finally, if you think using https is a hassle and want to do away with it, just leave the file blank but it **must** be there, the dev server will then default to http.

Once you finish tinkering with that, just run the following commands:

```bash
  # install dependencies
  $ npm install

  # run dev server
  $ npm start
```

it'll tell you where your local server is running so you can open it in your browser.

I also enabled Hot Module Replacement (HMR) so you can use that too. If you don't have a clue what that is, like I did, please refer to the [official guide](https://v4.webpack.js.org/guides/hot-module-replacement/).

### To Reuse

If you like my webpack settings and would just like to reuse them for your own project, you can do that too.

For your reference, here are the pertinent defaults I set in the configs not mentioned above:

- main entry point is ./src/main.js
- template for emitted index.html is ./src/template.ejs
- html titles are set in [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin#options) options
- scss files are used for styles
- [file-loader](https://github.com/webpack-contrib/file-loader) is only set to process png, jpg, woff, woff2

Of course you can extend, modify, and build on top of the configs I set here if you want to.

## Todo

A tentative list of things I'd like to implement to better the project (though I'm not quite sure how to do some of them).

### Refactoring

- [ ] create the html components in js
- [ ] use css modules with css-loader
- [ ] break up js and scss monoliths into components
- [ ] reduce unnecessary media query use
- [ ] find a way to keep webpack configs DRY
- [ ] use jsdoc comments / add explaining comments
- [ ] use a formatter and/or linter

### Features

- [ ] dynamically insert web API polyfills from polyfill-library only for browsers that need them
- [ ] make two bundles, one with modern code for newer browsers and another with transpiled code for older browsers
- [ ] use simplebar
- [ ] add unicode emojis for decoration where appropriate
- [ ] make _staph_ button circular to match _dank memes hur_ button
- [ ] remove _moar_ button and use infinite scrolling
- [ ] use client side routing
- [ ] make pages look decent even in super big screens
- [ ] make it look more consistent across browsers
- [ ] make it more accesible for keyboard-only navigation
- [ ] create a custom 404 page
- [ ] allow users to choose the subreddit where memes come from
- [ ] allow users to choose how many memes to load at a time
- [ ] add SEO meta tags

## Licenses and 3rd Party Assets

### Code

- The code in this project is licensed under the terms of the MIT license (see [LICENSE](LICENSE) file).
- NPM packages used are under their own licenses.

### Memes

- Memes from reddit are provided by the awesome [Meme API](https://github.com/R3l3ntl3ss/Meme_Api).

### Fonts

Fonts are downloaded from [Google Fonts](https://fonts.google.com/) using [google-webfonts-helper](https://google-webfonts-helper.herokuapp.com/fonts).

- [Roboto](https://fonts.google.com/specimen/Roboto) is licensed under [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0).
- [Zilla Slab Highlight](https://fonts.google.com/specimen/Zilla+Slab+Highlight) is licensed under [SIL Open Font License (OFL)](https://scripts.sil.org/cms/scripts/page.php?site_id=nrsi&id=OFL).

### Images

Images were processed using [Meme-Creator](https://meme-creator.com/) and [TinyJPG](https://tinyjpg.com/).

- [sad-pepe.png](https://www.pngkey.com/detail/u2q8q8o0t4u2r5y3_stickpng-rare-pepe-sad-frog-sad-pepe/) is licensed under personal use.
- [doge.png](https://www.pngkey.com/detail/u2a9o0y3o0e6r5o0_doge-fluffy-artwork-doge-png/) is licensed under personal use.
- [green-mnm.png](https://www.iconfinder.com/icons/312566/chocolate_color_colour_green_m%26m_icon) is licensed under [Creative Commons (Attribution 3.0 Unported)](https://creativecommons.org/licenses/by/3.0/).
- Other images taken from the internet are used and edited under [Fair use](https://www.copyright.gov/title17/92chap1.html#107).

## Thanks

That's it! Thanks for reading. Feel free to fork or reach out with an issue or pull request, though I am still learning how those work.