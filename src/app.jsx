'use strict';

const e = React.createElement;

class Tile extends React.Component {
  constructor(props) {
    super(props);
    this.clickHandler = this.clickHandler.bind(this);
  }

  clickHandler() {
    this.props.notifyClick(this.props.x, this.props.y);
  }

  render() {
    var klass = "tile ";
    if (!this.props.hasMarble) {
      klass += "marble_off ";
    } else {
      klass += "marble_on ";
    }

    if (this.props.isSelected) {
      klass = klass + "selected ";
    }

    return (
      <div className={klass} onClick={this.clickHandler}></div>
    );
  }
}

class Board extends React.Component {
  constructor(props) {
    super(props);

    console.log("Board constructor...");

    var hasMarbles = [];
    var count = 0;
    var width = this.props.width,
        height = this.props.height,
        corner = this.props.corner;
    for (var y = 0; y < this.props.height; y++) {
      var hasMarblesRow = [];
      hasMarbles.push(hasMarblesRow);
      for (var x = 0; x < width; x++) {
        if (x === (height - 1) / 2 && y === (width - 1) / 2) {
          hasMarblesRow.push(false);
        } else if ((x < corner || x >= width - 2) && (y < corner || y >= height - 2)) {
          hasMarblesRow.push(null);
        } else {
          hasMarblesRow.push(true);
          count++;
        }
      }
    }

    this.state = {
      selectedTile: null,
      count: count,
      hasMarbles: hasMarbles
    };

    this.clickHandler = this.clickHandler.bind(this);
  }

  clickHandler(x, y) {
    console.log(`x: ${x}, y: ${y}`);
    var hasMarble = this.state.hasMarbles[y][x];

    if (!hasMarble && this.state.selectedTile) {
      // evaluate if a marble can be removed
      var isValidMove = false;
      var selectedTile = this.state.selectedTile;
      if (selectedTile.x === x) {
        if (selectedTile.y === (y + 2) || selectedTile.y === (y - 2)) {
          if (this.state.hasMarbles[(selectedTile.y + y) / 2][x]) {
            isValidMove = true;
          }
        }
      } else if (selectedTile.y === y) {
        if (selectedTile.x === (x + 2) || selectedTile.x === (x - 2)) {
          if (this.state.hasMarbles[y][(selectedTile.x + x) / 2]) {
            isValidMove = true;
          }
        }
      }

      if (isValidMove) {
        var midTile = {
          x: (selectedTile.x + x) / 2,
          y: (selectedTile.y + y) / 2
        };

        var hasMarbles = this.state.hasMarbles;
        hasMarbles[y][x] = true;
        hasMarbles[midTile.y][midTile.x] = false;
        hasMarbles[selectedTile.y][selectedTile.x] = false;
        this.setState({
          count: this.state.count - 1,
          hasMarbles: hasMarbles,
          selectedTile: null
        })
      }
    } else if (this.state.selectedTile && this.state.selectedTile.x === x && this.state.selectedTile.y === y) {
      this.setState({ selectedTile: null });
    } else {
      this.setState({ selectedTile: { x: x, y: y } });
    }
  }

  isSelected(selectedTile, x, y) {
    return selectedTile && selectedTile.x === x && selectedTile.y === y;
  }

  createBoard(hasMarbles, width, height) {
    var board = [];
    for (var y = 0; y < height; y++) {
      board.push((
        <div>
          {this.createRow(hasMarbles[y], width, y)}
        </div>
      ));
    }
    return board;
  }

  createRow(hasMarblesRow, width, y) {
    var row = [];
    for (var x = 0; x < width; x++) {
      var isSelected = this.isSelected(this.state.selectedTile, x, y);
      var hasMarble = hasMarblesRow[x];
      if (hasMarble === null) {
        row.push(<div className="tile"></div>)
      } else {
        row.push(<Tile isSelected={isSelected} hasMarble={hasMarble} notifyClick={this.clickHandler} x={x} y={y}></Tile>)
      }
    }

    return row;
  }

  isGameOver(hasMarbles) {
    var height = hasMarbles.length,
      width = hasMarbles[0].length;

    function validMove(x, y, xDir, yDir) {
      var hopX = x + 2 * xDir;
      var hopY = y + 2 * yDir;
      if (hopX < 0 || hopX >= width || hopY < 0 || hopY >= height) {
        return false;
      }
      return hasMarbles[y + yDir][x + xDir] && hasMarbles[y + 2 * yDir][x + 2 * xDir];
    }

    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        if (hasMarbles[y][x] === false) {
          if (validMove(x, y, -1, 0) || validMove(x, y, 1, 0) || validMove(x, y, 0, -1) || validMove(x, y, 0, 1)) {
            return false;
          }
        }
      }
    }

    return true;
  }



  createWinLoss(hasMarbles, count) {
    if (this.isGameOver(hasMarbles)) {
      if (this.state.count === 1) {
        return (
          <div class="message won">
            "YOU WON!!!!"
          </div>
        )
      } else {
        return (
          <div class="message lost">
            "YOU LOST!!!!"
          </div>
        )
      }
    }
  }

  render() {
    return (
      <div>
        {this.createBoard(this.state.hasMarbles, this.props.width, this.props.height)}
        {this.createWinLoss(this.state.hasMarbles, this.state.count)}
      </div>
    );
  }
}

const domContainer = document.querySelector('#app');
ReactDOM.render(<Board width={7} height={7} corner={2} />, domContainer);
