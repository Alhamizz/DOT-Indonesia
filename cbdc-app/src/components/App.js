import logo from './logo.svg';
import { Tabs, Tab } from 'react-bootstrap'
import Token from '../abis/Token.json'
import dapps from '../abis/dapps.json'
import React, { Component } from 'react';
import Web3 from 'web3';

import './App.css';
import './App.css';

class App extends Component {

  async componentWillMount() {
    await this.loadBlockchainData(this.props.dispatch)
    await this.loadTokenName()   
    await this.distributedTokens()
    await this.loadmemberslength()
    await this.loadtrackslength()
    await this.loadcentralbankrole()

    document.title = "Uang Digital Berbasis Blockchain"
  }

  async loadBlockchainData(dispatch) {
    if(typeof window.ethereum!=='undefined'){
      const web3 = new Web3(window.ethereum)
      window.ethereum.enable();
      const netId = await web3.eth.net.getId()
      var accounts = await web3.eth.getAccounts()
      this.setState({web3: web3});

      window.ethereum.on('accountsChanged', (accounts)=> {
        try{
          if(typeof accounts !=='undefined'){
            console.log(accounts)
            const balance = web3.eth.getBalance(accounts[0])
            this.setState({account: accounts[0], balance: balance})
            this.loadTokenName()
            this.loadmemberslength()
            this.loadtrackslength()
            this.loadcentralbankrole()
            
          } else {
            window.alert('Please login with MetaMask')
          }
        }
        catch(e){    
        }
      });

      window.ethereum.on('networkChanged', (networkId)=>{
        console.log('networkChanged',networkId);
        try {
          window.location.reload()
          
        } catch (e) {
          console.log('Error', e)
          window.alert('Contracts not deployed to the current network')
        }
      });

      //load balance
      if(typeof accounts[0] !=='undefined'){
        const balance = await web3.eth.getBalance(accounts[0])
        this.setState({account: accounts[0], balance: balance, web3: web3})
        // console.log(this.state.account)
      } else {
        window.alert('Please login with MetaMask')
      }

      //load contracts
      try {
        const token = new web3.eth.Contract(Token.abi, Token.networks[netId].address)
        const dApps = new web3.eth.Contract(dapps.abi, dapps.networks[netId].address)
        const dappsAddress = dapps.networks[netId].address
        const tokenAddress = Token.networks[netId].address
        this.setState({ token: token, dApps: dApps, dappsAddress: dappsAddress, tokenAddress: tokenAddress})

      } catch (e) {
        console.log('Error', e)
        window.alert('Contracts not deployed to the current network')
      }
      

    } else {
      window.alert('Please install MetaMask')
    }   
  }

  async loadTokenName(){
    if(this.state.dApps!=='undefined'){
      try{
        const tokenName = await this.state.token.methods.name().call()
        this.setState({tokenName: tokenName})
      }
      catch (e) {
        console.log('Error, load token name: ', e)
      } 
    }
  }
  async distributedTokens(){
    if(this.state.token!=='undefined'){
      
      try{
        const supplyT = await this.state.token.methods.totalSupply().call();
        this.setState({TokenSupply: supplyT/10**18})
    
      } catch (e) {
        console.log('Error, Supply: ', e);
      }
    }
  }

  async issuance(to, amount){
    if(this.state.dApps!=='undefined'){
      
      try{
        await this.state.dApps.methods.issuance(to, amount.toString()).send({from: this.state.account})
        .on('transactionHash', (hash) => {
          var answer = window.confirm("Redirect to etherscan?")
          if (answer){
            // similar behavior as an HTTP redirect
            window.open("https://ropsten.etherscan.io/tx/" + hash);
         
          }
          
        })
      } catch (e) {
        console.log('Error, issuance: ', e)
      }
    }
  }

  async transfer(to, amount){
    if(this.state.dApps!=='undefined'){
      if(this.state.account === this.state.a3 || this.state.account === this.state.b3 || this.state.account === this.state.c3){
        try{
          await this.state.dApps.methods.transfer(to, amount.toString()).send({from: this.state.account})
          .on('transactionHash', (hash) => {
            var answer = window.confirm("Redirect to etherscan?")
            if (answer){
              // similar behavior as an HTTP redirect
              window.open("https://ropsten.etherscan.io/tx/" + hash);
           
            } 
          })
        } catch (e) {
          console.log('Error, Member not match: ', e)
        }
      }

    }
  }

