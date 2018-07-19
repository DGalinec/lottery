import React, { Component } from 'react';
import web3 from './web3'; 
import lottery from './lottery';

class App extends Component {

  state = {
    manager: '',
    players: [],
    balance: '',
    value: '',
    message: ''
  };

  async componentDidMount() {
    //when working with MetaMask Provider, we do not need to specify from where the 'call({ from: accounts[0] })' comes from
    //because a default account is already set, so 'call()' is enough.
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ manager, players, balance });
  }

  onSubmit = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({ message : 'Waiting on transaction success...' });

    await lottery.methods.enter().send({ 
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    });

    this.setState({ message: 'You have been entered!' });
  };

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Waiting on transaction success...' });

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    this.setState({ message: 'A winner has been picked!' });
  };

  render() {
    //console.log(web3.version);
    //web3.eth.getAccounts().then(console.log);
    return (
      <div>
        <div className="jumbotron text-center">
          <h1>Lottery Contract</h1>
          <h4>{lottery.options.address}</h4>
          <h3>This contract is managed by</h3>
          <h4>{this.state.manager}</h4>
        </div>

        <p>There are currently {this.state.players.length} people entered, competing to 
        win {web3.utils.fromWei(this.state.balance, 'ether')} ether!</p>
        
        <hr />

        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ether to enter</label>
              <input
                value = { this.state.value }
                onChange = { event => this.setState({ value: event.target.value })} 
              />
          </div>
          <button>Enter</button>
        </form>

        <hr />

        <h4>Ready to pick a winner?</h4>
        <button onClick={this.onClick}>Pick a winner!</button>

        <hr />

        <h1>{this.state.message}</h1>
      </div>
    );
  }
}

export default App;
