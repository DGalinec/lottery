This project is a Lottery game with all the logic being stored into a smart contract written in Solidity programming language and running on the Ethereum testnet (Rinkeby network). Minimum amount to enter the game is 0.01 ether. When lottery is over, the contract will randomly pick up a winner and send to his Ethereum testnet address the amount of all bets.

## Lottery contract

- The contract [Lottery.sol](https://github.com/DGalinec/lottery/blob/master/Ethereum/contracts/Lottery.sol) is written in the Solidity programming language.

- The contract has been pre-compiled and pre-tested on the [Remix](http://remix.ethereum.org/#optimize=false&version=soljson-v0.4.24+commit.e67f0147.js) Solidity IDE.

- The contract is compiled using the [solc](https://github.com/ethereum/solc-js) Solidity compiler. The script is called [compile.js](https://github.com/DGalinec/lottery/blob/master/Ethereum/compile.js).

- The [Mocha](https://mochajs.org/) JavaScript test framework paired with the [Ganache](https://github.com/trufflesuite/ganache) personnal blockchain for Ethereum development were used to test the behaviour of the different contract functions on the blockchain. The JavaScript file containing the different tests is named [Lottery.test.js](https://github.com/DGalinec/lottery/blob/master/test/Lottery.test.js).

- The contract was deployed on the [Rinkeby](https://www.rinkeby.io/#stats) network (Ethereum testnet at address [0x9e609C592970774d3a89633fF6f6Ec26Bf9Fc742](https://rinkeby.etherscan.io/address/0x9e609C592970774d3a89633fF6f6Ec26Bf9Fc742) using [truffle hdwallet provider](https://github.com/trufflesuite/truffle-hdwallet-provider).

## User interface

- This project is was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

- JavaScript source code of the user interface with calls to the Ethreum blockchain is in [App.js](https://github.com/DGalinec/lottery/blob/master/src/App.js) file.

- Interface between the user interface and the contract running on the Ethereum blockchain is [lottery.js](https://github.com/DGalinec/lottery/blob/master/src/lottery.js) file. It contains the JSON Application Binary Interface (ABI) and contract address on the Rinkeby network.

- Contract requires [MetaMask](https://metamask.io/) plugin to be installed in your Chrome or FireFox browser and be settled on the Rinkeby network in order to pay for transactions.

- To run the user interface type `~/$ npm run start`. Application will start on `localhost: 3000` in your browser. 

## Folder structure

After cloning files and running `~/$ npm install` in your working directory, your project should look like this:

```
lottery/
  Ethereum/
    compile.js
    contracts/
      Lottery.sol
    deploy.js
  node_modules/
  package.json
  public/
    favicon.ico
    index.html
    manifest.json
  README.md
  src/
    App.js
    App.test.js
    index.css
    index.js
    lottery.js
    registerServiceWorker.js
    web3.js
  test/
    Lottery.test.js
```