  async redemption(amount){
    if(this.state.dApps!=='undefined'){
      try{
        await this.state.dApps.methods.redemption(amount.toString()).send({from: this.state.account})
        .on('transactionHash', (hash) => {
          var answer = window.confirm("Redirect to etherscan?")
          if (answer){
            // similar behavior as an HTTP redirect
            window.open("https://ropsten.etherscan.io/tx/" + hash);
         
          }
          
        })
      } catch (e) {
        console.log('Error, issuance: ', e)
      }
    }
  }

  async passCentralBankRole(newCB){
    if(this.state.dApps!=='undefined'){
      
      try{
        
        await this.state.dApps.methods.passCentralBankRole(newCB).send({from: this.state.account})
        .on('transactionHash', (hash) => {
          var answer = window.confirm("Redirect to etherscan?")
          if (answer){
            // similar behavior as an HTTP redirect
            window.open("https://ropsten.etherscan.io/tx/" + hash);
         
          }
          
        })
      } catch (e) {
        console.log('Error, Request cant be canceleld: ', e)
      }
    }
  }

  async loadcentralbankrole(){
    if(this.state.dApps!=='undefined'){
      try{
        const centralbankrole = await this.state.dApps.methods.ShowCentralBankRole().call()
        this.setState({centralbankrole: centralbankrole})
      }
      catch (e) {
        console.log('Error, central bank role: ', e)
      } 
    }
  }

  async addmember(name, gender, address){
    if(this.state.dApps!=='undefined'){
      
      try{       
        await this.state.dApps.methods.AddMember(name, gender, address).send({from: this.state.account})
        .on('transactionHash', (hash) => {
          var answer = window.confirm("Redirect to etherscan?")
          if (answer){
            // similar behavior as an HTTP redirect
            window.open("https://ropsten.etherscan.io/tx/" + hash);   
          }         
        })
      } catch (e) {
        console.log('Error', e)
      }
    }
  }
  
  async addtrack(source, to, amount2){
    if(this.state.dApps!=='undefined'){
      
      try{
        
        await this.state.dApps.methods.AddTrack(source, to, amount2.toString()).send({from: this.state.account})
        .on('transactionHash', (hash) => {
          var answer = window.confirm("Redirect to etherscan?")
          if (answer){
            // similar behavior as an HTTP redirect
            window.open("https://ropsten.etherscan.io/tx/" + hash);
         
          }
          
        })
      } catch (e) {
        console.log('Error, Tracking: ', e)
      }
    }
  }

  async loadmemberslength(){
    if(this.state.dApps!=='undefined'){
      try{
        const memberslength = await this.state.dApps.methods.MemberLength().call()
        this.setState({memberslength: memberslength})
      }
      catch (e) {
        console.log('Error, load members length: ', e)
      } 
    }
  }

  async loadtrackslength(){
    if(this.state.dApps!=='undefined'){
      try{
        const trackslength = await this.state.dApps.methods.TrackLength().call()
        this.setState({trackslength: trackslength})
      }
      catch (e) {
        console.log('Error, load tracks length: ', e)
      } 
    }
  }

  async loadmembers(){

    if(this.state.dApps!=='undefined'){
      if(this.state.account === this.state.centralbankrole ){
     
      try{
        var member =  await this.state.dApps.methods.ShowMembers().call()
        var Name = [];
        var Gender = [];
        var Address = [];

        for (var i = 0; i < this.state.memberslength; i++){
          Name[i] = member[i].Name;
          Gender[i] = member[i].Gender;  
          Address[i] = member[i].Address; 
           
         this.setState({Name : Name, Gender : Gender, Address : Address})
        }

/*        const a1 = member[0].Name;
        const a2 = member[0].Gender;
        const a3 = member[0].Address;
          
        const b1 = member[1].Name;
        const b2 = member[1].Gender;
        const b3 = member[1].Address;
          
        const c1 = member[2].Name;
        const c2 = member[2].Gender;
        const c3 = member[2].Address;

        this.setState({a1 : a1, a2 : a2, a3 : a3})
        this.setState({b1 : b1, b2 : b2, b3 : b3})
        this.setState({c1 : c1, c2 : c2, c3 : c3})

        console.log(this.state.memberslength)

        <h5 style={{float: "left"}}>{}</h5>
                                  <table className="table table-bordered">
                                    <thead className="thead-dark">
                                      <tr>
                                        <th scope="col">Name</th>
                                        <th scope="col">Gender</th>
                                        <th scope="col">Address</th>
                                      </tr>
                                      
                                      <tr>
                                        <th scope="col">{this.state.Name[0]}</th>
                                        <th scope="col">{this.state.Gender[0]}</th>
                                        <th scope="col">{this.state.Address[0]}</th>
                                      </tr>

                                      <tr>
                                        <th scope="col">{this.state.Name[1]}</th>
                                        <th scope="col">{this.state.Gender[1]}</th>
                                        <th scope="col">{this.state.Address[1]}</th>
                                      </tr>

                                      <tr>
                                        <th scope="col">{this.state.Name[2]}</th>
                                        <th scope="col">{this.state.Gender[2]}</th>
                                        <th scope="col">{this.state.Address[2]}</th>
                                      </tr>
                                    
                                     
                                                                       
                                    </thead>
                                    </table>
*/
      } catch (e) {
        console.log('Error, Show Members: ', e)
      }
    }
  }
}


