var SafeMath = artifacts.require("./safemath.sol");
var ZombieFactory = artifacts.require("./zombiefactory.sol");
var ZombieFeeding = artifacts.require("./zombiefeeding.sol");
var ZombieHelper = artifacts.require("./zombiehelper.sol");
var ZombieAttack = artifacts.require("./zombieattack.sol");
var ZombieOwnership = artifacts.require("./zombieownership.sol");
const MockCryptoKitties = artifacts.require("MockCryptoKitties");

module.exports = async function(deployer, network, accounts) {
  
  // Deploy SafeMath library
  await deployer.deploy(SafeMath);
  
  // Deploy Zombie contracts
  await deployer.deploy(ZombieFactory);
  await deployer.deploy(ZombieFeeding);
  await deployer.deploy(ZombieHelper);
  await deployer.deploy(ZombieAttack);
  await deployer.deploy(ZombieOwnership);

  // Deploy MockCryptoKitties contract
  await deployer.deploy(MockCryptoKitties);

  // Get the deployed instance of MockCryptoKitties
  const mockCryptoKittiesInstance = await MockCryptoKitties.deployed();

  // Get the deployed instance of ZombieFeeding
  const zombieFeedingInstance = await ZombieFeeding.deployed();

  // Set the MockCryptoKitties contract address in ZombieFeeding
  await zombieFeedingInstance.setKittyContractAddress(mockCryptoKittiesInstance.address);

  console.log("MockCryptoKitties deployed at:", mockCryptoKittiesInstance.address);
  console.log("ZombieFeeding contract has set MockCryptoKitties address.");
};
