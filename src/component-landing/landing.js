// TODO: ADD THIS TO main.js WHEN CONNECTING meme and landing
showButton.addEventListener('click', () => {
  memes.innerHTML = '';
  main.style.transform = 'scale(1)';
  memes.append(initialDivision);
  
  shuffleSubreddits();
});