// contracts/MockCryptoKitties.sol
pragma solidity ^0.4.25;

contract MockCryptoKitties {
    
    struct Kitty {
        uint256 genes;
        uint256 birthTime;
        uint256 cooldownIndex;
        uint256 generation;
    }

    Kitty[] public kitties;

    // Add "public" visibility to the constructor
    constructor() public {
        // Initialize with some mock kitties
        kitties.push(Kitty(1234567890123456, block.timestamp, 0, 1)); // Kitty with ID 0
        kitties.push(Kitty(6543210987654321, block.timestamp, 0, 1)); // Kitty with ID 1
    }

    function getKitty(uint256 _id) external view returns (
        bool isGestating,
        bool isReady,
        uint256 cooldownIndex,
        uint256 nextActionAt,
        uint256 siringWithId,
        uint256 birthTime,
        uint256 matronId,
        uint256 sireId,
        uint256 generation,
        uint256 genes
    ) {
        Kitty storage kitty = kitties[_id];
        return (false, true, kitty.cooldownIndex, 0, 0, kitty.birthTime, 0, 0, kitty.generation, kitty.genes);
    }

    function createKitty(uint256 _genes) external {
        kitties.push(Kitty(_genes, block.timestamp, 0, 1));
    }
}
