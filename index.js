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
  const currentPlayerText = document.querySelector(".current-player");

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
    if (!gameState) return;
    GameBoard.setMarker(index, players[currentPlayerIndex].mark);
    DisplayController.updateGameBoard();
    if (checkWin()) {
      gameState = false;
      currentPlayerText.textContent = `${players[currentPlayerIndex].name} Wins!`;
      currentPlayerText.textContent += " Click to restart";
      currentPlayerText.style.color = "#a6e3a1";
      confettiEffect();
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

  const confettiEffect = () => {
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.8 },
    });
  };

  const restartGame = () => {
    GameBoard.resetBoard();
    DisplayController.updateGameBoard();
    currentPlayerText.textContent = `Player 1's Turn`;
    GameController.startGame();
  };

  return { startGame, playerTurn, restartGame };
})();

const DisplayController = (() => {
  const start = () => {
    const playerForm = document.getElementById("playerForm");
    playerForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const player1Name = document.getElementById("player1Name").value;
      const player1Sign = document.getElementById("player1Sign").value;
      const player2Name = document.getElementById("player2Name").value;
      const player2Sign = document.getElementById("player2Sign").value;

      if (player1Sign === player2Sign) {
        alert("Players must choose different signs.");
        return;
      }

      GameController.startGame(
        { name: player1Name, sign: player1Sign },
        { name: player2Name, sign: player2Sign }
      );

      const gameboardScreenStyle = document.querySelector(".gameboardScreen");
      document.querySelector(".formScreen").style.display = "none";
      gameboardScreenStyle.style.display = "flex";
      gameboardScreenStyle.style.flexDirection = "column";
      gameboardScreenStyle.style.alignItems = "center";
      gameboardScreenStyle.style.justifyContent = "space-between";
      gameboardScreenStyle.style.width = "100%";
    });
  };

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

  const resetButton = document.querySelector(".reset");
  resetButton.addEventListener("click", () => {
    GameController.restartGame();
  });

  return { start, updateGameBoard };
})();

document.addEventListener("DOMContentLoaded", () => {
  DisplayController.start();
});
