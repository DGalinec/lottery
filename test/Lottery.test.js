const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const provider = ganache.provider();
const web3 = new Web3(provider);

const { interface, bytecode } = require('../Ethereum/compile');

let accounts;
let lottery;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    lottery = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode, arguments: [] })
        .send({ from: accounts[0], gas: '1000000' });

    lottery.setProvider(provider);
});

describe('Lottery contract', () => {
    it('contract is deployed on the network', () => {
        assert.ok(lottery.options.address);
    });
    it('manager address is setup to accounts[0]', async () => {
        const manager = await lottery.methods.manager().call();
        assert.equal(manager, accounts[0]);
    });
    it('new player enters game function works properly', async () => {
        await lottery.methods.enter().send({ from: accounts[0], value: web3.utils.toWei('0.01', 'ether') });
        const players = await lottery.methods.getPlayers().call();
        assert.equal(accounts[0], players[0]);
        assert.equal(1, players.length);
    });
    it('5 players entered the game', async () => {
        await lottery.methods.enter().send({ from: accounts[1], value: web3.utils.toWei('0.01', 'ether') });
        await lottery.methods.enter().send({ from: accounts[2], value: web3.utils.toWei('0.01', 'ether') });
        await lottery.methods.enter().send({ from: accounts[3], value: web3.utils.toWei('0.01', 'ether') });
        await lottery.methods.enter().send({ from: accounts[4], value: web3.utils.toWei('0.01', 'ether') });
        await lottery.methods.enter().send({ from: accounts[5], value: web3.utils.toWei('0.01', 'ether') });
        const players = await lottery.methods.getPlayers().call();
        assert.equal(accounts[1], players[0]);
        assert.equal(accounts[2], players[1]);
        assert.equal(accounts[3], players[2]);
        assert.equal(accounts[4], players[3]);
        assert.equal(accounts[5], players[4]);
        assert.equal(5, players.length);
    });
    it('it is required a minimum payment of 0.01 ether to enter the game', async () => {
        try {
            await lottery.methods.enter().send({ from: accounts[0], value: web3.utils.toWei('0.001', 'ether') });
            assert(false);
        } catch (err) {
            assert(err);
        }        
    });
    it('only the contract creator can call the pickWinner() function', async () => {
        try {
            await lottery.methods.pickWinner().send({ from: accounts[1] });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });
    it('finds a winner, sends money to the winner, resets the players array and contrat balance is at zero', async () => {
        await lottery.methods.enter().send({ from: accounts[0], value: web3.utils.toWei('2', 'ether') });

        const initialBalance = await web3.eth.getBalance(accounts[0]);

        await lottery.methods.pickWinner().send({ from: accounts[0] });

        const finalBalance = await web3.eth.getBalance(accounts[0]);
        const difference = finalBalance - initialBalance;
        assert(difference > web3.utils.toWei('1.8', 'ether'));

        const players = await lottery.methods.getPlayers().call();
        assert.equal(0, players.length);

        const contractBalance = await web3.eth.getBalance(lottery.options.address);
        assert.equal(0, contractBalance);
    });
});