import React from 'react';
import Chance from 'chance';

class Detail extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            name: chance.first()
        }
    }

    buttonClicked(){
        const newState = {
            name: chance.first()
        };

        this.setState(newState);
    }

    render() {
        return <div>
            <p>{this.props.message}</p>
            <p>The name of the reload is: {this.state.name}</p>
            <button onClick={this.buttonClicked.bind(this)}>click me</button>
        </div>
    }
}

export default Detail;