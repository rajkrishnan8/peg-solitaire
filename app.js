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
      var klass = "marble_on";
      if (!this.props.hasMarble) {
        klass = "marble_off";
      }

      if (this.props.isSelected) {
        klass = klass + " selected";
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

    _this2.state = {
      selectedTile: null,
      count: 2,
      hasMarbles: [true, true, false]
    };

    _this2.clickHandler = _this2.clickHandler.bind(_this2);
    return _this2;
  }

  _createClass(Board, [{
    key: "clickHandler",
    value: function clickHandler(x, y) {
      var hasMarble = this.state.hasMarbles[y - 1];

      if (!hasMarble) {
        console.log("Tile has no marble");
      } else {
        this.setState({ selectedTile: { x: x, y: y } });
      }
    }
  }, {
    key: "isSelected",
    value: function isSelected(selectedTile, x, y) {
      return selectedTile && selectedTile.y == y;
    }
  }, {
    key: "createBoard",
    value: function createBoard(hasMarble, x, y) {
      console.log(this);
      this.tiles = [];
      for (var i = 1; i <= 3; i++) {
        this.tiles.push(React.createElement(Tile, { isSelected: this.isSelected(this.state.selectedTile, 1, i), hasMarble: this.state.hasMarbles[i - 1], notifyClick: this.clickHandler, x: 1, y: i }));
      }

      return this.tiles;
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        null,
        this.createBoard()
      );
    }
  }]);

  return Board;
}(React.Component);

var domContainer = document.querySelector('#app');
ReactDOM.render(e(Board), domContainer);