const board = document.getElementById('board');
const statusDiv = document.getElementById('status');
const restartBtn = document.getElementById('restart');
const currentPlayerSpan = document.getElementById('current-player');
const winLineCanvas = document.getElementById('win-line');
const boardContainer = document.getElementById('board-container');
const modal = document.getElementById('winner-modal');
const winnerText = document.getElementById('winner-text');
const closeModalBtn = document.getElementById('close-modal');

let currentPlayer, gameActive, cells;

const winPatterns = [
  [0,1,2],[3,4,5],[6,7,8], // rows
  [0,3,6],[1,4,7],[2,5,8], // columns
  [0,4,8],[2,4,6]          // diagonals
];

function resizeCanvas() {
  winLineCanvas.width = board.offsetWidth;
  winLineCanvas.height = board.offsetHeight;
  winLineCanvas.style.width = board.offsetWidth + 'px';
  winLineCanvas.style.height = board.offsetHeight + 'px';
}
window.addEventListener('resize', resizeCanvas);

function initGame() {
  board.innerHTML = '';
  cells = Array(9).fill('');
  currentPlayer = 'X';
  gameActive = true;
  updateStatus();
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('button');
    cell.classList.add('cell');
    cell.setAttribute('data-index', i);
    cell.addEventListener('click', handleCellClick);
    board.appendChild(cell);
  }
  resizeCanvas();
  clearCanvas();
}

function handleCellClick(e) {
  const idx = e.target.getAttribute('data-index');
  if (!gameActive || cells[idx]) return;
  cells[idx] = currentPlayer;
  e.target.textContent = currentPlayer;
  e.target.classList.add(currentPlayer === 'X' ? 'x' : 'o');
  e.target.classList.add('disabled');
  const winInfo = checkWinner();
  if (winInfo) {
    gameActive = false;
    statusDiv.innerHTML = `<strong>Player ${currentPlayer} wins!</strong>`;
    highlightWin(winInfo.pattern);
    showWinnerModal(currentPlayer);
  } else if (cells.every(c => c)) {
    gameActive = false;
    statusDiv.innerHTML = `<strong>It's a draw!</strong>`;
    showWinnerModal("Draw");
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateStatus();
  }
}

function updateStatus() {
  currentPlayerSpan.textContent = currentPlayer;
  statusDiv.innerHTML = `Player <span id="current-player">${currentPlayer}</span>'s turn`;
}

function checkWinner() {
  for (let i = 0; i < winPatterns.length; i++) {
    const pattern = winPatterns[i];
    const [a, b, c] = pattern;
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      return { player: cells[a], pattern };
    }
  }
  return null;
}

function highlightWin(pattern) {
  for (let idx of pattern) {
    const cell = board.children[idx];
    cell.style.background = 'var(--color-accent)';
    cell.style.color = 'var(--color-board)';
  }
  drawWinLine(pattern[0], pattern[2]);
  for (let cell of board.children) {
    cell.classList.add('disabled');
  }
}

function clearCanvas() {
  const ctx = winLineCanvas.getContext('2d');
  ctx.clearRect(0, 0, winLineCanvas.width, winLineCanvas.height);
}

function drawWinLine(startIdx, endIdx) {
  const cellEls = board.querySelectorAll('.cell');
  const startCell = cellEls[startIdx];
  const endCell = cellEls[endIdx];
  const boardRect = board.getBoundingClientRect();
  const startRect = startCell.getBoundingClientRect();
  const endRect = endCell.getBoundingClientRect();

  const offset = (rect) => ({
    x: rect.left - boardRect.left + rect.width / 2,
    y: rect.top - boardRect.top + rect.height / 2
  });
  const p1 = offset(startRect);
  const p2 = offset(endRect);

  const ctx = winLineCanvas.getContext('2d');
  clearCanvas();
  ctx.strokeStyle = '#c6ebbe';
  ctx.lineWidth = 7;
  ctx.lineCap = "round";
  ctx.shadowColor = '#02088755';
  ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.stroke();
}

function showWinnerModal(winner) {
  if (winner === "Draw") {
    winnerText.textContent = "It's a Draw!";
    winnerText.style.color = "#c6ebbe";
  } else {
    winnerText.textContent = `Player ${winner} Wins!`;
    winnerText.style.color = "#c6ebbe";
  }
  modal.style.display = "flex";
}

closeModalBtn.onclick = function() {
  modal.style.display = "none";
};
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

restartBtn.addEventListener('click', function() {
  modal.style.display = "none";
  initGame();
});

window.onload = () => {
  initGame();
  resizeCanvas();
};