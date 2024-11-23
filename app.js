function GameBoard() {
  let board;

  function initializeBoard() {
    board = Array(9).fill(null);
  }

  function getBoard() {
    return board;
  }

  
}


function GameController() {
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

  function updateScore() {
    players[currentPlayerIndex].score += 1;
  }

  function getScore() {
    return players[currentPlayerIndex].score;
  }

  function switchPlayer() {
    currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
  }

  function getBoardState() {

  }

  return { switchPlayer, getCurrentPlayer, updateScore };

}

