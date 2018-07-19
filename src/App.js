import React, { Component } from 'react';
import web3 from './web3'; 
import lottery from './lottery';

class App extends Component {

  state = {
    manager: '',
    players: [],
    balance: '',
    value: '',
    message: '',
    errorMessage: ''
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

    this.setState({ errorMessage: '' });

    this.setState({ message : 'Waiting on transaction success...' });

    try {
      const accounts = await web3.eth.getAccounts();

      if (this.state.value >= 0.01) {
        await lottery.methods.enter().send({ 
          from: accounts[0],
          value: web3.utils.toWei(this.state.value, 'ether')
        });
      } else {
        this.setState({ errorMessage: "Minimum bet amount must be greater than or equal to 0.01 ether" });
      }     
    } catch(err) {
      this.setState({ errorMessage: err.message });
    }

    if (this.state.errorMessage === '') {
      this.setState({ message: 'You have been entered to the game!' });

      const players = await lottery.methods.getPlayers().call();
      const balance = await web3.eth.getBalance(lottery.options.address);

      this.setState({ players, balance });
    } 
  };

  onClick = async () => {

    this.setState({ errorMessage: '' });

    this.setState({ message: "Waiting on transaction success..." });
    console.log('message: ', this.state.message);

    try {
      const accounts = await web3.eth.getAccounts();
      if (this.state.manager === accounts[0]) {
        await lottery.methods.pickWinner().send({
          from: accounts[0]
        });
      } else {
        this.setState({ errorMessage: "Your are not the contract Manager! Only the contract owner is allowed to close the current game and pick a winner" });
      }
    } catch(err) {
      this.setState({ errorMessage: err.message });
    }

    if (this.state.errorMessage === '') {
      this.setState({ message: 'A winner has been picked!' });

      const players = await lottery.methods.getPlayers().call();
      const balance = await web3.eth.getBalance(lottery.options.address);

      this.setState({ players, balance });
    } 
  };

  render() {
    //console.log(web3.version);
    //web3.eth.getAccounts().then(console.log);
    return (
      <div className="container">
        <div className="jumbotron text-center">
          <h1>Blockchain Lottery</h1>
          <h4>on Ethereum testnet (Rinkeby) - please enable MetaMask</h4>
          {/*}<h4>{lottery.options.address}</h4>{*/}
          <h3>This contract is managed by</h3>
          <h4>{this.state.manager}</h4>
        </div>

        <div className="alert alert-info" role="alert">There are currently {this.state.players.length} people entered, competing to win {web3.utils.fromWei(this.state.balance, 'ether')} ether!</div>
        
        <hr />

        <div>
          <h4>Want to try your luck?</h4>
          <p className="alert alert-warning" role="alert">Minimum bet amount is 0.01 Ether</p>
        </div>
        
        <form onSubmit={this.onSubmit} className="form-inline">
          <div className="form-group">
            <label>Amount of ether to enter</label>
              <input
                value = { this.state.value }
                onChange = { event => this.setState({ value: event.target.value })} 
              />
            {` Ether `}
            <button type="submit" className="btn btn-primary">Enter</button>
          </div>
        </form>

        <hr />

       {/*} <p className="alert alert-danger" role="alert">Only contract owner is allowed to close the current game and pick a winner</p> {*/}
        <button onClick={this.onClick} className="btn btn-success">Pick a winner!</button>

        <hr />
    
        { this.state.errorMessage!=='' ? <p className="alert alert-danger" role="alert">{this.state.errorMessage}</p> : null }
        { (this.state.errorMessage==='' && this.state.message !=='' ) ? <p className="alert alert-warning" role="alert">{this.state.message}</p> : null }
      </div>
    );
  }
}

export default App;
