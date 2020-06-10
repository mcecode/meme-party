/*********************************************\ 
  variable declarations /
\*********************************************/
const
landing = document.querySelector('header'),
landingH1 = landing.querySelector('h1'),
landingPar = landing.querySelector('p'),
landingImg = landing.querySelector('img'),
showButton = landing.querySelector('button');

/*********************************************\ 
  functions
\*********************************************/
function setlandingH1Content() {
  const
  height = window.innerHeight,
  width = window.innerWidth;
  
  if (height > width) {
    landingH1.innerHTML = `
      <pre> Memes </pre>
      <pre> Purr </pre>
      <pre> You </pre>`;
  } else {
    landingH1.innerHTML = `
      <pre> Memes Purr You </pre>`;
  }
}

/*********************************************\ 
  event listeners
\*********************************************/
window.onload = () => {
  window.onload = null;

  setlandingH1Content();
  
  if (!localStorage.getItem('saw landing animation'))  {
    landingPar.style.transform = 'translateY(-100vh)';
    landingImg.style.transform = 'scale(0)';
    showButton.style.transform = 'translateY(100vh)';

    landingH1.classList.add('h1-animate');
    setTimeout(() => {landingPar.classList.add('p-animate');}, 750);
    setTimeout(() => {landingImg.classList.add('img-animate');}, 750*2);
    setTimeout(() => {showButton.style.transform = 'scale(1)';}, 750*3)
    setTimeout(() => {showButton.classList.add('button-animate');}, 750*4);

    localStorage.setItem('saw landing animation', true);
  } else {
    showButton.style.animation = '750ms ease-in-out 0ms 5 normal backwards running rippleAnimation';
  }
}

window.addEventListener('resize', setlandingH1Content);

showButton.addEventListener('click', () => {
  memes.innerHTML = '';
  main.style.transform = 'scale(1)';
  memes.append(initialDivision);
  
  shuffleSubreddits();
});