const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const BASE_WIDTH = 600;
const BASE_HEIGHT = 800;
const noteWidth = 50;
const noteHeight = 20;
const noteSpeed = 5;
const hitboxTopBase = 595;
const hitboxHeight = 40;
const bufferHeight = hitboxHeight;
const keyBindings = { 'a': 0, 's': 1, 'd': 2, 'f': 3 };
const laneColors = ['#ff0000', '#00ff00', '#00bfff', '#800080'];
const white = '#FFFFFF';
const yellow = '#FFFF00';
const missRed = '#FF0000';

const offsetMs = 100;

let spawnEvents = [];
let notes = [];
let currentNoteIndex = 0;
let score = 0;
let scoreChangeText = ["", "", "", ""];
let scoreChangeTimer = [0, 0, 0, 0];

let holdPopupTimer = [0, 0, 0, 0];



let feedbackText = ["", "", "", ""];
let feedbackColor = [yellow, yellow, yellow, yellow];
let feedbackTimers = [0, 0, 0, 0];
let flashScreenRed = false;
let flashTimer = 0;
let keyPressed = [false, false, false, false];
let keyHeld = {};

let music;
let lastTimestamp = null;
let gameEnded = false;
let touchInputEnabled = false;

let laneTailActive = [false, false, false, false];

let holdScore = [0, 0, 0, 0];
let holdStartTime = [0, 0, 0, 0];

let showHoldPopup = [false, false, false, false];



// Stats
let perfectCount = 0;
let earlyCount = 0;
let lateCount = 0;
let missedCount = 0;

// Starfield
const stars = Array.from({ length: 300 }, () => ({
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
  radius: Math.random() * 1.5 + 0.5,
  speed: Math.random() * 0.3 + 0.1,
  drift: (Math.random() - 0.5) * 0.05
}));

