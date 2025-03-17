let isGameOver = false;

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
      name: 'Player 1',
      token: 'X',
      score: 0,
    },
    {
      name: 'Player 2',
      token: 'O',
      score: 0,
    },
  ];

  let currentPlayerIndex = 0;

  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  function getCurrentPlayer() {
    return players[currentPlayerIndex];
  }

  function switchPlayer() {
    currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
    console.log(`It is now ${players[currentPlayerIndex].name}'s turn.`);
  }

  // Alternates starting player
  function toggleStartingPlayer() {
    currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
  }

  function updateScore() {
    players[currentPlayerIndex].score += 1;
  }

  function getScore() {
    return players[currentPlayerIndex].score;
  }

  function hasPossibleWinningPlays() {
    const board = GameBoard.getBoard();
    
    // Check if either player can still win
    return players.some(player => {
      const token = player.token;
      
      return winningCombinations.some(combination => {
        const [a, b, c] = combination;
        // A winning play is still possible if all cells in a combination
        // are either empty or already contain the player's token
        return (board[a] === null || board[a] === token) && 
               (board[b] === null || board[b] === token) && 
               (board[c] === null || board[c] === token);
      });
    });
  }

  function checkWinner() {
    const board = GameBoard.getBoard();
    return winningCombinations.some(combination => {
      const [a, b, c] = combination;
      return board[a] && board[a] === board[b] && board[a] === board[c];
    });
  }

  function handleWin() {
    updateScore();
    console.log(`${getCurrentPlayer().name} wins!`);

    // Use Display module to handle UI updates
    Display.showWinMessage(getCurrentPlayer().name);
    Display.updateScores(GameController.getScore());
    Display.showReplayButton(() => {
      GameBoard.createBoard();
      Display.initializeBoard();
    });

    // Update the board to show all plays
    Display.updateBoard();
  }

  function handleDraw() {
    Display.showDrawMessage();
    Display.showReplayButton(() => {
      GameBoard.createBoard();
      Display.initializeBoard();
    });
  }

  function makeMove(index) {
    if (isGameOver) return;
  
    if (GameBoard.makeMove(index, getCurrentPlayer().token)) {
      if (checkWinner()) {
        handleWin();
        isGameOver = true;
      } else if (!hasPossibleWinningPlays()) {
        handleDraw();
        isGameOver = true;
      } else {
        switchPlayer();
      }
      return true; // Return true to indicate successful move
    }
    return false; // Return false if move couldn't be made
  }

  return { 
    getCurrentPlayer,
    switchPlayer,
    toggleStartingPlayer,
    updateScore,
    getScore,
    hasPossibleWinningPlays,
    checkWinner,
    handleWin,
    makeMove };
})();


const Display = (function() {
  GameBoard.createBoard();
  const board = document.querySelector('.board');
  const leaderBoard = document.querySelector('.leaderboard');

  function handleCellClick(event) {
    const index = Array.from(board.children).indexOf(event.target);
    console.log(`Cell ${index} clicked`);
    if (GameBoard.getBoard()[index] === null) {
      GameController.makeMove(index);
      updateBoard();
      event.target.classList.add('played');
      if (!isGameOver) {
        updateCurrentPlayer();
      }
    } else {
      console.log(`Cell ${index} is already occupied`);
    }
  }

  function initializeBoard() {
    console.log('Initializing board...');
    board.innerHTML = '';
    leaderBoard.textContent = `${GameController.getCurrentPlayer().name}'s turn`;
    GameBoard.getBoard().forEach((_, index) => {
      const cellDiv = document.createElement('div');
      cellDiv.classList.add('cell');
      cellDiv.textContent = '';
      cellDiv.addEventListener('click', handleCellClick);
      board.appendChild(cellDiv);
    });
  }

  function updateBoard() {
    console.log(`GameBoard: `, GameBoard.getBoard());
    const cells = document.querySelectorAll(".cell");
    GameBoard.getBoard().forEach((content, index) => {
      cells[index].textContent = content !== null ? content : '';
    });
  }

  function updateCurrentPlayer() {
    leaderBoard.textContent = `${GameController.getCurrentPlayer().name}'s turn`;
  }

  // Announces when a player wins
  function showWinMessage(playerName) {
    console.log(`${playerName} wins!`);
    leaderBoard.textContent = `${playerName} wins!`;
    leaderBoard.style.display = 'block';
  }

  // Announces when there's a draw
  function showDrawMessage() {
    console.log(`Draw!`);
    leaderBoard.textContent = `Draw!`;
    leaderBoard.style.display = 'block';
  }
  
  // Updates the player's scores
  function updateScores(score) {
    const playerOneScore = document.querySelector('.player-one-score');
    const playerTwoScore = document.querySelector('.player-two-score');
    const currentPlayer = GameController.getCurrentPlayer().name;
    if (currentPlayer === 'Player 1') {
      playerOneScore.textContent = score;
    } else {
      playerTwoScore.textContent = score;
    }
  }

  // Displays replay button when player wins
  function showReplayButton(callback) {
    const replayBtn = document.querySelector('.replay-btn');
    replayBtn.style.display = 'block';
    replayBtn.addEventListener('click', () => {
      GameController.toggleStartingPlayer();
      callback();
      replayBtn.style.display = 'none';
      isGameOver = false;
    }, { once: true }); // Ensures the listener is added only once
  }

  function removeEventListeners() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
      cell.removeEventListener('click', handleCellClick);
    });
  }

  return { 
    initializeBoard,
    updateBoard,
    updateCurrentPlayer,
    showWinMessage,
    showDrawMessage,
    updateScores,
    showReplayButton,
    removeEventListeners
  };
})();

Display.initializeBoard();