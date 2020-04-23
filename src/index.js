import "./styles.css";
import m from "mithril";

function Board({ attrs }) {
  let game = makeBoard();

  function makeBoard() {
    let board = new Array(7);
    for (let i = 0; i < board.length; i++) {
      board[i] = [];
      for (let j = 0; j < 6; j++) {
        board[i].push(0);
      }
    }
    return {
      board,
      gameStarted: false,
      player1: true,
      count: 0,
      gameOver: false,
      playerWin: 0
    };
  }

  const checkWin = () => {
    let b = game.board;
    let t;
    for (let i = 0; i < 4; i++) {
      for (let j = 5; j >= 0; j--) {
        t = b[i][j] + b[i + 1][j] + b[i + 2][j] + b[i + 3][j];
        if (t === 4 || t === 20) return true;
      }
    }
    for (let j = 0; j < 3; j++) {
      for (let i = 0; i < 7; i++) {
        t = b[i][j] + b[i][j + 1] + b[i][j + 2] + b[i][j + 3];
        if (t === 4 || t === 20) return true;
      }
    }
    for (let j = 5; j > 1; j--) {
      for (let i = 0; i < 4; i++) {
        t = b[i][j] + b[i + 1][j - 1] + b[i + 2][j - 2] + b[i + 3][j - 3];
        if (t === 4 || t === 20) return true;
        t = b[6 - i][j] + b[5 - i][j - 1] + b[4 - i][j - 2] + b[3 - i][j - 3];
        if (t === 4 || t === 20) return true;
      }
    }
    return false;
  };

  const colClick = n => {
    if (game.gameStarted && !game.gameOver) {
      for (let i = game.board[n].length - 1; i >= 0; i--) {
        if (game.board[n][i] === 0) {
          game.board[n][i] = game.player1 ? 1 : 5;
          game.count++;
          if (checkWin()) {
            game.gameOver = true;
            game.playerWin = game.player1 ? 1 : 2;
          } else {
            if (game.count === 42) {
              game.gameOver = true;
            }
            game.player1 = !game.player1;
          }
          break;
        }
      }
      checkWin();
    }
  };

  function startGame() {
    return (game.gameStarted = true);
  }

  const restartGame = () => {
    game = makeBoard();
    game.gameStarted = true;
  };

  const playerColor = n =>
    ({ 0: "", 1: " player1Color", 5: " player2Color" }[n]);

  const circleClass = () =>
    ({ true: " player1Color", false: " player2Color" }[game.player1]);

  function view({ attrs }) {
    return (
      <div class="App">
        <div id="board">
          <div class="board-container">
            <div />
            <div class="board-title-area">
              <div />
              <div class="board-position">
                <div class={"board-circle top-circle" + circleClass()}>GO</div>
              </div>
              <div id="board-info">CONNECT 4</div>
            </div>
            <div />
            <div class="board-game-area">
              <div />
              {[0, 1, 2, 3, 4, 5, 6].map(i => (
                <div class="board-column" key={i} onclick={() => colClick(i)}>
                  <div class="board-column-container">
                    {[0, 1, 2, 3, 4, 5].map(j => (
                      <div class="board-position" key={j}>
                        <div
                          class={"board-circle" + playerColor(game.board[i][j])}
                        >
                          {""}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div />
            </div>
          </div>
        </div>
        {!game.gameStarted ? (
          <div class="board-message-container" onclick={startGame}>
            <div class="board-message">START</div>
          </div>
        ) : (
          ""
        )}
        {game.gameOver ? (
          <div class="board-message-container" onclick={restartGame}>
            <div class="board-message">
              {game.player1
                ? game.playerWin === 0
                  ? "NOBODY"
                  : "RED"
                : game.playerWin === 0
                ? "NOBODY"
                : "YELLOW"}
              <br />
              WINS
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
  return { view };
}

m.mount(document.body, Board);
