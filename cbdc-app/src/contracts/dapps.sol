// SPDX-License-Identifier: MIT

//need to seprate the contracts due to how there is too big to be deployed
pragma solidity>=0.6.0 <0.9.0 ;

import "./Token.sol";


contract dapps {

    Token private token;

    Member[] public member;

    struct Member {
        string Name;
        string Gender;
        address Address;
    }

    Member[] members;

    constructor(Token _token){
        token = _token;
    }

    function issuance(address to, uint256 amount) public{
        token.mint(to, amount);
    }

    function redemption (uint256 amount) public {
        require(token.approve(address(this), amount),"Error can't approve amount");
        require(token.transferFrom(msg.sender, address(this), amount), "Error, can't receive tokens");
        token.burn(amount);
    }

    function transfer(address to, uint256 amount) public{
        require(token.approve(address(this), amount),"Error can't approve amount");
        require(token.transferFrom(msg.sender, to, amount), "Error, can't send tokens");
    }

    function AddMember(string memory _name, string memory _gender, address _address) public{
        members.push(Member(_name, _gender, _address));
    }   

    function MemberLength() public view returns(uint256){
        return members.length;
    }

    function ShowMembers() public view returns(Member[] memory){ 
        return members;         
    }  

    fallback() external payable {}

    receive() external payable {}


}