function drawStars(deltaTime) {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'white';
  stars.forEach(star => {
    star.y += star.speed * deltaTime;
    star.x += star.drift * deltaTime;
    if (star.y > canvas.height) {
      star.y = Math.random() * -50;
      star.x = Math.random() * canvas.width;
    }
    if (star.x < 0) star.x = canvas.width;
    if (star.x > canvas.width) star.x = 0;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fill();
  });
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function setGlow(color) {
  ctx.shadowBlur = 20;
  ctx.shadowColor = color;
}
function clearGlow() {
  ctx.shadowBlur = 0;
}
function setSpaceFont(sizePx) {
  ctx.font = `bold ${sizePx}px Arial, sans-serif`;
  ctx.textAlign = 'center';
}

fetch('notes.json')
  .then(response => response.json())
  .then(data => {
    spawnEvents = data;
    setupStartButton(); // waits for user to press start
  });

function startGame() {
  music = new Audio('./assets/Three_And_A_Half-Its_A_Trap_MASTER_07.04.25.wav');
  music.load();

  music.addEventListener('canplaythrough', () => {
    music.play().then(() => {
      const waitForAudioStart = () => {
        if (music.currentTime > 0.2) {
          console.log("Audio started at", music.currentTime); // <- this should appear
          requestAnimationFrame(gameLoop);
    setTimeout(() => { touchInputEnabled = true; }, 300);
        } else {
          setTimeout(waitForAudioStart, 10);
        }
      };
      waitForAudioStart();
    }).catch(err => {
      console.error("Playback failed:", err);
    });
  });
}


function gameLoop(timestamp) {
  if (!music || !music.currentTime) return;
  let elapsed = (music.currentTime * 1000) + offsetMs;

  if (!lastTimestamp) lastTimestamp = timestamp;
  let deltaTime = (timestamp - lastTimestamp) / 16.6667;
  lastTimestamp = timestamp;

  const pulse = 50 + Math.sin(performance.now() / 100) * 40;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(canvas.width / BASE_WIDTH, canvas.height / BASE_HEIGHT);

  drawStars(deltaTime);

  ctx.fillStyle = flashScreenRed ? 'red' : 'rgba(0, 0, 0, 0)';
  ctx.fillRect(0, 0, BASE_WIDTH, BASE_HEIGHT);

  const laneWidth = BASE_WIDTH / 4;
  const lanes = [0, laneWidth, laneWidth * 2, laneWidth * 3];

  while (currentNoteIndex < spawnEvents.length && elapsed >= spawnEvents[currentNoteIndex].time) {
    const event = spawnEvents[currentNoteIndex];
    let tailLength = 0;

    if (!event.noTail) {
  const nextEvent = spawnEvents[currentNoteIndex + 1];
  if (nextEvent) {
    const timeDiff = nextEvent.time - event.time;
    if (timeDiff >= 0) {
      tailLength = timeDiff;
    }
  }
}



  notes.push({
  lane: event.lane,
  x: lanes[event.lane] + (laneWidth - noteWidth) / 2,
  y: -noteHeight,
  hit: false,
  judged: false,
  tailLength: tailLength,
  tailEnded: false,
  holdStarted: false,
  holdStartTime: 0,
  holdScore: 0
});



if (tailLength > 0) {
  holdScore[event.lane] = 0;
  holdStartTime[event.lane] = 0;
}


  currentNoteIndex++;
}

laneTailActive = [false, false, false, false];
  notes.forEach(note => {
    note.y += noteSpeed * deltaTime;

  // Draw tail if it has one
     if (note.tailLength > 0) {
       const tailHeight = (note.tailLength / 1000) * noteSpeed * 60;
       ctx.fillStyle = laneColors[note.lane];
       const padding = 200;
       const trimmedTailHeight = Math.max(0, tailHeight - padding);
       ctx.fillRect(note.x + noteWidth / 2 - 5, note.y + noteHeight - trimmedTailHeight, 10, trimmedTailHeight);


     }


if (note.tailLength > 0 && note.hit) {
  const key = ['a', 's', 'd', 'f'][note.lane];
  const isKeyHeldNow = keyHeld[key];

  const tailHeight = (note.tailLength / 1000) * noteSpeed * 60;
  const padding = 200;
  const trimmedTailHeight = Math.max(0, tailHeight - padding);

  const tailTopY = note.y + noteHeight - trimmedTailHeight;
  const tailBottomY = note.y + noteHeight;

  const tailOverlapsHitbox =
    tailBottomY >= hitboxTopBase &&
    tailTopY <= hitboxTopBase + hitboxHeight;

  if (!note.tailEnded && isKeyHeldNow && tailOverlapsHitbox) {
    laneTailActive[note.lane] = true;
    showHoldPopup[note.lane] = true;


const now = performance.now();
if (!note.holdStarted) {
  note.holdStartTime = now;
  note.holdStarted = true;
}

const elapsed = now - note.holdStartTime;
const units = Math.floor(elapsed / 100);
const expectedScore = units * 1;

if (expectedScore > note.holdScore) {
  const delta = expectedScore - note.holdScore;
  note.holdScore = expectedScore;
  holdScore[note.lane] = expectedScore; // live display only
  score += delta;
}


  }
}


  // Draw note head
     setGlow(laneColors[note.lane]);
     ctx.fillStyle = note.hit ? yellow : laneColors[note.lane];
     ctx.fillRect(note.x, note.y, noteWidth, noteHeight);
     clearGlow();
});


  notes.forEach(note => {
    if (!note.hit && !note.judged && note.y > hitboxTopBase + hitboxHeight + bufferHeight) {
      note.judged = true;
    }
  });

notes.forEach(note => {
  if (
    note.tailLength > 0 &&
    note.hit &&
    !note.tailEnded
  ) {
    const tailHeight = (note.tailLength / 1000) * noteSpeed * 60;
    const padding = 200;
    const trimmedTailHeight = Math.max(0, tailHeight - padding);

    const tailBottomY = note.y + noteHeight;
    const tailTopY = tailBottomY - trimmedTailHeight;

    if (tailTopY > hitboxTopBase + hitboxHeight) {
      holdPopupTimer[note.lane] = performance.now();
      note.tailEnded = true;
    }
  }
});




  for (let i = 0; i < 4; i++) {
    const laneX = lanes[i];
    if (laneTailActive[i]) {
  const blue = 100 + Math.sin(performance.now() / 100) * 155;
  ctx.shadowBlur = pulse;
  ctx.shadowColor = `rgb(255, 255, ${blue})`;
  ctx.fillStyle = yellow;
} else {
  ctx.shadowBlur = 0;
  ctx.fillStyle = keyPressed[i] ? yellow : 'rgba(0,0,0,0)';
}


ctx.fillRect(laneX, hitboxTopBase, laneWidth, hitboxHeight);
ctx.shadowBlur = 0;


    setGlow(laneColors[i]);
    ctx.strokeStyle = laneColors[i];
    ctx.lineWidth = 4;
    ctx.strokeRect(laneX, hitboxTopBase, laneWidth, hitboxHeight);
    clearGlow();

    setSpaceFont(30);
    ctx.fillStyle = yellow;
    ctx.font = 'bold 30px StarJHol';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('ASDF'[i], laneX + laneWidth / 2, hitboxTopBase + hitboxHeight / 2);

    if (feedbackText[i]) {
      ctx.font = 'bold 24px StarJedi';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
      ctx.fillStyle = feedbackColor[i];
      ctx.fillText(feedbackText[i], laneX + laneWidth / 2, hitboxTopBase - 20);
    }
  }

  let now = performance.now();
  for (let i = 0; i < 4; i++) {
    if (feedbackTimers[i] && now - feedbackTimers[i] > 800) {
      feedbackText[i] = "";
    }
  }

  if (flashScreenRed && now - flashTimer > 100) {
    flashScreenRed = false;
  }

  document.getElementById('score').textContent = "Score: " + score;
for (let i = 0; i < 4; i++) {
  const laneWidth = BASE_WIDTH / 4;
  const x = (i + 1) * laneWidth - 10;
  const baseY = hitboxTopBase + hitboxHeight + 20;

  setSpaceFont(24);
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = yellow;

  if (scoreChangeText[i] && performance.now() - scoreChangeTimer[i] < 1000) {
    ctx.fillText(scoreChangeText[i], x, baseY);
  } else if (performance.now() - scoreChangeTimer[i] >= 1000) {
    scoreChangeText[i] = "";
  }

  const holdStillActive = showHoldPopup[i];
const holdFadingOut = holdPopupTimer[i] && performance.now() - holdPopupTimer[i] < 1000;

if ((holdStillActive || holdFadingOut) && holdScore[i] > 0) {
  ctx.fillText("+" + holdScore[i], x, baseY + 25);
}
for (let i = 0; i < 4; i++) {
  if (holdPopupTimer[i] && performance.now() - holdPopupTimer[i] >= 1000) {
    holdPopupTimer[i] = 0;
    holdScore[i] = 0;
    showHoldPopup[i] = false; // ✅ hide popup completely
  }
}


}





  
  if (!gameEnded && currentNoteIndex >= spawnEvents.length && notes.every(n => n.y > BASE_HEIGHT)) {
    gameEnded = true;
    fadeOutAndEnd();
    holdScore = [0, 0, 0, 0];
  }

  if (!gameEnded) {
    requestAnimationFrame(gameLoop);
    setTimeout(() => { touchInputEnabled = true; }, 300);
  }
}

// Keyboard and Touch Inputs
document.addEventListener('keydown', (e) => {
  const alreadyHeld = keyHeld[e.key];
  keyHeld[e.key] = true;
  if (alreadyHeld) return;
  let key = e.key.toLowerCase();
  if (keyBindings.hasOwnProperty(key)) {
    let lane = keyBindings[key];
    keyPressed[lane] = true;
    let hit = false;
    for (let note of notes) {
      if (note.lane === lane && !note.hit) {
        if (note.y >= hitboxTopBase && note.y <= hitboxTopBase + hitboxHeight) {
          note.hit = true; perfectCount++; score += 10;
          scoreChangeText[lane] = "+10";
          scoreChangeTimer[lane] = performance.now();
          feedbackText[lane] = "PERFECT"; feedbackColor[lane] = yellow;
          hit = true; break;
        } else if (note.y >= hitboxTopBase - bufferHeight && note.y < hitboxTopBase) {
          note.hit = true; earlyCount++; score += 5;
          scoreChangeText[lane] = "+5";
          scoreChangeTimer[lane] = performance.now();
          feedbackText[lane] = "EARLY"; feedbackColor[lane] = yellow;
          hit = true; break;
        } else if (note.y > hitboxTopBase + hitboxHeight && note.y <= hitboxTopBase + hitboxHeight + bufferHeight) {
          note.hit = true; lateCount++; score += 5;
          scoreChangeText[lane] = "+5";
          scoreChangeTimer[lane] = performance.now();
          feedbackText[lane] = "LATE"; feedbackColor[lane] = yellow;
          hit = true; break;
        }
      }
    }
    if (!hit) {
      flashScreenRed = true;
      flashTimer = performance.now();
      score -= 5;
      scoreChangeText[lane] = "-5";
      scoreChangeTimer[lane] = performance.now();
      feedbackText[lane] = "MiSS";
      feedbackColor[lane] = missRed;
      feedbackTimers[lane] = performance.now();
      missedCount++;
    } else {
      feedbackTimers[lane] = performance.now();
    }
  }
});

document.addEventListener('keyup', (e) => {
  keyHeld[e.key] = false;
  let key = e.key.toLowerCase();
  if (keyBindings.hasOwnProperty(key)) {
    keyPressed[keyBindings[key]] = false;
  }
});

canvas.addEventListener('touchstart', (e) => {
  if (!touchInputEnabled) return;
  e.preventDefault();
  for (let touch of e.touches) {
    const touchX = touch.clientX;
    const laneWidth = canvas.width / 4;
    const lane = Math.floor(touchX / laneWidth);
    if (lane >= 0 && lane < 4) {
      const key = 'asdf'[lane];
      const event = new KeyboardEvent('keydown', { key: key });
      document.dispatchEvent(event);
    }
  }
}, { passive: false });

canvas.addEventListener('touchend', (e) => {
  e.preventDefault();
  for (let lane = 0; lane < 4; lane++) {
    const key = 'asdf'[lane];
    const event = new KeyboardEvent('keyup', { key: key });
    document.dispatchEvent(event);
  }
}, { passive: false });


function fadeOutAndEnd() {
  const fadeDuration = 2000; // 2 seconds
  const fadeSteps = 60;
  let step = 0;
  const originalVolume = music.volume;

  const fadeInterval = setInterval(() => {
    step++;
    music.volume = originalVolume * (1 - step / fadeSteps);
    if (step >= fadeSteps) {
      clearInterval(fadeInterval);
      music.pause();
      music.volume = originalVolume;
      showGameOverScreen();
    }
  }, fadeDuration / fadeSteps);
}
