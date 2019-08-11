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
        var klass = "marble_on";
        if (!this.props.hasMarble) {
            klass = "marble_off";
        }

        if (this.props.isSelected) {
          klass = klass + " selected";
        }

        return (
            <div className={klass} onClick={this.clickHandler}></div>
        );
    }
}

class Board extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedTile: null,
      count: 2,
      hasMarbles: [true, true, false]
    };

    this.clickHandler = this.clickHandler.bind(this);
  }

  clickHandler(x, y) {
    var hasMarble = this.state.hasMarbles[y - 1];
    
    if (!hasMarble) {
      console.log("Tile has no marble");
    } else {
      this.setState({selectedTile: {x: x, y: y}});
    }
  }

  isSelected(selectedTile, x, y) {
    return selectedTile && selectedTile.y == y;
  }

  createBoard(hasMarble, x, y) {
    console.log(this);
    this.tiles = [];
    for (var i = 1; i <= 3; i++) {
      this.tiles.push(<Tile isSelected={this.isSelected(this.state.selectedTile, 1, i)} hasMarble={this.state.hasMarbles[i - 1]} notifyClick={this.clickHandler} x={1} y={i}></Tile>)
    }

    return this.tiles;
  }

  render() {
    return (
      <div>
      {this.createBoard()}
      </div>
    );
  }
}

const domContainer = document.querySelector('#app');
ReactDOM.render(e(Board), domContainer);
