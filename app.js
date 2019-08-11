'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var e = React.createElement;

var Tile = function (_React$Component) {
  _inherits(Tile, _React$Component);

  function Tile(props) {
    _classCallCheck(this, Tile);

    var _this = _possibleConstructorReturn(this, (Tile.__proto__ || Object.getPrototypeOf(Tile)).call(this, props));

    _this.clickHandler = _this.clickHandler.bind(_this);
    return _this;
  }

  _createClass(Tile, [{
    key: "clickHandler",
    value: function clickHandler() {
      this.props.notifyClick(this.props.x, this.props.y);
    }
  }, {
    key: "render",
    value: function render() {
      var klass = "tile ";
      if (!this.props.hasMarble) {
        klass += "marble_off ";
      } else {
        klass += "marble_on ";
      }

      if (this.props.isSelected) {
        klass = klass + "selected ";
      }

      return React.createElement("div", { className: klass, onClick: this.clickHandler });
    }
  }]);

  return Tile;
}(React.Component);

var Board = function (_React$Component2) {
  _inherits(Board, _React$Component2);

  function Board(props) {
    _classCallCheck(this, Board);

    var _this2 = _possibleConstructorReturn(this, (Board.__proto__ || Object.getPrototypeOf(Board)).call(this, props));

    console.log("Board constructor...");

    var hasMarbles = [];
    var count = 0;
    var width = _this2.props.width,
        height = _this2.props.height,
        corner = _this2.props.corner;
    for (var y = 0; y < _this2.props.height; y++) {
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

    _this2.state = {
      selectedTile: null,
      count: count,
      hasMarbles: hasMarbles
    };

    _this2.clickHandler = _this2.clickHandler.bind(_this2);
    return _this2;
  }

  _createClass(Board, [{
    key: "clickHandler",
    value: function clickHandler(x, y) {
      console.log("x: " + x + ", y: " + y);
      var hasMarble = this.state.hasMarbles[y][x];

      if (!hasMarble && this.state.selectedTile) {
        // evaluate if a marble can be removed
        var isValidMove = false;
        var selectedTile = this.state.selectedTile;
        if (selectedTile.x === x) {
          if (selectedTile.y === y + 2 || selectedTile.y === y - 2) {
            if (this.state.hasMarbles[(selectedTile.y + y) / 2][x]) {
              isValidMove = true;
            }
          }
        } else if (selectedTile.y === y) {
          if (selectedTile.x === x + 2 || selectedTile.x === x - 2) {
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
          });
        }
      } else if (this.state.selectedTile && this.state.selectedTile.x === x && this.state.selectedTile.y === y) {
        this.setState({ selectedTile: null });
      } else {
        this.setState({ selectedTile: { x: x, y: y } });
      }
    }
  }, {
    key: "isSelected",
    value: function isSelected(selectedTile, x, y) {
      return selectedTile && selectedTile.x === x && selectedTile.y === y;
    }
  }, {
    key: "createBoard",
    value: function createBoard(hasMarbles, width, height) {
      var board = [];
      for (var y = 0; y < height; y++) {
        board.push(React.createElement(
          "div",
          null,
          this.createRow(hasMarbles[y], width, y)
        ));
      }
      return board;
    }
  }, {
    key: "createRow",
    value: function createRow(hasMarblesRow, width, y) {
      var row = [];
      for (var x = 0; x < width; x++) {
        var isSelected = this.isSelected(this.state.selectedTile, x, y);
        var hasMarble = hasMarblesRow[x];
        if (hasMarble === null) {
          row.push(React.createElement("div", { className: "tile" }));
        } else {
          row.push(React.createElement(Tile, { isSelected: isSelected, hasMarble: hasMarble, notifyClick: this.clickHandler, x: x, y: y }));
        }
      }

      return row;
    }
  }, {
    key: "isGameOver",
    value: function isGameOver(hasMarbles) {
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
  }, {
    key: "createWinLoss",
    value: function createWinLoss(hasMarbles, count) {
      if (this.isGameOver(hasMarbles)) {
        if (this.state.count === 1) {
          return React.createElement(
            "div",
            { "class": "message won" },
            "\"YOU WON!!!!\""
          );
        } else {
          return React.createElement(
            "div",
            { "class": "message lost" },
            "\"YOU LOST!!!!\""
          );
        }
      }
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        null,
        this.createBoard(this.state.hasMarbles, this.props.width, this.props.height),
        this.createWinLoss(this.state.hasMarbles, this.state.count)
      );
    }
  }]);

  return Board;
}(React.Component);

var domContainer = document.querySelector('#app');
ReactDOM.render(React.createElement(Board, { width: 7, height: 7, corner: 2 }), domContainer);