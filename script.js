const board = document.getElementById('board');
const status = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');

const X_CLASS = 'x';
const O_CLASS = 'o';
let currentPlayer = X_CLASS;

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

const cells = [];

function startGame() {
  currentPlayer = X_CLASS;
  cells.forEach(cell => {
    cell.classList.remove(X_CLASS);
    cell.classList.remove(O_CLASS);
    cell.textContent = '';
    cell.removeEventListener('click', handleClick);
    cell.addEventListener('click', handleClick, { once: true });
  });
  setBoardHoverClass();
  status.innerText = "Player X's Turn";
}

function handleClick(e) {
  const cell = e.target;
  const currentClass = currentPlayer === X_CLASS ? X_CLASS : O_CLASS;
  placeMark(cell, currentClass);

  if (checkWin(currentClass)) {
    endGame(false);
  } else if (isDraw()) {
    endGame(true);
  } else {
    swapTurns();
    setBoardHoverClass();
  }
}

function endGame(draw) {
  if (draw) {
    status.innerText = 'Draw!';
  } else {
    status.innerText = `${currentPlayer === X_CLASS ? "Player X" : "Player O"} Wins!`;
  }
  cells.forEach(cell => {
    cell.removeEventListener('click', handleClick);
  });
}

function isDraw() {
  return cells.every(cell => {
    return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
  });
}

function placeMark(cell, currentClass) {
  cell.classList.add(currentClass);
  cell.textContent = currentClass === X_CLASS ? 'X' : 'O';
}

function swapTurns() {
  currentPlayer = currentPlayer === X_CLASS ? O_CLASS : X_CLASS;
  status.innerText = `${currentPlayer === X_CLASS ? "Player X's Turn" : "Player O's Turn"}`;
}

function setBoardHoverClass() {
  board.classList.remove(X_CLASS);
  board.classList.remove(O_CLASS);
  if (currentPlayer === X_CLASS) {
    board.classList.add(X_CLASS);
  } else {
    board.classList.add(O_CLASS);
    if (currentPlayer === O_CLASS) {
      setTimeout(() => {
        makeMove();
      }, 500);
    }
  }
}

function makeMove() {
  const availableCells = cells.filter(cell => !cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS));
  const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
  placeMark(randomCell, O_CLASS);
  if (checkWin(O_CLASS)) {
    endGame(false);
  } else if (isDraw()) {
    endGame(true);
  } else {
    swapTurns();
    setBoardHoverClass();
  }
}

function checkWin(currentClass) {
  return WINNING_COMBINATIONS.some(combination => {
    return combination.every(index => {
      return cells[index].classList.contains(currentClass);
    });
  });
}

restartBtn.addEventListener('click', startGame);

// Initialize the game with 9 cells
for (let i = 0; i < 9; i++) {
  const cell = document.createElement('div');
  cell.classList.add('cell');
  cell.setAttribute('data-cell', i);
  board.appendChild(cell);
  cells.push(cell);
}

startGame();
