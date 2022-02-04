const Token = artifacts.require("Token");
const dapps = artifacts.require("dapps");

module.exports = async function(deployer) {
	//deploy Token
	await deployer.deploy(Token)

	//assign token into variable to get it's address
	const token = await Token.deployed()
	
	//pass token address for dapps contract(for future minting)
	await deployer.deploy(dapps, token.address)

	//assign dapps contract into variable to get it's address
	const Dapps = await dapps.deployed()

	//change token's owner/minter from deployer to dapps
	await token.passMinterRole(Dapps.address)
	
};