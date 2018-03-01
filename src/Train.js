import React, { Component } from 'react';
import $ from 'jquery'; 

import './Train.css';

class Train extends Component {
  constructor(props) {
    super(props);

    this.tick = this.tick.bind(this);
    this.pollTrainTimes = this.pollTrainTimes.bind(this);

    this.state = {
      trains: false,
      secondsElapsed: 30
    };
    
  }

  tick(){
    this.setState({secondsElapsed: this.state.secondsElapsed - 1});
    
    if(this.state.secondsElapsed === 1) {
      window.location.reload();
      this.pollTrainTimes();
    }
  }

  pollTrainTimes() {
    const params = {
      "api_key": `${process.env.REACT_APP_API_KEY}`,
      // Request parameters
    };

    // Red Line -- Gallery Pl-Chinatown (B01)
    // Green/Yellow Line -- Gallery Pl-Chinatown (F01)

    $.ajax({
      url: "https://api.wmata.com/StationPrediction.svc/json/GetPrediction/B01?" + $.param(params),
      type: "GET",
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({trains: data.Trains});
      }.bind(this),
      error: function(xhr, status, err) {
        console.log(this.props.url, status, err.toString());
        // console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  }

  componentDidMount() {
    this.interval = setInterval(this.tick, 1000);
    this.pollTrainTimes();

    // console.log()
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    if (this.state.trains) {
      const trains = this.state.trains;
      var trainsList = trains.map(function(train, i){
      return (<tr key={i}>
                <td>{train.Line}</td>
                <td>{train.Car}</td>
                <td>{train.DestinationName}</td>
                <td>{train.Min}</td>                
          </tr>);
      });
    }

    return (
      <div className="Train">
        <header className="Train-header">
          <h1 className="Train-title">Train Times</h1>
        </header>
        <table className="train-table">
          <thead>
            <tr>
              <th>Line</th>
              <th>Car</th> 
              <th>Destination</th>
              <th>Min</th>
            </tr>
          </thead>
          <tbody>
            {trainsList}
          </tbody>
        </table>
        <br/>
        <div>Seconds Until Reload: {this.state.secondsElapsed}</div>
      </div>
    );
  }
}

export default Train;
