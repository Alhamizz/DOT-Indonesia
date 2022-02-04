// SPDX-License-Identifier: MIT

//need to seprate the contracts due to how there is too big to be deployed
pragma solidity>=0.6.0 <0.9.0 ;

import "./Token.sol";


contract dapps {

    Token private token;
    address private CB;

    Member[] public member;
    Track[] public track;

    struct Member {
        string Name;
        string Gender;
        address Address;
    }

    struct Track {
        address Source;
        address To;
        string Amount;
    }

    Member[] members;
    Track[] tracks;

    constructor(Token _token){
        token = _token;
        CB = msg.sender;
    }

    function issuance(address to, uint256 amount) public{
        require(msg.sender==CB, 'Error, msg.sender does not have central bank role');
        token.mint(to, amount);
    }

    function redemption (uint256 amount) public {
        require(msg.sender==CB, 'Error, msg.sender does not have central bank role');
        require(token.approve(address(this), amount),"Error can't approve amount");
        require(token.transferFrom(msg.sender, address(this), amount), "Error, can't receive tokens");
        token.burn(amount);
    }

    function transfer(address to, uint256 amount) public{
        require(token.approve(address(this), amount),"Error can't approve amount");
        require(token.transferFrom(msg.sender, to, amount), "Error, can't send tokens");
    }

    function AddMember(string memory _name, string memory _gender, address _address) public{
        require(msg.sender==CB, 'Error, msg.sender does not have central bank role');
        members.push(Member(_name, _gender, _address));
    }   

    function MemberLength() public view returns(uint256){
        return members.length;
    }

   /* function ShowMembers(string[] memory Name, string[] memory Gender, address[] memory Address) view public {  
        for(uint i=0; i < 3; i++){
                Name[i] = member[i].Name;
                Gender[i] = member[i].Gender;
                Address[i] = member[i].Address;      
        }     
    }*/  

    function ShowMembers() public view returns(Member[] memory){ 
        return members;         
    }  

    function AddTrack(address _source, address _to, string memory _amount2) public{
        tracks.push(Track(_source, _to, _amount2));
    }  

    function TrackLength() public view returns(uint256){
        return tracks.length;
    }

    /*function Tracking(address[] memory Source, address[] memory To, string[] memory Amount) view public{

        for(uint i=0; i < tracks.length; i++){
            Source[i] = track[i].Source;
            To[i] = track[i].To;
            Amount[i] = track[i].Amount;
        }            
    }*/

    function Tracking() public view returns(Track[] memory){ 
        return tracks;         
    }  

    function passCentralBankRole(address newCB) public{
        require(msg.sender==CB, 'Error, msg.sender does not have central bank role');
        CB = newCB;
    }

    function ShowCentralBankRole() public view returns(address){ 
        return CB;         
    }  

    fallback() external payable {}

    receive() external payable {}


}