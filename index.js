const GameBoard = (() => {
  let board = Array(9).fill("");

  const getBoard = () => board;

  const resetBoard = () => {
    board = Array(9).fill("");
  };

  const setMarker = (index, marker) => {
    if (board[index] === "") {
      board[index] = marker;
      return true;
    }
    return false;
  };

  return { getBoard, resetBoard, setMarker };
})();

const Players = (name, mark) => {
  return { name, mark };
};

const GameController = (() => {
  let gameState = false;
  let players = [];
  let currentPlayerIndex = 0;

  const winningCombos = [
    [0, 1, 2], // Horizontal
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], // Vertical
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], // Diagonal
    [2, 4, 6],
  ];

  const startGame = () => {
    gameState = true;
    currentPlayerIndex = 0;
    players = [Players("Player 1", "X"), Players("Player 2", "O")];
    GameBoard.resetBoard();
    DisplayController.updateGameBoard();
  };

  const playerTurn = (index) => {
    const currentPlayerText = document.querySelector(".current-player");
    if (!gameState) return;
    GameBoard.setMarker(index, players[currentPlayerIndex].mark);
    DisplayController.updateGameBoard();
    if (checkWin()) {
      gameState = false;
      currentPlayerText.textContent = `${players[currentPlayerIndex].name} Wins!`;
      currentPlayerText.textContent += " Click to restart";
      return;
    }
    currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
    currentPlayerText.textContent = `${players[currentPlayerIndex].name}'s Turn`;
  };

  const checkWin = () => {
    return winningCombos.some((combo) => {
      return combo.every(
        (index) =>
          GameBoard.getBoard()[index] === players[currentPlayerIndex].mark
      );
    });
  };

  return { startGame, playerTurn };
})();

const DisplayController = (() => {
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell, index) => {
    cell.addEventListener("click", () => {
      GameController.playerTurn(index);
    });
  });
  const updateGameBoard = () => {
    const board = GameBoard.getBoard();
    cells.forEach((cell, index) => {
      cell.classList.remove("x-mark", "o-mark");
      cell.textContent = board[index];
      if (board[index] === "X") {
        cell.classList.add("x-mark");
      } else {
        cell.classList.add("o-mark");
      }
    });
  };

  return { updateGameBoard };
})();

GameController.startGame();
