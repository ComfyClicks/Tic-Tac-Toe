const GameBoard = (function() {
  let board;

  function initializeBoard() {
    board = Array(9).fill(null);
    console.log(board);
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
  
  return { initializeBoard, getBoard, makeMove }
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
  console.log(GameBoard.initializeBoard());

  function getCurrentPlayer() {
    return players[currentPlayerIndex];
  }

  function switchPlayer() {
    currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
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
    gameBoard.initializeBoard();
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
  const board = document.querySelector('board');

  GameBoard.getBoard().forEach((content, index) => {
    const cellDiv = document.createElement('div');
    cellDiv.classlist = "cell";
    cellDiv.textContent = content;
    cellDiv.addEventListener('click', () => {
      GameBoard.makeMove(index, GameController.getCurrentPlayer().token);
    })
  })

})();
