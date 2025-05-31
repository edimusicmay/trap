function showGameOverScreen() {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawStars(1);

  const scaleX = canvas.width / BASE_WIDTH;
  const scaleY = canvas.height / BASE_HEIGHT;
  const scale = Math.min(scaleX, scaleY);

  ctx.fillStyle = yellow;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  ctx.font = `bold ${48 * scale}px StarJHol`;
  ctx.fillText('Game over', canvas.width / 2, 120 * scale);

  ctx.font = `bold ${28 * scale}px StarJedi`;
  ctx.fillText(`Perfect: ${perfectCount}`, canvas.width / 2, 240 * scale);
  ctx.fillText(`Early: ${earlyCount}`, canvas.width / 2, 290 * scale);
  ctx.fillText(`Late: ${lateCount}`, canvas.width / 2, 340 * scale);
  ctx.fillText(`MiSS: ${missedCount}`, canvas.width / 2, 390 * scale);

  const playAgainButton = document.createElement('button');
  playAgainButton.style.position = 'absolute';
playAgainButton.textContent = 'Play Again?';
  const yellowBottom = 390 * scale + 28 * scale;
  const whiteTop = 650 * scale;
  const midpoint = (yellowBottom + whiteTop) / 2;

  requestAnimationFrame(() => {
  const buttonHeight = playAgainButton.offsetHeight;
  const midpoint = (yellowBottom + whiteTop) / 2;
  playAgainButton.style.top = `${midpoint - buttonHeight / 2}px`;
});

  playAgainButton.style.left = '50%';
  playAgainButton.style.transform = 'translate(-50%, 0)';
  playAgainButton.style.fontSize = '24px';
  playAgainButton.style.padding = '10px 20px';
  playAgainButton.style.color = '#FFFF00';
  playAgainButton.style.backgroundColor = 'black';
  playAgainButton.style.border = '2px solid #FFFF00';
  playAgainButton.style.zIndex = '10';
  playAgainButton.style.fontWeight = 'bold';
  document.body.appendChild(playAgainButton);

const promoLink = document.createElement('a');
promoLink.href = 'https://linktr.ee/three3.5andahalf';
promoLink.textContent = 'Socials: Threeandahalf3.5';
promoLink.target = '_blank';

promoLink.style.position = 'absolute';
promoLink.style.left = '50%';
promoLink.style.transform = 'translateX(-50%)';
promoLink.style.top = `${canvas.height * 0.92}px`;

promoLink.style.fontFamily = "'StarJHol', Arial, sans-serif";
promoLink.style.fontSize = '24px';
promoLink.style.color = '#00bfff';
promoLink.style.textShadow = `
  0 0 5px #00bfff,
  0 0 10px #00bfff,
  0 0 20px #00bfff,
  0 0 40px #00aacc
`;
promoLink.style.animation = 'flicker 1.5s infinite';
promoLink.style.textDecoration = 'none';
promoLink.style.zIndex = '10';

document.body.appendChild(promoLink);

  playAgainButton.addEventListener('click', () => {
  playAgainButton.style.display = 'none';

  const loadingText = document.createElement('div');
  loadingText.textContent = 'Loading';
  loadingText.style.position = 'absolute';
  loadingText.style.left = '50%';
  loadingText.style.top = playAgainButton.style.top || '50%';
  loadingText.style.transform = 'translate(-50%, 0)';
  loadingText.style.fontSize = '24px';
  loadingText.style.fontWeight = 'bold';
  loadingText.style.color = '#FFFF00';
  loadingText.id = 'endLoadingText';
  document.body.appendChild(loadingText);

  let dots = 0;
  const loadingInterval = setInterval(() => {
    dots = (dots + 1) % 4;
    loadingText.textContent = 'Loading' + '.'.repeat(dots);
  }, 500);

  const video = document.getElementById('trapVideo');
  // Setup before loading
video.style.position = 'absolute';
video.style.top = '50%';
video.style.left = '50%';
video.style.transform = 'translate(-50%, -50%)';
video.style.width = '80%';
video.style.height = 'auto';
video.style.zIndex = '100';
video.style.display = 'none'; // 🔄 Wait to show until canplaythrough
video.style.backgroundColor = 'black';
video.controls = false;
video.currentTime = 0;

video.addEventListener('canplaythrough', () => {
  clearInterval(loadingInterval);
  if (loadingText) document.body.removeChild(loadingText);
  if (promoLink) promoLink.remove();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  video.style.display = 'block'; // ✅ Now safe to show
  video.play().catch(err => {
    console.error("Video playback failed:", err);
  });
}, { once: true });

video.load();


  video.onended = () => {
    video.style.display = 'none';
    location.reload();
  };
});





  ctx.fillStyle = white;
  setSpaceFont(16 * scale);
  ctx.fillText("Upload screenshot of this page to insta story", canvas.width / 2, 650 * scale);
  ctx.fillText("and tag us @threeandahalf3.5 for a chance to win!", canvas.width / 2, 680 * scale);


}