  async loadtracks(){

    if(this.state.dApps!=='undefined'){
      if(this.state.centralbankrole === this.state.account){
      
      try{
        const track =  await this.state.dApps.methods.Tracking().call()
        var Source = [];
        var To = [];
        var Amount = [];

        for (var i = 0; i < this.state.trackslength; i++){
          Source[i] = track[i].Source;
          To[i] = track[i].To;  
          Amount[i] = track[i].Amount; 
           
        this.setState({Source : Source, To : To, Amount : Amount})
        }

/*        const a11 = track[0].Source;
        const a22 = track[0].To;
        const a33 = track[0].Amount;
          
        const b11 = track[1].Source;
        const b22 = track[1].To;
        const b33 = track[1].Amount;
          
        const c11 = track[2].Source;
        const c22 = track[2].To;
        const c33 = track[2].Amount;
    
        this.setState({a11 : a11, a22 : a22, a33 : a33})
        this.setState({b11 : b11, b22 : b22, b33 : b33})
        this.setState({c11 : c11, c22 : c22, c33 : c33})
*/
      } catch (e) {
        console.log('Error, Tracking: ', e)
      }
    }
  }
}
    
/*async createTable()
{
var rn = this.state.memberslength;

 for(var i=0;i<rn;i++){
   var row = <tr>
     <td>${member[1].Name}</td>
     <td>${member[1].Name}</td>
     <td>a</td>
   </tr>
   table.innerHTML += row
   }
}*/

    
   //   const tempMember = new this.state.web3.eth.Contract(Member.abi, member)
   //   const name = await tempMember.methods.name().call()
   //   members.push({member: tempMember, name: name, address: member, id: i})
   //   this.setState({members: members, memberslength: length})

 
  constructor(props) {
    super(props)
    this.state = {
      
      Name: [],
      Gender: [],
      Address: [],
      Source: [],
      To: [],
      Amount: [],
      web3: 'undefined',
      account: '',
      token: null,
      Dapps: null,
      balance: 0,
      dappsAddress: null,
      tokenName: '',
      memberslength: null,

      }
  
  }

