pragma solidity ^0.4.25;

import "./zombiehelper.sol"; // Assuming this contains other functionality

contract ZombieAttack is ZombieHelper {
  uint randNonce = 0;
  uint attackVictoryProbability = 70;

  // Event to signal the result of the attack
  event AttackResult(uint winnerId, uint loserId, bool didWin);

  // Function for one zombie to attack another
  function attack(uint _zombieId, uint _targetId) external onlyOwnerOf(_zombieId) {
    Zombie storage myZombie = zombies[_zombieId];
    Zombie storage enemyZombie = zombies[_targetId];

    require(_isReady(myZombie), "Your zombie is not ready for attack.");

    uint rand = _randMod(100);
    if (rand <= attackVictoryProbability) {
      // Win scenario
      myZombie.winCount++;
      myZombie.level++;
      enemyZombie.lossCount++;
      emit AttackResult(_zombieId, _targetId, true); // Emit win result
    } else {
      // Loss scenario
      myZombie.lossCount++;
      enemyZombie.winCount++;
      emit AttackResult(_targetId, _zombieId, false); // Emit loss result
    }

    // Update total battles fought for both zombies
    myZombie.totalBattles++;
    enemyZombie.totalBattles++;

    _triggerCooldown(myZombie);
  }

  function _randMod(uint _modulus) internal returns (uint) {
    randNonce++;
    return uint(keccak256(abi.encodePacked(now, msg.sender, randNonce))) % _modulus;
  }
}
