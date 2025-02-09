// Game state
let score = 0;
const titles = {
  0: "Mildly Bored",
  51: "Slightly Entertained",
  101: "Boredom Slayer"
};

// API endpoints
const APIs = {
  activity: 'https://www.boredapi.com/api/activity',
  joke: 'https://v2.jokeapi.dev/joke/Any?safe-mode',
  fact: 'https://uselessfacts.jsph.pl/api/v2/facts/random',
  advice: 'https://api.adviceslip.com/advice',
  excuse: 'https://excuser-three.vercel.app/v1/excuse'
};

// Theme switching - Make it globally available
window.switchTheme = function(theme) {
  document.body.className = `theme-${theme}`;
}

// Score management
function updateScore(points) {
  score += points;
  document.getElementById('score').textContent = score;
  document.getElementById('score-progress').style.width = `${Math.min(score, 150)}%`;
  updateTitle();
  
  if (score >= 100) {
    showScorePopup();
  }
}

function updateTitle() {
  let currentTitle = titles[0];
  for (let threshold in titles) {
    if (score >= threshold) {
      currentTitle = titles[threshold];
    }
  }
  document.getElementById('title').textContent = currentTitle;
}

function showScorePopup() {
  const popup = document.createElement('div');
  popup.className = 'score-popup glass-card';
  popup.innerHTML = `
    <h2>🎉 Congratulations!</h2>
    <p>You've reached a score of 100!</p>
    <div class="popup-buttons">
      <button onclick="resetGame()" class="glass-btn">Start Over</button>
      <button onclick="exitWebsite()" class="glass-btn">Exit Website</button>
    </div>
  `;
  document.body.appendChild(popup);
}

window.resetGame = function() {
  score = 0;
  updateScore(0);
  document.querySelector('.score-popup').remove();
}

window.exitWebsite = function() {
  window.close();
  // If window.close() doesn't work (due to browser restrictions),
  // redirect to a blank page
  window.location.href = 'about:blank';
}

// Display functions
function showResult(content) {
  document.getElementById('result').innerHTML = content;
}

function showReaction(emoji, text) {
  const reaction = document.getElementById('reaction');
  reaction.innerHTML = `${emoji} ${text}`;
  reaction.style.animation = 'none';
  reaction.offsetHeight; // Trigger reflow
  reaction.style.animation = null;
}

// API functions - Make them globally available
window.getActivity = async function() {
  try {
    const response = await fetch(APIs.activity);
    const data = await response.json();
    showResult(`<h3>Try This Activity:</h3><p>${data.activity}</p>`);
    showReaction('🎯', 'Time to have some fun!');
    updateScore(10);
  } catch (error) {
    showResult('<p>Oops! Failed to fetch an activity. Try again!</p>');
  }
}

window.getJoke = async function() {
  try {
    const response = await fetch(APIs.joke);
    const data = await response.json();
    const joke = data.type === 'single' 
      ? data.joke 
      : `${data.setup}<br><br>${data.delivery}`;
    showResult(`<h3>Here's a Joke:</h3><p>${joke}</p>`);
    showReaction('😂', 'HAHAHA!');
    updateScore(5);
  } catch (error) {
    showResult('<p>Oops! Failed to fetch a joke. Try again!</p>');
  }
}

window.getFact = async function() {
  try {
    const response = await fetch(APIs.fact);
    const data = await response.json();
    showResult(`<h3>Useless Fact:</h3><p>${data.text}</p>`);
    showReaction('🤓', 'Whoa, I didn\'t know that!');
    updateScore(5);
  } catch (error) {
    showResult('<p>Oops! Failed to fetch a fact. Try again!</p>');
  }
}

window.getAdvice = async function() {
  try {
    const response = await fetch(APIs.advice);
    const data = await response.json();
    showResult(`<h3>Words of Wisdom:</h3><p>${data.slip.advice}</p>`);
    showReaction('🤔', 'Deep thoughts...');
    updateScore(5);
  } catch (error) {
    showResult('<p>Oops! Failed to fetch advice. Try again!</p>');
  }
}

window.getExcuse = async function() {
  try {
    const response = await fetch(APIs.excuse);
    const data = await response.json();
    showResult(`<h3>Random Excuse:</h3><p>${data[0].excuse}</p>`);
    showReaction('😅', 'Best excuse ever!');
    updateScore(3);
  } catch (error) {
    showResult('<p>Oops! Failed to fetch an excuse. Try again!</p>');
  }
}