  render() {
    return (

    <div className='text-monospace'>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <div>
          <img src={logo} className="App-logo" alt="logo" height="10"/>     
          <b className="navbar-brand" style={{float: "Middle", lineHeight: "35px"}}>CBDC</b>
        </div>
        </nav>
        

        <div className="container-fluid mt-5 text-center">
            <br></br>
              <h1>Welcome to Dapps</h1>
              <h2>{this.state.account}</h2>
              <br></br>
              <div className="row">
                  <main role="main" className="d-flex justify-content-center mb-3 text-black">
                      <div className="content mr-auto ml-auto">
                        <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example" >

                          <Tab eventKey="SetTokenIssuer" title="Set Token Issuer">
                           <div>
                            <br></br>
                            <p style={{float: "left"}}>
                              Central Bank Role : {this.state.centralbankrole}
                            </p>  
                              <br></br> 

                              <br></br>
                              Change Issuer
                              <br></br>
                              
                              <form onSubmit={(e) => {
                                  e.preventDefault()
                                  let to = this.TokenIssuer.value
                                  this.passCentralBankRole(to)
                                }}>
                                  
                                  <div className='form-group mr-sm-2'>
                                  <br></br>
                                    <label htmlFor="TokenIssuer" style={{float: "left"}}>Token Issuer:</label>
                                    <input
                                      id='TokenIssuer'
                                      type='text'
                                      ref={(input) => { this.TokenIssuer = input }}
                                      className="form-control form-control-md"
                                      placeholder='to...'
                                      required />
                  
                                  </div>
                                  <button type='submit' className='btn btn-primary'>Set</button>
                                </form>
                                
                             </div>
                          </Tab>
                            <Tab eventKey="supply" title="Total Supply">
                              <div>

                              <br></br>
                              <p style={{float: "left"}}>
                                Token Supply of {this.state.tokenName}: {this.state.TokenSupply}
                              </p>                                               
                                
                              </div>
                            </Tab>

                          <Tab eventKey="issuance" title="Issuance">
                            <div>
                              <br></br>
                              <p style={{float: "left"}}>
                                Central Bank Role : {this.state.centralbankrole}
                              </p>  
                              <br></br> 

                            <br></br>
                              How much issuance?
                              <br></br>
                              <form onSubmit={(e) => {
                                e.preventDefault()
                                let amount = this.IssuanceAmount.value
                                let to = this.Issuanceaddress.value

                                amount = amount * 10**18 //convert to wei
                              
                                this.issuance(to,amount)
                  
    
                              }}>
                                <div className='form-group mr-sm-2'>
                                <br></br>
                                  <label htmlFor="Issuanceaddress" style={{float: "left"}}>Node Address:</label>
                                  <input
                                    id='Issuanceaddress'
                                    type='text'
                                    ref={(input) => { this["Issuanceaddress"] = input }}
                                    className="form-control form-control-md"
                                    placeholder='to...'
                                  required />

                                  <label htmlFor="TypeIssuance" style={{float: "left"}}>Token Issued:</label>
                                  <select name="TypeIssuance" id="TypeIssuance" 
                                    ref={(input) => { this.TypeIssuance = input }} 
                                    className="form-control form-control-md">
                                    <option value="Token">{this.state.tokenName}-({this.state.tokenAddress})</option>
                                  </select>
                                  
                                  <label htmlFor="IssuanceAmount" style={{float: "left"}}>Amount:</label>
                                  <input
                                    id='IssuanceAmount'
                                    step="0.01"
                                    type='number'
                                    ref={(input) => { this.IssuanceAmount = input }}
                                    className="form-control form-control-md"
                                    placeholder='amount...'
                                    required />

                                  
                                </div>
                                <button type='submit' className='btn btn-primary'>Issuance</button>
                              </form>

                            </div>
                          </Tab>
                          <Tab eventKey="transfer" title="Transfer">
                            <div>
                            <br></br>
                              How much to Transfer?
                              <br></br>

                              <form onSubmit={(e) => {
                                e.preventDefault()
                                let source = this.state.account
                                let amount = this.TransferAmount.value
                                let amount2 = this.TransferAmount.value
                                let to = this.Transferaddress.value
                                amount = amount * 10**18 //convert to wei
                               
                                this.transfer(to,amount)
                                this.addtrack(source,to,amount2)
  
                              }}>
                                <div className='form-group mr-sm-2'>
                                <br></br>
                                  

                                  <label htmlFor="Transferaddress" style={{float: "left"}}>To:</label>
                                  <input
                                    id='Transferaddress'
                                    type='text'
                                    ref={(input) => { this.Transferaddress = input }}
                                    className="form-control form-control-md"
                                    placeholder='to...'
                                    required />

                                  <label htmlFor="TypeTransfer" style={{float: "left"}}>Token Transfer:</label>
                                  <select name="TypeTransfer" id="TypeTransfer" ref={(input) => { this.TypeTransfer = input }} className="form-control form-control-md">
                                    <option  value="Token">{this.state.tokenName}-{this.state.tokenAddress}</option>      
                                  </select>

                                  <label htmlFor="TransferAmount" style={{float: "left"}}>Amount (1 ETH = 1 x 10^18 Wei):</label>
                                  <input
                                    id='TransferAmount'
                                    step="0.01"
                                    type='number'
                                    ref={(input) => { this.TransferAmount = input }}
                                    className="form-control form-control-md"
                                    placeholder='amount...'
                                    required />

                                  
                                </div>
                                <button type='submit' className='btn btn-primary'>Transfer</button>
                              </form>

                            </div>
                          </Tab>
                          <Tab eventKey="redemption" title="Redemption">
                            <div>
                              <br></br>
                              <p style={{float: "left"}}>
                                Central Bank Role : {this.state.centralbankrole}
                              </p>  
                              <br></br> 
                            <br></br>
                            How much redemption?
                              <br></br>
                              <form onSubmit={(e) => {
                                e.preventDefault()
                                let amount = this.RedemptionAmount.value

                                amount = amount * 10**18 //convert to wei
                                
                                this.redemption(amount)
                               
                              }}>
                                <div className='form-group mr-sm-2'>

                                  <br></br>
                                  <br></br>

                                  <label htmlFor="TypeRedeem" style={{float: "left"}}>Token Redeem:</label>
                                  <select name="TypeRedeem" id="TypeRedeem" ref={(input) => { this.TypeRedeem = input }} className="form-control form-control-md">
                                    <option value="Token">{this.state.tokenAddress}-{this.state.tokenAddress}</option>
                                  </select>

                                  <label htmlFor="RedemptionAmount" style={{float: "left"}}>Amount:</label>
                                  <input
                                    id='RedemptionAmount'
                                    step="0.01"
                                    type='number'
                                    ref={(input) => { this.RedemptionAmount = input }}
                                    className="form-control form-control-md"
                                    placeholder='amount...'
                                    required />

                                </div>
                                <button type='submit' className='btn btn-primary'>Redemption</button>
                              </form>

                            </div>
                          </Tab>

                          <Tab eventKey="member" title="Member">
                           <div>
                            <br></br>
                              <p style={{float: "left"}}>
                                Central Bank Role : {this.state.centralbankrole}
                              </p>  
                            <br></br> 

                             <br></br>
                              Add Member
                                                          
                              <form onSubmit={(e) => {
                                  e.preventDefault()
                                  let name = this.name.value
                                  let gender = this.gender.value
                                  let address = this.address.value
                                  this.addmember(name, gender, address)
                                 //   console.log(Member[0].name);
                                }}>
                                  
                                  <div className='form-group mr-sm-2'>
                                  <br></br>
                                    <label htmlFor="name" style={{float: "left"}}>Name:</label>
                                    <input
                                      id='name'
                                      type='text'
                                      ref={(input) => { this.name = input }}
                                      className="form-control form-control-md"
                                      placeholder='your name..'
                                      required />

                                    <label htmlFor="gender" style={{float: "left"}}>Gender:</label>
                                    <input
                                      id='gender'
                                      type='text'
                                      ref={(input) => { this.gender = input }}
                                      className="form-control form-control-md"
                                      placeholder='your gender..'
                                      required />

                                    <label htmlFor="address" style={{float: "left"}}>Address:</label>
                                    <input
                                      id='address'
                                      type='text'
                                      ref={(input) => { this.address = input }}
                                      className="form-control form-control-md"
                                      placeholder='your wallet address..'
                                      required />
                  
                                  </div>
                                  <br></br>
                                  <button type='submit' className='btn btn-primary'>Add</button>
                                </form>
                                
                                <br></br>
                                Show Member
                                <br></br>
                                <br></br>

                            
                                <div>

                                  <table >
                                    <thead>
                                      <tr>
                                        <th>Name</th>
                                        <th>Gender</th>
                                        <th>Address</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      
                                      <th>
                                        {this.state.Name.map(item => (
                                          <tr key={item}>{item}</tr>
                                         ))}
                                      </th>

                                      <th>
                                         {this.state.Gender.map(item => (
                                          <tr key={item}>{item}</tr>
                                         ))}
                                      </th>
                                      
                                      <th>
                                         {this.state.Address.map(item => (
                                          <tr key={item}>{item}</tr>
                                         ))}
                                      </th>

                                    </tbody>
                                  </table>                               
                                  
                                </div>

                                <br></br> 

                                <form onSubmit={(e) => {
                                  e.preventDefault()
                                  this.loadmembers()
                                  
                                }}>
                                                                 
                                  <button type='submit' className='btn btn-primary'>Show</button>
                                </form>
                                
                             </div>
                          </Tab>

                          <Tab eventKey="track" title="Track">
                           <div>
                            <br></br>
                              <p style={{float: "left"}}>
                                Central Bank Role : {this.state.centralbankrole}
                              </p>  
                            <br></br> 
                                <br></br> 
                                Show Track
                                <br></br> 
                                <br></br>                            
                            
                                <div>
                                  
                                <h5 style={{float: "left"}}>{}</h5>
                                  <table className="table table-bordered">
                                    <thead>
                                      <tr>
                                        <th>From(Address)</th>
                                        <th>To(Address)</th>
                                        <th>Amount(CBDC)</th>
                                      </tr>
                                    </thead>

                                    <tbody>
                                      
                                      <th>
                                         {this.state.Source.map(item => (
                                          <tr key={item}>{item}</tr>
                                         ))}
                                      </th>

                                      <th>
                                         {this.state.To.map(item => (
                                          <tr key={item}>{item}</tr>
                                         ))}
                                      </th>

                                      <th>
                                         {this.state.Amount.map(item => (
                                          <tr key={item}>{item}</tr>
                                         ))}
                                      </th>
         
                                    </tbody>                                   
                                    
                                    </table>
                                  </div>
                                 
                                <form onSubmit={(e) => {
                                  e.preventDefault()
                                  this.loadtracks()
                                  
                                }}>
                                                                 
                                  <button type='submit' className='btn btn-primary'>Track</button>
                                </form>
                                
                             </div>
                          </Tab>

                        </Tabs>
                        </div>
                   </main>
               </div>
         </div>
     </div>
  ); 
  }
}

export default App;