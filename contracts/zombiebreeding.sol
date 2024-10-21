pragma solidity ^0.4.25;

import "./zombieownership.sol"; // Adjust import if needed

contract ZombieBreeding is ZombieOwnership {
    
    event NewZombie(uint zombieId, string name, uint dna);
    
    function breedZombies(uint _zombieId1, uint _zombieId2) 
        external 
        onlyOwnerOf(_zombieId1) 
        onlyOwnerOf(_zombieId2) 
    {
        Zombie storage parent1 = zombies[_zombieId1];
        Zombie storage parent2 = zombies[_zombieId2];

        // Generate DNA for the new zombie by mixing parents' DNA
        uint newDna = _mixDna(parent1.dna, parent2.dna);
        
        // Create a new zombie with a name and the combined DNA
        string memory newName = "BabyZombie"; // Modify this to take user input if needed
        _createZombie(newName, newDna);
    }

    function _mixDna(uint _dna1, uint _dna2) internal pure returns (uint) {
        uint dnaPrefix = _dna1 / 100000000;
        uint dnaSuffix = _dna2 % 100000000;
        return dnaPrefix * 100000000 + dnaSuffix;
    }
}
