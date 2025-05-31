window.showGameOverScreen = function() {
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
    requestAnimationFrame(() => {
      const buttonHeight = playAgainButton.offsetHeight;
      const midpoint = (yellowBottom + whiteTop) / 2;
      playAgainButton.style.top = `${midpoint - buttonHeight / 2}px`;
    });
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

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const buttonHeight = playAgainButton.offsetHeight;
      const midpoint = (yellowBottom + whiteTop) / 2;
      playAgainButton.style.top = `${midpoint - buttonHeight / 2}px`;
    });
  });

    playAgainButton.addEventListener('click', () => {
  const video = document.getElementById('trapVideo');

  if (!video) {
    console.error("trapVideo element not found in DOM.");
    return;
  }

  // Show loader at the location of the button
  const loading = showAnimatedLoadingText(document.body, playAgainButton);

  // Style and display the video
  video.style.position = 'absolute';
  video.style.top = '50%';
  video.style.left = '50%';
  video.style.transform = 'translate(-50%, -50%)';
  video.style.width = '80%';
  video.style.height = 'auto';
  video.style.zIndex = '100';
  video.style.display = 'block';
  video.style.backgroundColor = 'black';
  video.controls = false;
  video.currentTime = 0;

  video.play();

  // ✅ Remove loader as soon as video starts playing
  video.onplaying = () => {
    loading.clear();
  };

  // Then reload after video ends
  video.onended = () => {
    video.style.display = 'none';
    location.reload();
  };
});








  ctx.fillStyle = white;
  setSpaceFont(16 * scale);
  ctx.fillText("Upload screenshot of this page to insta story", canvas.width / 2, 650 * scale);
  ctx.fillText("and tag us @threeandahalf3.5 for a chance to win!", canvas.width / 2, 680 * scale);
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

}