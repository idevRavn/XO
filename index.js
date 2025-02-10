const GameBoard = (() => {
  let board = Array(9).fill("");

  const getBoard = () => board;

  const resetBoard = () => {
    board = Array(9).fill("");
  };

  const setMarker = (index, marker) => {
    if (board[index] === "") {
      board[index] = marker;
    }
  };

  return { getBoard, resetBoard, setMarker };
})();

const Players = (name, mark) => {
  return { name, mark };
};
