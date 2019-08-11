import React from 'react';

class Tile extends React.Component {
    constructor(props) {
        super(props);

        this.state= {
            hasMarble: props.hasMarble
        };
    }

    render() {
        var klass = "marble_on";
        if (!this.state.hasMarble) {
            klass = "marble_off";
        }
        return (
            <div className={klass}></div>
        );
    }
}