pragma solidity ^0.4.17;

contract Lottery {
    
    address public manager;
    address[] public players;
    uint public indexWinner;
    
    constructor() public {
        manager = msg.sender;
    }
    
    function enter() public payable {
        require(msg.value >= 0.01 ether);
        players.push(msg.sender);
    }
    
    function random() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.difficulty, now, players)));
    }
    
    function pickWinner() public restricted {
        indexWinner = random() % players.length;
        players[indexWinner].transfer(address(this).balance);
        
        //empty the list of players before to start a new game
        players = new address[](0);
    }
    
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
    
    function getPlayers() public view returns (address[]) {
        return players;
    }
}