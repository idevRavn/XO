const GameBoard = (() => {
  let board = Array(9).fill("");

  const getBoard = () => board;

  const resetBoard = () => {
    board = Array(9).fill("");
  };

  const setSign = (index, sign) => {
    if (board[index] === "") {
      board[index] = sign;
      return true;
    }
    return false;
  };

  return { getBoard, resetBoard, setSign };
})();

const Players = (name, sign) => {
  return { name, sign };
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

  const startGame = (player1, player2) => {
    gameState = true;
    currentPlayerIndex = 0;
    players = [
      Players(player1.name, player1.sign),
      Players(player2.name, player2.sign),
    ];
    GameBoard.resetBoard();
    DisplayController.updateGameBoard();
    DisplayController.updatePlayerInfo(players);
    currentPlayerText.textContent = `${players[currentPlayerIndex].name}'s Turn`;
  };

  const playerTurn = (index) => {
    if (!gameState) return;
    GameBoard.setSign(index, players[currentPlayerIndex].sign);
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
          GameBoard.getBoard()[index] === players[currentPlayerIndex].sign
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

  const resetGame = (player1Name) => {
    GameBoard.resetBoard();
    DisplayController.updateGameBoard();
    currentPlayerText.textContent = `${player1Name}'s Turn`;
    GameController.startGame();
  };

  const restartGame = () => {
    GameBoard.resetBoard();
    DisplayController.updateGameBoard();
    const gameboardScreenStyle = document.querySelector(".gameboardScreen");
    document.querySelector(".formScreen").style.display = "flex";
    gameboardScreenStyle.style.display = "none";
  };

  return { startGame, playerTurn, resetGame, restartGame };
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
        {
          name: player1Name,
          sign: player1Sign,
        },
        {
          name: player2Name,
          sign: player2Sign,
        }
      );

      const gameboardScreenStyle = document.querySelector(".gameboardScreen");
      document.querySelector(".formScreen").style.display = "none";
      gameboardScreenStyle.style.display = "flex";
      gameboardScreenStyle.style.flexDirection = "column";
      gameboardScreenStyle.style.alignItems = "center";
      gameboardScreenStyle.style.justifyContent = "space-between";
      gameboardScreenStyle.style.width = "100%";

      if (player1Sign === "X" && player2Sign === "O") {
        document.querySelector(".player-1-sign").classList.add("x-sign");
        document.querySelector(".player-2-sign").classList.add("o-sign");
      } else {
        document.querySelector(".player-1-sign").classList.add("o-sign");
        document.querySelector(".player-2-sign").classList.add("x-sign");
      }

      const resetButton = document.querySelector(".reset");
      resetButton.addEventListener("click", () => {
        GameController.resetGame(player1Name === "" ? "Player 1" : player1Name);
      });
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
      cell.classList.remove("x-sign", "o-sign");
      cell.textContent = board[index];
      if (board[index] === "X") {
        cell.classList.add("x-sign");
      } else {
        cell.classList.add("o-sign");
      }
    });
  };

  const updatePlayerInfo = (players) => {
    if (players[0].name === "") players[0].name = "Player 1";
    if (players[1].name === "") players[1].name = "Player 2";
    document.querySelector(".player-1-name").textContent = players[0].name;
    document.querySelector(".player-1-sign").textContent = players[0].sign;
    document.querySelector(".player-2-name").textContent = players[1].name;
    document.querySelector(".player-2-sign").textContent = players[1].sign;
  };

  const restartButton = document.querySelector(".restart");
  restartButton.addEventListener("click", () => {
    GameController.restartGame();
  });

  return { start, updateGameBoard, updatePlayerInfo, restartButton };
})();

document.addEventListener("DOMContentLoaded", () => {
  DisplayController.start();
});
