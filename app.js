const GameBoard = (function() {
  let board;

  function createBoard() {
    board = Array(9).fill(null);
  }

  function getBoard() {
    return board;
  }

  function makeMove(index, token) {
    if (board[index] === null) {
      board[index] = token;
      return true;
    }
    return false;
  }
  
  return { createBoard, getBoard, makeMove }
})();


const GameController = (function() {
  const players = [
    {
      name: 'Player One',
      token: 'X',
      score: 0,
    },
    {
      name: 'Player Two',
      token: 'O',
      score: 0,
    },
  ];

  let currentPlayerIndex = 0;

  function getCurrentPlayer() {
    return players[currentPlayerIndex];
  }

  function switchPlayer() {
    currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
    console.log(`It is now ${players[currentPlayerIndex].name}'s turn.`);
  }

  function updateScore() {
    players[currentPlayerIndex].score += 1;
  }

  function getScore() {
    return players[currentPlayerIndex].score;
  }

  function checkWinner() {
    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6]             // Diagonals
    ];
    const board = GameBoard.getBoard();
    return winningCombinations.some(combination => {
      const [a, b, c] = combination;
      return board[a] && board[a] === board[b] && board[a] === board[c];
    });
  }

  function handleWin() {
    updateScore();
    console.log(`${getCurrentPlayer().name} wins!`);
    GameBoard.createBoard();
  }

  function makeMove(index) {
    const currentPlayer = getCurrentPlayer();
    if (GameBoard.makeMove(index, currentPlayer.token)) {
      if (checkWinner()) {
        handleWin();
      } else if (GameBoard.getBoard().every(cell => cell !== null)) {
        handleDraw();
      } else {
        switchPlayer();
      }
    }
  }

  return { getCurrentPlayer, switchPlayer, updateScore, getScore, checkWinner, handleWin, makeMove };
})();


const Display = (function() {
  GameBoard.createBoard();
  const board = document.querySelector('.board');

  function initializeBoard() {
    board.innerHTML = '';
    GameBoard.getBoard().forEach((_, index) => {
      const cellDiv = document.createElement('div');
      cellDiv.classList.add('cell');
      cellDiv.textContent = '';
      cellDiv.addEventListener('click', () => {
        if (GameBoard.getBoard()[index] === null){
          GameController.makeMove(index);
          updateBoard();
        } else {
          console.log(`Cell ${index} is already occupied`);
        }
      });
      board.appendChild(cellDiv);
    });
  }

  function updateBoard() {
    console.log(`GameBoard: `, GameBoard.getBoard());
    const cells = document.querySelectorAll('.cell');
    GameBoard.getBoard().forEach((content, index) => {  
      cells[index].textContent = content !== null? content : '';
    });
  }

  return { initializeBoard, updateBoard }
})();


Display.initializeBoard();