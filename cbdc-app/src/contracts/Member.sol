// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

contract Member{
    address public minter;

    event MinterChanged(address indexed from, address to);

    string public Name;


    constructor(string memory _name){
      Name = _name;
      minter = msg.sender; //only initially
    }

    function passMinterRole(address dapps) public  returns (bool) {
      require(msg.sender==minter, 'Error, only owner can change pass minter role');
      minter = dapps;
      emit MinterChanged(msg.sender, dapps);
      return true;
    }
}